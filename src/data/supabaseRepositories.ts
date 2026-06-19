import { supabase } from '@/lib/supabase/client'
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
  IContratoPreVenda,
  IExtratoPreVenda,
  IClassificacaoRepo,
  IDashboardStats,
  IIngestaoLog,
  IAlerta,
  ISimulacaoRepo,
  IParametrosPricing,
  ITPA,
  ICampanha,
  ISimulacaoSalva,
} from '@/domain/contracts'

export class UsersRepoSupabase implements IUsersRepo {
  async login(email: string, senha: string, pais?: 'BR' | 'AR'): Promise<ITenantSession> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })
    if (authError) throw new Error(authError.message)

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .single()

    if (userError || !userData) throw new Error('Usuário não encontrado no banco de dados')

    return {
      id_usuario: userData.auth_user_id || authData.user.id,
      usuario: userData.nome || email.split('@')[0],
      nivel: userData.nivel || 'Regional',
      id_agencia: userData.id_agencia || 0,
      pais_ativo: (userData.pais as 'BR' | 'AR') || pais || 'BR',
      perfil_admin: userData.perfil_admin || false,
      moeda_padrao: (userData.moeda_padrao as 'BRL' | 'ARS') || 'BRL',
    }
  }

  async getUsers(pais: 'BR' | 'AR'): Promise<any[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, auth_user_id, nivel, pais')
      .eq('pais', pais)

    if (error) throw new Error(error.message)

    return data.map((u) => ({
      id: u.id,
      nome: u.nome || 'Desconhecido',
      email: u.auth_user_id,
      role: u.nivel || 'Regional',
      pais_ativo: u.pais,
    }))
  }
}

export class AgenciasRepoSupabase implements IAgenciasRepo {
  async getAgencias(pais: 'BR' | 'AR'): Promise<IAgencia[]> {
    const { data, error } = await supabase.from('agencias').select('*').eq('pais', pais)

    if (error) throw new Error(error.message)

    return data.map((a) => ({
      id: a.id,
      codigo: a.codigo || '',
      nome_fantasia: a.nome_fantasia || '',
      nome_legal: a.nome_legal || '',
      nivel: Number(a.nivel) || 1,
      id_agencia_pai: a.id_agencia_pai,
      comissao: a.percentual_comissao || 0,
      moeda: a.moeda_padrao || 'BRL',
      pais_ativo: a.pais as 'BR' | 'AR',
      status: 'Ativa',
    }))
  }

