/**
 * StatsPage — analytics dashboard with CSS-only charts and mock data.
 * Route: /admin/stats
 */
import { useState } from 'react'
import { BarChart3, Calendar, Download, Star, Trophy } from 'lucide-react'
import { mockWeeklyActiveUsers, mockSubjectPopularity, mockTopStudents } from '@/data/mockAdminData'
import { AdminBadge, AdminSelect } from '@/components/admin/shared'

const SUBJECT_EMOJI: Record<string, string> = {
  math: '🔢', arabic: '📝', science: '🔬', english: '🔤', geography: '🌍', history: '🏛️',
}

const SUBJECT_NAMES_AR: Record<string, string> = {
  math: 'الرياضيات', arabic: 'اللغة العربية', science: 'العلوم', english: 'الإنجليزية', geography: 'الجغرافيا', history: 'التاريخ',
}

const DAY_LABELS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
const HOUR_LABELS = [0, 4, 8, 12, 16, 20]

// Mock heatmap data (7 days x 24 hours)
const mockHeatmap: number[][] = Array.from({ length: 7 }, () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
)

function getHeatColor(value: number): string {
  if (value < 10) return 'bg-gray-100'
  if (value < 30) return 'bg-emerald-200'
  if (value < 60) return 'bg-emerald-400'
  if (value < 80) return 'bg-emerald-500'
  return 'bg-emerald-600'
}

const dateRanges = [
  { key: 'week', label: 'هذا الأسبوع' },
  { key: 'month', label: 'هذا الشهر' },
  { key: 'all', label: 'كل الوقت' },
]

export default function StatsPage() {
  const [range, setRange] = useState('week')

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Range Picker */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          <h2 className="font-display font-bold text-gray-800">الإحصائيات</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {dateRanges.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-4 py-2 rounded-xl font-body text-sm font-bold transition-all ${
                  range === r.key ? 'bg-purple-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-body text-sm hover:bg-gray-50"
          >
            <Download className="w-4 h-4" /> تحميل التقرير
          </button>
        </div>
      </div>

      {/* Weekly Active Users */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-display font-bold text-gray-800 mb-4">المستخدمون النشطون هذا الأسبوع</h3>
        <div className="flex items-end gap-3 h-48" dir="ltr">
          {mockWeeklyActiveUsers.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-body text-gray-400">{val}</span>
              <div
                className="w-full bg-gradient-to-t from-purple-500 to-indigo-400 rounded-t-xl transition-all"
                style={{ height: `${(val / 250) * 100}%` }}
              />
              <span className="text-xs font-body text-gray-500">{DAY_LABELS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Popularity + Stage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-display font-bold text-gray-800 mb-4">شعبية المواد</h3>
          <div className="space-y-3">
            {mockSubjectPopularity.map((s) => (
              <div key={s.subject} className="flex items-center gap-3">
                <span className="text-sm w-20 font-body text-gray-600">{SUBJECT_NAMES_AR[s.subject]}</span>
                <div className="flex-1">
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full"
                      style={{ width: `${s.percent}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-body text-gray-400 w-10 text-left">{s.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-display font-bold text-gray-800 mb-4">توزيع المراحل</h3>
          <div className="flex h-8 rounded-full overflow-hidden">
            <div className="bg-blue-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: '45%' }}>الابتدائي</div>
            <div className="bg-green-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: '30%' }}>الإعدادي</div>
            <div className="bg-purple-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: '25%' }}>الثانوي</div>
          </div>
          <div className="flex justify-between mt-3 text-xs font-body text-gray-400">
            <span>ابتدائي ٤٪</span>
            <span>إعدادي ٣٠٪</span>
            <span>ثانوي ٢٥٪</span>
          </div>
        </div>
      </div>

      {/* Hourly Activity Heatmap */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 overflow-x-auto">
        <h3 className="font-display font-bold text-gray-800 mb-4">النشاط الساعي (7 أيام × 24 ساعة)</h3>
        <div className="flex gap-0.5" dir="ltr">
          {/* Hour labels */}
          <div className="flex flex-col gap-0.5 min-w-[2rem]">
            {HOUR_LABELS.map((h) => (
              <div key={h} className="h-3 flex items-center text-[9px] text-gray-400 text-right">
                {h}:00
              </div>
            ))}
          </div>
          {/* Grid */}
          {mockHeatmap.map((day, di) => (
            <div key={di} className="flex flex-col gap-0.5">
              {day.filter((_, hi) => hi % 4 === 0 || hi === 12 || hi === 20).map((val, hi) => (
                <div
                  key={hi}
                  className={`w-3 h-3 rounded-[2px] ${getHeatColor(val)}`}
                  title={`${DAY_LABELS[di]} ${hi}:00 — ${val} نشاط`}
                />
              ))}
            </div>
          ))}
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 min-w-[2.5rem] justify-end">
            {DAY_LABELS.map((d) => (
              <div key={d} className="h-3 flex items-center text-[9px] text-gray-400 text-right font-body">
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 10 Students */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="font-display font-bold text-gray-800">أفضل 10 طلاب</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2.5 text-right font-body font-bold text-gray-500">الترتيب</th>
                <th className="px-3 py-2.5 text-right font-body font-bold text-gray-500">الاسم</th>
                <th className="px-3 py-2.5 text-right font-body font-bold text-gray-500">الصف</th>
                <th className="px-3 py-2.5 text-right font-body font-bold text-gray-500">متوسط النسبة</th>
                <th className="px-3 py-2.5 text-right font-body font-bold text-gray-500">عدد النجوم</th>
              </tr>
            </thead>
            <tbody>
              {mockTopStudents.map((s) => (
                <tr key={s.rank} className="border-t border-gray-100">
                  <td className="px-3 py-2.5">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      s.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {s.rank}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-body font-bold text-gray-700">{s.name}</td>
                  <td className="px-3 py-2.5 font-body text-gray-400 text-xs">{s.grade_ar}</td>
                  <td className="px-3 py-2.5">
                    <span className={`font-body text-sm font-bold ${
                      s.avgScore >= 90 ? 'text-emerald-600' : s.avgScore >= 80 ? 'text-blue-600' : 'text-amber-600'
                    }`}>
                      {s.avgScore}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-body text-amber-500">
                    <Star className="w-4 h-4 inline ml-1" fill="currentColor" />
                    {s.stars}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
