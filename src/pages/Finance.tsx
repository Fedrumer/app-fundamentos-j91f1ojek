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
import { Checkbox } from '@/components/ui/checkbox'
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
import { Lock, FileText, CheckCircle2, DollarSign, Printer } from 'lucide-react'
import { PrintWatermark } from '@/components/PrintWatermark'

export default function Finance() {
  const { session } = useTenant()
  const { financeiroRepo, agenciasRepo } = useRepositories()
  const { toast } = useToast()

  const [agencies, setAgencies] = useState<IAgencia[]>([])
  const [selectedAgency, setSelectedAgency] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [showEstornos, setShowEstornos] = useState(true)
  const [lancamentos, setLancamentos] = useState<ILancamentoFaturamento[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLocking, setIsLocking] = useState(false)

  const loadData = async () => {
    if (!session) return
    setIsLoading(true)
    try {
      const ags = await agenciasRepo.getAgencias(session.pais_ativo)
      setAgencies(ags)

      if (selectedAgency && selectedPeriod) {
        const data = await financeiroRepo.getLancamentosVigentes(session.pais_ativo, {
          id_agencia: selectedAgency,
          periodo: selectedPeriod,
        })
        setLancamentos(data)
      } else {
        setLancamentos([])
      }
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [session?.pais_ativo, selectedAgency, selectedPeriod, agenciasRepo, financeiroRepo])

  const filteredLancamentos = useMemo(() => {
    return lancamentos.filter((l) => (showEstornos ? true : l.tipo_lancamento !== 'ESTORNO'))
  }, [lancamentos, showEstornos])

  const totais = useMemo(() => {
    return filteredLancamentos.reduce(
      (acc, l) => ({
        bruto: acc.bruto + (l.valor_bruto || 0),
        comissao: acc.comissao + (l.comissao || 0),
        count: acc.count + 1,
        moeda: l.moeda || acc.moeda,
      }),
      { bruto: 0, comissao: 0, count: 0, moeda: session?.moeda_padrao || 'USD' },
    )
  }, [filteredLancamentos, session?.moeda_padrao])

  const lancamentosNaoTravados = filteredLancamentos.filter((l) => !l.fatura_travada)
  const isAllLocked = lancamentos.length > 0 && lancamentosNaoTravados.length === 0

  const handleTravarFatura = async () => {
    if (!selectedAgency || !selectedPeriod) return
    if (lancamentosNaoTravados.length === 0) {
      toast({ title: 'Sem lançamentos pendentes para travar.' })
      return
    }

    setIsLocking(true)
    try {
      const ids = lancamentosNaoTravados.map((l) => l.id)
      await financeiroRepo.travarFatura(session!.pais_ativo, selectedAgency, selectedPeriod, ids)
      toast({ title: 'Fatura travada com sucesso', description: `${ids.length} itens vinculados.` })
      await loadData()
    } catch (error: any) {
      toast({ title: 'Falha ao travar fatura', description: error.message, variant: 'destructive' })
    } finally {
      setIsLocking(false)
    }
  }

  const handleQuitar = async (id: string) => {
    try {
      await financeiroRepo.quitarLancamento(id)
      toast({ title: 'Lançamento marcado como quitado.' })
      await loadData()
    } catch (error: any) {
      toast({ title: 'Falha na quitação', description: error.message, variant: 'destructive' })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const formatCurrency = (val: number, cur: string) => {
    return new Intl.NumberFormat(cur === 'BRL' ? 'pt-BR' : 'es-AR', {
      style: 'currency',
      currency: cur,
    }).format(val)
  }

  return (
    <div className="space-y-6 relative">
      <PrintWatermark locked={isAllLocked} />

      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Faturamento</h1>
          <p className="mt-1 text-muted-foreground">
            Gestão financeira e fechamento de comissões ({session?.pais_ativo})
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" /> Exportar PDF
          </Button>
          <Button
            onClick={handleTravarFatura}
            disabled={
              !selectedAgency || !selectedPeriod || lancamentosNaoTravados.length === 0 || isLocking
            }
            className="gap-2 shadow-sm font-medium bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Lock className="h-4 w-4" /> Travar Fatura
          </Button>
        </div>
      </div>

      <Card className="p-4 border-slate-200/60 shadow-sm flex flex-wrap gap-6 items-end bg-white print:hidden">
        <div className="grid gap-1.5 w-full sm:w-[280px]">
          <label className="text-xs font-medium text-slate-500">Agência Parceira</label>
          <Select value={selectedAgency} onValueChange={setSelectedAgency}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a Agência" />
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
        <div className="grid gap-1.5 w-full sm:w-[180px]">
          <label className="text-xs font-medium text-slate-500">Período de Apuração</label>
          <Input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 pb-2">
          <Checkbox
            id="estornos"
            checked={showEstornos}
            onCheckedChange={(c) => setShowEstornos(!!c)}
          />
          <label
            htmlFor="estornos"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Exibir Estornos
          </label>
        </div>
      </Card>

      {/* Header visível apenas na impressão */}
      <div className="hidden print:block mb-8">
        <h1 className="text-2xl font-bold">Relatório de Faturamento</h1>
        <div className="text-sm text-slate-600 mt-2">
          <p>
            <strong>Agência:</strong>{' '}
            {agencies.find((a) => a.id.toString() === selectedAgency)?.nome_fantasia || '-'}
          </p>
          <p>
            <strong>Período:</strong> {selectedPeriod}
          </p>
          <p>
            <strong>Status do Lote:</strong>{' '}
            {isAllLocked ? 'FECHADO E TRAVADO' : 'RASCUNHO / ABERTO'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total de Comissões</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(totais.comissao, totais.moeda)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Valor líquido a pagar/receber</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Volume Bruto Base</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(totais.bruto, totais.moeda)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Soma do valor base dos vouchers</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Lançamentos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totais.count}</div>
            <p className="text-xs text-muted-foreground mt-1 print:hidden">
              Itens vigentes no período ({lancamentosNaoTravados.length} destravados)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="print:hidden">
          <CardTitle>Detalhamento</CardTitle>
          <CardDescription>
            Exibindo apenas os lançamentos mais recentes (vigentes) de cada voucher.
          </CardDescription>
        </CardHeader>
        <CardContent className="print:p-0">
          {isLoading ? (
            <div className="h-32 flex items-center justify-center text-slate-500">
              Carregando dados financeiros...
            </div>
          ) : filteredLancamentos.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-slate-500 border-2 border-dashed rounded-lg">
              Nenhum lançamento encontrado para os filtros selecionados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voucher (V.)</TableHead>
                  <TableHead>Agência</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Base Bruta</TableHead>
                  <TableHead className="text-right">Taxa</TableHead>
                  <TableHead className="text-right">Comissão</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right print:hidden">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLancamentos.map((l) => (
                  <TableRow
                    key={l.id}
                    className={l.tipo_lancamento === 'ESTORNO' ? 'bg-red-50/30' : ''}
                  >
                    <TableCell className="font-mono">
                      {l.voucher_code}{' '}
                      <span className="text-xs text-slate-400">v{l.versao_calculo}</span>
                    </TableCell>
                    <TableCell>
                      {l.agencia_recebedora_nome}
                      <div className="text-[10px] text-slate-500">{l.tipo_comissao}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          l.tipo_lancamento === 'ESTORNO'
                            ? 'border-red-200 text-red-700 bg-red-50 print:border-black print:text-black print:bg-transparent'
                            : 'border-emerald-200 text-emerald-700 bg-emerald-50 print:border-black print:text-black print:bg-transparent'
                        }
                      >
                        {l.tipo_lancamento}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-slate-600">
                      {formatCurrency(l.valor_bruto, l.moeda)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {l.percentual_aplicado}%
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-slate-900">
                      {formatCurrency(l.comissao, l.moeda)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col gap-1 items-center">
                        {l.fatura_travada ? (
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-600 text-[10px] print:border-black print:bg-transparent"
                          >
                            <Lock className="w-3 h-3 mr-1 print:hidden" /> Travado
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] border-slate-200 text-slate-500 print:border-black print:bg-transparent print:text-black"
                          >
                            Aberto
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            l.status_quitacao === 'QUITADO'
                              ? 'border-blue-200 text-blue-700 bg-blue-50'
                              : 'border-amber-200 text-amber-700 bg-amber-50'
                          } print:border-black print:bg-transparent print:text-black`}
                        >
                          {l.status_quitacao || 'PENDENTE'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right print:hidden">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={l.status_quitacao === 'QUITADO'}
                        onClick={() => handleQuitar(l.id)}
                        className={
                          l.status_quitacao === 'QUITADO'
                            ? 'opacity-50 cursor-not-allowed'
                            : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                        }
                      >
                        {l.status_quitacao === 'QUITADO' ? 'Resolvido' : 'Quitar'}
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