  async addAgencia(agencia: Omit<IAgencia, 'id'>): Promise<IAgencia> {
    const { data, error } = await supabase
      .from('agencias')
      .insert({
        codigo: agencia.codigo,
        nome_fantasia: agencia.nome_fantasia,
        nome_legal: agencia.nome_legal,
        nivel: agencia.nivel.toString(),
        id_agencia_pai: agencia.id_agencia_pai ? String(agencia.id_agencia_pai) : null,
        percentual_comissao: agencia.comissao,
        moeda_padrao: agencia.moeda,
        pais: agencia.pais_ativo,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    return {
      id: data.id,
      codigo: data.codigo || '',
      nome_fantasia: data.nome_fantasia || '',
      nome_legal: data.nome_legal || '',
      nivel: Number(data.nivel) || 1,
      id_agencia_pai: data.id_agencia_pai,
      comissao: data.percentual_comissao || 0,
      moeda: data.moeda_padrao || 'BRL',
      pais_ativo: data.pais as 'BR' | 'AR',
      status: 'Ativa',
    }
  }

  async updateAgencia(id: string | number, agencia: Partial<IAgencia>): Promise<IAgencia> {
    const updateData: any = {}
    if (agencia.codigo !== undefined) updateData.codigo = agencia.codigo
    if (agencia.nome_fantasia !== undefined) updateData.nome_fantasia = agencia.nome_fantasia
    if (agencia.nome_legal !== undefined) updateData.nome_legal = agencia.nome_legal
    if (agencia.nivel !== undefined) updateData.nivel = agencia.nivel.toString()
    if (agencia.id_agencia_pai !== undefined)
      updateData.id_agencia_pai = agencia.id_agencia_pai ? String(agencia.id_agencia_pai) : null
    if (agencia.comissao !== undefined) updateData.percentual_comissao = agencia.comissao
    if (agencia.moeda !== undefined) updateData.moeda_padrao = agencia.moeda
    if (agencia.pais_ativo !== undefined) updateData.pais = agencia.pais_ativo

    const { data, error } = await supabase
      .from('agencias')
      .update(updateData)
      .eq('id', String(id))
      .select()
      .single()

    if (error) throw new Error(error.message)

    return {
      id: data.id,
      codigo: data.codigo || '',
      nome_fantasia: data.nome_fantasia || '',
      nome_legal: data.nome_legal || '',
      nivel: Number(data.nivel) || 1,
      id_agencia_pai: data.id_agencia_pai,
      comissao: data.percentual_comissao || 0,
      moeda: data.moeda_padrao || 'BRL',
      pais_ativo: data.pais as 'BR' | 'AR',
      status: 'Ativa',
    }
  }

  async deleteAgencia(id: string | number): Promise<void> {
    const { error } = await supabase.from('agencias').delete().eq('id', String(id))
    if (error) throw new Error(error.message)
  }
}

export class VouchersRepoSupabase implements IVouchersRepo {
  async getVouchers(pais: 'BR' | 'AR'): Promise<IVoucherData[]> {
    const { data, error } = await supabase
      .from('vouchers')
      .select('*, passageiros(*)')
      .eq('pais', pais)

    if (error) throw new Error(error.message)

    return data.map((v) => {
      const paxCode =
        v.passageiros && v.passageiros.length > 0
          ? v.passageiros[0].voucher_passenger_code
          : 'Desconhecido'

      return {
        voucher_code: v.voucher_code || v.numero,
        voucher_passenger_code: paxCode || 'Desconhecido',
        agencia_atual: v.agencia_atual || v.agencia_original || '',
        id_agencia_atual: v.id_agencia_atual || v.id_agencia || 0,
        status_voucher: v.status_voucher || v.status_original,
        tipo_canal_atual: v.tipo_canal_atual || v.tipo_canal_origem || 'B2B',
        amount_paid: v.amount_paid || v.monto || 0,
        moeda_monto: v.moeda_monto || 'USD',
        versao_calculo: v.versao_calculo || 1,
        pais_ativo: v.pais as 'BR' | 'AR',
        data_emissao: v.data_criacao ? new Date(v.data_criacao).toISOString().split('T')[0] : '',
      }
    })
  }

  async getRecentVouchers(pais: 'BR' | 'AR'): Promise<any[]> {
    const { data, error } = await supabase
      .from('vouchers')
      .select('*, passageiros(*)')
      .eq('pais', pais)
      .order('data_criacao', { ascending: false })
      .limit(10)

    if (error) throw new Error(error.message)

    return data.map((v) => ({
      id: v.voucher_code || v.numero,
      cliente: v.cliente || 'Desconhecido',
      valor: v.amount_paid || v.monto || 0,
      status: v.status_voucher || v.status_original,
      data: v.data_criacao,
      pais_ativo: v.pais,
    }))
  }

  async reprocessarVoucher(
    id_voucher: string,
    id_agencia: number | string,
    nome_agencia: string,
  ): Promise<void> {
    const { error } = await supabase
      .from('vouchers')
      .update({
        id_agencia_atual: String(id_agencia),
        agencia_atual: nome_agencia,
        tipo_canal_atual: 'B2C_ATTRIBUTED',
      })
      .eq('voucher_code', id_voucher)

    if (error) throw new Error(error.message)

    const { data: vData, error: vError } = await supabase
      .from('vouchers')
      .select('id, status_voucher')
      .eq('voucher_code', id_voucher)
      .single()

    if (!vError && vData) {
      await supabase.functions.invoke('processar-voucher', {
        body: { id_voucher: vData.id, status_voucher: vData.status_voucher, reprocessar: true },
      })
    }
  }

  async sincronizarCSV(): Promise<void> {
    // Sincronização via upload em Vendas.tsx. Noop no repo
  }
}

export class ProdutosRepoSupabase implements IProdutosRepo {
  async getGroups(pais: 'BR' | 'AR'): Promise<IProductGroup[]> {
    const { data, error } = await supabase.from('grupos_produtos').select('*').eq('pais', pais)

    if (error) throw new Error(error.message)

    return data.map((g) => ({
      id: g.id,
      nome: g.nome || '',
      comissao_maxima: g.percentual_comissao_maximo || 0,
      moeda_cadastro: g.moeda_cadastro || 'USD',
      flags: [],
      pais_ativo: g.pais as 'BR' | 'AR',
    }))
  }

  async addGroup(group: Omit<IProductGroup, 'id'>): Promise<IProductGroup> {
    const { data, error } = await supabase
      .from('grupos_produtos')
      .insert({
        nome: group.nome,
        percentual_comissao_maximo: group.comissao_maxima,
        moeda_cadastro: group.moeda_cadastro,
        pais: group.pais_ativo,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    return {
      id: data.id,
      nome: data.nome || '',
      comissao_maxima: data.percentual_comissao_maximo || 0,
      moeda_cadastro: data.moeda_cadastro || 'USD',
      flags: [],
      pais_ativo: data.pais as 'BR' | 'AR',
    }
  }

  async updateGroup(id: string | number, group: Partial<IProductGroup>): Promise<IProductGroup> {
    const updateData: any = {}
    if (group.nome !== undefined) updateData.nome = group.nome
    if (group.comissao_maxima !== undefined)
      updateData.percentual_comissao_maximo = group.comissao_maxima
    if (group.moeda_cadastro !== undefined) updateData.moeda_cadastro = group.moeda_cadastro
    if (group.pais_ativo !== undefined) updateData.pais = group.pais_ativo

    const { data, error } = await supabase
      .from('grupos_produtos')
      .update(updateData)
      .eq('id', String(id))
      .select()
      .single()

    if (error) throw new Error(error.message)

    return {
      id: data.id,
      nome: data.nome || '',
      comissao_maxima: data.percentual_comissao_maximo || 0,
      moeda_cadastro: data.moeda_cadastro || 'USD',
      flags: [],
      pais_ativo: data.pais as 'BR' | 'AR',
    }
  }

  async deleteGroup(id: string | number): Promise<void> {
    const { error } = await supabase.from('grupos_produtos').delete().eq('id', String(id))
    if (error) throw new Error(error.message)
  }

  async getVariations(id_grupo: string | number): Promise<IProductVariation[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*, variacoes_preco(*)')
      .eq('id_grupo', String(id_grupo))

    if (error) throw new Error(error.message)

    const variations: IProductVariation[] = []

    data.forEach((p) => {
      if (p.variacoes_preco) {
        p.variacoes_preco.forEach((v: any) => {
          variations.push({
            id: v.id,
            id_grupo: p.id_grupo || '',
            nome: p.nome || '',
            destino: v.destino || '',
            faixa_etaria: v.faixa_etaria || '',
            preco: v.preco_moeda_cadastro || 0,
          })
        })
      }
    })

    return variations
  }

  async addVariation(variation: Omit<IProductVariation, 'id'>): Promise<IProductVariation> {
    const { data: prodData, error: prodError } = await supabase
      .from('produtos')
      .insert({
        nome: variation.nome,
        id_grupo: String(variation.id_grupo),
      })
      .select()
      .single()

    if (prodError) throw new Error(prodError.message)

    const { data: varData, error: varError } = await supabase
      .from('variacoes_preco')
      .insert({
        id_produto: prodData.id,
        destino: variation.destino,
        faixa_etaria: variation.faixa_etaria,
        preco_moeda_cadastro: variation.preco,
      })
      .select()
      .single()

    if (varError) throw new Error(varError.message)

    return {
      id: varData.id,
      id_grupo: prodData.id_grupo || '',
      nome: prodData.nome || '',
      destino: varData.destino || '',
      faixa_etaria: varData.faixa_etaria || '',
      preco: varData.preco_moeda_cadastro || 0,
    }
  }

  async updateVariation(
    id: string | number,
    variation: Partial<IProductVariation>,
  ): Promise<IProductVariation> {
    const { data: varData, error: varError } = await supabase
      .from('variacoes_preco')
      .update({
        destino: variation.destino,
        faixa_etaria: variation.faixa_etaria,
        preco_moeda_cadastro: variation.preco,
      })
      .eq('id', String(id))
      .select('*, produtos(*)')
      .single()

    if (varError) throw new Error(varError.message)

    if (variation.nome && varData.id_produto) {
      await supabase.from('produtos').update({ nome: variation.nome }).eq('id', varData.id_produto)
    }

    return {
      id: varData.id,
      id_grupo: varData.produtos?.id_grupo || '',
      nome: variation.nome || varData.produtos?.nome || '',
      destino: varData.destino || '',
      faixa_etaria: varData.faixa_etaria || '',
      preco: varData.preco_moeda_cadastro || 0,
    }
  }

  async deleteVariation(id: string | number): Promise<void> {
    const { error } = await supabase.from('variacoes_preco').delete().eq('id', String(id))
    if (error) throw new Error(error.message)
  }
}

export class FinanceiroRepoSupabase implements IFinanceiroRepo {
  async getDashboardStats(pais: 'BR' | 'AR') {
    const { data: faturamento, error: faturamentoError } = await supabase
      .from('faturamento_net')
      .select('valor_bruto')
      .eq('pais', pais)

    if (faturamentoError) throw new Error(faturamentoError.message)

    const { count: vendasCount, error: vendasError } = await supabase
      .from('vouchers')
      .select('id', { count: 'exact', head: true })
      .eq('pais', pais)

    if (vendasError) throw new Error(vendasError.message)

    const receitaTotal = faturamento.reduce((acc, curr) => acc + (curr.valor_bruto || 0), 0)

    return {
      receitaTotal: receitaTotal,
      vendasMensais: vendasCount || 0,
      crescimento: 0,
      moeda: pais === 'BR' ? 'BRL' : 'ARS',
    }
  }

  async getDashboardCompleto(pais: 'BR' | 'AR'): Promise<IDashboardStats> {
    const [vouchersRes, faturamentoRes, agenciasRes] = await Promise.all([
      supabase
        .from('vouchers')
        .select('amount_paid, moeda_monto, tipo_canal_atual, data_criacao, tipo_zero_amount')
        .eq('pais', pais),
      supabase
        .from('faturamento_vigente')
        .select('comissao, moeda, status_quitacao')
        .eq('pais', pais),
      supabase.from('agencias').select('id', { count: 'exact' }).eq('pais', pais),
    ])

    if (vouchersRes.error) throw new Error(vouchersRes.error.message)
    if (faturamentoRes.error) throw new Error(faturamentoRes.error.message)

    const vouchers = vouchersRes.data || []
    const faturamentos = faturamentoRes.data || []

    const totaisPorMoeda: Record<
      string,
      { amountPaid: number; comissao: number; liquido: number; valoresReceber: number }
    > = {}
    let totalCortesias = 0
    let totalPreVenda = 0
    let b2bCount = 0
    let b2cCount = 0

    const evolucaoMap: Record<string, Record<string, number>> = {}

    vouchers.forEach((v) => {
      const moeda = v.moeda_monto || (pais === 'BR' ? 'BRL' : 'ARS')
      if (!totaisPorMoeda[moeda])
        totaisPorMoeda[moeda] = { amountPaid: 0, comissao: 0, liquido: 0, valoresReceber: 0 }

      const amount = v.amount_paid || 0
      totaisPorMoeda[moeda].amountPaid += amount

      if (v.tipo_zero_amount === 'CORTESIA') totalCortesias++
      if (v.tipo_zero_amount === 'PRE_VENDA') totalPreVenda++

      if (v.tipo_canal_atual === 'B2C' || v.tipo_canal_atual === 'B2C_ATTRIBUTED') b2cCount++
      else b2bCount++

      if (v.data_criacao && amount > 0) {
        const dataDia = v.data_criacao.split('T')[0]
        if (!evolucaoMap[dataDia]) evolucaoMap[dataDia] = {}
        if (!evolucaoMap[dataDia][moeda]) evolucaoMap[dataDia][moeda] = 0
        evolucaoMap[dataDia][moeda] += amount
      }
    })

    faturamentos.forEach((f) => {
      const moeda = f.moeda || (pais === 'BR' ? 'BRL' : 'ARS')
      if (!totaisPorMoeda[moeda])
        totaisPorMoeda[moeda] = { amountPaid: 0, comissao: 0, liquido: 0, valoresReceber: 0 }

      totaisPorMoeda[moeda].comissao += f.comissao || 0

      if (f.status_quitacao === 'PENDENTE') {
        totaisPorMoeda[moeda].valoresReceber += f.comissao || 0
      }
    })

    Object.keys(totaisPorMoeda).forEach((m) => {
      totaisPorMoeda[m].liquido = totaisPorMoeda[m].amountPaid - totaisPorMoeda[m].comissao
    })

    const evolucaoDiaria = Object.entries(evolucaoMap)
      .sort(([d1], [d2]) => d1.localeCompare(d2))
      .flatMap(([data, moedas]) =>
        Object.entries(moedas).map(([moeda, valor]) => ({ data, valor, moeda })),
      )

    return {
      totaisPorMoeda,
      totalVouchers: vouchers.length,
      totalPreVenda,
      totalCortesias,
      agenciasAtivas: agenciasRes.count || 0,
      evolucaoDiaria,
      distribuicaoCanal: [
        { name: 'B2B', value: b2bCount },
        { name: 'B2C', value: b2cCount },
      ],
    }
  }

  async getIngestions(pais: 'BR' | 'AR'): Promise<IIngestaoLog[]> {
    const { data, error } = await supabase
      .from('ingestao_logs')
      .select('*')
      .eq('pais_processado', pais)
      .order('data_ingestao', { ascending: false })
      .limit(5)

    if (error) throw new Error(error.message)
    return data.map((d) => ({
      id: d.id,
      data_ingestao: d.data_ingestao || '',
      status: d.status || '',
      quantidade_registros: d.quantidade_registros || 0,
      quantidade_falhadas: d.quantidade_falhadas || 0,
      mensagem_erro: d.mensagem_erro || '',
    }))
  }

  async getAlerts(pais: 'BR' | 'AR'): Promise<IAlerta[]> {
    const alerts: IAlerta[] = []

    const trintaDiasAtras = new Date()
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30)

    const { data: vencidos } = await supabase
      .from('faturamento_vigente')
      .select('agencia_recebedora_nome')
      .eq('pais', pais)
      .eq('status_quitacao', 'PENDENTE')
      .lt('created_at', trintaDiasAtras.toISOString())
      .limit(5)

    if (vencidos && vencidos.length > 0) {
      const names = new Set(vencidos.map((v) => v.agencia_recebedora_nome))
      names.forEach((name) => {
        alerts.push({
          id: Math.random().toString(),
          tipo: 'CURRENTACCOUNT',
          mensagem: `Fatura de ${name} pendente há mais de 30 dias.`,
          data: new Date().toISOString(),
        })
      })
    }

    const { count: semZeroAmount } = await supabase
      .from('vouchers')
      .select('id', { count: 'exact' })
      .eq('pais', pais)
      .eq('amount_paid', 0)
      .is('tipo_zero_amount', null)

    if (semZeroAmount && semZeroAmount > 0) {
      alerts.push({
        id: Math.random().toString(),
        tipo: 'DISCREPANCIA',
        mensagem: `Existem ${semZeroAmount} vouchers com valor 0 aguardando classificação.`,
        data: new Date().toISOString(),
      })
    }

    return alerts
  }

  async getTransacoes(pais: 'BR' | 'AR'): Promise<any[]> {
    const { data, error } = await supabase
      .from('faturamento_net')
      .select('*')
      .eq('pais', pais)
      .order('data_evento', { ascending: false })
      .limit(50)

    if (error) throw new Error(error.message)

    return data.map((t) => ({
      id: t.id.substring(0, 8),
      data: t.data_evento ? new Date(t.data_evento).toISOString().split('T')[0] : '',
      valor: t.valor_moeda_nativa || t.comissao || 0,
      tipo: t.tipo || 'Desconhecido',
      pais_ativo: t.pais,
    }))
  }

  async getLancamentosVigentes(
    pais: 'BR' | 'AR',
    filtros: { id_agencia?: string; periodo?: string; moeda?: string; status_quitacao?: string },
  ): Promise<ILancamentoFaturamento[]> {
    let query = supabase.from('faturamento_vigente').select('*').eq('pais', pais)

    if (filtros.id_agencia) {
      query = query.eq('id_agencia_recebedora', filtros.id_agencia)
    }
    if (filtros.periodo) {
      query = query.eq('periodo_apuracao', filtros.periodo)
    }
    if (filtros.moeda) {
      query = query.eq('moeda', filtros.moeda)
    }
    if (filtros.status_quitacao) {
      query = query.eq('status_quitacao', filtros.status_quitacao)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)

    return data.map((d: any) => ({
      id: d.id,
      id_voucher: d.id_voucher,
      voucher_code: d.voucher_code || '',
      versao_calculo: d.versao_calculo,
      id_agencia_recebedora: d.id_agencia_recebedora,
      agencia_recebedora_nome: d.agencia_recebedora_nome || 'Desconhecida',
      pais: d.pais as 'BR' | 'AR',
      tipo_lancamento: d.tipo_lancamento || '',
      tipo_comissao: d.tipo_comissao || '',
      percentual_aplicado: d.percentual_aplicado || 0,
      valor_bruto: d.valor_bruto || 0,
      comissao: d.comissao || 0,
      valor_repasse: d.valor_repasse || 0,
      moeda: d.moeda || 'USD',
      periodo_apuracao: d.periodo_apuracao || '',
      id_fatura: d.id_fatura,
      fatura_travada: d.fatura_travada || false,
      status_quitacao: d.status_quitacao || 'PENDENTE',
    }))
  }

  async travarFatura(
    pais: 'BR' | 'AR',
    id_agencia: string,
    periodo: string,
    ids_lancamentos: string[],
  ): Promise<void> {
    if (!ids_lancamentos || ids_lancamentos.length === 0) return

    const { data: fatura, error: fError } = await supabase
      .from('faturas')
      .insert({
        id_agencia: id_agencia,
        pais: pais,
        status: 'FECHADA',
        status_lock: true,
        data_corte: new Date().toISOString(),
      })
      .select()
      .single()

    if (fError) throw new Error('Erro ao criar fatura: ' + fError.message)

    const { error: updError } = await supabase
      .from('faturamento_net')
      .update({ id_fatura: fatura.id })
      .in('id', ids_lancamentos)

    if (updError) throw new Error('Erro ao vincular lançamentos: ' + updError.message)
  }

  async quitarLancamento(id_lancamento: string): Promise<void> {
    const { error } = await supabase
      .from('faturamento_net')
      .update({ status_quitacao: 'QUITADO' })
      .eq('id', id_lancamento)

    if (error) throw new Error('Erro ao quitar lançamento: ' + error.message)
  }

  async quitarLancamentosPorVoucher(id_voucher: string): Promise<void> {
    const { error } = await supabase
      .from('faturamento_net')
      .update({ status_quitacao: 'QUITADO' })
      .eq('id_voucher', id_voucher)
      .eq('tipo_lancamento', 'COMISSAO')
      .neq('status_quitacao', 'QUITADO')

    if (error) throw new Error('Erro ao quitar voucher: ' + error.message)
  }
}

export class PreVendaRepoSupabase implements IPreVendaRepo {
  async getContratos(pais: 'BR' | 'AR'): Promise<IContratoPreVenda[]> {
    const { data, error } = await supabase
      .from('contratos_pre_venda')
      .select(
        `
        *,
        agencias ( nome_fantasia ),
        produtos ( nome )
      `,
      )
      .eq('pais', pais)

    if (error) throw new Error(error.message)

    return data.map((c: any) => ({
      id: c.id,
      id_agencia: c.id_agencia,
      agencia_nome: c.agencias ? c.agencias.nome_fantasia : '',
      id_produto: c.id_produto,
      produto_nome: c.produtos ? c.produtos.nome : '',
      dias_iniciais: c.dias_iniciais,
      dias_consumidos: c.dias_consumidos,
      data_validade: c.data_validade,
      status: c.status || 'ATIVO',
      pais: c.pais as 'BR' | 'AR',
      moeda: c.moeda,
    }))
  }

  async addContrato(
    contrato: Omit<IContratoPreVenda, 'id' | 'dias_consumidos' | 'agencia_nome' | 'produto_nome'>,
  ): Promise<void> {
    const { error } = await supabase.from('contratos_pre_venda').insert({
      id_agencia: String(contrato.id_agencia),
      id_produto: String(contrato.id_produto),
      dias_iniciais: contrato.dias_iniciais,
      data_validade: contrato.data_validade,
      status: contrato.status,
      pais: contrato.pais,
      moeda: contrato.moeda,
    })
    if (error) throw new Error(error.message)
  }

  async getExtrato(id_contrato: string): Promise<IExtratoPreVenda[]> {
    const { data, error } = await supabase
      .from('extrato_pre_venda')
      .select(
        `
        *,
        vouchers ( voucher_code )
      `,
      )
      .eq('id_contrato', id_contrato)
      .order('data_movimento', { ascending: false })

    if (error) throw new Error(error.message)

    return data.map((e: any) => ({
      id: e.id,
      id_contrato: e.id_contrato,
      id_voucher: e.id_voucher,
      voucher_code: e.vouchers ? e.vouchers.voucher_code : '',
      tipo_movimento: e.tipo_movimento,
      dias_consumidos: e.dias_consumidos,
      data_movimento: e.data_movimento,
    }))
  }

  async getProdutosLivres(pais: 'BR' | 'AR'): Promise<{ id: string; nome: string }[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select('id, nome, grupos_produtos!inner(pais)')
      .eq('grupos_produtos.pais', pais)

    if (error) throw new Error(error.message)

    return data.map((p: any) => ({ id: p.id, nome: p.nome }))
  }
}

export class ClassificacaoRepoSupabase implements IClassificacaoRepo {
  async getVouchersZeroAmount(pais: 'BR' | 'AR'): Promise<any[]> {
    const { data, error } = await supabase
      .from('vouchers')
      .select(
        `
        id,
        voucher_code,
        agencia_atual,
        data_criacao,
        destino,
        data_inicio_viagem,
        data_fim_viagem,
        tipo_zero_amount,
        amount_paid,
        monto,
        produtos ( nome ),
        passageiros ( id )
      `,
      )
      .eq('pais', pais)
      .or('amount_paid.eq.0,monto.eq.0')

    if (error) throw new Error(error.message)

    return data.map((v: any) => {
      let dias = 1
      if (v.data_inicio_viagem && v.data_fim_viagem) {
        const d1 = new Date(v.data_inicio_viagem)
        const d2 = new Date(v.data_fim_viagem)
        if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
          dias = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)) + 1)
        }
      }

      return {
        id: v.id,
        voucher_code: v.voucher_code,
        agencia: v.agencia_atual,
        data_emissao: v.data_criacao ? new Date(v.data_criacao).toISOString().split('T')[0] : '',
        passageiros_count: v.passageiros ? v.passageiros.length : 1,
        destino: v.destino,
        plano: v.produtos
          ? Array.isArray(v.produtos)
            ? v.produtos[0]?.nome
            : v.produtos.nome
          : 'N/A',
        dias_viagem: dias,
        tipo_zero_amount: v.tipo_zero_amount || 'ZERO_INDEFINIDO',
      }
    })
  }

  async reclassificarVoucher(
    id_voucher: string,
    tipo_anterior: string | null,
    tipo_novo: string,
    motivo: string,
    id_usuario: string,
    id_contrato?: string,
    dias_consumidos?: number,
  ): Promise<void> {
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_user_id', id_usuario)
      .single()

    const uid = usuario ? usuario.id : null

    const { error: updErr } = await supabase
      .from('vouchers')
      .update({ tipo_zero_amount: tipo_novo })
      .eq('id', id_voucher)

    if (updErr) throw new Error(updErr.message)

    await supabase.from('audit_reclassificacao').insert({
      id_voucher,
      tipo_anterior,
      tipo_novo,
      motivo,
      classificado_por: uid,
    })

    if (tipo_novo === 'PRE_VENDA' && id_contrato && dias_consumidos) {
      await supabase.from('extrato_pre_venda').insert({
        id_contrato,
        id_voucher,
        tipo_movimento: 'DEBITO',
        dias_consumidos,
      })

      const { data: c } = await supabase
        .from('contratos_pre_venda')
        .select('dias_consumidos')
        .eq('id', id_contrato)
        .single()

      if (c) {
        await supabase
          .from('contratos_pre_venda')
          .update({ dias_consumidos: (c.dias_consumidos || 0) + dias_consumidos })
          .eq('id', id_contrato)
      }
    }
  }
}

