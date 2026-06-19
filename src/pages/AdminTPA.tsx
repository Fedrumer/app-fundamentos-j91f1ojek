import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useRepositories } from '@/contexts/RepositoryContext'
import { useTenant } from '@/contexts/TenantContext'
import { IProductGroup, ITPA, IParametrosPricing } from '@/domain/contracts'
import { Lock, Loader2, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type TPARow = {
  grupo: IProductGroup
  tpa: ITPA | null
  editando: string
  salvando: boolean
}

type ParamRow = {
  grupo: IProductGroup
  params: IParametrosPricing
  salvando: boolean
}

export default function AdminTPA() {
  const { simulacaoRepo, produtosRepo } = useRepositories()
  const { session } = useTenant()
  const { toast } = useToast()
  const pais = (session?.pais_ativo ?? 'BR') as 'BR' | 'AR'
  const moeda = pais === 'BR' ? 'BRL' : 'USD'

  const [carregando, setCarregando] = useState(true)
  const [tpaRows, setTpaRows] = useState<TPARow[]>([])
  const [paramRows, setParamRows] = useState<ParamRow[]>([])

  const carregar = useCallback(async () => {
    setCarregando(true)
    const [grupos, tpas, params] = await Promise.all([
      produtosRepo.getGroups(pais),
      simulacaoRepo.getTodosTPAs(pais),
      simulacaoRepo.getTodosParametros(pais),
    ])

    setTpaRows(
      grupos.map((g) => ({
        grupo: g,
        tpa: tpas.find((t) => String(t.id_grupo_produto) === String(g.id)) ?? null,
        editando: '',
        salvando: false,
      })),
    )

    const defaultParams = (g: IProductGroup): IParametrosPricing => ({
      id_grupo_produto: g.id,
      pais,
      perc_impostos: 3.5,
      perc_agenciamento: 5.0,
      perc_bonificacoes: 5.0,
      perc_admin: 10.0,
    })

    setParamRows(
      grupos.map((g) => ({
        grupo: g,
        params: params.find((p) => String(p.id_grupo_produto) === String(g.id)) ?? defaultParams(g),
        salvando: false,
      })),
    )

    setCarregando(false)
  }, [pais, produtosRepo, simulacaoRepo])

  useEffect(() => { carregar() }, [carregar])

  const salvarTPA = async (idx: number) => {
    const row = tpaRows[idx]
    const valor = Number(row.editando)
    if (!row.editando || isNaN(valor)) return
    setTpaRows((prev) => prev.map((r, i) => (i === idx ? { ...r, salvando: true } : r)))
    try {
      await simulacaoRepo.saveTPA({
        id_grupo_produto: row.grupo.id,
        pais,
        destino: 'MUNDIAL',
        custo_tpa_diario: valor,
        moeda,
      })
      toast({ title: 'TPA salvo' })
      setTpaRows((prev) =>
        prev.map((r, i) =>
          i === idx
            ? {
                ...r,
                tpa: { id_grupo_produto: row.grupo.id, pais, destino: 'MUNDIAL', custo_tpa_diario: valor, moeda },
                editando: '',
                salvando: false,
              }
            : r,
        ),
      )
    } catch {
      toast({ title: 'Erro ao salvar TPA', variant: 'destructive' })
      setTpaRows((prev) => prev.map((r, i) => (i === idx ? { ...r, salvando: false } : r)))
    }
  }

  const updateParam = (idx: number, field: keyof IParametrosPricing, value: number) => {
    setParamRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, params: { ...r.params, [field]: value } } : r)),
    )
  }

  const salvarParams = async (idx: number) => {
    const row = paramRows[idx]
    setParamRows((prev) => prev.map((r, i) => (i === idx ? { ...r, salvando: true } : r)))
    try {
      await simulacaoRepo.saveParametros(row.params)
      toast({ title: 'Parâmetros salvos' })
    } catch {
      toast({ title: 'Erro ao salvar parâmetros', variant: 'destructive' })
    } finally {
      setParamRows((prev) => prev.map((r, i) => (i === idx ? { ...r, salvando: false } : r)))
    }
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">TPA e Parâmetros de Custo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure o custo de risco diário (TPA) e os percentuais de custo por grupo de produto
          </p>
        </div>
        <Badge
          className={cn(
            'mt-1 shrink-0 px-2.5 py-1 text-sm font-semibold',
            pais === 'BR'
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700',
          )}
        >
          {pais === 'BR' ? '🇧🇷 Brasil' : '🇦🇷 Argentina'}
        </Badge>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Carregando dados…
        </div>
      ) : (
        <Accordion type="multiple" defaultValue={['tpa', 'params']}>

          {/* ── TPA por Grupo ─────────────────────────────────────────────────── */}
          <AccordionItem value="tpa">
            <AccordionTrigger className="text-base font-semibold">
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-slate-400" />
                Custo TPA por Grupo (imutável para cotação)
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grupo de Produto</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead className="text-right">Custo Atual / dia</TableHead>
                        <TableHead>Moeda</TableHead>
                        <TableHead>Novo valor</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tpaRows.map((row, idx) => (
                        <TableRow key={String(row.grupo.id)} className={!row.tpa ? 'bg-red-50/40' : ''}>
                          <TableCell className="font-medium">{row.grupo.nome}</TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {row.tpa?.destino ?? '—'}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {row.tpa ? (
                              row.tpa.custo_tpa_diario.toFixed(4)
                            ) : (
                              <span className="text-red-500 font-medium text-xs">Não configurado</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-slate-500">
                            {row.tpa?.moeda ?? moeda}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.0001"
                              className="h-8 w-32 text-sm font-mono"
                              placeholder="0.0000"
                              value={row.editando}
                              onChange={(e) =>
                                setTpaRows((prev) =>
                                  prev.map((r, i) =>
                                    i === idx ? { ...r, editando: e.target.value } : r,
                                  ),
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!row.editando || row.salvando}
                              onClick={() => salvarTPA(idx)}
                              className="h-8"
                            >
                              {row.salvando ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Save className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ── Parâmetros de Custo por Grupo ────────────────────────────────── */}
          <AccordionItem value="params">
            <AccordionTrigger className="text-base font-semibold">
              Parâmetros de Custo por Grupo (% sobre Net)
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-normal text-slate-400">
                    Valores padrão aplicados quando não há configuração específica: Impostos 3,5% · Agenciamento 5% · Bonificações 5% · Admin 10%
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grupo</TableHead>
                        <TableHead className="text-right">Impostos %</TableHead>
                        <TableHead className="text-right">Agenciamento %</TableHead>
                        <TableHead className="text-right">Bonificações %</TableHead>
                        <TableHead className="text-right">Admin %</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paramRows.map((row, idx) => (
                        <TableRow key={String(row.grupo.id)}>
                          <TableCell className="font-medium">{row.grupo.nome}</TableCell>
                          {(
                            [
                              { field: 'perc_impostos' as const },
                              { field: 'perc_agenciamento' as const },
                              { field: 'perc_bonificacoes' as const },
                              { field: 'perc_admin' as const },
                            ] as const
                          ).map(({ field }) => (
                            <TableCell key={field} className="text-right">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className="h-8 w-20 text-right text-sm font-mono"
                                value={row.params[field]}
                                onChange={(e) => updateParam(idx, field, Number(e.target.value))}
                              />
                            </TableCell>
                          ))}
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={row.salvando}
                              onClick={() => salvarParams(idx)}
                              className="h-8"
                            >
                              {row.salvando ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Save className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )
}
