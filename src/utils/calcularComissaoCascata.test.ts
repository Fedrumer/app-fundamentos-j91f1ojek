import { describe, it, expect } from 'vitest'
import { calcularComissaoCascata } from './calcularComissaoCascata'
import { IVoucherData, IAgencia, IProductGroup } from '@/domain/contracts'

const mockVoucher = (overrides?: Partial<IVoucherData>): IVoucherData => ({
  voucher_code: 'TEST-001',
  id_agencia_atual: '10',
  tipo_canal_atual: 'B2B',
  amount_paid: 1000,
  moeda_monto: 'BRL',
  pais_ativo: 'BR',
  id_contrato: null,
  ...overrides,
})

const mockGrupo = (comissao_maxima = 20): IProductGroup => ({
  id: 'g1',
  nome: 'Grupo Teste',
  comissao_maxima,
  pais: 'BR',
})

const agenciaDireta: IAgencia = {
  id: '10',
  nome_fantasia: 'Agência SP',
  comissao: 10,
  id_agencia_pai: null,
  pais: 'BR',
  tipo_canal: 'B2B',
}

const agenciaMatriz: IAgencia = {
  id: '1',
  nome_fantasia: 'Matriz',
  comissao: 15,
  id_agencia_pai: null,
  pais: 'BR',
  tipo_canal: 'B2B',
}

const agenciaFilial: IAgencia = {
  id: '10',
  nome_fantasia: 'Filial',
  comissao: 8,
  id_agencia_pai: '1',
  pais: 'BR',
  tipo_canal: 'B2B',
}

describe('calcularComissaoCascata', () => {
  it('B2C retorna zero comissão', () => {
    const result = calcularComissaoCascata(
      mockVoucher({ tipo_canal_atual: 'B2C' }),
      [agenciaDireta],
      mockGrupo(),
    )
    expect(result).toHaveLength(0)
  })

  it('comissão direta simples', () => {
    const result = calcularComissaoCascata(mockVoucher(), [agenciaDireta], mockGrupo())
    expect(result).toHaveLength(1)
    expect(result[0].tipo_comissao).toBe('DIRETA')
    expect(result[0].percentual_aplicado).toBe(10)
    expect(result[0].valor_moeda_nativa).toBe(100) // 10% de 1000
  })

  it('cascata 2 níveis: filial 8% + matriz 15% = direta 8% + indireta 7%', () => {
    const result = calcularComissaoCascata(
      mockVoucher({ id_agencia_atual: '10' }),
      [agenciaFilial, agenciaMatriz],
      mockGrupo(20),
    )
    expect(result).toHaveLength(2)
    const direta = result.find((r) => r.tipo_comissao === 'DIRETA')
    const indireta = result.find((r) => r.tipo_comissao === 'INDIRETA')
    expect(direta?.percentual_aplicado).toBe(8)
    expect(indireta?.percentual_aplicado).toBe(7) // 15 - 8
    expect(direta!.valor_moeda_nativa + indireta!.valor_moeda_nativa).toBeCloseTo(150) // 15% de 1000
  })

  it('teto comissao_maxima é respeitado', () => {
    const result = calcularComissaoCascata(
      mockVoucher(),
      [agenciaDireta], // 10% comissão
      mockGrupo(5), // teto de 5%
    )
    expect(result[0].percentual_aplicado).toBe(5)
    expect(result[0].valor_moeda_nativa).toBe(50)
  })

  it('agência sem pai = apenas comissão direta', () => {
    const result = calcularComissaoCascata(mockVoucher(), [agenciaDireta], mockGrupo(20))
    expect(result).toHaveLength(1)
  })

  it('agência não encontrada = retorna vazio', () => {
    const result = calcularComissaoCascata(
      mockVoucher({ id_agencia_atual: '999' }),
      [agenciaDireta],
      mockGrupo(),
    )
    expect(result).toHaveLength(0)
  })
})
