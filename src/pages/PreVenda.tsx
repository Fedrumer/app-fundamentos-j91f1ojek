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
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Plus, List, Printer } from 'lucide-react'
import { IContratoPreVenda, IExtratoPreVenda } from '@/domain/contracts'
import { PrintWatermark } from '@/components/PrintWatermark'

export default function PreVenda() {
  const { session } = useTenant()
  const { preVendaRepo, agenciasRepo } = useRepositories()
  const { toast } = useToast()

  const [contratos, setContratos] = useState<IContratoPreVenda[]>([])
  const [agencias, setAgencias] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [extrato, setExtrato] = useState<IExtratoPreVenda[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showExtrato, setShowExtrato] = useState<string | null>(null)
  const [extratoLoading, setExtratoLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    id_agencia: '',
    id_produto: '',
    dias_iniciais: 100,
    data_validade: '',
    status: 'ATIVO',
    moeda: 'USD',
  })

  const loadData = async () => {
    if (!session) return
    setIsLoading(true)
    try {
      const [c, ag, pr] = await Promise.all([
        preVendaRepo.getContratos(session.pais_ativo),
        agenciasRepo.getAgencias(session.pais_ativo),
        preVendaRepo.getProdutosLivres(session.pais_ativo),
      ])
      setContratos(c)
      setAgencias(ag)
      setProdutos(pr)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [session?.pais_ativo])

  const handleAdd = async () => {
    if (!session || !formData.id_agencia || !formData.id_produto || !formData.data_validade) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' })
      return
    }
    setIsSaving(true)
    try {
      await preVendaRepo.addContrato({
        id_agencia: formData.id_agencia,
        id_produto: formData.id_produto,
        dias_iniciais: formData.dias_iniciais,
        data_validade: formData.data_validade,
        status: formData.status,
        pais: session.pais_ativo,
        moeda: formData.moeda,
      })
      toast({ title: 'Contrato salvo com sucesso' })
      setShowAdd(false)
      loadData()
    } catch (e: any) {
      toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleVerExtrato = async (id_contrato: string) => {
    setShowExtrato(id_contrato)
    setExtratoLoading(true)
    try {
      const data = await preVendaRepo.getExtrato(id_contrato)
      setExtrato(data)
    } catch (e: any) {
      toast({ title: 'Erro ao carregar extrato', description: e.message, variant: 'destructive' })
    } finally {
      setExtratoLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Pre-venda generally doesn't have a locked state like billing, so we show DRAFT
  const isLocked = false

  return (
    <div className="space-y-6 relative">
      <PrintWatermark locked={isLocked} />

      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pré-Venda</h1>
          <p className="mt-1 text-muted-foreground">Gestão de contratos e consumo de pacotes</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" /> Exportar PDF
          </Button>
          <Button onClick={() => setShowAdd(true)} className="gap-2 shadow-sm font-medium">
            <Plus className="w-4 h-4" /> Novo Contrato
          </Button>
        </div>
      </div>

      <div className="hidden print:block mb-8">
        <h1 className="text-2xl font-bold">Relatório de Contratos de Pré-Venda</h1>
        <p className="text-sm text-slate-600 mt-2">
          <strong>Região:</strong> {session?.pais_ativo === 'BR' ? 'Brasil' : 'Argentina'}
        </p>
      </div>

      <Card className="border-slate-200/60 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 print:hidden">
          <CardTitle className="text-lg">Contratos Ativos ({session?.pais_ativo})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Carregando contratos...</div>
          ) : contratos.length === 0 ? (
            <div className="p-8 text-center text-slate-500 border-2 border-dashed rounded-lg m-4">
              Nenhum contrato de pré-venda encontrado.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="pl-4">Agência</TableHead>
                  <TableHead>Produto Base</TableHead>
                  <TableHead className="text-center">Dias Iniciais</TableHead>
                  <TableHead className="text-center">Dias Consumidos</TableHead>
                  <TableHead className="text-center">Saldo Restante</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-4 text-right print:hidden">Extrato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contratos.map((c) => (
                  <TableRow key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="pl-4 font-medium text-slate-700">
                      {c.agencia_nome}
                    </TableCell>
                    <TableCell className="text-slate-600">{c.produto_nome}</TableCell>
                    <TableCell className="text-center font-mono">{c.dias_iniciais}</TableCell>
                    <TableCell className="text-center font-mono text-slate-500">
                      {c.dias_consumidos}
                    </TableCell>
                    <TableCell className="text-center font-mono font-bold text-emerald-600">
                      {c.dias_iniciais - c.dias_consumidos}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="print:border-black print:text-black">
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-4 text-right print:hidden">
                      <Button variant="ghost" size="sm" onClick={() => handleVerExtrato(c.id)}>
                        <List className="w-4 h-4 sm:mr-1.5" />{' '}
                        <span className="hidden sm:inline">Ver Movimentação</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Contrato de Pré-Venda</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Agência</label>
              <Select
                value={formData.id_agencia}
                onValueChange={(v) => setFormData({ ...formData, id_agencia: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a Agência" />
                </SelectTrigger>
                <SelectContent>
                  {agencias.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.nome_fantasia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Produto</label>
              <Select
                value={formData.id_produto}
                onValueChange={(v) => setFormData({ ...formData, id_produto: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o Produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Quantidade de Dias</label>
              <Input
                type="number"
                min="1"
                value={formData.dias_iniciais}
                onChange={(e) =>
                  setFormData({ ...formData, dias_iniciais: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Data de Validade</label>
              <Input
                type="date"
                value={formData.data_validade}
                onChange={(e) => setFormData({ ...formData, data_validade: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar Contrato'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showExtrato} onOpenChange={(o) => !o && setShowExtrato(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Extrato de Consumo</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {extratoLoading ? (
              <div className="p-8 text-center text-slate-500">Buscando lançamentos...</div>
            ) : extrato.length === 0 ? (
              <div className="p-8 text-center text-slate-500 border border-dashed rounded-lg bg-slate-50">
                Nenhuma movimentação registrada neste contrato.
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0">
                    <TableRow>
                      <TableHead>Data do Movimento</TableHead>
                      <TableHead>Voucher Origem</TableHead>
                      <TableHead className="text-center">Tipo</TableHead>
                      <TableHead className="text-right">Dias Debitados</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extrato.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className="text-slate-600">
                          {new Date(e.data_movimento).toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell className="font-mono text-slate-900">{e.voucher_code}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={
                              e.tipo_movimento === 'CREDITO'
                                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                : 'text-rose-700 bg-rose-50 border-rose-200'
                            }
                          >
                            {e.tipo_movimento}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium text-slate-800">
                          {e.tipo_movimento === 'DEBITO' ? '-' : '+'}
                          {e.dias_consumidos}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
