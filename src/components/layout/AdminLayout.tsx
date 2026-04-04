/**
 * AdminLayout — collapsible sidebar + top bar wrapper for all admin pages.
 * Dark sidebar, RTL Arabic, responsive.
 */
import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  GraduationCap,
  Image,
  BarChart3,
  ShieldCheck,
  Menu,
  LogOut,
  Bell,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { SessionTimer } from '@/components/admin/shared'
import { useAdminStore } from '@/store/adminStore'
import { logAction } from '@/lib/adminAuth'

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { path: '/admin/users', icon: Users, label: 'المستخدمون' },
  { path: '/admin/games', icon: Gamepad2, label: 'الألعاب والأسئلة' },
  { path: '/admin/grades', icon: GraduationCap, label: 'الصفوف الدراسية' },
  { path: '/admin/content', icon: Image, label: 'إدارة المحتوى' },
  { path: '/admin/stats', icon: BarChart3, label: 'الإحصائيات' },
  { path: '/admin/audit', icon: ShieldCheck, label: 'سجل العمليات' },
]

const pageTitles: Record<string, string> = {
  '/admin': 'لوحة التحكم',
  '/admin/users': 'المستخدمون',
  '/admin/games': 'الألعاب والأسئلة',
  '/admin/grades': 'الصفوف الدراسية',
  '/admin/content': 'إدارة المحتوى',
  '/admin/stats': 'الإحصائيات',
  '/admin/audit': 'سجل العمليات',
}

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { adminEmail, adminLogout, isAdmin } = useAdminStore()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // If somehow not admin, redirect
  useEffect(() => {
    if (!isAdmin) navigate('/admin/login', { replace: true })
  }, [isAdmin, navigate])

  const handleLogout = () => {
    adminLogout('logout')
    logAction('LOGOUT', adminEmail ?? '', 'manual logout')
    navigate('/admin/login?reason=logout')
  }

  const title = pageTitles[location.pathname] || 'لوحة الإدارة'

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={`flex flex-col h-full ${
        mobile ? 'min-w-[42vh]' : collapsed ? 'w-16' : 'w-64'
      } bg-[#0f0f1a] transition-all duration-300`}
      dir="rtl"
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${mobile ? '' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
          E
        </div>
        {!collapsed && !mobile && (
          <div>
            <span className="font-display font-bold text-white text-sm">EduQuest</span>
            <span className="text-[10px] text-purple-400 font-body block">لوحة الإدارة</span>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto" role="navigation" aria-label="Admin navigation">
        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl font-body text-sm transition-all ${
                active
                  ? 'bg-purple-500/20 text-purple-300 font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && !mobile && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: email + logout */}
      {!collapsed && !mobile && (
        <div className="px-4 py-4 border-t border-white/10 space-y-3">
          <p className="font-body text-xs text-gray-400 truncate" dir="ltr">{adminEmail}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm font-body transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
      {mobile && (
        <div className="px-4 py-4 border-t border-white/10 space-y-3">
          <p className="font-body text-xs text-gray-400 truncate" dir="ltr">{adminEmail}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm font-body transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" dir="rtl">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-shrink-0 border-l border-white/10">
        <Sidebar />
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 h-full z-50 md:hidden">
            <Sidebar mobile />
          </div>
        </>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-2 rounded-xl hover:bg-gray-100 text-gray-500"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <h1 className="font-display font-bold text-lg text-gray-800">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <SessionTimer />
            </div>
            <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6" onClick={() => {}}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
