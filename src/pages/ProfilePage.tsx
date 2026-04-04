import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Eye, EyeOff, Lock, ChevronDown, ChevronUp, AlertTriangle, User, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { grades, stages, getGradeById } from '@/data/grades'
import { STAGE_COLORS, type Stage } from '@/types'
import { validatePassword, PASSWORD_HINT } from '@/lib/validate'

/**
 * ProfilePage — User profile settings page for EduQuest.
 * Allows students to view and update their personal information,
 * change password, and delete their account. Full RTL Arabic layout.
 */
export default function ProfilePage() {
  const { user, logout, updateUser } = useAuthStore()
  const navigate = useNavigate()
  const { toasts, add: toast, remove: removeToast } = useToast()

  // Personal info state
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [selectedGrade, setSelectedGrade] = useState(() => getGradeById(user?.grade_id ?? 0) ?? null)

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const avatarFileRef = useRef<HTMLInputElement>(null)

  // Password state
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [showHide, setShowHide] = useState({ cur: false, newPwd: false, confirm: false })
  const [curPwd, setCurPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  // Save state
  const [saving, setSaving] = useState<string | null>(null)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Stage collapse state
  const [openStage, setOpenStage] = useState<string | null>(null)

  if (!user) return null

  const stage = user.grade_id >= 10 ? 'secondary' : user.grade_id >= 7 ? 'preparatory' : 'primary'
  const stageColors = STAGE_COLORS[stage as Stage]
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  const isPersonalDirty =
    name.trim() !== user.name || email.trim() !== user.email || selectedGrade?.id !== user.grade_id || !!avatarPreview

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const savePersonalInfo = async () => {
    const newErrors: Record<string, string> = {}
    if (name.trim().length < 2) newErrors.name = 'الاسم يجب أن يكون حرفين على الأقل'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = 'البريد الإلكتروني غير صحيح'
    if (!selectedGrade) newErrors.grade = 'يرجى اختيار الصف الدراسي'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast('يرجى تصحيح الأخطاء أولاً', 'error')
      return
    }
    setErrors({})
    setSaving('personal')
    await new Promise((r) => setTimeout(r, 1500))
    updateUser({ name: name.trim(), email: email.trim(), grade_id: selectedGrade!.id })
    setAvatarPreview(null)
    setSaving(null)
    toast('تم الحفظ بنجاح ✓', 'success')
  }

  const savePassword = async () => {
    const newErrors: Record<string, string> = {}
    if (!curPwd) newErrors.curPwd = 'كلمة المرور الحالية مطلوبة'
    const pwErr = validatePassword(newPwd)
    if (pwErr) newErrors.newPwd = pwErr
    if (newPwd !== confirmPwd) newErrors.confirmPwd = 'كلمتا المرور غير متطابقتين'
    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }))
      toast('يرجى تصحيح الأخطاء أولاً', 'error')
      return
    }
    setErrors((prev) => {
      const copy = { ...prev }
      delete copy.curPwd
      delete copy.newPwd
      delete copy.confirmPwd
      return copy
    })
    setSaving('password')
    await new Promise((r) => setTimeout(r, 1500))
    setCurPwd('')
    setNewPwd('')
    setConfirmPwd('')
    setSaving(null)
    setShowPasswordSection(false)
    toast('تم تغيير كلمة المرور بنجاح ✓', 'success')
  }

  const confirmDelete = async () => {
    if (deleteEmail.trim() !== user.email) return
    setDeleting(true)
    await new Promise((r) => setTimeout(r, 1500))
    logout()
    setDeleting(false)
    navigate('/')
    toast('تم حذف الحساب', 'info')
  }

  const togglePwd = (key: keyof typeof showHide) =>
    setShowHide((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div dir="rtl" className="font-tajawal min-h-screen bg-gray-50 py-8 px-4">
      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`px-4 py-3 rounded-2xl shadow-lg mb-2 animate-slide-in-right cursor-pointer ${
                t.type === 'success'
                  ? 'bg-emerald-50 border-2 border-emerald-200 text-emerald-800'
                  : t.type === 'error'
                  ? 'bg-red-50 border-2 border-red-200 text-red-800'
                  : 'bg-white border-2 border-gray-200 text-gray-800'
              }`}
              onClick={() => removeToast(t.id)}
            >
              {t.message}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page title */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-gray-800">الإعدادات الشخصية</h1>
          <p className="font-body text-gray-500 mt-1">أدر معلوماتك الشخصية وتفضيلاتك</p>
        </div>

        {/* Avatar Section */}
        <Card hover={false} className="p-6">
          <div className="flex flex-col items-center">
            <div
              className="relative group cursor-pointer"
              onClick={() => avatarFileRef.current?.click()}
            >
              <input
                ref={avatarFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white font-display font-bold text-2xl border-4 border-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${stageColors.primary}, ${stageColors.accent})` }}
                >
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            {avatarPreview && (
              <p className="text-sm text-gray-500 mt-2 font-body">تم اختيار صورة جديدة — اضغط حفظ لتأكيد التغيير</p>
            )}
          </div>
        </Card>

        {/* Personal Info Section */}
        <Card hover={false} className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5" style={{ color: stageColors.primary }} />
            <h2 className="font-display text-xl font-bold text-gray-800">المعلومات الشخصية</h2>
          </div>

          <Input
            label="الاسم الكامل"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }}
            error={errors.name}
            placeholder="أدخل اسمك الكامل"
            className="rtl"
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
            error={errors.email}
            placeholder="student@example.com"
            dir="ltr"
          />

          {/* Grade Selection */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2 font-body">الصف الدراسي</label>
            {errors.grade && <p className="mb-2 text-sm text-red-500 font-body">{errors.grade}</p>}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {stages.map((s) => {
                const stageGrades = grades.filter((g) => g.stage === s.key)
                const c = STAGE_COLORS[s.key as Stage]
                const isOpen = openStage === s.key

                return (
                  <div key={s.key} className="rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenStage(isOpen ? null : s.key)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span>{s.emoji}</span>
                        <span className="font-body font-bold text-sm text-gray-700">{s.name_ar}</span>
                        <span className="text-xs text-gray-400">{s.name_en}</span>
                      </span>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isOpen && (
                      <div className="p-2 grid grid-cols-2 gap-1.5 animate-slide-up">
                        {stageGrades.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                              setSelectedGrade(g)
                              setErrors((p) => ({ ...p, grade: '' }))
                            }}
                            className={`px-3 py-2.5 rounded-xl text-sm font-body font-bold transition-all ${
                              selectedGrade?.id === g.id
                                ? 'text-white shadow-md'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                            style={selectedGrade?.id === g.id ? { backgroundColor: c.primary } : {}}
                          >
                            {g.name_ar}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {selectedGrade && (
              <p className="mt-2 text-sm font-body text-gray-500">
                المحدد: {selectedGrade.name_ar} ({selectedGrade.name_en})
              </p>
            )}
          </div>

          <Button
            variant="primary"
            onClick={savePersonalInfo}
            isLoading={saving === 'personal'}
            disabled={!isPersonalDirty}
            className="w-full mt-2"
          >
            حفظ التغييرات
          </Button>
        </Card>

        {/* Password Section */}
        <Card hover={false} className="p-6">
          <button
            type="button"
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-500" />
              <h2 className="font-display text-xl font-bold text-gray-800">تغيير كلمة المرور</h2>
            </div>
            {showPasswordSection ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showPasswordSection && (
            <div className="mt-4 space-y-3 animate-slide-up">
              <div className="relative">
                <Input
                  label="كلمة المرور الحالية"
                  type={showHide.cur ? 'text' : 'password'}
                  value={curPwd}
                  onChange={(e) => { setCurPwd(e.target.value); setErrors((p) => ({ ...p, curPwd: '' })) }}
                  error={errors.curPwd}
                  placeholder="أدخل كلمة المرور الحالية"
                />
                <button
                  type="button"
                  onClick={() => togglePwd('cur')}
                  className="absolute left-3 top-10 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showHide.cur ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="كلمة المرور الجديدة"
                  type={showHide.newPwd ? 'text' : 'password'}
                  value={newPwd}
                  onChange={(e) => { setNewPwd(e.target.value); setErrors((p) => ({ ...p, newPwd: '' })) }}
                  error={errors.newPwd}
                  placeholder="8 أحرف على الأقل"
                />
                <button
                  type="button"
                  onClick={() => togglePwd('newPwd')}
                  className="absolute left-3 top-10 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showHide.newPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="تأكيد كلمة المرور"
                  type={showHide.confirm ? 'text' : 'password'}
                  value={confirmPwd}
                  onChange={(e) => { setConfirmPwd(e.target.value); setErrors((p) => ({ ...p, confirmPwd: '' })) }}
                  error={errors.confirmPwd}
                  placeholder="أعد كتابة كلمة المرور الجديدة"
                />
                <button
                  type="button"
                  onClick={() => togglePwd('confirm')}
                  className="absolute left-3 top-10 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showHide.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                variant="primary"
                onClick={savePassword}
                isLoading={saving === 'password'}
                disabled={!curPwd && !newPwd && !confirmPwd}
                className="w-full"
              >
                حفظ كلمة المرور
              </Button>
            </div>
          )}
        </Card>

        {/* Danger Zone */}
        <Card hover={false} className="p-6 border-2 border-red-200 bg-red-50/50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-red-700">منطقة الخطر</h3>
              <p className="font-body text-sm text-red-600 mt-1">
                حذف حسابك نهائي. ستفقد جميع بياناتك وتقدمك في الألعاب. لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
          </div>
          <Button
            variant="danger"
            size="md"
            className="mt-4 w-full"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-4 h-4 ml-2" />
            حذف الحساب
          </Button>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4"
          onClick={() => { if (!deleting) { setShowDeleteModal(false); setDeleteEmail('') } }}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="font-display text-xl font-bold text-gray-800">تأكيد حذف الحساب</h3>
              <p className="font-body text-sm text-gray-500 mt-2">
                اكتب بريدك الإلكتروني لتأكيد الحذف. هذا الإجراء لا يمكن التراجع عنه.
              </p>
            </div>

            <Input
              label="البريد الإلكتروني"
              type="email"
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
              placeholder={user.email}
              dir="ltr"
            />

            <p className="text-xs text-gray-400 font-body mb-4 text-center">
              يجب أن يطابق: <span className="font-bold text-gray-600" dir="ltr">{user.email}</span>
            </p>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => { setShowDeleteModal(false); setDeleteEmail('') }}
                disabled={deleting}
              >
                إلغاء
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={confirmDelete}
                isLoading={deleting}
                disabled={deleteEmail.trim() !== user.email}
              >
                حذف الحساب
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
