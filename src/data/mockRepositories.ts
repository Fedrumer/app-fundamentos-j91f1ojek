import {
  IAgenciasRepo,
  IFinanceiroRepo,
  IProdutosRepo,
  ITenantSession,
  IUsersRepo,
  IVouchersRepo,
  IVoucherData,
  IAgencia,
  IProductGroup,
  IProductVariation,
  ILancamentoFaturamento,
  IPreVendaRepo,
  IClassificacaoRepo,
  IContratoPreVenda,
  IExtratoPreVenda,
  IDashboardStats,
  IIngestaoLog,
  IAlerta,
  ISimulacaoRepo,
  IParametrosPricing,
  ITPA,
  ICampanha,
  ISimulacaoSalva,
} from '@/domain/contracts'

let mockVouchersData: IVoucherData[] = [
  {
    voucher_code: 'V-1001',
    voucher_passenger_code: 'PA-001',
    agencia_atual: 'Site BR',
    id_agencia_atual: 0,
    status_voucher: 'ISSUED',
    tipo_canal_atual: 'B2C',
    amount_paid: 1500,
    moeda_monto: 'BRL',
    versao_calculo: 1,
    pais_ativo: 'BR',
    data_emissao: '2023-10-01',
  },
  {
    voucher_code: 'V-1002',
    voucher_passenger_code: 'PA-002',
    agencia_atual: 'Agência São Paulo',
    id_agencia_atual: 101,
    status_voucher: 'USED',
    tipo_canal_atual: 'B2B',
    amount_paid: 2300,
    moeda_monto: 'BRL',
    versao_calculo: 1,
    pais_ativo: 'BR',
    data_emissao: '2023-10-05',
  },
  {
    voucher_code: 'V-2001',
    voucher_passenger_code: 'PA-004',
    agencia_atual: 'Site AR',
    id_agencia_atual: 0,
    status_voucher: 'ISSUED',
    tipo_canal_atual: 'B2C',
    amount_paid: 45000,
    moeda_monto: 'ARS',
    versao_calculo: 1,
    pais_ativo: 'AR',
    data_emissao: '2023-10-02',
  },
]

let mockAgenciasList: IAgencia[] = [
  {
    id: 101,
    codigo: 'AG-BR-01',
    nome_fantasia: 'Agência São Paulo',
    nome_legal: 'Agência SP S.A.',
    nivel: 1,
    comissao: 15,
    moeda: 'BRL',
    pais_ativo: 'BR',
    status: 'Ativa',
  },
  {
    id: 102,
    codigo: 'AG-BR-02',
    nome_fantasia: 'Agência Rio',
    nome_legal: 'Agência RJ LTDA',
    nivel: 2,
    id_agencia_pai: 101,
    comissao: 10,
    moeda: 'BRL',
    pais_ativo: 'BR',
    status: 'Ativa',
  },
  {
    id: 202,
    codigo: 'AG-AR-01',
    nome_fantasia: 'Agencia Buenos Aires',
    nome_legal: 'Agencia BA S.A.',
    nivel: 1,
    comissao: 20,
    moeda: 'ARS',
    pais_ativo: 'AR',
    status: 'Ativa',
  },
]

let mockGroups: IProductGroup[] = [
  {
    id: 1,
    nome: 'América do Sul Express',
    comissao_maxima: 15,
    moeda_cadastro: 'USD',
    flags: ['Destaque', 'Promo'],
    pais_ativo: 'BR',
  },
  {
    id: 2,
    nome: 'Cruzeiros Nacionais',
    comissao_maxima: 10,
    moeda_cadastro: 'BRL',
    flags: ['Marítimo'],
    pais_ativo: 'BR',
  },
  {
    id: 3,
    nome: 'Tour Europa VIP',
    comissao_maxima: 12,
    moeda_cadastro: 'EUR',
    flags: ['Premium'],
    pais_ativo: 'AR',
  },
]

let mockVariations: IProductVariation[] = [
  {
    id: 101,
    id_grupo: 1,
    nome: 'Plano Básico',
    destino: 'América Latina',
    faixa_etaria: '0-65',
    preco: 45,
  },
  {
    id: 102,
    id_grupo: 1,
    nome: 'Plano Plus',
    destino: 'América Latina',
    faixa_etaria: '66-85',
    preco: 90,
  },
  {
    id: 103,
    id_grupo: 2,
    nome: 'Cabine Interna',
    destino: 'Costa Brasileira',
    faixa_etaria: 'Livre',
    preco: 1500,
  },
  {
    id: 104,
    id_grupo: 3,
    nome: 'Euro Trip Master',
    destino: 'Schengen',
    faixa_etaria: '0-75',
    preco: 120,
  },
]

