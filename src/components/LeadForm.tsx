"use client";
import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {site} from "@/config/site";
import {Arrow} from "./Hero";
import {PREVIEW_EVENT, readPreviewConcept, validatePreviewConcept, type PreviewConcept} from "@/lib/preview";

type State = "idle" | "sending" | "done" | "error";
export function LeadForm({ available = true }: { available?: boolean }) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<PreviewConcept | null>(null);
  const [receipt, setReceipt] = useState<{reference: string; previewEmailed: boolean} | null>(null);
  const request = useRef<{body: string; id: string} | null>(null);
  const result = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setPreview(readPreviewConcept());
    const update = (event: Event) => setPreview(validatePreviewConcept((event as CustomEvent).detail));
    window.addEventListener(PREVIEW_EVENT, update);
    return () => window.removeEventListener(PREVIEW_EVENT, update);
  }, []);
  useEffect(() => {if (state === "done") result.current?.focus();}, [state]);
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (state === "sending" || !available) return;
    const data = new FormData(event.currentTarget);
    const payload = {name: String(data.get("name") || ""), email: String(data.get("email") || ""), want: String(data.get("want") || ""), company: String(data.get("company") || ""), preview, emailPreview: data.get("emailPreview") === "on"};
    const body = JSON.stringify(payload);
    if (request.current?.body !== body) request.current = {body, id: crypto.randomUUID()};
    setState("sending"); setError("");
    try {
      const response = await fetch("/api/leads", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({...payload, requestId: request.current.id}), signal: AbortSignal.timeout(35000)});
      const value = await response.json();
      if (!response.ok || !value.ok || !value.reference) throw new Error(value.error || "We couldn’t confirm receipt. Please try again.");
      setReceipt(value); setState("done");
    } catch (err) {
      setError(err instanceof Error && err.name !== "TimeoutError" ? err.message : "We couldn’t confirm receipt. Your details are still here. Please try again.");
      setState("error");
    }
  }
  if (state === "done") return <div className="panel p-6" ref={result} tabIndex={-1} role="status">
    <span className="inline-block h-[11px] w-[32px] skew-x-[-38deg] bg-royal" />
    <h3 className="mt-5 text-xl font-semibold text-chalk">Your inquiry is received.</h3>
    <p className="lede mt-2 text-sm">Your project details have been saved. Ian will follow up at the email address you provided.</p>
    {preview && <p className="mt-3 text-sm text-muted">Your app concept is included.{receipt?.previewEmailed ? " A copy is on its way to your inbox." : " You can also save its link in the preview above."}</p>}
    <p className="mt-4 break-all text-xs text-muted">Reference: {receipt?.reference}</p>
    <button className="btn btn--ghost mt-5" onClick={() => {setState("idle"); request.current = null;}}>Send another inquiry</button>
  </div>;
  return <form onSubmit={onSubmit} className="panel p-6" aria-busy={state === "sending"}>
    <div className="text-[11px] tracking-[0.18em] text-muted">TELL US ABOUT YOUR PROJECT</div>
    <p className="mt-2 text-sm text-muted">Share the idea. We’ll help you define the next step.</p>
    {!available && <div role="status" className="mt-4 rounded-xl border border-line bg-ink-deep p-4 text-sm leading-relaxed text-muted">Online inquiries are temporarily unavailable. You can <a href={`mailto:${site.email}`} className="text-chalk underline underline-offset-4">email your project details</a> or choose a consultation time alongside this form.</div>}
    <div hidden><label>Leave this empty<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="mt-5 space-y-4">
      <label className="block text-sm text-chalk" htmlFor="lead-name">Your name or business<span aria-hidden="true"> *</span><input id="lead-name" name="name" required maxLength={120} autoComplete="name" className="lead-input mt-1.5" placeholder="How should we address you?" /></label>
      <label className="block text-sm text-chalk" htmlFor="lead-email">Email<span aria-hidden="true"> *</span><input id="lead-email" name="email" type="email" required maxLength={254} autoComplete="email" className="lead-input mt-1.5" placeholder="you@yourbusiness.com" /></label>
      <label className="block text-sm text-chalk" htmlFor="lead-want">What would you like to build?<span aria-hidden="true"> *</span><textarea id="lead-want" name="want" required maxLength={4000} rows={4} className="lead-input mt-1.5 resize-y" placeholder="Who is it for, and what should it help them do?" /></label>
    </div>
    {preview && <div className="mt-4 rounded-xl border border-royal/30 bg-royal/5 p-4 text-sm">
      <p className="font-medium text-chalk">Your app concept is attached</p>
      <p className="mt-1 text-muted">{preview.name || "Your app"} · {preview.industry} · {preview.layout}</p>
      <p className="mt-1 text-xs text-muted">{preview.features.join(" · ")}</p>
      <label className="mt-3 flex items-start gap-2 text-muted"><input className="mt-1 accent-royal" type="checkbox" name="emailPreview" />Email me a link to this concept, too.</label>
      <button className="mt-3 text-xs underline underline-offset-4 text-muted" type="button" onClick={() => setPreview(null)}>Remove concept from inquiry</button>
    </div>}
    <p className="mt-4 text-xs leading-relaxed text-muted">We use your details to respond to this inquiry. No newsletter signup. <Link href="/privacy" className="underline underline-offset-4">Privacy details</Link>.</p>
    <button type="submit" className="btn btn--primary mt-4 w-full" disabled={state === "sending" || !available}>{state === "sending" ? "Sending your inquiry…" : "Send project details"}{state !== "sending" && <Arrow />}</button>
    {state === "error" && <div className="mt-3 text-sm text-chalk" role="alert"><p>{error}</p><a className="mt-2 inline-block break-all underline underline-offset-4" href={`mailto:${site.email}`}>Email {site.email}</a></div>}
  </form>;
}
