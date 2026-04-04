/**
 * Admin authentication utilities — simulated JWT-like tokens, rate limiting,
 * session timeout, and audit logging. No backend dependency.
 *
 * Token format: base64(header).base64(payload).base64(signature)
 * Session timeout: 30 minutes of inactivity.
 * Rate limit: 5 failed attempts → 5-minute block.
 */

const SECRET_KEY = 'EduQuest_Admin_Secret_2025_#XK9'
const SESSION_DURATION = 30 * 60 // seconds
const MAX_ATTEMPTS = 5
const BLOCK_DURATION = 5 * 60 // seconds

export interface TokenPayload {
  email: string
  role: string
  iat: number
  exp: number
}

// ─── Token ───────────────────────────────────────────

export function generateToken(email: string): string {
  const header = { alg: 'None', typ: 'JWT' }
  const iat = Date.now()
  const payload: TokenPayload = {
    email,
    role: 'admin',
    iat,
    exp: iat + SESSION_DURATION * 1000,
  }
  const h = btoa(JSON.stringify(header))
  const p = btoa(JSON.stringify(payload))
  const s = btoa(p + SECRET_KEY)
  return `${h}.${p}.${s}`
}

export function verifyToken(token: string): {
  valid: boolean
  expired: boolean
  payload?: TokenPayload
} {
  if (!token) return { valid: false, expired: false }
  const parts = token.split('.')
  if (parts.length !== 3) return { valid: false, expired: false }
  try {
    const payload: TokenPayload = JSON.parse(atob(parts[1]))
    const sig = btoa(parts[1] + SECRET_KEY)
    if (sig !== parts[2]) return { valid: false, expired: false }
    const expired = Date.now() > payload.exp
    return { valid: !expired, expired, payload }
  } catch {
    return { valid: false, expired: false }
  }
}

export function isTokenExpired(token: string): boolean {
  return !verifyToken(token).valid
}

// ─── Rate Limiting ───────────────────────────────────

interface AttemptRecord {
  count: number
  firstAt: number
}

const loginAttempts = new Map<string, AttemptRecord>()

export function checkRateLimit(key = 'default'): {
  allowed: boolean
  remainingAttempts: number
  blockedFor?: number
} {
  const record = loginAttempts.get(key)
  if (!record || record.count < MAX_ATTEMPTS) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - (record?.count ?? 0) }
  }
  const elapsed = (Date.now() - record.firstAt) / 1000
  if (elapsed >= BLOCK_DURATION) {
    loginAttempts.delete(key)
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS }
  }
  return {
    allowed: false,
    remainingAttempts: 0,
    blockedFor: Math.ceil(BLOCK_DURATION - elapsed),
  }
}

export function recordFailedAttempt(key = 'default'): void {
  const record = loginAttempts.get(key) ?? { count: 0, firstAt: Date.now() }
  record.count++
  if (record.count === 1) record.firstAt = Date.now()
  loginAttempts.set(key, record)
}

export function resetAttempts(key = 'default'): void {
  loginAttempts.delete(key)
}

// ─── Session Timeout ─────────────────────────────────

const ACTIVITY_KEY = 'eq_last_activity'

export function updateLastActivity(): void {
  sessionStorage.setItem(ACTIVITY_KEY, Date.now().toString())
}

export function getSessionTimeout(): number {
  const ts = parseInt(sessionStorage.getItem(ACTIVITY_KEY) ?? '0', 10)
  return ts
}

export function checkSessionTimeout(): boolean {
  const ts = parseInt(sessionStorage.getItem(ACTIVITY_KEY) ?? '0', 10)
  if (!ts) return false
  return Date.now() - ts > SESSION_DURATION * 1000
}

// ─── Audit Log ───────────────────────────────────────

const AUDIT_KEY = 'eq_audit_log'

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'DELETE_USER'
  | 'EDIT_USER'
  | 'ADD_GAME'
  | 'DELETE_GAME'
  | 'EDIT_GAME'
  | 'EDIT_GRADE'
  | 'EDIT_CONTENT'

export interface AuditEntry {
  id: string
  action: AuditAction
  target?: string
  timestamp: number
  details?: string
}

export function logAction(action: AuditAction, target?: string, details?: string): void {
  const entries = getAuditLog()
  entries.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    action,
    target,
    timestamp: Date.now(),
    details,
  })
  sessionStorage.setItem(AUDIT_KEY, JSON.stringify(entries.slice(0, 100)))
}

export function getAuditLog(): AuditEntry[] {
  try {
    return JSON.parse(sessionStorage.getItem(AUDIT_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function clearAuditLog(): void {
  sessionStorage.removeItem(AUDIT_KEY)
}
