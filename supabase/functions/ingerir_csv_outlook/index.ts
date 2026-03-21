import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from '@supabase/supabase-js'
import Papa from 'papaparse'

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
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    if (usuarioError || !usuario) throw new Error('User profile not found')

    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'No CSV file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const text = await file.text()
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    })

    const rows = parsed.data as Record<string, any>[]

    let processedCount = 0
    let failedCount = 0
    const countries = new Set<string>()
    const currencies = new Set<string>()

    const agencyCache = new Map<string, string | null>()
    const voucherCache = new Map<string, string>()

    for (const row of rows) {
      try {
        const getField = (keys: string[]) => {
          for (const k of keys) {
            const val = row[k] || row[k.toLowerCase()] || row[k.toUpperCase()]
            if (val !== undefined && val !== null) return String(val).trim()
          }
          return ''
        }

        const originCountry = getField(['origin_country', 'pais_origen', 'country', 'pais'])
        const currency = getField(['moeda_monto', 'moneda', 'currency', 'moeda'])

        let rowCountry = originCountry
        if (!rowCountry) {
          if (currency === 'BRL') rowCountry = 'BR'
          else if (currency === 'ARS') rowCountry = 'AR'
        }

        if (!rowCountry) {
          failedCount++
          continue
        }

        rowCountry = rowCountry.toUpperCase()
        if (rowCountry === 'BRASIL' || rowCountry === 'BRAZIL') rowCountry = 'BR'
        if (rowCountry === 'ARGENTINA') rowCountry = 'AR'

        if (!usuario.perfil_admin && usuario.pais !== rowCountry) {
          failedCount++
          continue
        }

        if (currency) currencies.add(currency)
        countries.add(rowCountry)

        const agencyCode = getField([
          'agency_code',
          'codigo_agencia',
          'agencia',
          'codigo',
          'agency',
        ])
        if (!agencyCode) {
          failedCount++
          continue
        }

        const agencyCacheKey = `${agencyCode}_${rowCountry}`
        let agenciaId = agencyCache.get(agencyCacheKey)

        if (agenciaId === undefined) {
          const { data: ag } = await supabase
            .from('agencias')
            .select('id')
            .eq('codigo', agencyCode)
            .eq('pais', rowCountry)
            .maybeSingle()

          if (ag) {
            agenciaId = ag.id
            agencyCache.set(agencyCacheKey, agenciaId)
          } else {
            agencyCache.set(agencyCacheKey, null)
            agenciaId = null
          }
        }

        if (!agenciaId) {
          failedCount++
          continue
        }

        const voucherCode = getField(['voucher_code', 'voucher', 'codigo_voucher'])
        if (!voucherCode) {
          failedCount++
          continue
        }

        let voucherId = voucherCache.get(voucherCode)

        if (!voucherId) {
          const { data: existingVoucher } = await supabase
            .from('vouchers')
            .select('id')
            .eq('voucher_code', voucherCode)
            .maybeSingle()

          if (existingVoucher) {
            voucherId = existingVoucher.id
            voucherCache.set(voucherCode, voucherId)
          } else {
            const rawStatus = getField(['status', 'estado'])
            let mappedStatus = rawStatus.toUpperCase()
            if (mappedStatus === 'CONFIRMADO') mappedStatus = 'CONFIRMED'
            else if (mappedStatus === 'PENDIENTE') mappedStatus = 'PENDING'
            else if (mappedStatus === 'CANCELADO') mappedStatus = 'CANCELLED'
            else if (mappedStatus === 'ACTIVO') mappedStatus = 'ACTIVE'
            else if (mappedStatus === 'VENCIDO') mappedStatus = 'EXPIRED'
            if (!mappedStatus) mappedStatus = 'PENDING'

            const rawAgencyName = getField([
              'agency_name',
              'nome_agencia',
              'agencia_original',
            ]).toUpperCase()
            const rawClient = getField(['client', 'cliente']).toUpperCase()
            let canal = 'B2B'
            if (rawAgencyName.includes('NOW ASSISTANCE') || rawClient.includes('NOW ASSISTANCE')) {
              canal = 'B2C'
            }

            const rawAmount = getField(['amount_paid', 'monto', 'amount', 'valor'])
            const amountPaid = parseFloat(rawAmount.replace(',', '.') || '0')
            let tipo_zero_amount = null
            if (amountPaid === 0) {
              tipo_zero_amount = 'ZERO_INDEFINIDO'
            }

            const issueDateStr =
              getField(['issue_date', 'data_criacao', 'emissao', 'fecha_emision']) ||
              new Date().toISOString()
            const issueDate = new Date(issueDateStr)
            const isInvalidDate = isNaN(issueDate.getTime())
            const finalIssueDate = isInvalidDate ? new Date() : issueDate
            const periodo = `${finalIssueDate.getFullYear()}-${String(finalIssueDate.getMonth() + 1).padStart(2, '0')}`

            const { data: newVoucher, error: vErr } = await supabase
              .from('vouchers')
              .insert({
                numero: voucherCode,
                voucher_code: voucherCode,
                cliente: rawClient || 'Desconhecido',
                id_agencia: agenciaId,
                id_agencia_original: agenciaId,
                id_agencia_atual: agenciaId,
                agencia_original: rawAgencyName || null,
                agencia_atual: rawAgencyName || null,
                amount_paid: amountPaid,
                monto: amountPaid,
                moeda_monto: currency || (rowCountry === 'BR' ? 'BRL' : 'ARS'),
                pais: rowCountry,
                destino: getField(['destination_country', 'destino', 'destination']) || null,
                tipo_canal_origem: canal,
                tipo_canal_atual: canal,
                tipo_zero_amount: tipo_zero_amount,
                status_voucher: mappedStatus,
                status_original: mappedStatus,
                data_criacao: finalIssueDate.toISOString(),
                product_code:
                  getField(['product_code', 'producto', 'product', 'produto']) || 'DEFAULT',
                periodo_apuracao: periodo,
              })
              .select('id')
              .single()

            if (vErr || !newVoucher) {
              console.error('Voucher insert error:', vErr)
              failedCount++
              continue
            }

            voucherId = newVoucher.id
            voucherCache.set(voucherCode, voucherId)
          }
        }

        const paxCode = getField(['voucher_passenger_code', 'passenger_code', 'pasajero', 'pax'])
        if (paxCode) {
          const { data: existingPax } = await supabase
            .from('passageiros')
            .select('id')
            .eq('id_voucher', voucherId)
            .eq('voucher_passenger_code', paxCode)
            .maybeSingle()

          if (existingPax) {
            failedCount++
            continue
          }

          let dob: string | null = getField(['dob', 'data_nascimento', 'fecha_nacimiento'])
          if (dob) {
            const d = new Date(dob)
            if (isNaN(d.getTime())) dob = null
            else dob = d.toISOString().split('T')[0]
          }

          const { error: pErr } = await supabase.from('passageiros').insert({
            id_voucher: voucherId,
            voucher_passenger_code: paxCode,
            nome: getField(['passenger_name', 'nome', 'nombre', 'name']) || 'Desconhecido',
            documento_tipo: getField(['document_type', 'tipo_documento']) || null,
            documento_numero:
              getField(['document_number', 'numero_documento', 'documento']) || null,
            data_nascimento: dob,
          })

          if (pErr) {
            console.error('Passenger insert error:', pErr)
            failedCount++
          } else {
            processedCount++
          }
        } else {
          processedCount++
        }
      } catch (err) {
        console.error('Row processing error:', err)
        failedCount++
      }
    }

    await supabase.from('ingestao_logs').insert({
      quantidade_registros: processedCount,
      quantidade_falhadas: failedCount,
      pais_processado: Array.from(countries)[0] || null,
      moedas_processadas: Array.from(currencies),
      id_usuario: usuario.id,
      status: failedCount === 0 ? 'SUCESSO' : processedCount > 0 ? 'PARCIAL' : 'FALHA',
    })

    return new Response(
      JSON.stringify({
        message: 'Processing complete',
        processedCount,
        failedCount,
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      },
    )
  } catch (error: any) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
