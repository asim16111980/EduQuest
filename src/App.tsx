import { lazy, Suspense } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'
import { PublicOnlyRoute } from '@/components/ui/PublicOnlyRoute'
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
import { AdminPageSkeleton } from '@/components/admin/AdminPageSkeleton'

// PERF: Lazy load all admin pages for better initial bundle size
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const UsersPage = lazy(() => import('@/pages/admin/UsersPage'))
const GamesPage = lazy(() => import('@/pages/admin/GamesPage'))
const GradesPage = lazy(() => import('@/pages/admin/GradesPage'))
const ContentPage = lazy(() => import('@/pages/admin/ContentPage'))
const StatsPage = lazy(() => import('@/pages/admin/StatsPage'))
const AuditPage = lazy(() => import('@/pages/admin/AuditPage'))

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
        <Route index element={<Suspense fallback={<AdminPageSkeleton />}><AdminDashboard /></Suspense>} />
        <Route path="users" element={<Suspense fallback={<AdminPageSkeleton />}><UsersPage /></Suspense>} />
        <Route path="games" element={<Suspense fallback={<AdminPageSkeleton />}><GamesPage /></Suspense>} />
        <Route path="grades" element={<Suspense fallback={<AdminPageSkeleton />}><GradesPage /></Suspense>} />
        <Route path="content" element={<Suspense fallback={<AdminPageSkeleton />}><ContentPage /></Suspense>} />
        <Route path="stats" element={<Suspense fallback={<AdminPageSkeleton />}><StatsPage /></Suspense>} />
        <Route path="audit" element={<Suspense fallback={<AdminPageSkeleton />}><AuditPage /></Suspense>} />
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
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/grade/:gradeId" element={<ProtectedRoute><GradePage /></ProtectedRoute>} />
        <Route path="/game/:gameId" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}
