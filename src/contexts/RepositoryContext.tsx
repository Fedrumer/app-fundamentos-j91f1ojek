import React, { createContext, useContext, useMemo } from 'react'
import {
  IAgenciasRepo,
  IFinanceiroRepo,
  IProdutosRepo,
  IUsersRepo,
  IVouchersRepo,
  IPreVendaRepo,
  IClassificacaoRepo,
} from '@/domain/contracts'

import {
  AgenciasRepoMock,
  FinanceiroRepoMock,
  ProdutosRepoMock,
  UsersRepoMock,
  VouchersRepoMock,
  PreVendaRepoMock,
  ClassificacaoRepoMock,
} from '@/data/mockRepositories'

import {
  UsersRepoSupabase,
  AgenciasRepoSupabase,
  VouchersRepoSupabase,
  ProdutosRepoSupabase,
  FinanceiroRepoSupabase,
  PreVendaRepoSupabase,
  ClassificacaoRepoSupabase,
} from '@/data/supabaseRepositories'

interface IRepositoryContext {
  usersRepo: IUsersRepo
  agenciasRepo: IAgenciasRepo
  vouchersRepo: IVouchersRepo
  produtosRepo: IProdutosRepo
  financeiroRepo: IFinanceiroRepo
  preVendaRepo: IPreVendaRepo
  classificacaoRepo: IClassificacaoRepo
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
        preVendaRepo: new PreVendaRepoMock(),
        classificacaoRepo: new ClassificacaoRepoMock(),
      }
    }

    return {
      usersRepo: new UsersRepoSupabase(),
      agenciasRepo: new AgenciasRepoSupabase(),
      vouchersRepo: new VouchersRepoSupabase(),
      produtosRepo: new ProdutosRepoSupabase(),
      financeiroRepo: new FinanceiroRepoSupabase(),
      preVendaRepo: new PreVendaRepoSupabase(),
      classificacaoRepo: new ClassificacaoRepoSupabase(),
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
