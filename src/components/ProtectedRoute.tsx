import { Navigate, useLocation } from 'react-router-dom'
import { useTenant } from '@/contexts/TenantContext'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useTenant()
  const location = useLocation()

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
