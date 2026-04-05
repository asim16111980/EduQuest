/**
 * @file PublicOnlyRoute.tsx
 * @description Redirects authenticated users away from public-only pages like login/register.
 * @exports PublicOnlyRoute
 * @dependencies react-router-dom, @/store/authStore
 */
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin mx-auto mb-4" />
          <p className="font-body text-gray-500 animate-pulse-gentle">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
