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
import { useFilteredData } from '@/hooks/useFilteredData'

export default function Agencies() {
  const { session } = useTenant()
  const { agenciasRepo } = useRepositories()
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    if (session) {
      agenciasRepo.getAgencias(session.pais_ativo).then(setData)
    }
  }, [session?.pais_ativo, agenciasRepo])

  const filteredData = useFilteredData(data)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Agências Parceiras</h1>
        <p className="mt-1 text-muted-foreground">Rede de distribuição ({session?.pais_ativo})</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Agências Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome da Agência</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-muted-foreground">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700"
                    >
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
