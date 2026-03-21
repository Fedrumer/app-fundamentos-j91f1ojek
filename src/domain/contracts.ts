export interface ITenantSession {
  usuario: string
  nivel: string
  id_agencia: string | number
  pais_ativo: 'BR' | 'AR'
  perfil_admin: boolean
  moeda_padrao: 'BRL' | 'ARS'
}

export interface IUsersRepo {
  login(email: string, senha: string, pais?: 'BR' | 'AR'): Promise<ITenantSession>
  getUsers(pais: 'BR' | 'AR'): Promise<any[]>
}

export interface IAgenciasRepo {
  getAgencias(pais: 'BR' | 'AR'): Promise<any[]>
}

export interface IVouchersRepo {
  getVouchers(pais: 'BR' | 'AR'): Promise<any[]>
  getRecentVouchers(pais: 'BR' | 'AR'): Promise<any[]>
}

export interface IProdutosRepo {
  getProdutos(pais: 'BR' | 'AR'): Promise<any[]>
}

export interface IFinanceiroRepo {
  getDashboardStats(pais: 'BR' | 'AR'): Promise<{
    receitaTotal: number
    vendasMensais: number
    crescimento: number
    moeda: string
  }>
  getTransacoes(pais: 'BR' | 'AR'): Promise<any[]>
}
