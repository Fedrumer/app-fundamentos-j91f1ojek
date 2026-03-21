import { useEffect, useState, useCallback } from 'react'
import { useRepositories } from '@/contexts/RepositoryContext'
import { IProductGroup, IProductVariation } from '@/domain/contracts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { VariationDialog } from './VariationDialog'
import { useToast } from '@/hooks/use-toast'

export function VariationsSubTable({ group }: { group: IProductGroup }) {
  const { produtosRepo } = useRepositories()
  const { toast } = useToast()
  const [variations, setVariations] = useState<IProductVariation[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingVar, setEditingVar] = useState<IProductVariation | null>(null)
  const [deleteId, setDeleteId] = useState<string | number | null>(null)

  const loadData = useCallback(async () => {
    try {
      const res = await produtosRepo.getVariations(group.id)
      setVariations(res)
    } catch (error) {
      console.error('Erro ao carregar variações', error)
    }
  }, [produtosRepo, group.id])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAdd = () => {
    setEditingVar(null)
    setDialogOpen(true)
  }

  const handleEdit = (v: IProductVariation) => {
    setEditingVar(v)
    setDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      await produtosRepo.deleteVariation(deleteId)
      toast({ title: 'Variação removida com sucesso' })
      loadData()
    } catch (error: any) {
      toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' })
    } finally {
      setDeleteId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: group.moeda_cadastro,
    }).format(price)
  }

  return (
    <div className="space-y-3 p-4 bg-slate-50 border-t border-b shadow-inner">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-700">Variações Cadastradas</h4>
        <Button size="sm" variant="outline" onClick={handleAdd} className="h-8 gap-1 bg-white">
          <Plus className="h-3.5 w-3.5" /> Adicionar Variação
        </Button>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="h-10 text-xs">Produto</TableHead>
              <TableHead className="h-10 text-xs">Destino</TableHead>
              <TableHead className="h-10 text-xs">Faixa Etária</TableHead>
              <TableHead className="h-10 text-xs text-right">
                Preço ({group.moeda_cadastro})
              </TableHead>
              <TableHead className="h-10 w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variations.map((v) => (
              <TableRow key={v.id} className="hover:bg-slate-50 transition-colors">
                <TableCell className="py-2 text-sm font-medium">{v.nome}</TableCell>
                <TableCell className="py-2 text-sm">{v.destino}</TableCell>
                <TableCell className="py-2 text-sm">{v.faixa_etaria}</TableCell>
                <TableCell className="py-2 text-sm text-right font-mono font-semibold text-emerald-600">
                  {formatPrice(v.preco)}
                </TableCell>
                <TableCell className="py-2 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleEdit(v)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600 hover:bg-red-50"
                    onClick={() => setDeleteId(v.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {variations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-20 text-center text-sm text-muted-foreground">
                  Nenhuma variação encontrada neste grupo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <VariationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        group={group}
        variation={editingVar}
        onSaved={loadData}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Variação?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta variação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
