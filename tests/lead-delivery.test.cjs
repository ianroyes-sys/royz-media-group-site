const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(name, ...args) { return resolve.call(this, name.startsWith('@/') ? path.join(__dirname, '../src', name.slice(2)) : name, ...args); };
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020}}).outputText, file);
const {parseLead} = require('../src/lib/server/leads.ts');
const {readJson} = require('../src/lib/server/http.ts');
const {POST} = require('../src/app/api/leads/route.ts');
const {GET: retry} = require('../src/app/api/cron/notifications/route.ts');
const {dispatchNotifications} = require('../src/lib/server/notifications.ts');
const valid = {name: 'Example', email: 'person@example.com', want: 'A member app', company: '', requestId: 'efcb4065-5bcb-405b-bb6c-47ca9c903c98'};
const record = {id:valid.requestId,name:valid.name,email:valid.email,message:valid.want,preview:null,email_preview:false,preview_emailed:false,notified_at:null,notification_attempts:1};
const request = (body = valid, headers = {}) => new Request('https://royzmediagroup.com/api/leads', {method: 'POST', headers: {'content-type': 'application/json', origin: 'https://royzmediagroup.com', ...headers}, body: JSON.stringify(body)});
for (const key of ['RMG_RESEND_API_KEY','RMG_EMAIL_FROM','RMG_INQUIRY_EMAIL','RMG_SUPABASE_SERVICE_ROLE_KEY','RMG_RATE_LIMIT_SECRET']) process.env[key] = 'test-only';
process.env.RMG_SUPABASE_URL = 'https://database.example';

