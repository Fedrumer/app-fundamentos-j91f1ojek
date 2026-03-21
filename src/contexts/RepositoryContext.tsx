import React, { createContext, useContext, useMemo } from 'react'
import {
  IAgenciasRepo,
  IFinanceiroRepo,
  IProdutosRepo,
  IUsersRepo,
  IVouchersRepo,
} from '@/domain/contracts'

import {
  AgenciasRepoMock,
  FinanceiroRepoMock,
  ProdutosRepoMock,
  UsersRepoMock,
  VouchersRepoMock,
} from '@/data/mockRepositories'

import {
  UsersRepoSupabase,
  AgenciasRepoSupabase,
  VouchersRepoSupabase,
  ProdutosRepoSupabase,
  FinanceiroRepoSupabase,
} from '@/data/supabaseRepositories'

interface IRepositoryContext {
  usersRepo: IUsersRepo
  agenciasRepo: IAgenciasRepo
  vouchersRepo: IVouchersRepo
  produtosRepo: IProdutosRepo
  financeiroRepo: IFinanceiroRepo
}

const RepositoryContext = createContext<IRepositoryContext | undefined>(undefined)

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const repos = useMemo(() => {
    const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

    if (useMocks) {
      return {
        usersRepo: new UsersRepoMock(),
        agenciasRepo: new AgenciasRepoMock(),
        vouchersRepo: new VouchersRepoMock(),
        produtosRepo: new ProdutosRepoMock(),
        financeiroRepo: new FinanceiroRepoMock(),
      }
    }

    return {
      usersRepo: new UsersRepoSupabase(),
      agenciasRepo: new AgenciasRepoSupabase(),
      vouchersRepo: new VouchersRepoSupabase(),
      produtosRepo: new ProdutosRepoSupabase(),
      financeiroRepo: new FinanceiroRepoSupabase(),
    }
  }, [])

  return <RepositoryContext.Provider value={repos}>{children}</RepositoryContext.Provider>
}

export const useRepositories = () => {
  const context = useContext(RepositoryContext)
  if (!context) {
    throw new Error('useRepositories deve ser usado dentro de um RepositoryProvider')
  }
  return context
}
