import {
  IAgenciasRepo,
  IFinanceiroRepo,
  IProdutosRepo,
  ITenantSession,
  IUsersRepo,
  IVouchersRepo,
  IVoucherData,
  IAgencia,
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
    voucher_code: 'V-1003',
    voucher_passenger_code: 'PA-003',
    agencia_atual: 'Agência Rio',
    id_agencia_atual: 102,
    status_voucher: 'CANCELLED',
    tipo_canal_atual: 'B2B',
    amount_paid: 3200,
    moeda_monto: 'BRL',
    versao_calculo: 1,
    pais_ativo: 'BR',
    data_emissao: '2023-10-10',
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
  {
    voucher_code: 'V-2002',
    voucher_passenger_code: 'PA-005',
    agencia_atual: 'Agencia Buenos Aires',
    id_agencia_atual: 202,
    status_voucher: 'USED',
    tipo_canal_atual: 'B2B',
    amount_paid: 60000,
    moeda_monto: 'ARS',
    versao_calculo: 1,
    pais_ativo: 'AR',
    data_emissao: '2023-10-12',
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

export class UsersRepoMock implements IUsersRepo {
  async login(email: string, senha: string, pais?: 'BR' | 'AR'): Promise<ITenantSession> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    if (email === 'admin@now.com' && senha === 'senha123') {
      return {
        usuario: 'Administrador Global',
        nivel: 'Master',
        id_agencia: 0,
        pais_ativo: pais || 'BR',
        perfil_admin: true,
        moeda_padrao: pais === 'AR' ? 'ARS' : 'BRL',
      }
    }
    if (email === 'teste_br@now.com' && senha === 'senha123') {
      return {
        usuario: 'Operador Brasil',
        nivel: 'Operacional',
        id_agencia: 101,
        pais_ativo: 'BR',
        perfil_admin: false,
        moeda_padrao: 'BRL',
      }
    }
    if (email === 'teste_ar@now.com' && senha === 'senha123') {
      return {
        usuario: 'Operador Argentina',
        nivel: 'Operacional',
        id_agencia: 202,
        pais_ativo: 'AR',
        perfil_admin: false,
        moeda_padrao: 'ARS',
      }
    }
    throw new Error('Credenciais inválidas')
  }

  async getUsers(pais: 'BR' | 'AR'): Promise<any[]> {
    return pais === 'BR'
      ? [
          { id: 1, nome: 'João Silva', email: 'joao@now.com', role: 'Operador' },
          { id: 2, nome: 'Maria Souza', email: 'maria@now.com', role: 'Gerente' },
        ]
      : [{ id: 3, nome: 'Carlos Gardel', email: 'carlos@now.ar', role: 'Operador' }]
  }
}

export class AgenciasRepoMock implements IAgenciasRepo {
  async getAgencias(pais: 'BR' | 'AR'): Promise<IAgencia[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockAgenciasList.filter((a) => a.pais_ativo === pais)
  }

  async addAgencia(agencia: Omit<IAgencia, 'id'>): Promise<IAgencia> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const nova = { ...agencia, id: Math.floor(Math.random() * 100000) }
    mockAgenciasList.push(nova as IAgencia)
    return nova as IAgencia
  }

  async updateAgencia(id: string | number, agencia: Partial<IAgencia>): Promise<IAgencia> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const index = mockAgenciasList.findIndex((a) => a.id.toString() === id.toString())
    if (index > -1) {
      mockAgenciasList[index] = { ...mockAgenciasList[index], ...agencia }
      return mockAgenciasList[index]
    }
    throw new Error('Agência não encontrada no sistema.')
  }

  async deleteAgencia(id: string | number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const hasChildren = mockAgenciasList.some((a) => a.id_agencia_pai?.toString() === id.toString())
    if (hasChildren) {
      throw new Error('Não é possível excluir uma agência que possui sub-agências associadas.')
    }
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

  async reprocessarVoucher(
    id_voucher: string,
    id_agencia: number,
    nome_agencia: string,
  ): Promise<void> {
    const v = mockVouchersData.find((x) => x.voucher_code === id_voucher)
    if (v) {
      v.id_agencia_atual = id_agencia
      v.agencia_atual = nome_agencia
      v.tipo_canal_atual = 'B2C_ATTRIBUTED'
      v.versao_calculo += 1
    }
  }

  async sincronizarCSV(): Promise<void> {
    const pais = Math.random() > 0.5 ? 'BR' : 'AR'
    mockVouchersData.push({
      voucher_code: `V-${Math.floor(Math.random() * 10000)}`,
      voucher_passenger_code: `PA-${Math.floor(Math.random() * 1000)}`,
      agencia_atual: pais === 'BR' ? 'Site BR' : 'Site AR',
      id_agencia_atual: 0,
      status_voucher: 'ISSUED',
      tipo_canal_atual: 'B2C',
      amount_paid: pais === 'BR' ? 3000 : 55000,
      moeda_monto: pais === 'BR' ? 'BRL' : 'ARS',
      versao_calculo: 1,
      pais_ativo: pais,
      data_emissao: new Date().toISOString().split('T')[0],
    })
  }
}

export class ProdutosRepoMock implements IProdutosRepo {
  async getProdutos(pais: 'BR' | 'AR'): Promise<any[]> {
    return pais === 'BR'
      ? [
          { id: 1, nome: 'Pacote Nordeste', preco: 3500 },
          { id: 2, nome: 'Cruzeiro Sul', preco: 4200 },
        ]
      : [{ id: 3, nome: 'Tour Bariloche', preco: 120000 }]
  }
}

export class FinanceiroRepoMock implements IFinanceiroRepo {
  async getDashboardStats(pais: 'BR' | 'AR') {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return pais === 'BR'
      ? { receitaTotal: 1250000.5, vendasMensais: 3450, crescimento: 12.5, moeda: 'BRL' }
      : { receitaTotal: 45000000.0, vendasMensais: 1200, crescimento: 8.2, moeda: 'ARS' }
  }

  async getTransacoes(pais: 'BR' | 'AR'): Promise<any[]> {
    return pais === 'BR'
      ? [
          { id: 'T1', data: '2023-10-01', valor: 500, tipo: 'Entrada' },
          { id: 'T2', data: '2023-10-02', valor: 1200, tipo: 'Entrada' },
        ]
      : [{ id: 'T3', data: '2023-10-01', valor: 15000, tipo: 'Entrada' }]
  }
}