let mockLancamentosFaturamento: ILancamentoFaturamento[] = [
  {
    id: 'L-1',
    id_voucher: 'v1',
    voucher_code: 'V-1002',
    versao_calculo: 1,
    id_agencia_recebedora: 101,
    agencia_recebedora_nome: 'Agência São Paulo',
    pais: 'BR',
    tipo_lancamento: 'COMISSAO',
    tipo_comissao: 'DIRETA',
    percentual_aplicado: 15,
    valor_bruto: 2300,
    comissao: 345,
    valor_repasse: 1955,
    moeda: 'BRL',
    periodo_apuracao: '2023-10',
    fatura_travada: false,
    status_quitacao: 'PENDENTE',
  },
  {
    id: 'L-2',
    id_voucher: 'v2',
    voucher_code: 'V-1003',
    versao_calculo: 1,
    id_agencia_recebedora: 101,
    agencia_recebedora_nome: 'Agência São Paulo',
    pais: 'BR',
    tipo_lancamento: 'ESTORNO',
    tipo_comissao: 'DIRETA',
    percentual_aplicado: -15,
    valor_bruto: -1000,
    comissao: -150,
    valor_repasse: -850,
    moeda: 'BRL',
    periodo_apuracao: '2023-10',
    fatura_travada: false,
    status_quitacao: 'PENDENTE',
  },
]

let mockContratos: IContratoPreVenda[] = []
let mockExtrato: IExtratoPreVenda[] = []

export class UsersRepoMock implements IUsersRepo {
  async login(email: string, senha: string, pais?: 'BR' | 'AR'): Promise<ITenantSession> {
    await new Promise((r) => setTimeout(r, 400))
    if (email === 'admin@now.com' && senha === 'Teste123!')
      return {
        id_usuario: 'user-admin',
        usuario: 'Administrador Global',
        nivel: 'Master',
        id_agencia: 0,
        pais_ativo: pais || 'BR',
        perfil_admin: true,
        moeda_padrao: pais === 'AR' ? 'ARS' : 'BRL',
      }
    if (email === 'teste_br@now.com' && senha === 'Teste123!')
      return {
        id_usuario: 'user-br',
        usuario: 'Operador Brasil',
        nivel: 'Operacional',
        id_agencia: 101,
        pais_ativo: 'BR',
        perfil_admin: false,
        moeda_padrao: 'BRL',
      }
    if (email === 'teste_ar@now.com' && senha === 'Teste123!')
      return {
        id_usuario: 'user-ar',
        usuario: 'Operador Argentina',
        nivel: 'Operacional',
        id_agencia: 202,
        pais_ativo: 'AR',
        perfil_admin: false,
        moeda_padrao: 'ARS',
      }
    throw new Error('Credenciais inválidas')
  }
  async getUsers(pais: 'BR' | 'AR'): Promise<any[]> {
    return pais === 'BR'
      ? [{ id: 1, nome: 'João Silva', email: 'joao@now.com', role: 'Operador' }]
      : [{ id: 3, nome: 'Carlos Gardel', email: 'carlos@now.ar', role: 'Operador' }]
  }
}

export class AgenciasRepoMock implements IAgenciasRepo {
  async getAgencias(pais: 'BR' | 'AR'): Promise<IAgencia[]> {
    return mockAgenciasList.filter((a) => a.pais_ativo === pais)
  }
  async addAgencia(agencia: Omit<IAgencia, 'id'>): Promise<IAgencia> {
    const nova = { ...agencia, id: Math.floor(Math.random() * 100000) }
    mockAgenciasList.push(nova as IAgencia)
    return nova as IAgencia
  }
  async updateAgencia(id: string | number, agencia: Partial<IAgencia>): Promise<IAgencia> {
    const index = mockAgenciasList.findIndex((a) => a.id.toString() === id.toString())
    if (index > -1) {
      mockAgenciasList[index] = { ...mockAgenciasList[index], ...agencia }
      return mockAgenciasList[index]
    }
    throw new Error('Agência não encontrada.')
  }
  async deleteAgencia(id: string | number): Promise<void> {
    mockAgenciasList = mockAgenciasList.filter((a) => a.id.toString() !== id.toString())
  }
}

