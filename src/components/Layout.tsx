import { Outlet, useLocation } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { ProtectedRoute } from './ProtectedRoute'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Layout() {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('fadeIn')

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut')
      setTimeout(() => {
        setDisplayLocation(location)
        setTransitionStage('fadeIn')
      }, 150) // half of the transition
    }
  }, [location, displayLocation])

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-slate-50">
          <AppSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <AppHeader />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              <div
                className={`w-full max-w-7xl mx-auto transition-all duration-300 ease-in-out ${
                  transitionStage === 'fadeIn'
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-4'
                }`}
              >
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
