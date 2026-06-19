import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { useRepositories } from '@/contexts/RepositoryContext'
import { useTenant } from '@/contexts/TenantContext'
import { ICampanha } from '@/domain/contracts'
import { Plus, Pencil, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const campanhaVazia = (pais: 'BR' | 'AR'): Omit<ICampanha, 'id'> => ({
  nome: '',
  pais,
  tipo: 'DESCONTO_PERCENTUAL',
  percentual: 0,
  condicao_pagamento: 'TRANSFERENCIA_DEPOSITO',
  id_grupo_produto: null,
  ativo: true,
  data_inicio: null,
  data_fim: null,
})

export default function AdminCampanhas() {
  const { simulacaoRepo } = useRepositories()
  const { session } = useTenant()
  const { toast } = useToast()
  const pais = session?.pais_ativo ?? 'BR'

  const [campanhas, setCampanhas] = useState<ICampanha[]>([])
  const [carregando, setCarregando] = useState(true)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState<Omit<ICampanha, 'id'> & { id?: string }>(campanhaVazia(pais))

  const carregar = useCallback(async () => {
    setCarregando(true)
    const lista = await simulacaoRepo.getCampanhasAdmin(pais)
    setCampanhas(lista)
    setCarregando(false)
  }, [simulacaoRepo, pais])

  useEffect(() => { carregar() }, [carregar])

  const abrirNova = () => {
    setForm(campanhaVazia(pais))
    setDialogAberto(true)
  }

  const abrirEditar = (c: ICampanha) => {
    setForm({ ...c })
    setDialogAberto(true)
  }

  const salvar = async () => {
    if (!form.nome.trim()) return
    setSalvando(true)
    try {
      await simulacaoRepo.salvarCampanha(form)
      toast({ title: form.id ? 'Campanha atualizada' : 'Campanha criada' })
      setDialogAberto(false)
      carregar()
    } catch {
      toast({ title: 'Erro ao salvar campanha', variant: 'destructive' })
    } finally {
      setSalvando(false)
    }
  }

  const alternarAtivo = async (id: string, ativo: boolean) => {
    await simulacaoRepo.toggleCampanha(id, ativo)
    setCampanhas((prev) => prev.map((c) => (c.id === id ? { ...c, ativo } : c)))
  }

  if (!session?.perfil_admin) {
    return (
      <div className="flex h-40 items-center justify-center text-slate-400 text-sm">
        Acesso restrito a administradores.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestão de Campanhas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Campanhas de desconto e promoções aplicadas no Simulador de Cotação
          </p>
        </div>
        <Button onClick={abrirNova}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Campanha
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Campanhas — {pais === 'BR' ? '🇧🇷 Brasil' : '🇦🇷 Argentina'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {carregando ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando…
            </div>
          ) : campanhas.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-400">Nenhuma campanha cadastrada</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Desconto</TableHead>
                  <TableHead>Condição</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead className="text-center">Ativo</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {campanhas.map((c) => (
                  <TableRow key={c.id} className={!c.ativo ? 'opacity-50' : ''}>
                    <TableCell className="font-medium">{c.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {c.tipo === 'DESCONTO_PERCENTUAL' ? 'Desconto %' : '2x1'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {c.tipo === 'DESCONTO_PERCENTUAL' ? `${c.percentual}%` : '—'}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {c.condicao_pagamento.replace('_', ' ')}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">
                      {c.data_inicio && c.data_fim
                        ? `${c.data_inicio} → ${c.data_fim}`
                        : c.data_inicio
                        ? `A partir de ${c.data_inicio}`
                        : 'Sem prazo'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={c.ativo}
                        onCheckedChange={(v) => alternarAtivo(c.id, v)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => abrirEditar(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog: Nova / Editar Campanha */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.id ? 'Editar Campanha' : 'Nova Campanha'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input
                autoFocus
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                placeholder="Ex: 20% Desconto Depósito"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select
                  value={form.tipo}
                  onValueChange={(v) => setForm((f) => ({ ...f, tipo: v as ICampanha['tipo'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DESCONTO_PERCENTUAL">Desconto Percentual</SelectItem>
                    <SelectItem value="2X1">2x1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Desconto (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.percentual}
                  onChange={(e) => setForm((f) => ({ ...f, percentual: Number(e.target.value) }))}
                  disabled={form.tipo === '2X1'}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Condição de Pagamento</Label>
              <Select
                value={form.condicao_pagamento}
                onValueChange={(v) => setForm((f) => ({ ...f, condicao_pagamento: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRANSFERENCIA_DEPOSITO">Transferência / Depósito</SelectItem>
                  <SelectItem value="QUALQUER">Qualquer forma de pagamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Data início</Label>
                <Input
                  type="date"
                  value={form.data_inicio ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, data_inicio: e.target.value || null }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Data fim</Label>
                <Input
                  type="date"
                  value={form.data_fim ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, data_fim: e.target.value || null }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.ativo}
                onCheckedChange={(v) => setForm((f) => ({ ...f, ativo: v }))}
              />
              <Label>Campanha ativa</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogAberto(false)}>Cancelar</Button>
            <Button onClick={salvar} disabled={!form.nome.trim() || salvando}>
              {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {form.id ? 'Salvar alterações' : 'Criar campanha'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
