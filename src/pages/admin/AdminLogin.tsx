/**
 * AdminLogin — dark-themed admin login page with rate limiting display
 * and session expiry messages.
 */
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, Shield } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import { checkRateLimit } from '@/lib/adminAuth'

export default function AdminLogin() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const adminLogin = useAdminStore((s) => s.adminLogin)
  const isBlocked = useAdminStore((s) => s.isBlocked)
  const blockedUntil = useAdminStore((s) => s.blockedUntil)
  const loginAttempts = useAdminStore((s) => s.loginAttempts)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  const reason = searchParams.get('reason')
  const reasonMsg =
    reason === 'expired'
      ? 'انتهت جلستك، يرجى تسجيل الدخول مجدداً'
      : reason === 'logout'
      ? 'تم تسجيل الخروج بنجاح'
      : ''

  // Countdown if blocked
  useEffect(() => {
    if (isBlocked && blockedUntil) {
      const remaining = Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000))
      setCountdown(remaining)
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isBlocked, blockedUntil])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    // SECURITY: Validate email format and require fields
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('البريد الإلكتروني غير صحيح')
      return
    }

    const rate = checkRateLimit(email)
    if (!rate.allowed) {
      setError(`المحاولة التالية بعد ${formatTime(rate.blockedFor!)} دقيقة`)
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    const result = await adminLogin(email.trim(), password)
    setLoading(false)

    if (result.success) {
      navigate('/admin', { replace: true })
    } else {
      setError(result.error ?? 'خطأ في تسجيل الدخول')
    }
  }

  if (isBlocked && countdown > 0) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-4">
        <div className="bg-[#1a1a2e] rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-red-500/20">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-red-400 mb-2">تم حظر محاولات تسجيل الدخول</h2>
          <p className="font-body text-gray-400 mb-4">
            المحاولة التالية بعد{' '}
            <span className="text-red-400 font-bold" dir="ltr">{formatTime(countdown)}</span>
          </p>
          <p className="text-xs text-gray-500 font-body">نظراً لعدد كبير من المحاولات الفاشلة</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-4">
      <div className="bg-[#1a1a2e] rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/5">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white mx-auto mb-3">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white">لوحة الإدارة</h2>
          <p className="font-body text-sm text-gray-400 mt-1">سجّل دخولك للوصول إلى لوحة التحكم</p>
        </div>

        {/* Reason message */}
        {reasonMsg && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-xl px-4 py-3 text-sm font-body mb-4 text-center">
            {reasonMsg}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl px-4 py-3 text-sm font-body mb-4 text-center">
            {error}
          </div>
        )}

        {/* Attempts warning */}
        {loginAttempts >= 3 && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl px-4 py-2 text-sm font-body mb-4 text-center">
            ⚠️ متبقي {5 - loginAttempts} محاولات
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1.5 font-body">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@eduquest.eg"
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-body focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1.5 font-body">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-body focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-display font-bold transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-purple-500/20"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
