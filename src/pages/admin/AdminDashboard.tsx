/**
 * AdminDashboard — main admin overview page with stats, charts, and quick actions.
 * Route: /admin
 */
import { Link } from 'react-router-dom'
import { Users, Gamepad2, Trophy, Star } from 'lucide-react'
import { AdminStatCard } from '@/components/admin/shared'
import { MOCK_USERS } from '@/data/mockAdminData'

export default function AdminDashboard() {
  const recentSignups = [...MOCK_USERS]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const topGames = [
    { title: 'مغامرة العد', plays: 387, max: 387 },
    { title: 'تحدي الجمع', plays: 312, max: 387 },
    { title: 'رحلة الضرب', plays: 256, max: 387 },
    { title: 'سيد الخرائط', plays: 198, max: 387 },
    { title: 'سحر الهندسة', plays: 176, max: 387 },
  ]

  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days < 7) return `${days} يوم`
    const weeks = Math.floor(days / 7)
    return `${weeks} أسبوع`
  }

  return (
    <div className="space-y-6" dir="rtl" onClick={() => {}}>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          icon={<Users className="w-5 h-5 text-blue-600" />}
          label="إجمالي الطلاب"
          value="1,240"
          trend={{ value: 12, up: true }}
          color="bg-blue-100"
        />
        <AdminStatCard
          icon={<Gamepad2 className="w-5 h-5 text-purple-600" />}
          label="ألعاب اليوم"
          value="387"
          trend={{ value: 5, up: true }}
          color="bg-purple-100"
        />
        <AdminStatCard
          icon={<Trophy className="w-5 h-5 text-amber-600" />}
          label="أكثر صف نشاطاً"
          value="الصف السادس"
          color="bg-amber-100"
        />
        <AdminStatCard
          icon={<Star className="w-5 h-5 text-emerald-600" />}
          label="متوسط النقاط"
          value="74%"
          trend={{ value: 2, up: false }}
          color="bg-emerald-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Signups */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-display font-bold text-gray-800 mb-4">أحدث الاشتراكات</h3>
          <div className="space-y-3">
            {recentSignups.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-600">{user.name_ar[0]}</span>
                  </div>
                  <div>
                    <p className="font-body text-sm font-bold text-gray-800">{user.name_ar}</p>
                    <p className="font-body text-xs text-gray-400" dir="ltr">{user.email}</p>
                  </div>
                </div>
                <span className="font-body text-xs text-gray-400">{timeAgo(user.created_at)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Games */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-display font-bold text-gray-800 mb-4">أكثر 5 ألعاب لعباً</h3>
          <div className="space-y-3">
            {topGames.map((game, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-5 text-center">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-sm text-gray-700">{game.title}</span>
                    <span className="font-body text-xs text-gray-400" dir="ltr">{game.plays}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${(game.plays / game.max) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/games"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-body font-bold text-sm hover:shadow-lg transition-all"
        >
          أضف لعبة
        </Link>
        <Link
          to="/admin/users"
          className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-body font-bold text-sm hover:bg-gray-50 transition-colors"
        >
          أضف مستخدم
        </Link>
        <Link
          to="/admin/stats"
          className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-body font-bold text-sm hover:bg-gray-50 transition-colors"
        >
          عرض التقارير
        </Link>
      </div>
    </div>
  )
}
