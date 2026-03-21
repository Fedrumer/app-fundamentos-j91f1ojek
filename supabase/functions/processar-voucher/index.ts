import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const body = await req.json()
    const { id_voucher, status_voucher, reprocessar } = body

    if (!id_voucher || !status_voucher) {
      throw new Error('id_voucher and status_voucher are required')
    }

    // 1. Obter Voucher
    const { data: voucher, error: voucherError } = await supabase
      .from('vouchers')
      .select('*, produtos(*, grupos_produtos(*))')
      .eq('id', id_voucher)
      .single()

    if (voucherError || !voucher) {
      throw new Error('Voucher não encontrado: ' + (voucherError?.message || ''))
    }

    // 2. Determinar versao_calculo
    const { data: maxProc } = await supabase
      .from('voucher_processamentos')
      .select('versao_calculo')
      .eq('id_voucher', id_voucher)
      .order('versao_calculo', { ascending: false })
      .limit(1)
      .maybeSingle()

    const maxVersao = maxProc?.versao_calculo || 0
    const versao_atual = reprocessar ? maxVersao + 1 : maxVersao === 0 ? 1 : maxVersao

    // Atualizar voucher com a versão vigente
    if (voucher.versao_calculo !== versao_atual) {
      await supabase.from('vouchers').update({ versao_calculo: versao_atual }).eq('id', id_voucher)
    }

    // 3. Verificar idempotência (se não for reprocessamento para a mesma versão)
    const { data: procExistente } = await supabase
      .from('voucher_processamentos')
      .select('*')
      .eq('id_voucher', id_voucher)
      .eq('status_voucher', status_voucher)
      .eq('versao_calculo', versao_atual)
      .maybeSingle()

    if (procExistente && procExistente.resultado_status === 'SUCESSO') {
      return new Response(
        JSON.stringify({
          message: 'Voucher já processado com sucesso para este status e versão.',
          versao_calculo: versao_atual,
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 200 },
      )
    }

    // Função auxiliar para registrar log de processamento
    const logProcessamento = async (status: 'SUCESSO' | 'FALHA', hash = '') => {
      await supabase.from('voucher_processamentos').upsert(
        {
          id_voucher,
          status_voucher,
          versao_calculo: versao_atual,
          resultado_status: status,
          hash_input: hash,
        },
        { onConflict: 'id_voucher,status_voucher,versao_calculo' },
      )
    }

    // 4. Lógica por Status
    if (status_voucher === 'PENDING') {
      await logProcessamento('SUCESSO', 'noop')
      return new Response(JSON.stringify({ message: 'Processado como PENDING (noop)' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    if (status_voucher === 'CONFIRMED') {
      const tipoCanal = voucher.tipo_canal_atual || voucher.tipo_canal_origem

      // Se B2C, não há comissão
      if (tipoCanal === 'B2C') {
        await logProcessamento('SUCESSO', 'b2c_zero_comissao')
        return new Response(
          JSON.stringify({ message: 'Processado como CONFIRMED (B2C sem comissão)' }),
          {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          },
        )
      }

      // Buscar cadeia de agências
      const cadeia = []
      let current_id = voucher.id_agencia_atual || voucher.id_agencia_original || voucher.id_agencia
      const visited = new Set()

      while (current_id && !visited.has(current_id)) {
        visited.add(current_id)
        const { data: ag } = await supabase
          .from('agencias')
          .select('*')
          .eq('id', current_id)
          .maybeSingle()
        if (!ag) break
        cadeia.push(ag)
        current_id = ag.id_agencia_pai
      }

      if (cadeia.length === 0) {
        await logProcessamento('FALHA', 'cadeia_agencias_vazia')
        throw new Error('Nenhuma agência encontrada na cadeia para comissionamento')
      }

      const produto = Array.isArray(voucher.produtos) ? voucher.produtos[0] : voucher.produtos
      const grupo = produto?.grupos_produtos
      const tetoComissao = grupo?.percentual_comissao_maximo ?? 100

      let accumulated = 0
      let last_percentage = 0
      let is_direct = true
      const lancamentos = []
      const periodo_apuracao = voucher.periodo_apuracao || new Date().toISOString().slice(0, 7)

      for (const agency of cadeia) {
        const agency_comissao = agency.percentual_comissao || 0
        let applied = 0

        if (is_direct) {
          applied = agency_comissao
        } else {
          applied = Math.max(0, agency_comissao - last_percentage)
        }

        if (accumulated + applied > tetoComissao) {
          applied = Math.max(0, tetoComissao - accumulated)
        }

        if (applied > 0) {
          const valorBase = voucher.amount_paid || voucher.monto || 0
          const valorComissao = valorBase * (applied / 100)
          const valorRepasse = valorBase * ((100 - applied) / 100)

          lancamentos.push({
            id_voucher,
            id_agencia: voucher.id_agencia,
            id_agencia_vendedora: cadeia[0].id,
            id_agencia_recebedora: agency.id,
            valor_bruto: valorBase,
            comissao: valorComissao,
            percentual_aplicado: applied,
            valor_moeda_nativa: valorComissao,
            valor_repasse: valorRepasse,
            moeda: voucher.moeda_monto || 'USD',
            pais: voucher.pais || 'BR',
            periodo_apuracao,
            status_pagamento: 'PENDENTE',
            tipo: 'CREDITO',
            tipo_lancamento: 'COMISSAO',
            tipo_comissao: is_direct ? 'DIRETA' : 'INDIRETA',
            versao_calculo: versao_atual,
          })
          accumulated += applied
        }

        last_percentage = Math.max(last_percentage, agency_comissao)
        is_direct = false

        if (accumulated >= tetoComissao) break
      }

      // Validar Teto
      const totalAplicado = lancamentos.reduce((acc, l) => acc + l.percentual_aplicado, 0)
      if (totalAplicado > tetoComissao) {
        await logProcessamento('FALHA', 'teto_excedido')
        throw new Error(
          `Teto de comissão excedido. Teto: ${tetoComissao}%, Calculado: ${totalAplicado}%`,
        )
      }

      if (lancamentos.length > 0) {
        const { error: insertError } = await supabase.from('faturamento_net').insert(lancamentos)
        if (insertError) {
          await logProcessamento('FALHA', 'erro_insercao_faturamento')
          throw new Error('Erro ao inserir comissões: ' + insertError.message)
        }
      }

      await logProcessamento('SUCESSO', 'comissao_calculada')
      return new Response(
        JSON.stringify({
          message: 'Processado como CONFIRMED com sucesso',
          lancamentos: lancamentos.length,
        }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        },
      )
    }

    if (status_voucher === 'CANCELLED') {
      // Buscar maior versão de SUCESSO anterior para estornar
      const { data: procVigente } = await supabase
        .from('voucher_processamentos')
        .select('versao_calculo')
        .eq('id_voucher', id_voucher)
        .eq('resultado_status', 'SUCESSO')
        .order('versao_calculo', { ascending: false })
        .limit(1)

      if (!procVigente || procVigente.length === 0) {
        await logProcessamento('SUCESSO', 'sem_origem_para_estorno')
        return new Response(
          JSON.stringify({ message: 'Nenhum processamento de sucesso anterior para estornar' }),
          {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          },
        )
      }

      const versaoEstorno = procVigente[0].versao_calculo

      const { data: comissoes } = await supabase
        .from('faturamento_net')
        .select('*')
        .eq('id_voucher', id_voucher)
        .eq('versao_calculo', versaoEstorno)
        .eq('tipo_lancamento', 'COMISSAO')

      if (!comissoes || comissoes.length === 0) {
        await logProcessamento('SUCESSO', 'nenhuma_comissao_para_estornar')
        return new Response(
          JSON.stringify({
            message: 'Nenhuma comissão encontrada na versão vigente para estornar',
          }),
          {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          },
        )
      }

      const estornos = comissoes.map((c) => {
        const {
          id,
          created_at,
          updated_at,
          data_evento,
          data_lock,
          data_pagamento,
          data_vencimento_quitacao,
          ...rest
        } = c
        return {
          ...rest,
          tipo_lancamento: 'ESTORNO',
          tipo: 'DEBITO',
          id_lancamento_origem: id,
          valor_moeda_nativa: -Math.abs(c.valor_moeda_nativa || 0),
          comissao: -Math.abs(c.comissao || 0),
          percentual_aplicado: -Math.abs(c.percentual_aplicado || 0),
          valor_repasse: -Math.abs(c.valor_repasse || 0),
          valor_bruto: -Math.abs(c.valor_bruto || 0),
          versao_calculo: versao_atual,
        }
      })

      const { error: estornoError } = await supabase.from('faturamento_net').insert(estornos)

      if (estornoError) {
        if (
          !estornoError.message.includes('idx_estorno_unico') &&
          !estornoError.message.includes('duplicate key')
        ) {
          await logProcessamento('FALHA', 'erro_insercao_estorno')
          throw new Error('Erro ao inserir estornos: ' + estornoError.message)
        }
      }

      await logProcessamento('SUCESSO', 'estornos_gerados')
      return new Response(
        JSON.stringify({ message: 'Processado como CANCELLED com sucesso, estornos gerados' }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        },
      )
    }

    throw new Error('Status de voucher desconhecido: ' + status_voucher)
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 400,
    })
  }
})
