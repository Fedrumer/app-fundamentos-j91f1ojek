import { useEffect, useState, useMemo } from 'react'
import { useTenant } from '@/contexts/TenantContext'
import { useRepositories } from '@/contexts/RepositoryContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { IAgencia, ILancamentoFaturamento } from '@/domain/contracts'
import { CheckCircle2, Wallet, Receipt } from 'lucide-react'

export default function Receivables() {
  const { session } = useTenant()
  const { financeiroRepo, agenciasRepo } = useRepositories()
  const { toast } = useToast()

  const [agencies, setAgencies] = useState<IAgencia[]>([])
  const [selectedAgency, setSelectedAgency] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [selectedMoeda, setSelectedMoeda] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('PENDENTE')

  const [lancamentos, setLancamentos] = useState<ILancamentoFaturamento[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadData = async () => {
    if (!session) return
    setIsLoading(true)
    try {
      const ags = await agenciasRepo.getAgencias(session.pais_ativo)
      setAgencies(ags)

      const data = await financeiroRepo.getLancamentosVigentes(session.pais_ativo, {
        id_agencia: selectedAgency === 'all' ? undefined : selectedAgency,
        periodo: selectedPeriod || undefined,
        moeda: selectedMoeda === 'all' ? undefined : selectedMoeda,
        status_quitacao: selectedStatus === 'all' ? undefined : selectedStatus,
      })
      setLancamentos(data)
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [
    session?.pais_ativo,
    selectedAgency,
    selectedPeriod,
    selectedMoeda,
    selectedStatus,
    agenciasRepo,
    financeiroRepo,
  ])

  // Group by voucher
  const groupedVouchers = useMemo(() => {
    const map = new Map<string, any>()
    lancamentos.forEach((l) => {
      if (l.tipo_lancamento === 'ESTORNO') return // Ignorar estornos na visão agrupada de quitação

      const key = l.id_voucher
      if (!map.has(key)) {
        map.set(key, {
          id_voucher: l.id_voucher,
          voucher_code: l.voucher_code,
          versao_calculo: l.versao_calculo,
          agencias: new Set<string>(),
          valor_bruto: l.valor_bruto,
          comissao: 0,
          moeda: l.moeda,
          status_quitacao: 'QUITADO',
          is_estorno: false,
        })
      }
      const g = map.get(key)
      g.agencias.add(l.agencia_recebedora_nome)
      g.comissao += l.comissao
      if (l.status_quitacao === 'PENDENTE') g.status_quitacao = 'PENDENTE'
    })

    return Array.from(map.values()).map((g) => ({
      ...g,
      agencias: Array.from(g.agencias).join(', '),
    }))
  }, [lancamentos])

  const totais = useMemo(() => {
    const res: Record<string, { pendente: number; quitado: number }> = {}
    lancamentos.forEach((l) => {
      if (l.tipo_lancamento === 'ESTORNO') return
      if (!res[l.moeda]) res[l.moeda] = { pendente: 0, quitado: 0 }
      if (l.status_quitacao === 'PENDENTE') res[l.moeda].pendente += l.comissao
      else res[l.moeda].quitado += l.comissao
    })
    return res
  }, [lancamentos])

  const handleQuitarVoucher = async (id_voucher: string) => {
    try {
      await financeiroRepo.quitarLancamentosPorVoucher(id_voucher)
      toast({ title: 'Voucher quitado com sucesso.' })
      await loadData()
    } catch (error: any) {
      toast({ title: 'Falha na quitação', description: error.message, variant: 'destructive' })
    }
  }

  const formatCurrency = (val: number, cur: string) => {
    return new Intl.NumberFormat(cur === 'BRL' ? 'pt-BR' : 'es-AR', {
      style: 'currency',
      currency: cur,
    }).format(val)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Valores a Receber</h1>
          <p className="mt-1 text-muted-foreground">
            Gestão de contas a receber e quitação de vouchers pendentes ({session?.pais_ativo})
          </p>
        </div>
      </div>

      <Card className="p-4 border-slate-200/60 shadow-sm flex flex-wrap gap-6 items-end bg-white">
        <div className="grid gap-1.5 w-full sm:w-[240px]">
          <label className="text-xs font-medium text-slate-500">Agência Parceira</label>
          <Select value={selectedAgency} onValueChange={setSelectedAgency}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as Agências" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Agências</SelectItem>
              {agencies.map((a) => (
                <SelectItem key={a.id} value={a.id.toString()}>
                  {a.nome_fantasia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5 w-full sm:w-[160px]">
          <label className="text-xs font-medium text-slate-500">Período</label>
          <Input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5 w-full sm:w-[140px]">
          <label className="text-xs font-medium text-slate-500">Moeda</label>
          <Select value={selectedMoeda} onValueChange={setSelectedMoeda}>
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="BRL">BRL</SelectItem>
              <SelectItem value="ARS">ARS</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5 w-full sm:w-[140px]">
          <label className="text-xs font-medium text-slate-500">Status</label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="PENDENTE">Pendente</SelectItem>
              <SelectItem value="QUITADO">Quitado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(totais).map(([moeda, valores]) => (
          <Card key={moeda} className="border-slate-200/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total {moeda}</CardTitle>
              <Wallet className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(valores.pendente, moeda)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Pendente de recebimento</p>
              <div className="text-sm font-medium text-slate-500 mt-2">
                Quitado: {formatCurrency(valores.quitado, moeda)}
              </div>
            </CardContent>
          </Card>
        ))}
        {Object.keys(totais).length === 0 && (
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Resumo</CardTitle>
              <Receipt className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">R$ 0,00</div>
              <p className="text-xs text-muted-foreground mt-1">Sem valores pendentes</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comissões a Receber (Por Voucher)</CardTitle>
          <CardDescription>
            Listagem da maior versão vigente. A quitação é feita em lote para todas as comissões do
            voucher.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-32 flex items-center justify-center text-slate-500">
              Carregando dados...
            </div>
          ) : groupedVouchers.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-slate-500 border-2 border-dashed rounded-lg">
              Nenhum valor pendente ou quitado para os filtros selecionados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voucher (V.)</TableHead>
                  <TableHead>Agências (Cascata)</TableHead>
                  <TableHead className="text-right">Base Bruta</TableHead>
                  <TableHead className="text-right">Comissões (Soma)</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedVouchers.map((g) => (
                  <TableRow key={g.id_voucher}>
                    <TableCell className="font-mono">
                      {g.voucher_code}{' '}
                      <span className="text-xs text-slate-400">v{g.versao_calculo}</span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 truncate max-w-[200px]">
                      {g.agencias}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-slate-600">
                      {formatCurrency(g.valor_bruto, g.moeda)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-slate-900">
                      {formatCurrency(g.comissao, g.moeda)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          g.status_quitacao === 'QUITADO'
                            ? 'border-blue-200 text-blue-700 bg-blue-50'
                            : 'border-amber-200 text-amber-700 bg-amber-50'
                        }`}
                      >
                        {g.status_quitacao}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={g.status_quitacao === 'QUITADO'}
                        onClick={() => handleQuitarVoucher(g.id_voucher)}
                        className={
                          g.status_quitacao === 'QUITADO'
                            ? 'opacity-50 cursor-not-allowed'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
                        }
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        {g.status_quitacao === 'QUITADO' ? 'Resolvido' : 'Quitar Voucher'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
