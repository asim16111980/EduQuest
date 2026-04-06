import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const trimmedEmail = email.trim()

    // Field-level validation
    const fe: Record<string, string> = {}
    if (!trimmedEmail) fe.email = 'البريد الإلكتروني مطلوب'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) fe.email = 'البريد الإلكتروني غير صحيح'
    if (!password) fe.password = 'كلمة المرور مطلوبة'
    else if (password.length < 8) fe.password = 'يجب أن تكون 8 أحرف على الأقل'
    if (Object.keys(fe).length > 0) {
      setFieldErrors(fe)
      return
    }

    setLoading(true)
    const result = await login(trimmedEmail, password)
    setLoading(false)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error ?? 'خطأ في تسجيل الدخول')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-display font-bold text-lg group-hover:scale-110 transition-transform">E</div>
          <span className="font-display font-bold text-xl text-gray-800">EduQuest</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-3">
              <LogIn className="w-7 h-7 text-primary-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="font-body text-gray-500 mt-1">Login to continue your adventure</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-body mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: '' })); setError('') }}
              placeholder="student@example.com"
              error={fieldErrors.email}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: '' })); setError('') }}
              placeholder="Your password"
              error={fieldErrors.password}
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={loading}
            >
              Login
            </Button>
          </form>

          <p className="text-center mt-4 text-sm font-body text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-600 font-bold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
