import {
  IAgenciasRepo,
  IFinanceiroRepo,
  IProdutosRepo,
  ITenantSession,
  IUsersRepo,
  IVouchersRepo,
} from '@/domain/contracts'

export class UsersRepoMock implements IUsersRepo {
  async login(email: string, senha: string, pais?: 'BR' | 'AR'): Promise<ITenantSession> {
    await new Promise((resolve) => setTimeout(resolve, 600)) // Fake delay

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
  async getAgencias(pais: 'BR' | 'AR'): Promise<any[]> {
    return pais === 'BR'
      ? [
          { id: 101, nome: 'Agência São Paulo', status: 'Ativa' },
          { id: 102, nome: 'Agência Rio', status: 'Ativa' },
        ]
      : [{ id: 202, nome: 'Agencia Buenos Aires', status: 'Ativa' }]
  }
}

export class VouchersRepoMock implements IVouchersRepo {
  async getVouchers(pais: 'BR' | 'AR'): Promise<any[]> {
    return pais === 'BR'
      ? [
          { id: 'V-1001', cliente: 'Pedro', valor: 1500, status: 'Emitido' },
          { id: 'V-1002', cliente: 'Ana', valor: 2300, status: 'Usado' },
        ]
      : [{ id: 'V-2001', cliente: 'Diego', valor: 45000, status: 'Emitido' }]
  }

  async getRecentVouchers(pais: 'BR' | 'AR'): Promise<any[]> {
    return this.getVouchers(pais)
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
    if (pais === 'BR') {
      return { receitaTotal: 1250000.5, vendasMensais: 3450, crescimento: 12.5, moeda: 'BRL' }
    } else {
      return { receitaTotal: 45000000.0, vendasMensais: 1200, crescimento: 8.2, moeda: 'ARS' }
    }
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
