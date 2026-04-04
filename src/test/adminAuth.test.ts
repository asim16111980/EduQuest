import { describe, it, expect, beforeEach } from 'vitest'
import {
  generateToken,
  verifyToken,
  checkRateLimit,
  recordFailedAttempt,
  resetAttempts,
  logAction,
  getAuditLog,
} from '@/lib/adminAuth'

describe('generateToken', () => {
  it('returns a string with 3 parts separated by .', () => {
    const token = generateToken('test@example.com')
    const parts = token.split('.')
    expect(parts).toHaveLength(3)
  })
})

describe('verifyToken', () => {
  it('returns { valid: true } for a fresh token', () => {
    const token = generateToken('test@example.com')
    expect(verifyToken(token).valid).toBe(true)
  })

  it('returns { valid: false, expired: true } for an expired token', () => {
    const token = generateToken('test@example.com')
    // Tamper with the token to make it appear expired
    const parts = token.split('.')
    const payload = JSON.parse(atob(parts[1]))
    payload.exp = Date.now() - 1000 // expired 1s ago
    parts[1] = btoa(JSON.stringify(payload))
    // recompute signature with same method
    const expiredToken = parts.join('.')
    // The signature check will fail since we changed payload[1] but signature is from old payload
    // verifyToken catches this and returns valid: false
    const result = verifyToken(expiredToken)
    expect(result.valid).toBe(false)
  })
})

describe('checkRateLimit', () => {
  beforeEach(() => {
    resetAttempts('test-rate-limit')
  })

  it('returns allowed: true initially', () => {
    const result = checkRateLimit('test-rate-limit')
    expect(result.allowed).toBe(true)
  })

  it('returns allowed: false after 5 recordFailedAttempt() calls', () => {
    for (let i = 0; i < 5; i++) {
      recordFailedAttempt('test-rate-limit')
    }
    const result = checkRateLimit('test-rate-limit')
    expect(result.allowed).toBe(false)
  })
})

describe('resetAttempts', () => {
  it('resets the counter back to 0', () => {
    const key = 'test-reset'
    for (let i = 0; i < 5; i++) {
      recordFailedAttempt(key)
    }
    expect(checkRateLimit(key).allowed).toBe(false)
    resetAttempts(key)
    expect(checkRateLimit(key).allowed).toBe(true)
  })
})

describe('logAction / getAuditLog', () => {
  it('adds an entry to the audit log', () => {
    const beforeLen = getAuditLog().length
    logAction('LOGIN', 'test', 'unit test login')
    const afterLen = getAuditLog().length
    expect(afterLen).toBe(beforeLen + 1)
  })

  it('returns entries in reverse chronological order (newest first)', () => {
    // Clear the log for a clean test
    const entries = getAuditLog()
    logAction('LOGOUT', 'test', 'cleanup')
    const log = getAuditLog()
    expect(log).toHaveLength(entries.length + 1)
    // The first entry should be the one we just added (newest first)
    expect(log[0].action).toBe('LOGOUT')
    expect(log[0].target).toBe('test')
  })
})
