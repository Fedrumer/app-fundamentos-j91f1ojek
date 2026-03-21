import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IProductGroup } from '@/domain/contracts'
import { useRepositories } from '@/contexts/RepositoryContext'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'

interface GroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group: IProductGroup | null
  onSaved: () => void
}

export function GroupDialog({ open, onOpenChange, group, onSaved }: GroupDialogProps) {
  const { produtosRepo } = useRepositories()
  const { session } = useTenant()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [nome, setNome] = useState('')
  const [comissao, setComissao] = useState<number | ''>('')
  const [moeda, setMoeda] = useState('')
  const [flags, setFlags] = useState('')

  useEffect(() => {
    if (open) {
      if (group) {
        setNome(group.nome)
        setComissao(group.comissao_maxima)
        setMoeda(group.moeda_cadastro)
        setFlags(group.flags.join(', '))
      } else {
        setNome('')
        setComissao('')
        setMoeda(session?.moeda_padrao || 'USD')
        setFlags('')
      }
    }
  }, [open, group, session?.moeda_padrao])

  const handleSave = async () => {
    if (!nome || comissao === '' || !moeda || !session) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })
      return
    }

    try {
      setLoading(true)
      const data = {
        nome,
        comissao_maxima: Number(comissao),
        moeda_cadastro: moeda,
        flags: flags
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean),
        pais_ativo: session.pais_ativo,
      }

      if (group) {
        await produtosRepo.updateGroup(group.id, data)
        toast({ title: 'Grupo atualizado com sucesso' })
      } else {
        await produtosRepo.addGroup(data)
        toast({ title: 'Novo grupo criado com sucesso' })
      }
      onSaved()
      onOpenChange(false)
    } catch (error: any) {
      toast({ title: 'Erro ao salvar grupo', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{group ? 'Editar Grupo de Produtos' : 'Novo Grupo de Produtos'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Nome do Grupo</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Cruzeiros Nacionais"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Comissão Máxima (%)</Label>
              <Input
                type="number"
                value={comissao}
                onChange={(e) => setComissao(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 15"
              />
            </div>
            <div className="grid gap-2">
              <Label>Moeda de Cadastro</Label>
              <Select value={moeda} onValueChange={setMoeda} disabled={!!group}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - Dólar</SelectItem>
                  <SelectItem value="BRL">BRL - Real</SelectItem>
                  <SelectItem value="ARS">ARS - Peso Arg.</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Flags (separadas por vírgula)</Label>
            <Input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="Ex: Destaque, Promoção, Marítimo"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
