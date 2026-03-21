import { useEffect, useState } from 'react'
import { useTenant } from '@/contexts/TenantContext'
import { useRepositories } from '@/contexts/RepositoryContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function Vouchers() {
  const { session } = useTenant()
  const { vouchersRepo } = useRepositories()
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    if (session) {
      vouchersRepo.getVouchers(session.pais_ativo).then(setData)
    }
  }, [session?.pais_ativo, vouchersRepo])

  const formatValue = (v: number) => {
    return new Intl.NumberFormat(session?.moeda_padrao === 'BRL' ? 'pt-BR' : 'es-AR', {
      style: 'currency',
      currency: session?.moeda_padrao || 'USD',
    }).format(v)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Vouchers</h1>
        <p className="text-muted-foreground mt-1">
          Cupons emitidos no país ativo ({session?.pais_ativo})
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Controle de Vouchers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cód. Voucher</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono font-medium">{item.id}</TableCell>
                  <TableCell>{item.cliente}</TableCell>
                  <TableCell className="font-mono text-right">{formatValue(item.valor)}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Emitido' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
