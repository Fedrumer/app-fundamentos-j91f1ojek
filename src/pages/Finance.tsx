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

export default function Finance() {
  const { session } = useTenant()
  const { financeiroRepo } = useRepositories()
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    if (session) {
      financeiroRepo.getTransacoes(session.pais_ativo).then(setData)
    }
  }, [session?.pais_ativo, financeiroRepo])

  const formatValue = (v: number) => {
    return new Intl.NumberFormat(session?.moeda_padrao === 'BRL' ? 'pt-BR' : 'es-AR', {
      style: 'currency',
      currency: session?.moeda_padrao || 'USD',
    }).format(v)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financeiro</h1>
        <p className="text-muted-foreground mt-1">
          Transações financeiras locais ({session?.pais_ativo})
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Extrato de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.id}</TableCell>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      {item.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-right font-medium text-emerald-700">
                    +{formatValue(item.valor)}
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
