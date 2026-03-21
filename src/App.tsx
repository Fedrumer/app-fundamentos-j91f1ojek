import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import { RepositoryProvider } from './contexts/RepositoryContext'
import { TenantProvider } from './contexts/TenantContext'
import { AuthProvider } from './hooks/use-auth'

import MainLayout from './components/MainLayout'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Index from './pages/Index'
import Users from './pages/Users'
import Agencies from './pages/Agencies'
import Vendas from './pages/Vendas'
import Products from './pages/Products'
import Finance from './pages/Finance'
import Receivables from './pages/Receivables'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <RepositoryProvider>
        <TenantProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
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
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </TenantProvider>
      </RepositoryProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
