import { IVoucherData, IAgencia, IProductGroup, ComissaoResult } from '@/domain/contracts'

export type { ComissaoResult }

/**
 * Motor de comissionamento puro: calcula o rateio em formato cascata
 * considerando as regras B2B/B2C, teto de comissão do grupo e limites entre os níveis.
 */
export function calcularComissaoCascata(
  voucher: IVoucherData,
  cadeia: IAgencia[],
  grupo: IProductGroup,
): ComissaoResult[] {
  // Regra de Canal B2C: Zero comissão
  if (voucher.tipo_canal_atual === 'B2C') {
    return []
  }

  const result: ComissaoResult[] = []
  let currentAgencyId: string | number | null | undefined = voucher.id_agencia_atual
  let accumulatedPercentage = 0
  let lastPercentage = 0
  let isDirect = true

  while (currentAgencyId) {
    const agency = cadeia.find((a) => a.id.toString() === currentAgencyId?.toString())
    if (!agency) break

    let appliedPercentage = 0

    if (isDirect) {
      appliedPercentage = agency.comissao
    } else {
      appliedPercentage = Math.max(0, agency.comissao - lastPercentage)
    }

    // Validação de teto: Garantir que a soma não exceda o % máximo do grupo
    if (accumulatedPercentage + appliedPercentage > grupo.comissao_maxima) {
      appliedPercentage = Math.max(0, grupo.comissao_maxima - accumulatedPercentage)
    }

    if (appliedPercentage > 0) {
      result.push({
        id_agencia_recebedora: agency.id,
        tipo_comissao: isDirect ? 'DIRETA' : 'INDIRETA',
        percentual_aplicado: appliedPercentage,
        valor_moeda_nativa: (voucher.amount_paid * appliedPercentage) / 100,
        moeda: voucher.moeda_monto,
      })
      accumulatedPercentage += appliedPercentage
    }

    // O último percentual é o maior percentual distribuído nas camadas inferiores
    lastPercentage = Math.max(lastPercentage, agency.comissao)
    currentAgencyId = agency.id_agencia_pai
    isDirect = false

    if (accumulatedPercentage >= grupo.comissao_maxima) {
      break
    }
  }

  return result
}
