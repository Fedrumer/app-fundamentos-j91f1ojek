import { useEffect, useState } from 'react'
import { useTenant } from '@/contexts/TenantContext'
import { useRepositories } from '@/contexts/RepositoryContext'
import { Card, CardContent } from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { IContratoPreVenda } from '@/domain/contracts'

export default function Cortesias() {
  const { session } = useTenant()
  const { classificacaoRepo, preVendaRepo } = useRepositories()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState('a-classificar')
  const [vouchers, setVouchers] = useState<any[]>([])
  const [contratos, setContratos] = useState<IContratoPreVenda[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [classifyVoucher, setClassifyVoucher] = useState<any>(null)
  const [tipoNovo, setTipoNovo] = useState('CORTESIA')
  const [motivo, setMotivo] = useState('')
  const [selectedContrato, setSelectedContrato] = useState('')

  const loadData = async () => {
    if (!session) return
    setIsLoading(true)
    try {
      const v = await classificacaoRepo.getVouchersZeroAmount(session.pais_ativo)
      setVouchers(v)
      const c = await preVendaRepo.getContratos(session.pais_ativo)
      setContratos(c)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [session?.pais_ativo])

  const filtered = vouchers.filter((v) => {
    if (activeTab === 'a-classificar')
      return v.tipo_zero_amount === 'ZERO_INDEFINIDO' || !v.tipo_zero_amount
    if (activeTab === 'cortesias') return v.tipo_zero_amount === 'CORTESIA'
    if (activeTab === 'pre-venda') return v.tipo_zero_amount === 'PRE_VENDA'
    return false
  })

  const diasNecessarios = classifyVoucher
    ? classifyVoucher.passageiros_count * classifyVoucher.dias_viagem
    : 0

  const handleSave = async () => {
    if (!classifyVoucher || !session) return
    setIsSaving(true)
    try {
      await classificacaoRepo.reclassificarVoucher(
        classifyVoucher.id,
        classifyVoucher.tipo_zero_amount,
        tipoNovo,
        motivo,
        session.id_usuario,
        tipoNovo === 'PRE_VENDA' ? selectedContrato : undefined,
        tipoNovo === 'PRE_VENDA' ? diasNecessarios : undefined,
      )
      toast({ title: 'Classificação atualizada com sucesso.' })
      setClassifyVoucher(null)
      setMotivo('')
      setSelectedContrato('')
      await loadData()
    } catch (e: any) {
      toast({ title: 'Falha na reclassificação', description: e.message, variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Classificação e Cortesias
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gestão de vouchers emitidos com custo zero na região {session?.pais_ativo}.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="a-classificar">A Classificar</TabsTrigger>
          <TabsTrigger value="cortesias">Cortesias</TabsTrigger>
          <TabsTrigger value="pre-venda">Pré-Venda</TabsTrigger>
        </TabsList>

        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Carregando registros...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-500 border-2 border-dashed rounded-lg m-4">
                Nenhum voucher encontrado para esta aba.
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="pl-4">Voucher</TableHead>
                    <TableHead>Agência</TableHead>
                    <TableHead>Emissão</TableHead>
                    <TableHead className="text-center">Pax</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead className="text-center">Dias</TableHead>
                    <TableHead className="pr-4 text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((v) => (
                    <TableRow key={v.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="pl-4 font-mono">{v.voucher_code}</TableCell>
                      <TableCell className="text-slate-600">{v.agencia}</TableCell>
                      <TableCell className="text-slate-600">{v.data_emissao}</TableCell>
                      <TableCell className="text-center font-medium">
                        {v.passageiros_count}
                      </TableCell>
                      <TableCell className="text-slate-600">{v.destino}</TableCell>
                      <TableCell className="text-slate-600 truncate max-w-[150px]">
                        {v.plano}
                      </TableCell>
                      <TableCell className="text-center font-medium">{v.dias_viagem}</TableCell>
                      <TableCell className="pr-4 text-right">
                        {activeTab === 'a-classificar' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setClassifyVoucher(v)
                              setTipoNovo('CORTESIA')
                              setMotivo('')
                            }}
                          >
                            Classificar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Tabs>

      <Dialog open={!!classifyVoucher} onOpenChange={(o) => !o && setClassifyVoucher(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Classificar Voucher {classifyVoucher?.voucher_code}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tipo de Classificação</label>
              <Select value={tipoNovo} onValueChange={setTipoNovo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CORTESIA">Cortesia</SelectItem>
                  <SelectItem value="PRE_VENDA">Pré-Venda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tipoNovo === 'PRE_VENDA' && (
              <div className="space-y-2 border p-3 rounded-md bg-slate-50">
                <label className="text-sm font-medium">Selecione o Contrato de Pré-Venda</label>
                <Select value={selectedContrato} onValueChange={setSelectedContrato}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Contrato..." />
                  </SelectTrigger>
                  <SelectContent>
                    {contratos
                      .filter((c) => c.status === 'ATIVO')
                      .map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.agencia_nome} - {c.produto_nome} (Saldo:{' '}
                          {c.dias_iniciais - c.dias_consumidos})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Dias consumidos nesta operação:{' '}
                  <strong className="text-slate-900">{diasNecessarios}</strong>
                  <br />
                  (Passageiros: {classifyVoucher?.passageiros_count} × Dias de Viagem:{' '}
                  {classifyVoucher?.dias_viagem})
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Motivo (Obrigatório)</label>
              <Input
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Descreva o motivo da reclassificação..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClassifyVoucher(null)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                isSaving || !motivo.trim() || (tipoNovo === 'PRE_VENDA' && !selectedContrato)
              }
            >
              {isSaving ? 'Salvando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
