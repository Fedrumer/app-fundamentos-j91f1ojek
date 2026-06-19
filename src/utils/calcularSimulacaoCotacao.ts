import {
  ISimulacaoInput,
  IResultadoSimulacao,
  ICustoLinha,
  ICampanha,
  IAgencia,
  IProductGroup,
  ComissaoResult,
} from '@/domain/contracts'
import { calcularComissaoCascata } from './calcularComissaoCascata'
import { buildSimVoucher } from './buildSimVoucher'

const TAXA_COBRANCA: Record<string, number> = {
  DEPOSITO: 0,
  '1X_CARTAO': 5.31,
  '2X_CARTAO': 17.77,
  '3X_CARTAO': 22.01,
}

const TAXA_PROVIDER_GC: Record<string, number> = {
  PAGO24: 2.42,
  NUBI: 6.05,
}

export function calcularSimulacaoCotacao(
  input: ISimulacaoInput,
  cadeia: IAgencia[],
  grupo: IProductGroup,
  campanhasDisponiveis: ICampanha[],
): IResultadoSimulacao {
  const campanhasAtivas = campanhasDisponiveis.filter((c) =>
    input.campanhas_ativas.includes(c.id),
  )

  // ── 1. Calcular bruto base ────────────────────────────────────────────────
  const bruto_original = input.pv_unitario * input.quantidade_pax

  // Pax cobertas pelo TPA (pode diferir em caso 2x1)
  let pax_pagantes = input.quantidade_pax
  let pax_cobertos_tpa = input.quantidade_pax
  const campanhas_aplicadas: string[] = []

  // Campanha 2x1: paga metade dos pax, TPA incide sobre todos
  const campanha2x1 = campanhasAtivas.find(
    (c) => c.tipo === '2X1' && input.forma_cobranca === 'DEPOSITO',
  )
  if (campanha2x1) {
    pax_pagantes = Math.ceil(input.quantidade_pax / 2)
    campanhas_aplicadas.push(campanha2x1.nome)
  }

  let bruto_final = input.pv_unitario * pax_pagantes

  // Campanha de desconto percentual
  const campanhaDesconto = campanhasAtivas.find(
    (c) => c.tipo === 'DESCONTO_PERCENTUAL' && input.forma_cobranca === 'DEPOSITO',
  )
  if (campanhaDesconto) {
    bruto_final = bruto_final * (1 - campanhaDesconto.percentual / 100)
    campanhas_aplicadas.push(campanhaDesconto.nome)
  }

  // ── 2. Comissão em cascata ────────────────────────────────────────────────
  const mockVoucher = buildSimVoucher(
    bruto_final,
    input.id_agencia,
    input.tipo_canal,
    input.moeda,
    input.pais,
  )
  const comissoes_detalhe: ComissaoResult[] = calcularComissaoCascata(mockVoucher, cadeia, grupo)
  const comissao_total = comissoes_detalhe.reduce((s, c) => s + c.valor_moeda_nativa, 0)

  // ── 3. Net ────────────────────────────────────────────────────────────────
  const net = bruto_final - comissao_total

  // ── 4. Linhas de custo ────────────────────────────────────────────────────
  const linhas_custo: ICustoLinha[] = []

  const addNet = (label: string, perc: number) => {
    linhas_custo.push({ label, base: 'NET', percentual: perc, valor: (net * perc) / 100 })
  }
  const addBruto = (label: string, perc: number, detalhe?: string, imutavel?: boolean) => {
    linhas_custo.push({
      label,
      base: 'BRUTO',
      percentual: perc,
      valor: (bruto_final * perc) / 100,
      detalhe,
      imutavel,
    })
  }

  addNet('Impostos', input.parametros.perc_impostos)
  addNet('Agenciamento', input.parametros.perc_agenciamento)
  addNet('Bonificações', input.parametros.perc_bonificacoes)
  addNet('Admin', input.parametros.perc_admin)

  if (input.perc_gift_card > 0) {
    addBruto('Gift Card extra', input.perc_gift_card)
  }

  if (input.provider_gc) {
    const taxa = TAXA_PROVIDER_GC[input.provider_gc] ?? 0
    addBruto(`Fee ${input.provider_gc}`, taxa, input.provider_gc)
  }

  const perc_cobranca = TAXA_COBRANCA[input.forma_cobranca] ?? 0
  addBruto('Custo de Cobrança', perc_cobranca, input.forma_cobranca.replace('_', ' '))

  // TPA: imutável, calculado sobre pax cobertos
  const tpa_total = input.tpa_diario * input.dias * pax_cobertos_tpa
  const tpa_perc = bruto_final > 0 ? (tpa_total / bruto_final) * 100 : 0
  linhas_custo.push({
    label: 'TPA WMMS',
    base: 'BRUTO',
    percentual: tpa_perc,
    valor: tpa_total,
    imutavel: true,
    detalhe: `${input.tpa_diario.toFixed(4)}/dia × ${input.dias}d × ${pax_cobertos_tpa}pax`,
  })

  // ── 5. Margem ─────────────────────────────────────────────────────────────
  const total_custos = linhas_custo.reduce((s, l) => s + l.valor, 0)
  const margem_valor = bruto_final - comissao_total - total_custos
  const margem_percentual = bruto_final > 0 ? (margem_valor / bruto_final) * 100 : 0

  const guardrail: IResultadoSimulacao['guardrail'] =
    margem_percentual >= 25 ? 'OK' : margem_percentual >= 15 ? 'ATENCAO' : 'CRITICO'

  return {
    bruto_original,
    bruto_final,
    campanhas_aplicadas,
    comissao_total,
    net,
    linhas_custo,
    total_custos,
    margem_valor,
    margem_percentual,
    comissoes_detalhe,
    moeda: input.moeda,
    guardrail,
  }
}