export class VouchersRepoMock implements IVouchersRepo {
  async getVouchers(pais: 'BR' | 'AR'): Promise<IVoucherData[]> {
    return mockVouchersData.filter((v) => v.pais_ativo === pais)
  }
  async getRecentVouchers(pais: 'BR' | 'AR'): Promise<any[]> {
    return mockVouchersData
      .filter((v) => v.pais_ativo === pais)
      .map((v) => ({
        id: v.voucher_code,
        cliente: v.voucher_passenger_code,
        valor: v.amount_paid,
        status: v.status_voucher,
      }))
  }
  async reprocessarVoucher(id: string, id_ag: number | string, nome: string): Promise<void> {
    const v = mockVouchersData.find((x) => x.voucher_code === id)
    if (v) {
      v.id_agencia_atual = id_ag
      v.agencia_atual = nome
      v.tipo_canal_atual = 'B2C_ATTRIBUTED'
      v.versao_calculo += 1
    }
  }
  async sincronizarCSV(): Promise<void> {}
}

export class ProdutosRepoMock implements IProdutosRepo {
  async getGroups(pais: 'BR' | 'AR'): Promise<IProductGroup[]> {
    await new Promise((r) => setTimeout(r, 200))
    return mockGroups.filter((g) => g.pais_ativo === pais)
  }
  async addGroup(group: Omit<IProductGroup, 'id'>): Promise<IProductGroup> {
    await new Promise((r) => setTimeout(r, 200))
    const novo = { ...group, id: Math.floor(Math.random() * 100000) } as IProductGroup
    mockGroups.push(novo)
    return novo
  }
  async updateGroup(id: string | number, group: Partial<IProductGroup>): Promise<IProductGroup> {
    await new Promise((r) => setTimeout(r, 200))
    const index = mockGroups.findIndex((g) => g.id.toString() === id.toString())
    if (index > -1) {
      mockGroups[index] = { ...mockGroups[index], ...group }
      return mockGroups[index]
    }
    throw new Error('Grupo não encontrado')
  }
  async deleteGroup(id: string | number): Promise<void> {
    await new Promise((r) => setTimeout(r, 200))
    mockGroups = mockGroups.filter((g) => g.id.toString() !== id.toString())
    mockVariations = mockVariations.filter((v) => v.id_grupo.toString() !== id.toString())
  }
  async getVariations(id_grupo: string | number): Promise<IProductVariation[]> {
    await new Promise((r) => setTimeout(r, 200))
    return mockVariations.filter((v) => v.id_grupo.toString() === id_grupo.toString())
  }
  async addVariation(variation: Omit<IProductVariation, 'id'>): Promise<IProductVariation> {
    await new Promise((r) => setTimeout(r, 200))
    const novo = { ...variation, id: Math.floor(Math.random() * 100000) } as IProductVariation
    mockVariations.push(novo)
    return novo
  }
  async updateVariation(
    id: string | number,
    variation: Partial<IProductVariation>,
  ): Promise<IProductVariation> {
    await new Promise((r) => setTimeout(r, 200))
    const index = mockVariations.findIndex((v) => v.id.toString() === id.toString())
    if (index > -1) {
      mockVariations[index] = { ...mockVariations[index], ...variation }
      return mockVariations[index]
    }
    throw new Error('Variação não encontrada')
  }
  async deleteVariation(id: string | number): Promise<void> {
    await new Promise((r) => setTimeout(r, 200))
    mockVariations = mockVariations.filter((v) => v.id.toString() !== id.toString())
  }
}

export class FinanceiroRepoMock implements IFinanceiroRepo {
  async getDashboardStats(pais: 'BR' | 'AR') {
    return pais === 'BR'
      ? { receitaTotal: 1250000.5, vendasMensais: 3450, crescimento: 12.5, moeda: 'BRL' }
      : { receitaTotal: 45000000.0, vendasMensais: 1200, crescimento: 8.2, moeda: 'ARS' }
  }

  async getDashboardCompleto(pais: 'BR' | 'AR'): Promise<IDashboardStats> {
    return {
      totaisPorMoeda: {
        BRL: { amountPaid: 15000, comissao: 1500, liquido: 13500, valoresReceber: 500 },
      },
      totalVouchers: 150,
      totalPreVenda: 12,
      agenciasAtivas: 34,
      totalCortesias: 5,
      evolucaoDiaria: [
        { data: '2023-10-01', valor: 1000, moeda: 'BRL' },
        { data: '2023-10-02', valor: 1500, moeda: 'BRL' },
      ],
      distribuicaoCanal: [
        { name: 'B2B', value: 80 },
        { name: 'B2C', value: 20 },
      ],
    }
  }

  async getIngestions(pais: 'BR' | 'AR'): Promise<IIngestaoLog[]> {
    return [
      {
        id: '1',
        data_ingestao: new Date().toISOString(),
        status: 'SUCESSO',
        quantidade_registros: 150,
        quantidade_falhadas: 0,
        mensagem_erro: '',
      },
    ]
  }

