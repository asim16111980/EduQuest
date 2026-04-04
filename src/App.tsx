import { Routes, Route, Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'
import { AdminRoute } from '@/components/ui/AdminRoute'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Dashboard } from '@/pages/Dashboard'
import { GradePage } from '@/pages/GradePage'
import { GamePage } from '@/pages/GamePage'
import ProfilePage from '@/pages/ProfilePage'
import AdminLogin from '@/pages/admin/AdminLogin'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import UsersPage from '@/pages/admin/UsersPage'
import GamesPage from '@/pages/admin/GamesPage'
import GradesPage from '@/pages/admin/GradesPage'
import ContentPage from '@/pages/admin/ContentPage'
import StatsPage from '@/pages/admin/StatsPage'
import AuditPage from '@/pages/admin/AuditPage'

// Student-facing routes with Navbar + Footer
function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

// Admin routes with AdminLayout (fullscreen, its own sidebar)
function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="audit" element={<AuditPage />} />
      </Route>
    </Routes>
  )
}

export function App() {
  return (
    <Routes>
      {/* Admin login — standalone, no layout wrapper */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin pages — fullscreen with own layout */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Student-facing routes — Navbar + Footer */}
      <Route element={<StudentLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/grade/:gradeId" element={<ProtectedRoute><GradePage /></ProtectedRoute>} />
        <Route path="/game/:gameId" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}
