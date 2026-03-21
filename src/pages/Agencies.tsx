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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useFilteredData } from '@/hooks/useFilteredData'
import { IAgencia } from '@/domain/contracts'
import { AgencyForm } from '@/components/agencies/AgencyForm'
import { useToast } from '@/hooks/use-toast'

export default function Agencies() {
  const { session } = useTenant()
  const { agenciasRepo } = useRepositories()
  const { toast } = useToast()

  const [data, setData] = useState<IAgencia[]>([])
  const [isFormOpen, setFormOpen] = useState(false)
  const [editingAgency, setEditingAgency] = useState<IAgencia | null>(null)
  const [deleteId, setDeleteId] = useState<string | number | null>(null)

  const loadData = useCallback(async () => {
    if (session) {
      const res = await agenciasRepo.getAgencias(session.pais_ativo)
      setData(res)
    }
  }, [session, agenciasRepo])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredData = useFilteredData(data)

  const handleAdd = () => {
    setEditingAgency(null)
    setFormOpen(true)
  }

  const handleEdit = (item: IAgencia) => {
    setEditingAgency(item)
    setFormOpen(true)
  }

  const handleDeleteClick = (id: string | number) => setDeleteId(id)

  const handleSave = async (agencyData: Partial<IAgencia>) => {
    try {
      if (editingAgency) {
        await agenciasRepo.updateAgencia(editingAgency.id, agencyData)
        toast({ title: 'Agência atualizada com sucesso.' })
      } else {
        await agenciasRepo.addAgencia(agencyData as Omit<IAgencia, 'id'>)
        toast({ title: 'Nova agência cadastrada com sucesso.' })
      }
      setFormOpen(false)
      loadData()
    } catch (error: any) {
      toast({
        title: 'Falha ao salvar agência',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await agenciasRepo.deleteAgencia(deleteId)
      toast({ title: 'Agência removida permanentemente.' })
      setDeleteId(null)
      loadData()
    } catch (error: any) {
      toast({ title: 'Erro de exclusão', description: error.message, variant: 'destructive' })
    }
  }

  const getParentName = (parentId?: string | number | null) => {
    if (!parentId) return '-'
    const p = data.find((a) => a.id.toString() === parentId.toString())
    return p ? p.nome_fantasia : '-'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Agências Parceiras</h1>
          <p className="mt-1 text-muted-foreground">
            Gerenciamento da rede de distribuição para{' '}
            {session?.pais_ativo === 'BR' ? 'o Brasil' : 'a Argentina'}
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2 shadow-sm font-medium">
          <Plus className="h-4 w-4" /> Adicionar Agência
        </Button>
      </div>

      <Card className="border-slate-200/60 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg">Estrutura Hierárquica de Vendas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="pl-6 h-11">Nome Fantasia</TableHead>
                <TableHead className="h-11">Nível</TableHead>
                <TableHead className="h-11">Agência Pai</TableHead>
                <TableHead className="h-11 text-right">Comissão</TableHead>
                <TableHead className="h-11 text-center">Moeda</TableHead>
                <TableHead className="pr-6 h-11 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/80 transition-colors">
                  <TableCell className="pl-6 font-medium text-slate-800">
                    {item.nome_fantasia}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="font-mono text-xs bg-slate-100 text-slate-700 border-slate-200"
                    >
                      Nível {item.nivel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {getParentName(item.id_agencia_pai)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold text-emerald-600">
                    {item.comissao}%
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-sm">
                      {item.moeda}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 text-right opacity-40 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                      className="hover:text-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(item.id)}
                      className="hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    Nenhuma agência encontrada para esta região.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AgencyForm
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        agency={editingAgency}
        agencies={data}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Agência Definitivamente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá completamente o registro da agência do sistema e não poderá ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
