import { supabase } from '@/lib/supabase/client'

export const processarVoucher = async (
  id_voucher: string,
  status_voucher: string,
  reprocessar = false,
) => {
  const { data, error } = await supabase.functions.invoke('processar-voucher', {
    body: { id_voucher, status_voucher, reprocessar },
  })

  if (error) {
    throw new Error(error.message || 'Erro ao processar voucher')
  }

  return data
}
