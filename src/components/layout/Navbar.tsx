import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, LayoutGrid, Settings } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-display font-bold text-lg group-hover:scale-110 transition-transform">
              E
            </div>
            <span className="font-display font-bold text-xl text-gray-800 hidden sm:block">EduQuest</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 text-gray-600 hover:text-primary-600 font-body font-semibold text-sm transition-colors">
                  Dashboard
                </Link>
                <Link to="/profile" className="px-3 py-2 text-gray-600 hover:text-primary-600 font-body font-semibold text-sm transition-colors flex items-center gap-1">
                  <Settings className="w-4 h-4" /> Profile
                </Link>
                {user?.role === 'admin' && (
                <Link to="/admin/login" className="px-3 py-2 text-gray-400 hover:text-gray-600 font-body font-semibold text-xs transition-colors flex items-center gap-1">
                  <Settings className="w-3.5 h-3.5" /> Admin
                </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-xl">
                  <User className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-body font-semibold text-primary-700">{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-xl hover:bg-gray-100">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-3 animate-slide-up">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50">
                  <LayoutGrid className="w-5 h-5 text-gray-500" />
                  <span className="font-body font-semibold text-gray-700">Dashboard</span>
                </Link>
                <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="font-body font-semibold text-gray-700">Profile</span>
                </Link>
                <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 rounded-xl">
                  <User className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-body font-semibold text-primary-700">{user?.name}</span>
                </div>
                <button onClick={() => { handleLogout(); setOpen(false) }} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-body font-semibold">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
