/**
 * AdminRoute — protects nested admin routes. Redirects to /admin/login
 * if the admin token is missing or expired.
 */
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { verifyToken } from '@/lib/adminAuth'
import { useAdminStore } from '@/store/adminStore'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const checkAndRefreshSession = useAdminStore((s) => s.checkAndRefreshSession)

  useEffect(() => {
    const token = sessionStorage.getItem('eq_admin_token')
    const tokenResult = verifyToken(token ?? '')
    if (!token || !tokenResult.valid || tokenResult.expired) {
      if (location.pathname !== '/admin/login') {
        navigate('/admin/login?reason=expired', { replace: true })
      }
      return
    }
    const alive = checkAndRefreshSession()
    if (!alive) {
      navigate('/admin/login?reason=expired', { replace: true })
    }
  }, [location.pathname])

  return <>{children}</>
}
