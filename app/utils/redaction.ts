/**
 * Secret Token Redaction Engine for Pre-Training Troubleshooting & Log Sharing
 * Requirements: PRE-TOOL-03
 * STRIDE Mitigations: T-27-01, T-27-02
 */

export interface RedactionRule {
  name: string
  pattern: RegExp
  replacement: string
}

export interface SanitizeResult {
  sanitized: string
  matchesCount: number
}

export const REDACTION_RULES: RedactionRule[] = [
  {
    name: 'Telegram Bot Token',
    pattern: /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/g,
    replacement: '[REDACTED_TELEGRAM_BOT_TOKEN]',
  },
  {
    name: 'OpenAI API Key',
    pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/g,
    replacement: '[REDACTED_API_KEY]',
  },
  {
    name: 'Google Cloud API Key',
    pattern: /\bAIza[0-9A-Za-z-_]{35}\b/g,
    replacement: '[REDACTED_GOOGLE_API_KEY]',
  },
  {
    name: 'Bearer Token',
    pattern: /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi,
    replacement: 'Bearer [REDACTED_BEARER_TOKEN]',
  },
  {
    name: 'Email Address',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    replacement: '[REDACTED_EMAIL]',
  },
  {
    name: 'Windows User Path',
    pattern: /(C:\\Users\\)[a-zA-Z0-9_.-]+(\\)/gi,
    replacement: '$1[USER]$2',
  },
]

/**
 * Client-side sanitization function that safely replaces secret tokens,
 * credentials, emails, and user paths from raw log strings.
 *
 * Guaranteed ReDoS-safe and resets RegExp lastIndex across invocations.
 */
export function sanitizeLogText(
  rawText: string | null | undefined
): SanitizeResult {
  if (!rawText) {
    return { sanitized: '', matchesCount: 0 }
  }

  let sanitized = String(rawText)
  let totalMatches = 0

  for (const rule of REDACTION_RULES) {
    // Reset stateful RegExp lastIndex to prevent offset skipping
    rule.pattern.lastIndex = 0
    const matches = sanitized.match(rule.pattern)
    if (matches) {
      totalMatches += matches.length
      sanitized = sanitized.replace(rule.pattern, rule.replacement)
    }
  }

  return { sanitized, matchesCount: totalMatches }
}
