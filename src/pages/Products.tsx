import { useEffect, useState, useCallback } from 'react'
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
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { IProductGroup } from '@/domain/contracts'
import { useFilteredData } from '@/hooks/useFilteredData'
import { GroupRow } from '@/components/products/GroupRow'
import { GroupDialog } from '@/components/products/GroupDialog'
import { useToast } from '@/hooks/use-toast'

export default function Products() {
  const { session } = useTenant()
  const { produtosRepo } = useRepositories()
  const { toast } = useToast()

  const [groups, setGroups] = useState<IProductGroup[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<IProductGroup | null>(null)

  const loadData = useCallback(async () => {
    if (session) {
      try {
        const res = await produtosRepo.getGroups(session.pais_ativo)
        setGroups(res)
      } catch (error) {
        toast({ title: 'Erro ao carregar grupos', variant: 'destructive' })
      }
    }
  }, [session, produtosRepo, toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredGroups = useFilteredData(groups)

  const handleAdd = () => {
    setEditingGroup(null)
    setDialogOpen(true)
  }

  const handleEdit = (group: IProductGroup) => {
    setEditingGroup(group)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string | number) => {
    try {
      await produtosRepo.deleteGroup(id)
      toast({ title: 'Grupo removido com sucesso.' })
      loadData()
    } catch (error: any) {
      toast({ title: 'Falha na exclusão', description: error.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Catálogo de Produtos</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie grupos e variações de produtos para{' '}
            {session?.pais_ativo === 'BR' ? 'o Brasil' : 'a Argentina'}
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2 shadow-sm font-medium">
          <Plus className="h-4 w-4" /> Novo Grupo
        </Button>
      </div>

      <Card className="border-slate-200/60 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg">Grupos de Produtos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[50px] pl-4"></TableHead>
                <TableHead className="h-11">Nome do Grupo</TableHead>
                <TableHead className="h-11">Comissão Máxima</TableHead>
                <TableHead className="h-11">Moeda de Cadastro</TableHead>
                <TableHead className="h-11">Flags / Etiquetas</TableHead>
                <TableHead className="pr-6 h-11 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((group) => (
                <GroupRow
                  key={group.id}
                  group={group}
                  onEdit={() => handleEdit(group)}
                  onDelete={() => handleDelete(group.id)}
                />
              ))}
              {filteredGroups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    Nenhum grupo de produtos cadastrado nesta região.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <GroupDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        group={editingGroup}
        onSaved={loadData}
      />
    </div>
  )
}