test('rejects malformed email, honeypot, oversized and invalid preview data', () => {
  for (const change of [{email:'bad'}, {company:'bot'}, {want:'a'.repeat(4001)}, {name:'x\nHeader'}, {preview:{name:'unsafe'}}, {requestId:'bad'}, {emailPreview:'yes'}]) assert.throws(() => parseLead({...valid, ...change}));
  assert.equal(parseLead({...valid, email:' Person@Example.com '}).email, 'person@example.com');
});
test('enforces body byte cap, JSON type and same-origin', async () => {
  await assert.rejects(() => readJson(request(valid), 20), e => e.status === 413);
  await assert.rejects(() => readJson(request(valid, {origin:'https://attacker.example'})), e => e.status === 403);
  await assert.rejects(() => readJson(request(valid, {'content-type':'text/plain'})), e => e.status === 415);
});
test('missing configuration never claims receipt', async () => {
  const key = process.env.RMG_RESEND_API_KEY; delete process.env.RMG_RESEND_API_KEY;
  const response = await POST(request()); assert.equal(response.status,503); assert.equal((await response.json()).ok, undefined);
  process.env.RMG_RESEND_API_KEY = key;
});
test('storage failure never sends a notification or claims success', async () => {
  const original = global.fetch; const calls = [];
  global.fetch = async url => {calls.push(url); return new Response('failed',{status:500});};
  try { assert.equal((await POST(request())).status,503); assert.equal(calls.length,1); assert.match(calls[0], /rmg_accept_inquiry/); } finally {global.fetch = original;}
});
test('stored inquiry receives success, sends notification with idempotency, marks delivery', async () => {
  const original = global.fetch; const calls = [];
  global.fetch = async (url, options) => {calls.push({url,options}); return Response.json(url.includes('/emails') ? {id:'email-receipt'} : url.includes('rmg_claim_notifications') ? [record] : url.includes('/rpc/') ? 'saved' : []);};
  try {
    const response = await POST(request()); const body = await response.json();
    assert.equal(response.status,200); assert.equal(body.ok,true); assert.equal(body.notified,true); assert.equal(calls.length,4);
    assert.equal(calls[2].options.headers['Idempotency-Key'], `inquiry-${valid.requestId}`);
    assert.equal(JSON.parse(calls[2].options.body).reply_to,valid.email);
  } finally {global.fetch = original;}
});
test('notification failure does not discard a durably stored inquiry', async () => {
  const original = global.fetch;
  global.fetch = async url => url.includes('rmg_claim_notifications') ? Response.json([record]) : url.includes('/rpc/') ? Response.json('saved') : new Response('',{status:503});
  try { const result = await (await POST(request())).json(); assert.equal(result.ok,true); assert.equal(result.notified,false); } finally {global.fetch=original;}
});
test('shared database abuse limits and conflicting retries stop delivery', async () => {
  const original = global.fetch;
  try { for (const [result,status] of [['limited',429],['conflict',409]]) {global.fetch = async () => Response.json(result); assert.equal((await POST(request())).status,status);} } finally {global.fetch=original;}
});
test('optional concept email uses fixed origin and omits arbitrary project message', async () => {
  const original = global.fetch; const emails=[];
  global.fetch=async (url, options) => {if(url.includes('/emails')) {emails.push(JSON.parse(options.body)); return Response.json({id:'accepted'});} return Response.json(url.includes('rmg_claim_notifications') ? [{...record,email_preview:true,preview:{name:'Example',industry:'church',accent:'#000000',layout:'community',features:['Events']}}] : url.includes('/rpc/') ? 'saved' : []);};
  try {
    const preview={name:'Example',industry:'church',accent:'#000000',layout:'community',features:['Events']};
    const result=await (await POST(request({...valid,preview,emailPreview:true}))).json();
    assert.equal(result.previewEmailed,true); assert.equal(emails.length,2); assert.ok(emails[1].text.includes('https://royzmediagroup.com/')); assert.ok(!emails[1].text.includes(valid.want));
  } finally {global.fetch=original;}
});
test('previously notified retries return receipt without sending again', async () => {
  const original = global.fetch; let calls=0;
  global.fetch=async () => {calls++;return Response.json('existing_preview_sent');};
  try { const result=await (await POST(request())).json();assert.equal(result.ok,true);assert.equal(result.previewEmailed,true);assert.equal(calls,1); } finally {global.fetch=original;}
});
test('cron rejects missing, wrong and multibyte credentials without doing work', async () => {
  process.env.CRON_SECRET='test';
  for (const token of ['', 'Bearer nope', 'Bearer éééé']) {
    assert.equal((await retry(new Request('https://royzmediagroup.com/api/cron/notifications',{headers:{authorization:token}}))).status,401);
  }
});
test('customer copy retries independently after owner notification succeeded', async () => {
  const original=global.fetch; const emails=[]; let patch;
  const claimed={...record, notified_at:'2026-09-21T00:00:00Z', email_preview:true,preview:{name:'Example',industry:'church',accent:'#000000',layout:'community',features:['Events']}};
  global.fetch=async (url,options) => {
    if(url.includes('/emails')) {emails.push(JSON.parse(options.body)); return Response.json({id:'receipt'});}
    if(url.includes('rmg_claim_notifications')) return Response.json([claimed]);
    patch=JSON.parse(options.body); return Response.json([]);
  };
  try { const result=await dispatchNotifications(); assert.equal(emails.length,1);assert.equal(emails[0].to[0],record.email); assert.equal(result[0].pending,false);assert.equal(patch.notified_at,claimed.notified_at);assert.equal(patch.preview_emailed,true);assert.equal(patch.next_notification_attempt_at,null); } finally {global.fetch=original;}
});
test('a failed optional copy remains pending while owner state is retained', async () => {
  const original=global.fetch; let patch;
  const claimed={...record,email_preview:true,preview:{name:'Example',industry:'church',accent:'#000000',layout:'community',features:['Events']}};
  global.fetch=async (url,options) => {
    if(url.includes('/emails')) return options.headers['Idempotency-Key'].startsWith('concept') ? new Response('',{status:503}) : Response.json({id:'receipt'});
    if(url.includes('rmg_claim_notifications')) return Response.json([claimed]);
    patch=JSON.parse(options.body); return Response.json([]);
  };
  try {const result=await dispatchNotifications();assert.equal(result[0].pending,true);assert.ok(patch.notified_at);assert.equal(patch.preview_emailed,false);assert.ok(patch.next_notification_attempt_at);} finally {global.fetch=original;}
});
test('leased or exhausted records trigger no email requests', async () => {
  const original=global.fetch;let calls=0;
  global.fetch=async () => {calls++;return Response.json([]);};
  try {assert.deepEqual(await dispatchNotifications(),[]);assert.equal(calls,1);} finally {global.fetch=original;}
});
test('accepts legitimate external Host behind a local Next.js listener without trusting forwarded headers', async () => {
  const proxied = headers => new Request('http://localhost:3105/api/leads', {method:'POST',headers:{'content-type':'application/json',host:'127.0.0.1:3105',origin:'http://127.0.0.1:3105',...headers},body:JSON.stringify(valid)});
  assert.equal((await readJson(proxied({}))).name,valid.name);
  assert.equal((await readJson(proxied({host:'royzmediagroup.com',origin:'https://royzmediagroup.com'}))).name,valid.name);
  await assert.rejects(() => readJson(proxied({origin:'https://attacker.example','x-forwarded-host':'attacker.example'})), e => e.status===403);
  await assert.rejects(() => readJson(proxied({'sec-fetch-site':'cross-site'})), e => e.status===403);
  await assert.rejects(() => readJson(proxied({origin:'http://127.0.0.1:9999'})), e => e.status===403);
  await assert.rejects(() => readJson(proxied({origin:'null'})), e => e.status===403);
});
test('cron claims ten records maximum and rejects unexpectedly oversized responses', async () => {
  const original=global.fetch;let claim;
  global.fetch=async (url,options) => {claim=JSON.parse(options.body);return Response.json([]);};
  try {await dispatchNotifications();assert.equal(claim.p_limit,10);global.fetch=async()=>Response.json(Array(11).fill(record));await assert.rejects(() => dispatchNotifications(),/Invalid notification claim/);} finally {global.fetch=original;}
});
