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
import { IProductGroup, IProductVariation } from '@/domain/contracts'
import { useRepositories } from '@/contexts/RepositoryContext'
import { useToast } from '@/hooks/use-toast'

interface VariationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group: IProductGroup
  variation: IProductVariation | null
  onSaved: () => void
}

export function VariationDialog({
  open,
  onOpenChange,
  group,
  variation,
  onSaved,
}: VariationDialogProps) {
  const { produtosRepo } = useRepositories()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [nome, setNome] = useState('')
  const [destino, setDestino] = useState('')
  const [faixaEtaria, setFaixaEtaria] = useState('')
  const [preco, setPreco] = useState<number | ''>('')

  useEffect(() => {
    if (open) {
      if (variation) {
        setNome(variation.nome)
        setDestino(variation.destino)
        setFaixaEtaria(variation.faixa_etaria)
        setPreco(variation.preco)
      } else {
        setNome('')
        setDestino('')
        setFaixaEtaria('')
        setPreco('')
      }
    }
  }, [open, variation])

  const handleSave = async () => {
    if (!nome || !destino || !faixaEtaria || preco === '') {
      toast({ title: 'Preencha todos os campos obrigatórios', variant: 'destructive' })
      return
    }

    try {
      setLoading(true)
      const data = {
        id_grupo: group.id,
        nome,
        destino,
        faixa_etaria: faixaEtaria,
        preco: Number(preco),
      }

      if (variation) {
        await produtosRepo.updateVariation(variation.id, data)
        toast({ title: 'Variação atualizada com sucesso' })
      } else {
        await produtosRepo.addVariation(data)
        toast({ title: 'Nova variação adicionada' })
      }
      onSaved()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar variação',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{variation ? 'Editar Variação' : 'Nova Variação de Produto'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Nome do Produto / Variação</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Plano Plus"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Destino</Label>
              <Input
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Ex: Europa"
              />
            </div>
            <div className="grid gap-2">
              <Label>Faixa Etária</Label>
              <Input
                value={faixaEtaria}
                onChange={(e) => setFaixaEtaria(e.target.value)}
                placeholder="Ex: 0-65"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Preço Base ({group.moeda_cadastro})</Label>
            <Input
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0.00"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Valor registrado e travado na moeda {group.moeda_cadastro}. Sem conversão automática
              no frontend.
            </p>
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
