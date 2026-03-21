import { useEffect, useState } from 'react'
import { useTenant } from '@/contexts/TenantContext'
import { useRepositories } from '@/contexts/RepositoryContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, DollarSign, Package, Ticket, Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

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
  const [recentVouchersCount, setRecentVouchersCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // This effect simulates "Reset Logic: If the pais_ativo is changed, reset active filters/parameters"
  // by refetching data every time the tenant's country changes.
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setStats(null)
    setRecentVouchersCount(null)

    const loadDashboard = async () => {
      if (!session) return
      try {
        const [dashStats, vouchers] = await Promise.all([
          financeiroRepo.getDashboardStats(session.pais_ativo),
          vouchersRepo.getRecentVouchers(session.pais_ativo),
        ])

        if (isMounted) {
          setStats(dashStats)
          setRecentVouchersCount(vouchers.length)
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
          <p className="text-muted-foreground mt-1">
            Olá, <span className="font-semibold text-slate-800">{session.usuario}</span>. Acompanhe
            os resultados da sua região.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
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
        <Card className="shadow-sm border-slate-200/60 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Receita Total</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || !stats ? (
              <Skeleton className="h-8 w-[120px] mb-2" />
            ) : (
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                {formatCurrency(stats.receitaTotal, stats.moeda)}
              </div>
            )}
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {isLoading || !stats ? (
                <Skeleton className="h-4 w-[60px]" />
              ) : (
                <>
                  <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-600 font-medium">+{stats.crescimento}%</span>
                  <span className="ml-1">em relação ao mês passado</span>
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200/60 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Vendas (Mês)</CardTitle>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Package className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || !stats ? (
              <Skeleton className="h-8 w-[80px] mb-2" />
            ) : (
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                +{stats.vendasMensais.toLocaleString()}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Pacotes comercializados</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200/60 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Vouchers Ativos</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Ticket className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || recentVouchersCount === null ? (
              <Skeleton className="h-8 w-[60px] mb-2" />
            ) : (
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                {recentVouchersCount}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Emitidos recentemente</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200/60 transition-all hover:shadow-md bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Nível de Acesso</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary tracking-tight mt-1">
              {session.nivel}
            </div>
            <p className="text-xs text-primary/70 mt-1">
              {session.perfil_admin
                ? 'Acesso irrestrito a configurações globais'
                : 'Permissões restritas à agência local'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="col-span-4 shadow-sm border-slate-200/60 min-h-[300px]">
          <CardHeader>
            <CardTitle className="text-lg">Atividade Recente ({session.pais_ativo})</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-dashed border-slate-300">
              <BarChart3 className="h-8 w-8 text-slate-400" />
            </div>
            <p>O gráfico de evolução será renderizado aqui.</p>
            <p className="text-xs mt-2">
              Dados processados pela camada{' '}
              <span className="font-mono bg-slate-100 px-1 rounded">FinanceiroRepo</span>
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <button className="flex items-center w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-primary/30 transition-all text-left group">
              <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">
                  Emitir Novo Voucher
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Criar cupom para cliente na região {session.pais_ativo}
                </p>
              </div>
            </button>
            <button className="flex items-center w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-primary/30 transition-all text-left group">
              <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">
                  Gerenciar Agências
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
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
