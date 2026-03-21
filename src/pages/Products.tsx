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

export default function Products() {
  const { session } = useTenant()
  const { produtosRepo } = useRepositories()
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    if (session) {
      produtosRepo.getProdutos(session.pais_ativo).then(setData)
    }
  }, [session?.pais_ativo, produtosRepo])

  const formatValue = (v: number) => {
    return new Intl.NumberFormat(session?.moeda_padrao === 'BRL' ? 'pt-BR' : 'es-AR', {
      style: 'currency',
      currency: session?.moeda_padrao || 'USD',
    }).format(v)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Produtos</h1>
        <p className="text-muted-foreground mt-1">
          Catálogo de pacotes e produtos ({session?.pais_ativo})
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Catálogo Base</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nome do Produto</TableHead>
                <TableHead className="text-right">Preço Base ({session?.moeda_padrao})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-slate-500">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell className="font-mono text-right font-semibold">
                    {formatValue(item.preco)}
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
