/** Configuration presence only; not a provider connectivity or delivery guarantee. */
export function inquiryConfigurationReady(): boolean {
  return ["RMG_SUPABASE_URL", "RMG_SUPABASE_SERVICE_ROLE_KEY", "RMG_RATE_LIMIT_SECRET", "RMG_RESEND_API_KEY", "RMG_EMAIL_FROM", "RMG_INQUIRY_EMAIL"].every(key => Boolean(process.env[key]?.trim()));
}
