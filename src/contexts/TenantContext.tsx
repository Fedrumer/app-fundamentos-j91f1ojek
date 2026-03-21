import React, { createContext, useContext, useState, useEffect } from 'react'
import { ITenantSession } from '@/domain/contracts'
import { useNavigate } from 'react-router-dom'

interface ITenantContext {
  session: ITenantSession | null
  setSession: (session: ITenantSession | null) => void
  switchCountry: (pais: 'BR' | 'AR') => void
  logout: () => void
}

const TenantContext = createContext<ITenantContext | undefined>(undefined)

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<ITenantSession | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('tenant_session')
    if (stored) {
      try {
        setSession(JSON.parse(stored))
      } catch (e) {
        console.error('Falha ao carregar sessão', e)
      }
    }
  }, [])

  const handleSetSession = (newSession: ITenantSession | null) => {
    setSession(newSession)
    if (newSession) {
      localStorage.setItem('tenant_session', JSON.stringify(newSession))
    } else {
      localStorage.removeItem('tenant_session')
    }
  }

  const switchCountry = (pais: 'BR' | 'AR') => {
    if (session && session.perfil_admin) {
      handleSetSession({
        ...session,
        pais_ativo: pais,
        moeda_padrao: pais === 'AR' ? 'ARS' : 'BRL',
      })
    }
  }

  const logout = () => {
    handleSetSession(null)
    navigate('/login')
  }

  return (
    <TenantContext.Provider
      value={{ session, setSession: handleSetSession, switchCountry, logout }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export const useTenant = () => {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant deve ser usado dentro de um TenantProvider')
  }
  return context
}
