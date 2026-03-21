import { useEffect, useState, useMemo } from 'react'
import { useTenant } from '@/contexts/TenantContext'
import { useRepositories } from '@/contexts/RepositoryContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  DollarSign,
  Package,
  Ticket,
  Building2,
  Gift,
  FileText,
  AlertTriangle,
  ArrowRightLeft,
  Bell,
  CheckCircle2,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { IDashboardStats, IIngestaoLog, IAlerta } from '@/domain/contracts'

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function Index() {
  const { session } = useTenant()
  const { financeiroRepo } = useRepositories()

  const [stats, setStats] = useState<IDashboardStats | null>(null)
  const [ingestions, setIngestions] = useState<IIngestaoLog[]>([])
  const [alerts, setAlerts] = useState<IAlerta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCurrency, setSelectedCurrency] = useState<string>('')

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    const loadDashboard = async () => {
      if (!session) return
      try {
        const [dashStats, ings, alts] = await Promise.all([
          financeiroRepo.getDashboardCompleto(session.pais_ativo),
          financeiroRepo.getIngestions(session.pais_ativo),
          financeiroRepo.getAlerts(session.pais_ativo),
        ])

        if (isMounted) {
          setStats(dashStats)
          setIngestions(ings)
          setAlerts(alts)

          const availableCurrencies = Object.keys(dashStats.totaisPorMoeda)
          if (availableCurrencies.length > 0) {
            setSelectedCurrency(
              availableCurrencies.includes(session.moeda_padrao)
                ? session.moeda_padrao
                : availableCurrencies[0],
            )
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dashboard', error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [session?.pais_ativo, financeiroRepo, session])

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'es-AR', {
      style: 'currency',
      currency: currency,
    }).format(value)
  }

  const currentTotals = stats?.totaisPorMoeda[selectedCurrency] || {
    amountPaid: 0,
    comissao: 0,
    liquido: 0,
    valoresReceber: 0,
  }

  const filteredLineData = useMemo(() => {
    if (!stats) return []
    return stats.evolucaoDiaria.filter((d) => d.moeda === selectedCurrency)
  }, [stats, selectedCurrency])

  if (!session) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Visão Geral</h1>
          <p className="mt-1 text-muted-foreground">
            Olá, <span className="font-semibold text-slate-800">{session.usuario}</span>. Acompanhe
            os resultados estratégicos.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 rounded-lg border bg-white px-4 py-2 shadow-sm">
            <span className="text-sm font-medium text-slate-500">Região:</span>
            <Badge
              variant={session.pais_ativo === 'BR' ? 'default' : 'outline'}
              className={
                session.pais_ativo === 'BR'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'border-blue-400 text-blue-700'
              }
            >
              {session.pais_ativo === 'BR' ? 'Brasil' : 'Argentina'}
            </Badge>
          </div>
          <div className="flex items-center space-x-2 rounded-lg border bg-white px-2 py-1 shadow-sm">
            <span className="text-sm font-medium text-slate-500 ml-2">Moeda Base:</span>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-[100px] border-none shadow-none focus:ring-0 font-bold text-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stats &&
                  Object.keys(stats.totaisPorMoeda).map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Primary Financial Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Volume Bruto (Base)
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="font-mono text-2xl font-bold text-slate-900">
                {formatCurrency(currentTotals.amountPaid, selectedCurrency)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Total de Amount Paid</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Comissões (Repasse)
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
              <ArrowRightLeft className="h-4 w-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="font-mono text-2xl font-bold text-slate-900">
                {formatCurrency(currentTotals.comissao, selectedCurrency)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Custos c/ versão vigente e estornos
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Líquido Retido</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="font-mono text-2xl font-bold text-slate-900">
                {formatCurrency(currentTotals.liquido, selectedCurrency)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Amount Paid - Comissões</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Valores a Receber</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <FileText className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="font-mono text-2xl font-bold text-slate-900">
                {formatCurrency(currentTotals.valoresReceber, selectedCurrency)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Comissões pendentes de quitação</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Operation Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total de Vouchers</CardTitle>
            <Ticket className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats?.totalVouchers || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Pré-Venda</CardTitle>
            <Package className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats?.totalPreVenda || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Cortesias</CardTitle>
            <Gift className="h-4 w-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats?.totalCortesias || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Agências Ativas</CardTitle>
            <Building2 className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats?.agenciasAtivas || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-5 border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle>Evolução Diária de Vendas ({selectedCurrency})</CardTitle>
            <CardDescription>Valor bruto processado por dia.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : filteredLineData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-500 border border-dashed rounded-lg">
                Sem dados de evolução para esta moeda.
              </div>
            ) : (
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    valor: { label: 'Volume', color: 'hsl(var(--primary))' },
                  }}
                >
                  <LineChart
                    data={filteredLineData}
                    margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="data"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getDate()}/${date.getMonth() + 1}`
                      }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `K ${Math.round(value / 1000)}`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="valor"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      stroke="var(--color-valor)"
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-2 border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle>Distribuição por Canal</CardTitle>
            <CardDescription>B2B vs B2C</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="h-48 w-48 rounded-full" />
              </div>
            ) : (
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    B2B: { label: 'B2B', color: PIE_COLORS[0] },
                    B2C: { label: 'B2C', color: PIE_COLORS[1] },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={stats?.distribuicaoCanal}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats?.distribuicaoCanal.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Operational Tracking */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle>Últimas Ingestões (CSV)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Registros</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-slate-500 py-4">
                      Nenhuma ingestão recente.
                    </TableCell>
                  </TableRow>
                ) : (
                  ingestions.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {new Date(log.data_ingestao).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            log.status === 'SUCESSO'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : log.status === 'PARCIAL'
                                ? 'border-amber-200 bg-amber-50 text-amber-700'
                                : 'border-rose-200 bg-rose-50 text-rose-700'
                          }
                        >
                          {log.status === 'SUCESSO' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <span className="text-slate-900 font-medium">
                          {log.quantidade_registros}
                        </span>
                        {log.quantidade_falhadas > 0 && (
                          <span className="text-rose-500 ml-1 text-xs">
                            (-{log.quantidade_falhadas})
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Alertas e Atenção</CardTitle>
            <Bell className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-4">
              {alerts.length === 0 ? (
                <div className="text-center text-sm text-slate-500 py-8 border border-dashed rounded-lg">
                  Tudo certo! Nenhum alerta crítico.
                </div>
              ) : (
                alerts.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3"
                  >
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-amber-900 leading-tight">
                        {a.tipo === 'CURRENTACCOUNT' && 'Inadimplência Potencial'}
                        {a.tipo === 'DISCREPANCIA' && 'Discrepância de Dados'}
                        {a.tipo === 'INGESTAO' && 'Falha na Ingestão'}
                      </p>
                      <p className="text-xs text-amber-700">{a.mensagem}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
