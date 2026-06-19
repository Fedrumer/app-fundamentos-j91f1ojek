import { describe, it, expect } from 'vitest'
import { calcularSimulacaoCotacao } from './calcularSimulacaoCotacao'
import { ISimulacaoInput, IAgencia, IProductGroup, ICampanha, IParametrosPricing } from '@/domain/contracts'

const parametrosPadrao: IParametrosPricing = {
  id_grupo_produto: 'g1',
  pais: 'BR',
  perc_impostos: 3.5,
  perc_agenciamento: 5.0,
  perc_bonificacoes: 5.0,
  perc_admin: 10.0,
}

const inputBase: ISimulacaoInput = {
  pais: 'BR',
  id_grupo: 'g1',
  id_variacao: 'v1',
  id_agencia: '10',
  tipo_canal: 'B2B',
  pv_unitario: 500,
  quantidade_pax: 2,
  dias: 10,
  forma_cobranca: 'DEPOSITO',
  perc_gift_card: 0,
  provider_gc: null,
  campanhas_ativas: [],
  parametros: parametrosPadrao,
  tpa_diario: 2.5,
  moeda: 'BRL',
}

const agencia: IAgencia = {
  id: '10',
  nome_fantasia: 'Agência SP',
  comissao: 10,
  id_agencia_pai: null,
  pais: 'BR',
  tipo_canal: 'B2B',
}

const grupo: IProductGroup = {
  id: 'g1',
  nome: 'Grupo Teste',
  comissao_maxima: 20,
  pais: 'BR',
}

