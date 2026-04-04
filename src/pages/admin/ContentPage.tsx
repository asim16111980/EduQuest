/**
 * ContentPage — manage static content: hero, system messages, images, announcements.
 * Route: /admin/content
 */
import { useState } from 'react'
import { Image, Bell, Globe, MessageSquare, Save, Upload, Trash2 } from 'lucide-react'
import { AdminConfirmDialog, AdminSwitch } from '@/components/admin/shared'
import { logAction } from '@/lib/adminAuth'

// Mock content state
const initialContent = {
  heroTitle: 'رحلتك التعليمية تبدأ هنا',
  heroSubtitle: 'ألعاب تعليمية تفاعلية مصممة خصيصاً لطلاب المدارس المصرية',
  ctaText: 'ابدأ الآن',

  systemMessages: {
    welcome_toast: 'مرحباً بك في EduQuest!',
    success_toast: 'تم الحفظ بنجاح',
    error_toast: 'حدث خطأ، حاول مرة أخرى',
    no_games_state: 'لا توجد ألعاب متاحة لهذا الصف',
    no_results_found: 'لا توجد نتائج',
  },

  images: [
    { id: 1, name: 'hero-bg.png', url: '/images/hero-bg.png', uploadedAt: '2025-09-01' },
    { id: 2, name: 'landing-icon.png', url: '/images/landing-icon.png', uploadedAt: '2025-09-15' },
    { id: 3, name: 'game-math-bg.png', url: '/images/game-math-bg.png', uploadedAt: '2025-10-01' },
  ],

  announcements: [
    { id: 1, text: 'اختبارات الأسبوع القادم', color: 'emerald', active: true },
    { id: 2, text: 'تحديث منهج الصف السادس', color: 'blue', active: true },
    { id: 3, text: 'صيانة مقررة الأحد القادم', color: 'amber', active: false },
  ],
}

const bannerColors = [
  { key: 'emerald', label: 'أخضر' },
  { key: 'blue', label: 'أزرق' },
  { key: 'amber', label: 'برتقالي' },
  { key: 'red', label: 'أحمر' },
  { key: 'purple', label: 'بنفسجي' },
]

