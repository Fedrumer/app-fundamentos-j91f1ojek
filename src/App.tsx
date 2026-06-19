import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Loader2 } from 'lucide-react'

import { RepositoryProvider } from './contexts/RepositoryContext'
import { TenantProvider } from './contexts/TenantContext'
import { AuthProvider } from './hooks/use-auth'

import MainLayout from './components/MainLayout'

const NotFound      = lazy(() => import('./pages/NotFound'))
const Login         = lazy(() => import('./pages/Login'))
const Index         = lazy(() => import('./pages/Index'))
const Users         = lazy(() => import('./pages/Users'))
const Agencies      = lazy(() => import('./pages/Agencies'))
const Vendas        = lazy(() => import('./pages/Vendas'))
const Products      = lazy(() => import('./pages/Products'))
const Finance       = lazy(() => import('./pages/Finance'))
const Receivables   = lazy(() => import('./pages/Receivables'))
const Cortesias     = lazy(() => import('./pages/Cortesias'))
const PreVenda      = lazy(() => import('./pages/PreVenda'))
const Simulador     = lazy(() => import('./pages/Simulador'))
const AdminCampanhas = lazy(() => import('./pages/AdminCampanhas'))
const AdminTPA      = lazy(() => import('./pages/AdminTPA'))

function PageLoader() {
  return (
    <div className="flex h-40 items-center justify-center text-slate-400">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  )
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <RepositoryProvider>
        <TenantProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<MainLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/usuarios" element={<Users />} />
                  <Route path="/agencias" element={<Agencies />} />
                  <Route path="/vendas" element={<Vendas />} />
                  <Route path="/produtos" element={<Products />} />
                  <Route path="/financeiro" element={<Finance />} />
                  <Route path="/valores-a-receber" element={<Receivables />} />
                  <Route path="/pre-venda" element={<PreVenda />} />
                  <Route path="/cortesias" element={<Cortesias />} />
                  <Route path="/simulador" element={<Simulador />} />
                  <Route path="/admin/campanhas" element={<AdminCampanhas />} />
                  <Route path="/admin/tpa" element={<AdminTPA />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </TooltipProvider>
        </TenantProvider>
      </RepositoryProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
