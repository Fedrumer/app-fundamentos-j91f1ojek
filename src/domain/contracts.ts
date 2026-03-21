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
  id_agencia_atual: number | string
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

export interface IProductGroup {
  id: string | number
  nome: string
  comissao_maxima: number
  moeda_cadastro: string
  flags: string[]
  pais_ativo: 'BR' | 'AR'
}

export interface IProductVariation {
  id: string | number
  id_grupo: string | number
  nome: string
  destino: string
  faixa_etaria: string
  preco: number
}

export interface ILancamentoFaturamento {
  id: string
  id_voucher: string
  voucher_code: string
  versao_calculo: number
  id_agencia_recebedora: string | number
  agencia_recebedora_nome: string
  pais: 'BR' | 'AR'
  tipo_lancamento: string
  tipo_comissao: string
  percentual_aplicado: number
  valor_bruto: number
  comissao: number
  valor_repasse: number
  moeda: string
  periodo_apuracao: string
  id_fatura?: string
  fatura_travada?: boolean
  status_quitacao?: string
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
  reprocessarVoucher(
    id_voucher: string,
    id_agencia: string | number,
    nome_agencia: string,
  ): Promise<void>
  sincronizarCSV(): Promise<void>
}

export interface IProdutosRepo {
  getGroups(pais: 'BR' | 'AR'): Promise<IProductGroup[]>
  addGroup(group: Omit<IProductGroup, 'id'>): Promise<IProductGroup>
  updateGroup(id: string | number, group: Partial<IProductGroup>): Promise<IProductGroup>
  deleteGroup(id: string | number): Promise<void>

  getVariations(id_grupo: string | number): Promise<IProductVariation[]>
  addVariation(variation: Omit<IProductVariation, 'id'>): Promise<IProductVariation>
  updateVariation(
    id: string | number,
    variation: Partial<IProductVariation>,
  ): Promise<IProductVariation>
  deleteVariation(id: string | number): Promise<void>
}

export interface IFinanceiroRepo {
  getDashboardStats(pais: 'BR' | 'AR'): Promise<{
    receitaTotal: number
    vendasMensais: number
    crescimento: number
    moeda: string
  }>
  getTransacoes(pais: 'BR' | 'AR'): Promise<any[]>
  getLancamentosVigentes(
    pais: 'BR' | 'AR',
    filtros: { id_agencia?: string; periodo?: string; moeda?: string; status_quitacao?: string },
  ): Promise<ILancamentoFaturamento[]>
  travarFatura(
    pais: 'BR' | 'AR',
    id_agencia: string,
    periodo: string,
    ids_lancamentos: string[],
  ): Promise<void>
  quitarLancamento(id_lancamento: string): Promise<void>
  quitarLancamentosPorVoucher(id_voucher: string): Promise<void>
}
