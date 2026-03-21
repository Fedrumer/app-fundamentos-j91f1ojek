import { Navigate, useLocation } from 'react-router-dom'
import { useTenant } from '@/contexts/TenantContext'
import { useAuth } from '@/hooks/use-auth'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loadingTenant } = useTenant()
  const { loading: authLoading } = useAuth()
  const location = useLocation()

  if (authLoading || loadingTenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500 animate-pulse">Carregando sessão...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
