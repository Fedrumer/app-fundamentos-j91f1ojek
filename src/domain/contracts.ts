export interface ITenantSession {
  usuario: string
  nivel: string
  id_agencia: string | number
  pais_ativo: 'BR' | 'AR'
  perfil_admin: boolean
  moeda_padrao: 'BRL' | 'ARS'
}

export interface IVoucherData {
  voucher_code: string
  voucher_passenger_code: string
  agencia_atual: string
  id_agencia_atual: number
  status_voucher: string
  tipo_canal_atual: string
  amount_paid: number
  moeda_monto: string
  versao_calculo: number
  pais_ativo: 'BR' | 'AR'
  data_emissao?: string
}

export interface IAgencia {
  id: string | number
  codigo: string
  nome_fantasia: string
  nome_legal: string
  nivel: number
  id_agencia_pai?: string | number | null
  comissao: number
  moeda: string
  pais_ativo: 'BR' | 'AR'
  status: string
}

export interface IUsersRepo {
  login(email: string, senha: string, pais?: 'BR' | 'AR'): Promise<ITenantSession>
  getUsers(pais: 'BR' | 'AR'): Promise<any[]>
}

export interface IAgenciasRepo {
  getAgencias(pais: 'BR' | 'AR'): Promise<IAgencia[]>
  addAgencia(agencia: Omit<IAgencia, 'id'>): Promise<IAgencia>
  updateAgencia(id: string | number, agencia: Partial<IAgencia>): Promise<IAgencia>
  deleteAgencia(id: string | number): Promise<void>
}

export interface IVouchersRepo {
  getVouchers(pais: 'BR' | 'AR'): Promise<IVoucherData[]>
  getRecentVouchers(pais: 'BR' | 'AR'): Promise<any[]>
  reprocessarVoucher(id_voucher: string, id_agencia: number, nome_agencia: string): Promise<void>
  sincronizarCSV(): Promise<void>
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
