import { IVoucherData } from '@/domain/contracts'

export function buildSimVoucher(
  bruto: number,
  id_agencia: string | number,
  tipo_canal: string,
  moeda: string,
  pais: 'BR' | 'AR',
): IVoucherData {
  return {
    voucher_code: 'SIM-PREVIEW',
    voucher_passenger_code: 'SIM-PAX',
    agencia_atual: '',
    id_agencia_atual: id_agencia,
    status_voucher: 'ISSUED',
    tipo_canal_atual: tipo_canal,
    amount_paid: bruto,
    moeda_monto: moeda,
    versao_calculo: 1,
    pais_ativo: pais,
  }
}
