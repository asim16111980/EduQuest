/**
 * Admin Zustand store — manages admin login state, sessions, rate limiting.
 */
import { create } from 'zustand'
import {
  generateToken,
  verifyToken,
  checkRateLimit,
  recordFailedAttempt,
  resetAttempts,
  updateLastActivity,
  checkSessionTimeout,
  logAction,
} from '@/lib/adminAuth'

interface AdminState {
  isAdmin: boolean
  adminEmail: string | null
  token: string | null
  loginAttempts: number
  isBlocked: boolean
  blockedUntil: number | null
  lastActivity: number

  adminLogin(email: string, password: string): Promise<{ success: boolean; error?: string }>
  adminLogout(reason?: string): void
  refreshActivity(): void
  startSessionWatcher(): void
  checkAndRefreshSession(): boolean
  resetFromRateLimit(): void
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAdmin: false,
  adminEmail: null,
  token: null,
  loginAttempts: 0,
  isBlocked: false,
  blockedUntil: null,
  lastActivity: Date.now(),

  adminLogin: async (email: string, password: string) => {
    // Rate limit check
    const rate = checkRateLimit(email)
    if (!rate.allowed) {
      set({
        isBlocked: true,
        blockedUntil: Date.now() + (rate.blockedFor ?? 0) * 1000,
      })
      return { success: false, error: 'تم حظر المحاولة مؤقتاً', blockedFor: rate.blockedFor }
    }

    // Credentials check (hardcoded)
    const ADMIN_EMAIL = 'admin@eduquest.eg'
    const ADMIN_PASSWORD = 'EduQuest@2025!'

    if (email.trim() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      recordFailedAttempt(email)
      const remaining = checkRateLimit(email).remainingAttempts
      set({ loginAttempts: MAX_ATTEMPTS - remaining })
      return {
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      }
    }

    // Success
    resetAttempts(email)
    const token = generateToken(email)
    sessionStorage.setItem('eq_admin_token', token)
    updateLastActivity()
    logAction('LOGIN', email)

    set({
      isAdmin: true,
      adminEmail: email,
      token,
      loginAttempts: 0,
      isBlocked: false,
      blockedUntil: null,
      lastActivity: Date.now(),
    })

    return { success: true }
  },

  adminLogout: (reason = 'logout') => {
    const state = get()
    if (state.adminEmail) {
      logAction('LOGOUT', state.adminEmail, reason)
    }
    sessionStorage.removeItem('eq_admin_token')
    set({
      isAdmin: false,
      adminEmail: null,
      token: null,
      loginAttempts: 0,
      isBlocked: false,
      blockedUntil: null,
      lastActivity: 0,
    })
  },

  refreshActivity: () => {
    updateLastActivity()
    set({ lastActivity: Date.now() })
  },

  startSessionWatcher: () => {
    window.setInterval(() => {
      get().refreshActivity()
    }, 60_000)
  },

  checkAndRefreshSession: (): boolean => {
    const state = get()
    if (!state.token) return false
    const tokenResult = verifyToken(state.token)
    const timedOut = checkSessionTimeout()

    if (!tokenResult.valid || timedOut) {
      sessionStorage.removeItem('eq_admin_token')
      set({
        isAdmin: false,
        adminEmail: null,
        token: null,
        lastActivity: 0,
      })
      return false
    }
    get().refreshActivity()
    return true
  },

  resetFromRateLimit: () => {
    const state = get()
    if (state.adminEmail) resetAttempts(state.adminEmail)
    set({ isBlocked: false, blockedUntil: null })
  },
}))

// Constants from adminAuth
const MAX_ATTEMPTS = 5
