export interface ITenantSession {
  id_usuario: string
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

export interface IContratoPreVenda {
  id: string
  id_agencia: string | number
  agencia_nome?: string
  id_produto: string | number
  produto_nome?: string
  dias_iniciais: number
  dias_consumidos: number
  data_validade: string
  status: string
  pais: 'BR' | 'AR'
  moeda: string
}

export interface IExtratoPreVenda {
  id: string
  id_contrato: string
  id_voucher: string
  voucher_code?: string
  tipo_movimento: string
  dias_consumidos: number
  data_movimento: string
}

export interface IDashboardStats {
  totaisPorMoeda: Record<
    string,
    { amountPaid: number; comissao: number; liquido: number; valoresReceber: number }
  >
  totalVouchers: number
  totalPreVenda: number
  agenciasAtivas: number
  totalCortesias: number
  evolucaoDiaria: { data: string; valor: number; moeda: string }[]
  distribuicaoCanal: { name: string; value: number }[]
}

export interface IIngestaoLog {
  id: string
  data_ingestao: string
  status: string
  quantidade_registros: number
  quantidade_falhadas: number
  mensagem_erro: string
}

export interface IAlerta {
  id: string
  tipo: 'INGESTAO' | 'CURRENTACCOUNT' | 'DISCREPANCIA'
  mensagem: string
  data: string
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
  getDashboardCompleto(pais: 'BR' | 'AR'): Promise<IDashboardStats>
  getIngestions(pais: 'BR' | 'AR'): Promise<IIngestaoLog[]>
  getAlerts(pais: 'BR' | 'AR'): Promise<IAlerta[]>
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

export interface IPreVendaRepo {
  getContratos(pais: 'BR' | 'AR'): Promise<IContratoPreVenda[]>
  addContrato(
    contrato: Omit<IContratoPreVenda, 'id' | 'dias_consumidos' | 'agencia_nome' | 'produto_nome'>,
  ): Promise<void>
  getExtrato(id_contrato: string): Promise<IExtratoPreVenda[]>
  getProdutosLivres(pais: 'BR' | 'AR'): Promise<{ id: string; nome: string }[]>
}

export interface IClassificacaoRepo {
  getVouchersZeroAmount(pais: 'BR' | 'AR'): Promise<any[]>
  reclassificarVoucher(
    id_voucher: string,
    tipo_anterior: string | null,
    tipo_novo: string,
    motivo: string,
    id_usuario: string,
    id_contrato?: string,
    dias_consumidos?: number,
  ): Promise<void>
}

// ─── Simulação de Cotação ─────────────────────────────────────────────────────

export interface ComissaoResult {
  id_agencia_recebedora: string | number
  tipo_comissao: 'DIRETA' | 'INDIRETA'
  percentual_aplicado: number
  valor_moeda_nativa: number
  moeda: string
}

export interface ITPA {
  id?: string
  id_grupo_produto: string | number
  pais: 'BR' | 'AR'
  destino: string
  custo_tpa_diario: number
  moeda: string
}

export interface IParametrosPricing {
  id?: string
  id_grupo_produto: string | number
  pais: 'BR' | 'AR'
  perc_impostos: number
  perc_agenciamento: number
  perc_bonificacoes: number
  perc_admin: number
}

export interface ICampanha {
  id: string
  nome: string
  pais: 'BR' | 'AR'
  tipo: 'DESCONTO_PERCENTUAL' | '2X1'
  percentual: number
  condicao_pagamento: string
  id_grupo_produto?: string | null
  ativo: boolean
  data_inicio?: string | null
  data_fim?: string | null
}

export type FormaCobranca = 'DEPOSITO' | '1X_CARTAO' | '2X_CARTAO' | '3X_CARTAO'
export type ProviderGC = 'PAGO24' | 'NUBI' | null

export interface ISimulacaoInput {
  pais: 'BR' | 'AR'
  id_grupo: string | number
  id_variacao: string | number
  id_agencia: string | number
  tipo_canal: string
  pv_unitario: number
  quantidade_pax: number
  dias: number
  forma_cobranca: FormaCobranca
  perc_gift_card: number
  provider_gc: ProviderGC
  campanhas_ativas: string[]
  parametros: IParametrosPricing
  tpa_diario: number
  moeda: string
}

export interface ICustoLinha {
  label: string
  base: 'BRUTO' | 'NET'
  percentual: number
  valor: number
  imutavel?: boolean
  detalhe?: string
}

export interface IResultadoSimulacao {
  bruto_original: number
  bruto_final: number
  campanhas_aplicadas: string[]
  comissao_total: number
  net: number
  linhas_custo: ICustoLinha[]
  total_custos: number
  margem_valor: number
  margem_percentual: number
  comissoes_detalhe: ComissaoResult[]
  moeda: string
  guardrail: 'OK' | 'ATENCAO' | 'CRITICO'
}

export interface ISimulacaoSalva {
  id: string
  nome: string
  pais: 'BR' | 'AR'
  inputs_json: unknown[]
  resultados_json: unknown[]
  created_at: string
  updated_at: string
}

export interface ISimulacaoRepo {
  getParametros(id_grupo: string | number, pais: 'BR' | 'AR'): Promise<IParametrosPricing | null>
  saveParametros(p: IParametrosPricing): Promise<IParametrosPricing>
  getTPA(id_grupo: string | number, pais: 'BR' | 'AR', destino?: string): Promise<ITPA | null>
  saveTPA(tpa: ITPA): Promise<ITPA>
  getCampanhas(pais: 'BR' | 'AR'): Promise<ICampanha[]>
  getCampanhasAdmin(pais: 'BR' | 'AR'): Promise<ICampanha[]>
  salvarCampanha(campanha: Omit<ICampanha, 'id'> & { id?: string }): Promise<ICampanha>
  toggleCampanha(id: string, ativo: boolean): Promise<void>
  salvarSimulacao(
    nome: string,
    pais: 'BR' | 'AR',
    inputs: unknown[],
    resultados: unknown[],
  ): Promise<ISimulacaoSalva>
  listarSimulacoes(pais: 'BR' | 'AR'): Promise<ISimulacaoSalva[]>
  carregarSimulacao(id: string): Promise<ISimulacaoSalva>
}
