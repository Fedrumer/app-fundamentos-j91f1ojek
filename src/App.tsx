import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import { RepositoryProvider } from './contexts/RepositoryContext'
import { TenantProvider } from './contexts/TenantContext'

import Layout from './components/Layout'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Index from './pages/Index'
import Users from './pages/Users'
import Agencies from './pages/Agencies'
import Vouchers from './pages/Vouchers'
import Products from './pages/Products'
import Finance from './pages/Finance'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <RepositoryProvider>
      <TenantProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/usuarios" element={<Users />} />
              <Route path="/agencias" element={<Agencies />} />
              <Route path="/vouchers" element={<Vouchers />} />
              <Route path="/produtos" element={<Products />} />
              <Route path="/financeiro" element={<Finance />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </TenantProvider>
    </RepositoryProvider>
  </BrowserRouter>
)

export default App
