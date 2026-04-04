import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/useToast'
import { grades, stages, type Grade } from '@/data/grades'
import { STAGE_COLORS, type Stage } from '@/types'

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null)
  const [openStage, setOpenStage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { toasts, add: toast, remove: removeToast } = useToast()
  const login = useAuthStore((s) => s.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Name is required'); return }
    if (!email.trim() || !email.includes('@')) { setError('Valid email is required'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (!selectedGrade) { setError('Please select your grade'); return }

    setLoading(true)
    // Simulated registration (Supabase auth would go here)
    await new Promise((r) => setTimeout(r, 800))

    const user = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      grade_id: selectedGrade.id,
      created_at: new Date().toISOString(),
    }
    login(user)
    toast('Welcome to EduQuest! 🎉', 'success')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50">
        {toasts.map((t) => (
          <div key={t.id} className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl shadow-lg mb-2 animate-slide-in-right">
            {t.message}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-display font-bold text-lg group-hover:scale-110 transition-transform">E</div>
          <span className="font-display font-bold text-xl text-gray-800">EduQuest</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-7 h-7 text-primary-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-800">Create Your Account</h2>
            <p className="font-body text-gray-500 mt-1">Join the learning adventure</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-body mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8+ chars, uppercase, lowercase, number, special char" />

            {/* Grade Selection */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2 font-body">School Grade</label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {stages.map((stage) => {
                  const stageGrades = grades.filter((g) => g.stage === stage.key)
                  const c = STAGE_COLORS[stage.key as Stage]
                  const isOpen = openStage === stage.key

                  return (
                    <div key={stage.key} className="rounded-xl border border-gray-200 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenStage(isOpen ? null : stage.key)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span>{stage.emoji}</span>
                          <span className="font-body font-bold text-sm text-gray-700">{stage.name_en}</span>
                          <span className="font-arabic text-xs text-gray-400" dir="rtl">{stage.name_ar}</span>
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isOpen && (
                        <div className="p-2 grid grid-cols-2 gap-1.5 animate-slide-up">
                          {stageGrades.map((g) => (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => setSelectedGrade(g)}
                              className={`px-3 py-2.5 rounded-xl text-sm font-body font-bold transition-all ${
                                selectedGrade?.id === g.id
                                  ? 'text-white shadow-md'
                                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                              }`}
                              style={selectedGrade?.id === g.id ? { backgroundColor: c.primary } : {}}
                            >
                              {g.name_en}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              {selectedGrade && (
                <div className="mt-2 text-sm font-body text-gray-500 flex items-center gap-1">
                  <span className="text-primary-500">Selected:</span> {selectedGrade.name_en} ({selectedGrade.name_ar})
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={loading}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center mt-4 text-sm font-body text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