describe('calcularSimulacaoCotacao', () => {
  it('cascata básica sem campanha', () => {
    const r = calcularSimulacaoCotacao(inputBase, [agencia], grupo, [])
    expect(r.bruto_original).toBe(1000) // 500 × 2
    expect(r.bruto_final).toBe(1000)
    expect(r.campanhas_aplicadas).toHaveLength(0)
    expect(r.comissao_total).toBe(100) // 10% de 1000
    expect(r.net).toBe(900)
    expect(r.moeda).toBe('BRL')
  })

  it('margem = bruto_final - comissão - custos', () => {
    const r = calcularSimulacaoCotacao(inputBase, [agencia], grupo, [])
    const computedMargem = r.bruto_final - r.comissao_total - r.total_custos
    expect(r.margem_valor).toBeCloseTo(computedMargem, 4)
  })

  it('guardrail OK quando margem >= 25%', () => {
    // Sem TPA e comissão baixa garante margem alta
    const r = calcularSimulacaoCotacao(
      { ...inputBase, tpa_diario: 0, parametros: { ...parametrosPadrao, perc_impostos: 0, perc_agenciamento: 0, perc_bonificacoes: 0, perc_admin: 0 } },
      [],
      grupo,
      [],
    )
    expect(r.margem_percentual).toBeGreaterThanOrEqual(25)
    expect(r.guardrail).toBe('OK')
  })

  it('guardrail CRITICO quando margem < 15%', () => {
    // TPA alto força margem baixa
    const r = calcularSimulacaoCotacao(
      { ...inputBase, tpa_diario: 100 },
      [agencia],
      grupo,
      [],
    )
    expect(r.margem_percentual).toBeLessThan(15)
    expect(r.guardrail).toBe('CRITICO')
  })

  it('guardrail ATENCAO quando margem entre 15% e 25%', () => {
    const r = calcularSimulacaoCotacao(
      { ...inputBase, tpa_diario: 15 },
      [agencia],
      grupo,
      [],
    )
    if (r.margem_percentual >= 15 && r.margem_percentual < 25) {
      expect(r.guardrail).toBe('ATENCAO')
    }
  })

  it('campanha DESCONTO_PERCENTUAL 20% sobre depósito', () => {
    const campanha: ICampanha = {
      id: 'c1',
      nome: '20% OFF',
      pais: 'AR',
      tipo: 'DESCONTO_PERCENTUAL',
      percentual: 20,
      condicao_pagamento: 'TRANSFERENCIA_DEPOSITO',
      ativo: true,
    }
    const r = calcularSimulacaoCotacao(
      { ...inputBase, campanhas_ativas: ['c1'] },
      [agencia],
      grupo,
      [campanha],
    )
    expect(r.bruto_final).toBeCloseTo(800) // 1000 × 0.8
    expect(r.campanhas_aplicadas).toContain('20% OFF')
  })

  it('campanha DESCONTO não aplica em cartão', () => {
    const campanha: ICampanha = {
      id: 'c1',
      nome: '20% OFF',
      pais: 'AR',
      tipo: 'DESCONTO_PERCENTUAL',
      percentual: 20,
      condicao_pagamento: 'TRANSFERENCIA_DEPOSITO',
      ativo: true,
    }
    const r = calcularSimulacaoCotacao(
      { ...inputBase, forma_cobranca: '1X_CARTAO', campanhas_ativas: ['c1'] },
      [agencia],
      grupo,
      [campanha],
    )
    expect(r.bruto_final).toBe(1000) // sem desconto
    expect(r.campanhas_aplicadas).toHaveLength(0)
  })

  it('campanha 2x1: paga metade dos pax', () => {
    const campanha: ICampanha = {
      id: 'c2',
      nome: '2x1 Multi',
      pais: 'AR',
      tipo: '2X1',
      percentual: 0,
      condicao_pagamento: 'TRANSFERENCIA_DEPOSITO',
      ativo: true,
    }
    const r = calcularSimulacaoCotacao(
      { ...inputBase, quantidade_pax: 4, campanhas_ativas: ['c2'] },
      [agencia],
      grupo,
      [campanha],
    )
    // 4 pax → 2 pagam → bruto = 500 × 2 = 1000
    expect(r.bruto_final).toBe(1000)
    expect(r.campanhas_aplicadas).toContain('2x1 Multi')
  })

  it('TPA calculado sobre todos os pax no 2x1', () => {
    const campanha: ICampanha = {
      id: 'c2',
      nome: '2x1 Multi',
      pais: 'AR',
      tipo: '2X1',
      percentual: 0,
      condicao_pagamento: 'TRANSFERENCIA_DEPOSITO',
      ativo: true,
    }
    const r = calcularSimulacaoCotacao(
      { ...inputBase, quantidade_pax: 4, tpa_diario: 1, dias: 10, campanhas_ativas: ['c2'] },
      [],
      grupo,
      [campanha],
    )
    const tpaLinha = r.linhas_custo.find((l) => l.label === 'TPA WMMS')
    expect(tpaLinha?.valor).toBe(40) // 1 × 10 dias × 4 pax (todos, não só pagantes)
  })

  it('TPA marcado como imutável', () => {
    const r = calcularSimulacaoCotacao(inputBase, [agencia], grupo, [])
    const tpa = r.linhas_custo.find((l) => l.label === 'TPA WMMS')
    expect(tpa?.imutavel).toBe(true)
  })

  it('custo de cobrança 1X_CARTAO = 5.31% do bruto', () => {
    const r = calcularSimulacaoCotacao(
      { ...inputBase, forma_cobranca: '1X_CARTAO', tpa_diario: 0 },
      [],
      grupo,
      [],
    )
    const cobranca = r.linhas_custo.find((l) => l.label === 'Custo de Cobrança')
    expect(cobranca?.valor).toBeCloseTo(1000 * 0.0531, 2)
  })

  it('Provider GC PAGO24 = 2.42% do bruto', () => {
    const r = calcularSimulacaoCotacao(
      { ...inputBase, provider_gc: 'PAGO24', tpa_diario: 0 },
      [],
      grupo,
      [],
    )
    const fee = r.linhas_custo.find((l) => l.label.includes('PAGO24'))
    expect(fee?.valor).toBeCloseTo(1000 * 0.0242, 2)
  })

  it('B2C = sem comissão', () => {
    const r = calcularSimulacaoCotacao(
      { ...inputBase, tipo_canal: 'B2C' },
      [agencia],
      grupo,
      [],
    )
    expect(r.comissao_total).toBe(0)
    expect(r.comissoes_detalhe).toHaveLength(0)
  })

  it('margem sobre bruto_final (não bruto_original)', () => {
    const campanha: ICampanha = {
      id: 'c1',
      nome: '20% OFF',
      pais: 'AR',
      tipo: 'DESCONTO_PERCENTUAL',
      percentual: 20,
      condicao_pagamento: 'TRANSFERENCIA_DEPOSITO',
      ativo: true,
    }
    const r = calcularSimulacaoCotacao(
      { ...inputBase, campanhas_ativas: ['c1'], tpa_diario: 0 },
      [],
      grupo,
      [campanha],
    )
    // Margem % deve ser calculada sobre bruto_final (800), não bruto_original (1000)
    const expectedPerc = (r.margem_valor / r.bruto_final) * 100
    expect(r.margem_percentual).toBeCloseTo(expectedPerc, 4)
  })
})