  async getAlerts(pais: 'BR' | 'AR'): Promise<IAlerta[]> {
    return [
      {
        id: 'a1',
        tipo: 'CURRENTACCOUNT',
        mensagem: 'Fatura Agência SP pendente há mais de 30 dias',
        data: new Date().toISOString(),
      },
    ]
  }

  async getTransacoes(pais: 'BR' | 'AR'): Promise<any[]> {
    return pais === 'BR'
      ? [{ id: 'T1', data: '2023-10-01', valor: 500, tipo: 'Entrada' }]
      : [{ id: 'T3', data: '2023-10-01', valor: 15000, tipo: 'Entrada' }]
  }

  async getLancamentosVigentes(
    pais: 'BR' | 'AR',
    filtros: { id_agencia?: string; periodo?: string; moeda?: string; status_quitacao?: string },
  ) {
    await new Promise((r) => setTimeout(r, 300))
    return mockLancamentosFaturamento.filter((l) => {
      if (l.pais !== pais) return false
      if (filtros.id_agencia && l.id_agencia_recebedora.toString() !== filtros.id_agencia)
        return false
      if (filtros.periodo && l.periodo_apuracao !== filtros.periodo) return false
      if (filtros.moeda && l.moeda !== filtros.moeda) return false
      if (filtros.status_quitacao && l.status_quitacao !== filtros.status_quitacao) return false
      return true
    })
  }

  async travarFatura(
    pais: 'BR' | 'AR',
    id_agencia: string,
    periodo: string,
    ids_lancamentos: string[],
  ) {
    await new Promise((r) => setTimeout(r, 500))
    mockLancamentosFaturamento = mockLancamentosFaturamento.map((l) =>
      ids_lancamentos.includes(l.id) ? { ...l, fatura_travada: true, id_fatura: 'F-MOCK' } : l,
    )
  }

  async quitarLancamento(id_lancamento: string) {
    await new Promise((r) => setTimeout(r, 300))
    mockLancamentosFaturamento = mockLancamentosFaturamento.map((l) =>
      l.id === id_lancamento ? { ...l, status_quitacao: 'QUITADO' } : l,
    )
  }

  async quitarLancamentosPorVoucher(id_voucher: string) {
    await new Promise((r) => setTimeout(r, 300))
    mockLancamentosFaturamento = mockLancamentosFaturamento.map((l) =>
      l.id_voucher === id_voucher && l.tipo_lancamento === 'COMISSAO'
        ? { ...l, status_quitacao: 'QUITADO' }
        : l,
    )
  }
}

export class PreVendaRepoMock implements IPreVendaRepo {
  async getContratos(pais: 'BR' | 'AR') {
    return mockContratos.filter((c) => c.pais === pais)
  }
  async addContrato(c: any) {
    mockContratos.push({
      ...c,
      id: Math.random().toString(),
      dias_consumidos: 0,
      agencia_nome: 'Mock Agência',
      produto_nome: 'Mock Produto',
    } as IContratoPreVenda)
  }
  async getExtrato(id_contrato: string) {
    return mockExtrato.filter((e) => e.id_contrato === id_contrato)
  }
  async getProdutosLivres(pais: 'BR' | 'AR') {
    return [{ id: 'p1', nome: 'Produto Padrão ' + pais }]
  }
}

export class ClassificacaoRepoMock implements IClassificacaoRepo {
  async getVouchersZeroAmount(pais: 'BR' | 'AR') {
    return [
      {
        id: 'v1',
        voucher_code: 'V-ZERO-1',
        agencia: 'Agência SP',
        data_emissao: '2023-10-10',
        passageiros_count: 2,
        destino: 'Europa',
        plano: 'Euro Premium',
        dias_viagem: 10,
        tipo_zero_amount: 'ZERO_INDEFINIDO',
      },
    ]
  }
  async reclassificarVoucher(
    id_voucher: string,
    tipo_anterior: string | null,
    tipo_novo: string,
    motivo: string,
    id_usuario: string,
    id_contrato?: string,
    dias_consumidos?: number,
  ) {
    if (id_contrato) {
      const c = mockContratos.find((x) => x.id === id_contrato)
      if (c) c.dias_consumidos += dias_consumidos || 0
      mockExtrato.push({
        id: Math.random().toString(),
        id_contrato,
        id_voucher,
        voucher_code: 'V-ZERO-1',
        tipo_movimento: 'DEBITO',
        dias_consumidos: dias_consumidos || 0,
        data_movimento: new Date().toISOString(),
      })
    }
  }
}

