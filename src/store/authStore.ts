/**
 * @file authStore.ts
 * @description Auth store with registered-user persistence (localStorage) and login validation.
 */
import { create } from 'zustand'
import type { User } from '@/types'
import { validatePassword } from '@/lib/validate'

const REGISTRY_KEY = 'eq_registered_users'

interface RegisteredUser {
  id: string
  name: string
  email: string
  passwordHash: string // btoa(password) — simple mock hash; use bcrypt in production
  gradeId: number
  createdAt: number
}

function loadUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users: RegisteredUser[]): void {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(users))
}

interface AuthState {
  users: RegisteredUser[]
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string, gradeId: number) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  setLoading: (isLoading: boolean) => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  users: loadUsers(),
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    const trimmed = email.trim()
    const users = get().users

    const found = users.find((u) => u.email === trimmed)
    if (!found) return { success: false, error: 'لا يوجد حساب بهذا البريد الإلكتروني' }
    if (found.passwordHash !== btoa(password)) return { success: false, error: 'كلمة المرور غير صحيحة' }

    const user: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      grade_id: found.gradeId,
      created_at: new Date(found.createdAt).toISOString(),
    }
    set({ user, isAuthenticated: true, isLoading: false })
    return { success: true }
  },

  register: async (name: string, email: string, password: string, gradeId: number) => {
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const existingUsers = get().users

    if (!trimmedName || trimmedName.length < 2) return { success: false, error: 'الاسم يجب أن يكون حرفين على الأقل' }
    if (/\d/.test(trimmedName)) return { success: false, error: 'الاسم لا يجب أن يحتوي على أرقام' }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return { success: false, error: 'البريد الإلكتروني غير صحيح' }

    const pwErr = validatePassword(password)
    if (pwErr) return { success: false, error: pwErr }
    if (existingUsers.some((u) => u.email === trimmedEmail)) return { success: false, error: 'هذا البريد الإلكتروني مسجل مسبقاً' }

    const newUser: RegisteredUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name: trimmedName,
      email: trimmedEmail,
      passwordHash: btoa(password), // mock hash; use bcrypt in production
      gradeId,
      createdAt: Date.now(),
    }
    const updatedUsers = [...existingUsers, newUser]
    saveUsers(updatedUsers)
    set({ users: updatedUsers })
    return { success: true }
  },

  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  updateUser: (updates: Partial<User>) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}))
