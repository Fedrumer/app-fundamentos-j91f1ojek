import React, { createContext, useContext, useState, useEffect } from 'react'
import { ITenantSession } from '@/domain/contracts'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

interface ITenantContext {
  session: ITenantSession | null
  setSession: (session: ITenantSession | null) => void
  switchCountry: (pais: 'BR' | 'AR') => void
  logout: () => void
  loadingTenant: boolean
}

const TenantContext = createContext<ITenantContext | undefined>(undefined)

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<ITenantSession | null>(null)
  const [loadingTenant, setLoadingTenant] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut, loading: authLoading } = useAuth()

  useEffect(() => {
    let isMounted = true

    if (authLoading) return

    if (!user) {
      setSession(null)
      setLoadingTenant(false)
      return
    }

    const loadProfile = async () => {
      setLoadingTenant(true)
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('auth_user_id', user.id)
          .single()

        if (!isMounted) return

        if (data && !error) {
          setSession(() => {
            const localCountry = localStorage.getItem('tenant_admin_country') as 'BR' | 'AR'
            const isActiveCountry =
              data.perfil_admin && localCountry ? localCountry : (data.pais as 'BR' | 'AR') || 'BR'

            return {
              usuario: data.nome || user.email?.split('@')[0] || 'Usuário',
              nivel: data.nivel || 'Regional',
              id_agencia: data.id_agencia || 0,
              pais_ativo: isActiveCountry,
              perfil_admin: data.perfil_admin || false,
              moeda_padrao:
                data.perfil_admin && localCountry === 'AR'
                  ? 'ARS'
                  : (data.moeda_padrao as 'BRL' | 'ARS') || 'BRL',
            }
          })
        } else {
          setSession({
            usuario: user.email?.split('@')[0] || 'Usuário',
            nivel: 'Desconhecido',
            id_agencia: 0,
            pais_ativo: 'BR',
            perfil_admin: false,
            moeda_padrao: 'BRL',
          })
        }
      } catch (err) {
        console.error('Erro ao carregar perfil do tenant:', err)
      } finally {
        if (isMounted) setLoadingTenant(false)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [user, authLoading])

  const handleSetSession = (newSession: ITenantSession | null) => {
    setSession(newSession)
  }

  const switchCountry = (pais: 'BR' | 'AR') => {
    if (session && session.perfil_admin) {
      localStorage.setItem('tenant_admin_country', pais)
      handleSetSession({
        ...session,
        pais_ativo: pais,
        moeda_padrao: pais === 'AR' ? 'ARS' : 'BRL',
      })

      navigate(
        {
          pathname: location.pathname,
          search: '',
        },
        { replace: true },
      )
    }
  }

  const logout = async () => {
    handleSetSession(null)
    localStorage.removeItem('tenant_admin_country')
    await signOut()
    navigate('/login')
  }

  return (
    <TenantContext.Provider
      value={{ session, setSession: handleSetSession, switchCountry, logout, loadingTenant }}
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
