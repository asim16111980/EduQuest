import { describe, it, expect, beforeEach } from 'vitest'
import { useAdminStore } from '@/store/adminStore'
import { resetAttempts, recordFailedAttempt, generateToken } from '@/lib/adminAuth'

beforeEach(() => {
  useAdminStore.getState().adminLogout('test-cleanup')
  resetAttempts('admin@eduquest.eg')
  sessionStorage.removeItem('eq_admin_token')
})

describe('adminLogin', () => {
  it('with correct credentials sets isAdmin: true and stores token in sessionStorage', async () => {
    const result = await useAdminStore.getState().adminLogin('admin@eduquest.eg', 'EduQuest@2025!')
    expect(result.success).toBe(true)
    expect(useAdminStore.getState().isAdmin).toBe(true)
    expect(sessionStorage.getItem('eq_admin_token')).toBeTruthy()
  })

  it('with wrong password returns { success: false }', async () => {
    resetAttempts('admin@eduquest.eg')
    const result = await useAdminStore.getState().adminLogin('admin@eduquest.eg', 'wrong-password')
    expect(result.success).toBe(false)
    expect(useAdminStore.getState().isAdmin).toBe(false)
  })

  it('after 5 failures returns { success: false, blockedFor: number }', async () => {
    const email = 'blocked@test.com'
    resetAttempts(email)
    // Record 5 failed attempts
    for (let i = 0; i < 5; i++) {
      recordFailedAttempt(email)
    }
    // Now attempt login — should be blocked
    const result = await useAdminStore.getState().adminLogin(email, 'anything')
    expect(result.success).toBe(false)
    // @ts-expect-error blockedFor may not exist on the return type
    expect(result.blockedFor).toBeDefined()
    resetAttempts(email)
  })
})

describe('adminLogout', () => {
  it('clears isAdmin, token, and sessionStorage key eq_admin_token', async () => {
    await useAdminStore.getState().adminLogin('admin@eduquest.eg', 'EduQuest@2025!')
    expect(useAdminStore.getState().isAdmin).toBe(true)
    useAdminStore.getState().adminLogout('logout-cleanup')
    expect(useAdminStore.getState().isAdmin).toBe(false)
    expect(useAdminStore.getState().token).toBeNull()
    expect(sessionStorage.getItem('eq_admin_token')).toBeNull()
  })
})

describe('checkAndRefreshSession', () => {
  it('returns false when token is missing', () => {
    const result = useAdminStore.getState().checkAndRefreshSession()
    expect(result).toBe(false)
  })

  it('returns false when token is expired (tampered)', () => {
    // Create a valid token, then tamper the expiry
    const token = generateToken('test@test.com')
    const parts = token.split('.')
    const payload = JSON.parse(atob(parts[1]))
    payload.exp = Date.now() - 10000 // expired 10s ago
    parts[1] = btoa(JSON.stringify(payload))
    // Signature won't match, so verifyToken returns valid: false
    const tamperedToken = parts.join('.')

    // Set the tampered token and update store state
    sessionStorage.setItem('eq_admin_token', tamperedToken)
    // Manually set store to logged in so checkAndRefreshSession has something to check
    useAdminStore.setState({ isAdmin: true, token: tamperedToken, adminEmail: 'test@test.com' })

    const result = useAdminStore.getState().checkAndRefreshSession()
    expect(result).toBe(false)
    expect(useAdminStore.getState().isAdmin).toBe(false)
  })
})
