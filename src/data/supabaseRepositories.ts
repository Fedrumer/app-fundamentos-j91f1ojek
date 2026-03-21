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
}
