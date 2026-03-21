import { useEffect, useState } from 'react'
import { useTenant } from '@/contexts/TenantContext'
import { useRepositories } from '@/contexts/RepositoryContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowUpRight,
  DollarSign,
  Package,
  Ticket,
  Users,
  BarChart3,
  Building2,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useFilteredData } from '@/hooks/useFilteredData'

interface DashboardStats {
  receitaTotal: number
  vendasMensais: number
  crescimento: number
  moeda: string
}

export default function Index() {
  const { session } = useTenant()
  const { financeiroRepo, vouchersRepo } = useRepositories()

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentVouchers, setRecentVouchers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const filteredVouchers = useFilteredData(recentVouchers)
  const recentVouchersCount = filteredVouchers.length

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setStats(null)
    setRecentVouchers([])

    const loadDashboard = async () => {
      if (!session) return
      try {
        const [dashStats, vouchers] = await Promise.all([
          financeiroRepo.getDashboardStats(session.pais_ativo),
          vouchersRepo.getRecentVouchers(session.pais_ativo),
        ])

        if (isMounted) {
          setStats(dashStats)
          setRecentVouchers(vouchers)
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
  }, [session?.pais_ativo, financeiroRepo, vouchersRepo, session])

  if (!session) return null

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'es-AR', {
      style: 'currency',
      currency: currency,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Visão Geral</h1>
          <p className="mt-1 text-muted-foreground">
            Olá, <span className="font-semibold text-slate-800">{session.usuario}</span>. Acompanhe
            os resultados da sua região.
          </p>
        </div>
        <div className="flex items-center space-x-2 rounded-lg border bg-white px-4 py-2 shadow-sm">
          <span className="text-sm font-medium text-slate-500">Contexto Atual:</span>
          <Badge variant="secondary" className="font-mono text-xs">
            AG-{session.id_agencia}
          </Badge>
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200/60 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Receita Total</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || !stats ? (
              <Skeleton className="mb-2 h-8 w-[120px]" />
            ) : (
              <div className="font-mono text-2xl font-bold tracking-tight text-slate-900">
                {formatCurrency(stats.receitaTotal, stats.moeda)}
              </div>
            )}
            <p className="mt-1 flex items-center text-xs text-muted-foreground">
              {isLoading || !stats ? (
                <Skeleton className="h-4 w-[60px]" />
              ) : (
                <>
                  <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                  <span className="font-medium text-emerald-600">+{stats.crescimento}%</span>
                  <span className="ml-1">em relação ao mês passado</span>
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Vendas (Mês)</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
              <Package className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || !stats ? (
              <Skeleton className="mb-2 h-8 w-[80px]" />
            ) : (
              <div className="font-mono text-2xl font-bold tracking-tight text-slate-900">
                +{stats.vendasMensais.toLocaleString()}
              </div>
            )}
            <p className="mt-1 text-xs text-muted-foreground">Pacotes comercializados</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Vouchers Ativos</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <Ticket className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="mb-2 h-8 w-[60px]" />
            ) : (
              <div className="font-mono text-2xl font-bold tracking-tight text-slate-900">
                {recentVouchersCount}
              </div>
            )}
            <p className="mt-1 text-xs text-muted-foreground">Emitidos recentemente</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 border-slate-200/60 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Nível de Acesso</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-1 text-xl font-bold tracking-tight text-primary">
              {session.nivel}
            </div>
            <p className="mt-1 text-xs text-primary/70">
              {session.perfil_admin
                ? 'Acesso irrestrito a configurações globais'
                : 'Permissões restritas à agência local'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 min-h-[300px] border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Atividade Recente ({session.pais_ativo})</CardTitle>
          </CardHeader>
          <CardContent className="flex h-[200px] flex-col items-center justify-center text-muted-foreground">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-100">
              <BarChart3 className="h-8 w-8 text-slate-400" />
            </div>
            <p>O gráfico de evolução será renderizado aqui.</p>
            <p className="mt-2 text-xs">
              Dados processados pela camada{' '}
              <span className="rounded bg-slate-100 px-1 font-mono">FinanceiroRepo</span>
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <button className="group flex w-full items-center rounded-lg border border-slate-200 p-3 text-left transition-all hover:border-primary/30 hover:bg-slate-50">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 transition-colors group-hover:text-primary">
                  Emitir Novo Voucher
                </h4>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Criar cupom para cliente na região {session.pais_ativo}
                </p>
              </div>
            </button>
            <button className="group flex w-full items-center rounded-lg border border-slate-200 p-3 text-left transition-all hover:border-primary/30 hover:bg-slate-50">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 transition-colors group-hover:text-primary">
                  Gerenciar Agências
                </h4>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Ver rede local de distribuição
                </p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