export class SimulacaoRepoMock implements ISimulacaoRepo {
  async getParametros(
    id_grupo: string | number,
    pais: 'BR' | 'AR',
  ): Promise<IParametrosPricing | null> {
    return {
      id_grupo_produto: id_grupo,
      pais,
      perc_impostos: 3.5,
      perc_agenciamento: 5.0,
      perc_bonificacoes: 5.0,
      perc_admin: 10.0,
    }
  }

  async saveParametros(p: IParametrosPricing): Promise<IParametrosPricing> {
    return p
  }

  async getTPA(
    id_grupo: string | number,
    pais: 'BR' | 'AR',
  ): Promise<ITPA | null> {
    return {
      id_grupo_produto: id_grupo,
      pais,
      destino: 'MUNDIAL',
      custo_tpa_diario: pais === 'BR' ? 2.5 : 0.85,
      moeda: pais === 'BR' ? 'BRL' : 'USD',
    }
  }

  async saveTPA(tpa: ITPA): Promise<ITPA> {
    return tpa
  }

  async getCampanhas(pais: 'BR' | 'AR'): Promise<ICampanha[]> {
    return this._campanhas.filter((c) => c.pais === pais && c.ativo)
  }

  private _campanhas: ICampanha[] = [
    { id: 'camp-ar-1', nome: '20% Desconto Transferência/Depósito', pais: 'AR', tipo: 'DESCONTO_PERCENTUAL', percentual: 20, condicao_pagamento: 'TRANSFERENCIA_DEPOSITO', id_grupo_produto: null, ativo: true },
    { id: 'camp-ar-2', nome: '2x1 Now Multi 150', pais: 'AR', tipo: '2X1', percentual: 0, condicao_pagamento: 'TRANSFERENCIA_DEPOSITO', id_grupo_produto: null, ativo: true },
  ]

  async getCampanhasAdmin(pais: 'BR' | 'AR'): Promise<ICampanha[]> {
    return this._campanhas.filter((c) => c.pais === pais)
  }

  async salvarCampanha(campanha: Omit<ICampanha, 'id'> & { id?: string }): Promise<ICampanha> {
    if (campanha.id) {
      const idx = this._campanhas.findIndex((c) => c.id === campanha.id)
      if (idx >= 0) this._campanhas[idx] = { ...this._campanhas[idx], ...campanha } as ICampanha
      return this._campanhas[idx]
    }
    const nova: ICampanha = { ...campanha, id: `mock-${Date.now()}` }
    this._campanhas.push(nova)
    return nova
  }

  async toggleCampanha(id: string, ativo: boolean): Promise<void> {
    const c = this._campanhas.find((c) => c.id === id)
    if (c) c.ativo = ativo
  }

  async getTodosTPAs(pais: 'BR' | 'AR'): Promise<ITPA[]> {
    return [
      { id_grupo_produto: 'g-br-1', pais: 'BR', destino: 'MUNDIAL', custo_tpa_diario: 2.5, moeda: 'BRL' },
      { id_grupo_produto: 'g-ar-1', pais: 'AR', destino: 'MUNDIAL', custo_tpa_diario: 0.85, moeda: 'USD' },
    ].filter((t) => t.pais === pais)
  }

  async getTodosParametros(pais: 'BR' | 'AR'): Promise<IParametrosPricing[]> {
    return [
      { id_grupo_produto: 'g-br-1', pais: 'BR', perc_impostos: 3.5, perc_agenciamento: 5, perc_bonificacoes: 5, perc_admin: 10 },
      { id_grupo_produto: 'g-ar-1', pais: 'AR', perc_impostos: 3.5, perc_agenciamento: 5, perc_bonificacoes: 5, perc_admin: 10 },
    ].filter((p) => p.pais === pais)
  }

  private _simulacoes: ISimulacaoSalva[] = []

  async salvarSimulacao(
    nome: string,
    pais: 'BR' | 'AR',
    inputs: unknown[],
    resultados: unknown[],
  ): Promise<ISimulacaoSalva> {
    const sim: ISimulacaoSalva = {
      id: `mock-${Date.now()}`,
      nome,
      pais,
      inputs_json: inputs,
      resultados_json: resultados,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this._simulacoes.push(sim)
    return sim
  }

  async listarSimulacoes(pais: 'BR' | 'AR'): Promise<ISimulacaoSalva[]> {
    return this._simulacoes.filter((s) => s.pais === pais).slice().reverse()
  }

  async carregarSimulacao(id: string): Promise<ISimulacaoSalva> {
    const sim = this._simulacoes.find((s) => s.id === id)
    if (!sim) throw new Error(`Simulação ${id} não encontrada`)
    return sim
  }
}