export class SimulacaoRepoSupabase implements ISimulacaoRepo {
  private defaultParametros(id_grupo: string | number, pais: 'BR' | 'AR'): IParametrosPricing {
    return {
      id_grupo_produto: id_grupo,
      pais,
      perc_impostos: 3.5,
      perc_agenciamento: 5.0,
      perc_bonificacoes: 5.0,
      perc_admin: 10.0,
    }
  }

  async getParametros(
    id_grupo: string | number,
    pais: 'BR' | 'AR',
  ): Promise<IParametrosPricing | null> {
    const { data, error } = await supabase
      .from('parametros_pricing')
      .select('*')
      .eq('id_grupo_produto', id_grupo)
      .eq('pais', pais)
      .maybeSingle()

    if (error || !data) return this.defaultParametros(id_grupo, pais)

    return {
      id: data.id,
      id_grupo_produto: data.id_grupo_produto,
      pais: data.pais,
      perc_impostos: Number(data.perc_impostos),
      perc_agenciamento: Number(data.perc_agenciamento),
      perc_bonificacoes: Number(data.perc_bonificacoes),
      perc_admin: Number(data.perc_admin),
    }
  }

  async saveParametros(p: IParametrosPricing): Promise<IParametrosPricing> {
    const payload = {
      id_grupo_produto: p.id_grupo_produto,
      pais: p.pais,
      perc_impostos: p.perc_impostos,
      perc_agenciamento: p.perc_agenciamento,
      perc_bonificacoes: p.perc_bonificacoes,
      perc_admin: p.perc_admin,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('parametros_pricing')
      .upsert(payload, { onConflict: 'id_grupo_produto,pais' })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return { ...p, id: data.id }
  }

  async getTPA(
    id_grupo: string | number,
    pais: 'BR' | 'AR',
    destino = 'MUNDIAL',
  ): Promise<ITPA | null> {
    const { data, error } = await supabase
      .from('tpa_produtos')
      .select('*')
      .eq('id_grupo_produto', id_grupo)
      .eq('pais', pais)
      .eq('destino', destino)
      .maybeSingle()

    if (error || !data) {
      // Tentar fallback MUNDIAL
      if (destino !== 'MUNDIAL') return this.getTPA(id_grupo, pais, 'MUNDIAL')
      return null
    }

    return {
      id: data.id,
      id_grupo_produto: data.id_grupo_produto,
      pais: data.pais,
      destino: data.destino,
      custo_tpa_diario: Number(data.custo_tpa_diario),
      moeda: data.moeda,
    }
  }

  async saveTPA(tpa: ITPA): Promise<ITPA> {
    const payload = {
      id_grupo_produto: tpa.id_grupo_produto,
      pais: tpa.pais,
      destino: tpa.destino,
      custo_tpa_diario: tpa.custo_tpa_diario,
      moeda: tpa.moeda,
    }

    const { data, error } = await supabase
      .from('tpa_produtos')
      .upsert(payload, { onConflict: 'id_grupo_produto,pais,destino' })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return { ...tpa, id: data.id }
  }

  async getTodosTPAs(pais: 'BR' | 'AR'): Promise<ITPA[]> {
    const { data, error } = await supabase
      .from('tpa_produtos')
      .select('*')
      .eq('pais', pais)
      .order('destino')
    if (error) throw new Error(error.message)
    return (data ?? []).map((d) => ({
      id: d.id,
      id_grupo_produto: d.id_grupo_produto,
      pais: d.pais,
      destino: d.destino,
      custo_tpa_diario: Number(d.custo_tpa_diario),
      moeda: d.moeda,
    }))
  }

  async getTodosParametros(pais: 'BR' | 'AR'): Promise<IParametrosPricing[]> {
    const { data, error } = await supabase
      .from('parametros_pricing')
      .select('*')
      .eq('pais', pais)
    if (error) throw new Error(error.message)
    return (data ?? []).map((d) => ({
      id: d.id,
      id_grupo_produto: d.id_grupo_produto,
      pais: d.pais,
      perc_impostos: Number(d.perc_impostos),
      perc_agenciamento: Number(d.perc_agenciamento),
      perc_bonificacoes: Number(d.perc_bonificacoes),
      perc_admin: Number(d.perc_admin),
    }))
  }

  private _mapCampanha(c: Record<string, unknown>): ICampanha {
    return {
      id: c.id as string,
      nome: c.nome as string,
      pais: c.pais as 'BR' | 'AR',
      tipo: c.tipo as 'DESCONTO_PERCENTUAL' | '2X1',
      percentual: Number(c.percentual),
      condicao_pagamento: c.condicao_pagamento as string,
      id_grupo_produto: (c.id_grupo_produto as string | null) ?? null,
      ativo: c.ativo as boolean,
      data_inicio: (c.data_inicio as string | null) ?? null,
      data_fim: (c.data_fim as string | null) ?? null,
    }
  }

  async getCampanhas(pais: 'BR' | 'AR'): Promise<ICampanha[]> {
    const { data, error } = await supabase
      .from('campanhas_pricing')
      .select('*')
      .eq('pais', pais)
      .eq('ativo', true)

    if (error) throw new Error(error.message)
    return (data ?? []).map((c) => this._mapCampanha(c as Record<string, unknown>))
  }

  async getCampanhasAdmin(pais: 'BR' | 'AR'): Promise<ICampanha[]> {
    const { data, error } = await supabase
      .from('campanhas_pricing')
      .select('*')
      .eq('pais', pais)
      .order('ativo', { ascending: false })
      .order('nome')

    if (error) throw new Error(error.message)
    return (data ?? []).map((c) => this._mapCampanha(c as Record<string, unknown>))
  }

  async salvarCampanha(campanha: Omit<ICampanha, 'id'> & { id?: string }): Promise<ICampanha> {
    const payload = {
      nome: campanha.nome,
      pais: campanha.pais,
      tipo: campanha.tipo,
      percentual: campanha.percentual,
      condicao_pagamento: campanha.condicao_pagamento,
      id_grupo_produto: campanha.id_grupo_produto ?? null,
      ativo: campanha.ativo,
      data_inicio: campanha.data_inicio ?? null,
      data_fim: campanha.data_fim ?? null,
    }

    if (campanha.id) {
      const { data, error } = await supabase
        .from('campanhas_pricing')
        .update(payload)
        .eq('id', campanha.id)
        .select()
        .single()
      if (error) throw new Error(error.message)
      return this._mapCampanha(data as Record<string, unknown>)
    }

    const { data, error } = await supabase
      .from('campanhas_pricing')
      .insert(payload)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return this._mapCampanha(data as Record<string, unknown>)
  }

  async toggleCampanha(id: string, ativo: boolean): Promise<void> {
    const { error } = await supabase
      .from('campanhas_pricing')
      .update({ ativo })
      .eq('id', id)
    if (error) throw new Error(error.message)
  }

  private async _getUsuarioId(): Promise<string | null> {
    const { data: authData } = await supabase.auth.getUser()
    const authUid = authData.user?.id
    if (!authUid) return null
    const { data } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_user_id', authUid)
      .single()
    return data?.id ?? null
  }

  async salvarSimulacao(
    nome: string,
    pais: 'BR' | 'AR',
    inputs: unknown[],
    resultados: unknown[],
  ): Promise<ISimulacaoSalva> {
    const id_usuario = await this._getUsuarioId()

    const { data, error } = await supabase
      .from('simulacoes')
      .insert({
        nome,
        pais,
        id_usuario,
        inputs_json: inputs,
        resultados_json: resultados,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return {
      id: data.id,
      nome: data.nome,
      pais: data.pais,
      inputs_json: data.inputs_json,
      resultados_json: data.resultados_json,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  async listarSimulacoes(pais: 'BR' | 'AR'): Promise<ISimulacaoSalva[]> {
    const id_usuario = await this._getUsuarioId()

    let query = supabase
      .from('simulacoes')
      .select('*')
      .eq('pais', pais)
      .order('updated_at', { ascending: false })
      .limit(50)

    if (id_usuario) {
      query = query.eq('id_usuario', id_usuario)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)
    return (data ?? []).map((d) => ({
      id: d.id,
      nome: d.nome,
      pais: d.pais,
      inputs_json: d.inputs_json,
      resultados_json: d.resultados_json,
      created_at: d.created_at,
      updated_at: d.updated_at,
    }))
  }

  async carregarSimulacao(id: string): Promise<ISimulacaoSalva> {
    const { data, error } = await supabase
      .from('simulacoes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return {
      id: data.id,
      nome: data.nome,
      pais: data.pais,
      inputs_json: data.inputs_json,
      resultados_json: data.resultados_json,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }
}
