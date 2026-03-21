import { useState } from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { IProductGroup } from '@/domain/contracts'
import { VariationsSubTable } from './VariationsSubTable'

interface GroupRowProps {
  group: IProductGroup
  onEdit: () => void
  onDelete: () => void
}

export function GroupRow({ group, onEdit, onDelete }: GroupRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <TableRow className="group hover:bg-slate-50/60 transition-colors">
        <TableCell className="w-[50px] pl-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-primary"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </TableCell>
        <TableCell className="font-medium text-slate-900">{group.nome}</TableCell>
        <TableCell className="font-mono font-medium text-indigo-600">
          {group.comissao_maxima}%
        </TableCell>
        <TableCell>
          <Badge variant="outline" className="font-mono font-semibold bg-slate-50">
            {group.moeda_cadastro}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {group.flags.map((f) => (
              <Badge key={f} variant="secondary" className="text-xs font-normal">
                {f}
              </Badge>
            ))}
            {group.flags.length === 0 && <span className="text-slate-400 text-sm">-</span>}
          </div>
        </TableCell>
        <TableCell className="text-right pr-4 opacity-40 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 mr-1 hover:text-primary"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteOpen(true)}
            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-0">
          <TableCell colSpan={6} className="p-0">
            <VariationsSubTable group={group} />
          </TableCell>
        </TableRow>
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Grupo de Produtos?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o grupo <strong>{group.nome}</strong>? Esta ação
              removerá também todas as variações associadas a ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setDeleteOpen(false)
                onDelete()
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir Tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
