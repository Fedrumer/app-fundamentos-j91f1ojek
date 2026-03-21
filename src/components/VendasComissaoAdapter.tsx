import React from 'react'
import { IVoucherData, IAgencia, IProductGroup } from '@/domain/contracts'
import { calcularComissaoCascata } from '@/utils/calcularComissaoCascata'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface VendasComissaoAdapterProps {
  voucher: IVoucherData
  cadeia: IAgencia[]
  grupo: IProductGroup
}

export function VendasComissaoAdapter({ voucher, cadeia, grupo }: VendasComissaoAdapterProps) {
  const comissoes = calcularComissaoCascata(voucher, cadeia, grupo)

  if (voucher.tipo_canal_atual === 'B2C') {
    return (
      <div className="rounded-md border p-6 text-center text-sm text-muted-foreground bg-slate-50">
        O canal <span className="font-semibold">B2C</span> não é elegível para cálculo de comissões.
      </div>
    )
  }

  if (comissoes.length === 0) {
    return (
      <div className="rounded-md border p-6 text-center text-sm text-muted-foreground bg-slate-50">
        Nenhuma comissão pôde ser calculada para este voucher com as regras e hierarquia atuais.
      </div>
    )
  }

  const getAgencyName = (id: string | number) => {
    return cadeia.find((a) => a.id.toString() === id.toString())?.nome_fantasia || `Agência #${id}`
  }

  const fmtCurrency = (val: number, cur: string) =>
    new Intl.NumberFormat(cur === 'BRL' ? 'pt-BR' : 'es-AR', {
      style: 'currency',
      currency: cur,
    }).format(val)

  const totalComissao = comissoes.reduce((acc, c) => acc + c.percentual_aplicado, 0)
  const totalValor = comissoes.reduce((acc, c) => acc + c.valor_moeda_nativa, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg bg-slate-50 p-4 border shadow-sm">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-0.5">Valor Base (Moeda Nativa)</p>
          <p className="text-xl font-bold text-slate-900">
            {fmtCurrency(voucher.amount_paid, voucher.moeda_monto)}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-medium text-slate-500 mb-0.5">Regra de Teto ({grupo.nome})</p>
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
            Máximo de {grupo.comissao_maxima}%
          </Badge>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Agência Favorecida</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">% Rateio</TableHead>
              <TableHead className="text-right">Valor Calculado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comissoes.map((c, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-slate-700">
                  {getAgencyName(c.id_agencia_recebedora)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={c.tipo_comissao === 'DIRETA' ? 'default' : 'secondary'}
                    className="text-[10px] uppercase tracking-wider"
                  >
                    {c.tipo_comissao}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {c.percentual_aplicado.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right font-mono text-sm font-medium text-emerald-600">
                  {fmtCurrency(c.valor_moeda_nativa, c.moeda)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t pt-4 px-1 text-sm">
        <span className="font-medium text-slate-600">Total Distribuído:</span>
        <div className="flex items-center gap-6">
          <span className="font-mono font-medium text-slate-600">{totalComissao.toFixed(2)}%</span>
          <span className="font-mono font-bold text-emerald-600">
            {fmtCurrency(totalValor, voucher.moeda_monto)}
          </span>
        </div>
      </div>
    </div>
  )
}
