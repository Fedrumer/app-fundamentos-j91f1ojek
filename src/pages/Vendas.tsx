import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useFilteredData } from '@/hooks/useFilteredData'
import { useToast } from '@/hooks/use-toast'
import { Edit, RefreshCw } from 'lucide-react'
import { IVoucherData, IAgencia } from '@/domain/contracts'

export default function Vendas() {
  const { session } = useTenant()
  const { vouchersRepo, agenciasRepo } = useRepositories()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  const [vouchers, setVouchers] = useState<IVoucherData[]>([])
  const [agencies, setAgencies] = useState<IAgencia[]>([])
  const [editingVoucher, setEditingVoucher] = useState<IVoucherData | null>(null)
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>('')

  const st = searchParams.get('status') || 'all'
  const ag = searchParams.get('agencia') || 'all'
  const ch = searchParams.get('canal') || 'all'
  const start = searchParams.get('start') || ''
  const end = searchParams.get('end') || ''

  const loadData = async () => {
    if (!session) return
    const [vData, aData] = await Promise.all([
      vouchersRepo.getVouchers(session.pais_ativo),
      agenciasRepo.getAgencias(session.pais_ativo),
    ])
    setVouchers(vData)
    setAgencies(aData)
  }

  useEffect(() => {
    loadData()
  }, [session?.pais_ativo, vouchersRepo, agenciasRepo])

  const filteredData = useFilteredData(vouchers).filter((v) => {
    if (st !== 'all' && v.status_voucher !== st) return false
    if (ag !== 'all' && v.id_agencia_atual.toString() !== ag) return false
    if (ch !== 'all' && v.tipo_canal_atual !== ch) return false
    if (start && v.data_emissao && v.data_emissao < start) return false
    if (end && v.data_emissao && v.data_emissao > end) return false
    return true
  })

  const updateQuery = (key: string, value: string) => {
    if (!value || value === 'all') searchParams.delete(key)
    else searchParams.set(key, value)
    setSearchParams(searchParams)
  }

  const handleSync = async () => {
    await vouchersRepo.sincronizarCSV()
    await loadData()
    toast({ title: 'Sincronização Concluída', description: 'Novos vouchers recebidos.' })
  }

  const handleSaveAgency = async () => {
    if (!editingVoucher || !selectedAgencyId) return
    const agObj = agencies.find((a) => a.id.toString() === selectedAgencyId)
    if (agObj) {
      await vouchersRepo.reprocessarVoucher(
        editingVoucher.voucher_code,
        Number(agObj.id),
        agObj.nome_fantasia,
      )
      await loadData()
      setEditingVoucher(null)
      toast({ title: 'Voucher atualizado', description: 'O voucher foi atribuído e reprocessado.' })
    }
  }

  const fmtCurrency = (val: number, cur: string) =>
    new Intl.NumberFormat(cur === 'BRL' ? 'pt-BR' : 'es-AR', {
      style: 'currency',
      currency: cur,
    }).format(val)
  const getStatus = (s: string) =>
    ({ ISSUED: 'Emitido', USED: 'Utilizado', CANCELLED: 'Cancelado' })[s] || s

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Vendas</h1>
          <p className="mt-1 text-muted-foreground">
            Gestão de vouchers da região {session?.pais_ativo}
          </p>
        </div>
        <Button onClick={handleSync} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Sincronizar Ingestão
        </Button>
      </div>

      <Card className="p-4 border-slate-200/60 shadow-sm flex flex-wrap gap-4 items-end bg-white">
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-slate-500">Status</label>
          <Select value={st} onValueChange={(v) => updateQuery('status', v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ISSUED">Emitido</SelectItem>
              <SelectItem value="USED">Utilizado</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-slate-500">Agência</label>
          <Select value={ag} onValueChange={(v) => updateQuery('agencia', v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Agência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {agencies.map((a) => (
                <SelectItem key={a.id} value={a.id.toString()}>
                  {a.nome_fantasia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-slate-500">Canal</label>
          <Select value={ch} onValueChange={(v) => updateQuery('canal', v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="B2B">B2B</SelectItem>
              <SelectItem value="B2C">B2C</SelectItem>
              <SelectItem value="B2C_ATTRIBUTED">B2C Atribuído</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-slate-500">Período Início</label>
          <Input
            type="date"
            value={start}
            onChange={(e) => updateQuery('start', e.target.value)}
            className="w-[140px]"
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-slate-500">Período Fim</label>
          <Input
            type="date"
            value={end}
            onChange={(e) => updateQuery('end', e.target.value)}
            className="w-[140px]"
          />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voucher</TableHead>
                <TableHead>Pax</TableHead>
                <TableHead>Agência</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((v) => (
                <TableRow key={v.voucher_code}>
                  <TableCell className="font-mono">{v.voucher_code}</TableCell>
                  <TableCell>{v.voucher_passenger_code}</TableCell>
                  <TableCell>{v.agencia_atual}</TableCell>
                  <TableCell>
                    <Badge variant={v.status_voucher === 'ISSUED' ? 'default' : 'secondary'}>
                      {getStatus(v.status_voucher)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {v.tipo_canal_atual}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {fmtCurrency(v.amount_paid, v.moeda_monto)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={v.tipo_canal_atual !== 'B2C'}
                      onClick={() => setEditingVoucher(v)}
                      className={
                        v.tipo_canal_atual === 'B2C'
                          ? 'border-primary text-primary hover:bg-primary/5'
                          : ''
                      }
                    >
                      <Edit className="h-4 w-4 mr-1.5" /> Editar Agência
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingVoucher} onOpenChange={(o) => !o && setEditingVoucher(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Agência (B2C)</DialogTitle>
            <DialogDescription>Voucher: {editingVoucher?.voucher_code}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Selecione a Agência Parceira</label>
            <Select value={selectedAgencyId} onValueChange={setSelectedAgencyId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {agencies.map((a) => (
                  <SelectItem key={a.id} value={a.id.toString()}>
                    {a.nome_fantasia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingVoucher(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAgency}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