export default function ContentPage() {
  const [tab, setTab] = useState<0 | 1 | 2 | 3>(0)
  const tabs = [
    { icon: Globe, label: 'الصفحة الرئيسية' },
    { icon: MessageSquare, label: 'رسائل النظام' },
    { icon: Image, label: 'الصور' },
    { icon: Bell, label: 'الإعلانات' },
  ]

  const [content, setContent] = useState(initialContent)
  const [newAnnouncementText, setNewAnnouncementText] = useState('')
  const [newAnnouncementColor, setNewAnnouncementColor] = useState('blue')
  const [showDeleteImg, setShowDeleteImg] = useState<number | null>(null)

  const handleSaveHero = () => {
    logAction('EDIT_CONTENT', 'hero', 'updated hero content')
  }

  const handleSaveMessages = () => {
    logAction('EDIT_CONTENT', 'system-messages', 'updated messages')
  }

  const handleSaveImages = () => {
    logAction('EDIT_CONTENT', 'images', 'updated images')
  }

  const handleAddAnnouncement = () => {
    if (!newAnnouncementText.trim()) return
    setContent((prev) => ({
      ...prev,
      announcements: [
        ...prev.announcements,
        { id: Date.now(), text: newAnnouncementText.trim(), color: newAnnouncementColor, active: true },
      ],
    }))
    logAction('EDIT_CONTENT', 'announcements', 'added announcement')
    setNewAnnouncementText('')
  }

  const handleSaveAnnouncements = () => {
    logAction('EDIT_CONTENT', 'announcements', 'updated announcements')
  }

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="space-y-5" dir="rtl">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setTab(i as 0 | 1 | 2 | 3)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              tab === i ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab 0: Hero */}
      {tab === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block font-body font-bold text-gray-700 mb-2 text-sm">عنوان الصفحة الرئيسية</label>
            <input
              value={content.heroTitle}
              onChange={(e) => setContent((p) => ({ ...p, heroTitle: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-sm"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block font-body font-bold text-gray-700 mb-2 text-sm">العنوان الفرعي</label>
            <textarea
              value={content.heroSubtitle}
              onChange={(e) => setContent((p) => ({ ...p, heroSubtitle: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-sm resize-none"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block font-body font-bold text-gray-700 mb-2 text-sm">نص زر الدعوة للإجراء</label>
            <input
              value={content.ctaText}
              onChange={(e) => setContent((p) => ({ ...p, ctaText: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-sm"
              dir="rtl"
            />
          </div>
          <button onClick={handleSaveHero} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 text-white font-body text-sm font-bold">
            <Save className="w-4 h-4" /> حفظ التغييرات
          </button>
        </div>
      )}

      {/* Tab 1: System Messages */}
      {tab === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          {Object.entries(content.systemMessages).map(([key, value]) => (
            <div key={key}>
              <label className="block font-body text-xs text-gray-400 mb-1">{key}</label>
              <input
                value={value}
                onChange={(e) => setContent((p) => ({
                  ...p, systemMessages: { ...p.systemMessages, [key]: e.target.value }
                }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm"
                dir="rtl"
              />
            </div>
          ))}
          <button onClick={handleSaveMessages} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 text-white font-body text-sm font-bold">
            <Save className="w-4 h-4" /> حفظ التغييرات
          </button>
        </div>
      )}

      {/* Tab 2: Images */}
      {tab === 2 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-body font-bold text-gray-700">الصور المرفوعة</h3>
            <button
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                // SECURITY: Validate file type before upload
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (!file) return
                  if (!file.type.startsWith('image/')) {
                    alert('يرجى اختيار ملف صورة صالح (PNG, JPG, GIF, etc.)')
                    return
                  }
                  // File is valid — in production this would upload to storage
                }
                input.click()
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-purple-300 text-purple-600 font-body text-sm font-bold hover:bg-purple-50"
            >
              <Upload className="w-4 h-4" /> رفع صورة
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {content.images.map((img) => (
              <div key={img.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                    <Image className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-bold text-gray-700" dir="ltr">{img.name}</p>
                    <p className="text-xs text-gray-400 font-body" dir="ltr">{img.uploadedAt}</p>
                  </div>
                </div>
                <button onClick={() => setShowDeleteImg(img.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={handleSaveImages} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 text-white font-body text-sm font-bold">
            <Save className="w-4 h-4" /> حفظ التغييرات
          </button>
        </div>
      )}

      {/* Tab 3: Announcements */}
      {tab === 3 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          {/* Add new */}
          <div className="flex gap-3">
            <input
              value={newAnnouncementText}
              onChange={(e) => setNewAnnouncementText(e.target.value)}
              placeholder="نص الإعلان الجديد"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm"
              dir="rtl"
            />
            <select value={newAnnouncementColor} onChange={(e) => setNewAnnouncementColor(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 font-body text-sm">
              {bannerColors.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
            <button onClick={handleAddAnnouncement} className="px-4 py-2.5 rounded-xl bg-purple-500 text-white font-body text-sm font-bold">إضافة</button>
          </div>

          {/* Announcements list */}
          <div className="divide-y divide-gray-100">
            {content.announcements.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-body font-bold ${colorMap[a.color]}`}>{a.text}</span>
                  <AdminSwitch checked={a.active} onChange={(v) => {
                    setContent((p) => ({
                      ...p,
                      announcements: p.announcements.map((an) => an.id === a.id ? { ...an, active: v } : an),
                    }))
                  }} />
                </div>
                <button
                  onClick={() => setContent((p) => ({ ...p, announcements: p.announcements.filter((an) => an.id !== a.id) }))}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button onClick={handleSaveAnnouncements} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 text-white font-body text-sm font-bold">
            <Save className="w-4 h-4" /> حفظ التغييرات
          </button>
        </div>
      )}

      {/* Delete Image Confirm */}
      {showDeleteImg !== null && (
        <AdminConfirmDialog
          title="حذف الصورة"
          message="هل أنت متأكد؟ سيتم حذف الصورة نهائياً."
          onConfirm={() => {
            setContent((p) => ({
              ...p,
              images: p.images.filter((img) => img.id !== showDeleteImg),
            }))
            logAction('EDIT_CONTENT', 'images', 'deleted image')
            setShowDeleteImg(null)
          }}
          onCancel={() => setShowDeleteImg(null)}
        />
      )}
    </div>
  )
}
