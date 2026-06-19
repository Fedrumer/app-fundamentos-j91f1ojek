import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRepositories } from '@/contexts/RepositoryContext'
import { useTenant } from '@/contexts/TenantContext'
import {
  IProductGroup,
  IProductVariation,
  IAgencia,
  IParametrosPricing,
  ICampanha,
  IResultadoSimulacao,
  FormaCobranca,
  ProviderGC,
} from '@/domain/contracts'
import { calcularSimulacaoCotacao } from '@/utils/calcularSimulacaoCotacao'
import PropostaComercial from '@/components/PropostaComercial'
import {
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  FileText,
  Lock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

// ─── Tipos locais ────────────────────────────────────────────────────────────

interface LinhaSimulacaoForm {
  id: number
  id_grupo: string
  id_variacao: string
  id_agencia: string
  tipo_canal: string
  pv_unitario: string
  quantidade_pax: string
  dias: string
  forma_cobranca: FormaCobranca
  perc_gift_card: string
  provider_gc: ProviderGC
  campanhas_ativas: string[]
}

interface LinhaSimulacaoResultado {
  form: LinhaSimulacaoForm
  grupo: IProductGroup
  variacao: IProductVariation
  agencia: IAgencia
  resultado: IResultadoSimulacao
}

const FORMAS_COBRANCA: { value: FormaCobranca; label: string; perc: string }[] = [
  { value: 'DEPOSITO', label: 'Transferência/Depósito', perc: '0%' },
  { value: '1X_CARTAO', label: '1x Cartão', perc: '5,31%' },
  { value: '2X_CARTAO', label: '2x Cartão', perc: '17,77%' },
  { value: '3X_CARTAO', label: '3x Cartão', perc: '22,01%' },
]

function criarLinhaVazia(id: number): LinhaSimulacaoForm {
  return {
    id,
    id_grupo: '',
    id_variacao: '',
    id_agencia: '',
    tipo_canal: 'B2B',
    pv_unitario: '',
    quantidade_pax: '1',
    dias: '10',
    forma_cobranca: 'DEPOSITO',
    perc_gift_card: '0',
    provider_gc: null,
    campanhas_ativas: [],
  }
}

function formatMoeda(valor: number, moeda: string) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: moeda === 'BRL' ? 'BRL' : moeda === 'ARS' ? 'ARS' : 'USD',
    minimumFractionDigits: 2,
  })
}

function formatPerc(v: number) {
  return `${v.toFixed(1)}%`
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function Simulador() {
  const { simulacaoRepo, produtosRepo, agenciasRepo } = useRepositories()
  const { session } = useTenant()
  const pais = session?.pais_ativo ?? 'BR'
  const moeda = pais === 'BR' ? 'BRL' : 'USD'

  const [grupos, setGrupos] = useState<IProductGroup[]>([])
  const [variacoesPorGrupo, setVariacoesPorGrupo] = useState<
    Record<string, IProductVariation[]>
  >({})
  const [agencias, setAgencias] = useState<IAgencia[]>([])
  const [campanhas, setCampanhas] = useState<ICampanha[]>([])
  const [parametrosPorGrupo, setParametrosPorGrupo] = useState<
    Record<string, IParametrosPricing>
  >({})

  const [linhas, setLinhas] = useState<LinhaSimulacaoForm[]>([criarLinhaVazia(1)])
  const [resultados, setResultados] = useState<LinhaSimulacaoResultado[]>([])
  const [mostrarProposta, setMostrarProposta] = useState(false)
  const [calculando, setCalculando] = useState(false)

  // ── Carga inicial ──────────────────────────────────────────────────────────
  useEffect(() => {
    produtosRepo.getGroups(pais).then(setGrupos)
    agenciasRepo.getAgencias(pais).then(setAgencias)
    simulacaoRepo.getCampanhas(pais).then(setCampanhas)
  }, [pais, produtosRepo, agenciasRepo, simulacaoRepo])

  const carregarVariacoes = useCallback(
    async (id_grupo: string, linhaId: number) => {
      if (!id_grupo) return
      if (!variacoesPorGrupo[id_grupo]) {
        const vars = await produtosRepo.getVariations(id_grupo)
        setVariacoesPorGrupo((prev) => ({ ...prev, [id_grupo]: vars }))
      }
      const params = await simulacaoRepo.getParametros(id_grupo, pais)
      if (params) {
        setParametrosPorGrupo((prev) => ({ ...prev, [id_grupo]: params }))
      }
      // Pré-preencher PV com primeiro preço disponível
      setLinhas((prev) =>
        prev.map((l) => {
          if (l.id !== linhaId || l.id_grupo !== id_grupo) return l
          const vars = variacoesPorGrupo[id_grupo] ?? []
          const primeiraVar = vars[0]
          return {
            ...l,
            pv_unitario: primeiraVar ? String(primeiraVar.preco) : l.pv_unitario,
          }
        }),
      )
    },
    [pais, produtosRepo, simulacaoRepo, variacoesPorGrupo],
  )

  const aoMudarVariacao = (linhaId: number, id_variacao: string, id_grupo: string) => {
    const vars = variacoesPorGrupo[id_grupo] ?? []
    const variacao = vars.find((v) => String(v.id) === id_variacao)
    setLinhas((prev) =>
      prev.map((l) => {
        if (l.id !== linhaId) return l
        return {
          ...l,
          id_variacao,
          pv_unitario: variacao ? String(variacao.preco) : l.pv_unitario,
        }
      }),
    )
  }

  const atualizarLinha = (id: number, campo: Partial<LinhaSimulacaoForm>) => {
    setLinhas((prev) => prev.map((l) => (l.id === id ? { ...l, ...campo } : l)))
  }

  const adicionarLinha = () => {
    const novoId = Math.max(...linhas.map((l) => l.id)) + 1
    setLinhas((prev) => [...prev, criarLinhaVazia(novoId)])
  }

  const removerLinha = (id: number) => {
    if (linhas.length === 1) return
    setLinhas((prev) => prev.filter((l) => l.id !== id))
    setResultados((prev) => prev.filter((r) => r.form.id !== id))
  }

  // ── Calcular ───────────────────────────────────────────────────────────────
  const calcular = async () => {
    setCalculando(true)
    try {
      const novosResultados: LinhaSimulacaoResultado[] = []

      for (const linha of linhas) {
        if (!linha.id_grupo || !linha.id_variacao || !linha.id_agencia) continue

        const grupo = grupos.find((g) => String(g.id) === linha.id_grupo)
        if (!grupo) continue

        const vars = variacoesPorGrupo[linha.id_grupo] ?? []
        const variacao = vars.find((v) => String(v.id) === linha.id_variacao)
        if (!variacao) continue

        const agencia = agencias.find((a) => String(a.id) === linha.id_agencia)
        if (!agencia) continue

        const tpaData = await simulacaoRepo.getTPA(linha.id_grupo, pais, variacao.destino)
        const tpa_diario = tpaData?.custo_tpa_diario ?? 0

        const parametros = parametrosPorGrupo[linha.id_grupo] ?? {
          id_grupo_produto: linha.id_grupo,
          pais,
          perc_impostos: 3.5,
          perc_agenciamento: 5.0,
          perc_bonificacoes: 5.0,
          perc_admin: 10.0,
        }

        const input = {
          pais,
          id_grupo: linha.id_grupo,
          id_variacao: linha.id_variacao,
          id_agencia: linha.id_agencia,
          tipo_canal: linha.tipo_canal,
          pv_unitario: Number(linha.pv_unitario) || 0,
          quantidade_pax: Number(linha.quantidade_pax) || 1,
          dias: Number(linha.dias) || 1,
          forma_cobranca: linha.forma_cobranca,
          perc_gift_card: Number(linha.perc_gift_card) || 0,
          provider_gc: linha.provider_gc,
          campanhas_ativas: linha.campanhas_ativas,
          parametros,
          tpa_diario,
          moeda,
        }

        const resultado = calcularSimulacaoCotacao(input, agencias, grupo, campanhas)

        novosResultados.push({ form: linha, grupo, variacao, agencia, resultado })
      }

      setResultados(novosResultados)
    } finally {
      setCalculando(false)
    }
  }

  const salvarParametros = async (id_grupo: string) => {
    const params = parametrosPorGrupo[id_grupo]
    if (!params) return
    const salvos = await simulacaoRepo.saveParametros(params)
    setParametrosPorGrupo((prev) => ({ ...prev, [id_grupo]: salvos }))
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Simulador de Cotação</h1>
          <p className="text-sm text-slate-500">Motor de cotação — Now Assistance</p>
        </div>
        {resultados.length > 0 && (
          <Button onClick={() => setMostrarProposta(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Gerar Proposta Parceiro
          </Button>
        )}
      </div>

      {/* ── Linhas de simulação ─────────────────────────────────────────── */}
      {linhas.map((linha, idx) => (
        <Card key={linha.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Produto {idx + 1}
              </CardTitle>
              {linhas.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removerLinha(linha.id)}
                  className="h-7 w-7 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Linha 1: Grupo / Variação / Agência / Canal */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="space-y-1.5">
                <Label>Grupo/Produto</Label>
                <Select
                  value={linha.id_grupo}
                  onValueChange={(v) => {
                    atualizarLinha(linha.id, { id_grupo: v, id_variacao: '' })
                    carregarVariacoes(v, linha.id)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar…" />
                  </SelectTrigger>
                  <SelectContent>
                    {grupos.map((g) => (
                      <SelectItem key={String(g.id)} value={String(g.id)}>
                        {g.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Variação (destino + faixa)</Label>
                <Select
                  value={linha.id_variacao}
                  onValueChange={(v) => aoMudarVariacao(linha.id, v, linha.id_grupo)}
                  disabled={!linha.id_grupo}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar…" />
                  </SelectTrigger>
                  <SelectContent>
                    {(variacoesPorGrupo[linha.id_grupo] ?? []).map((v) => (
                      <SelectItem key={String(v.id)} value={String(v.id)}>
                        {v.destino} · {v.faixa_etaria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Agência Parceira</Label>
                <Select
                  value={linha.id_agencia}
                  onValueChange={(v) => atualizarLinha(linha.id, { id_agencia: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar…" />
                  </SelectTrigger>
                  <SelectContent>
                    {agencias.map((a) => (
                      <SelectItem key={String(a.id)} value={String(a.id)}>
                        {a.nome_fantasia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Canal</Label>
                <Select
                  value={linha.tipo_canal}
                  onValueChange={(v) => atualizarLinha(linha.id, { tipo_canal: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2B">B2B</SelectItem>
                    <SelectItem value="B2C">B2C (sem comissão)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Linha 2: PV / Pax / Dias */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="space-y-1.5">
                <Label>PV Unitário ({moeda})</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={linha.pv_unitario}
                  onChange={(e) => atualizarLinha(linha.id, { pv_unitario: e.target.value })}
                  placeholder="0,00"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Qtd Passageiros</Label>
                <Input
                  type="number"
                  min="1"
                  value={linha.quantidade_pax}
                  onChange={(e) => atualizarLinha(linha.id, { quantidade_pax: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Dias de Cobertura</Label>
                <Input
                  type="number"
                  min="1"
                  value={linha.dias}
                  onChange={(e) => atualizarLinha(linha.id, { dias: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Forma de Cobrança</Label>
                <Select
                  value={linha.forma_cobranca}
                  onValueChange={(v) =>
                    atualizarLinha(linha.id, { forma_cobranca: v as FormaCobranca })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMAS_COBRANCA.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label} ({f.perc})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Linha 3: Gift Card / Provider */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="space-y-1.5">
                <Label>Gift Card extra (%)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={linha.perc_gift_card}
                  onChange={(e) => atualizarLinha(linha.id, { perc_gift_card: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Provider GC</Label>
                <Select
                  value={linha.provider_gc ?? 'NENHUM'}
                  onValueChange={(v) =>
                    atualizarLinha(linha.id, {
                      provider_gc: v === 'NENHUM' ? null : (v as ProviderGC),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NENHUM">Nenhum</SelectItem>
                    <SelectItem value="PAGO24">Pago24 (2,42%)</SelectItem>
                    <SelectItem value="NUBI">Nubi (6,05%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Campanhas */}
            {campanhas.length > 0 && (
              <div className="space-y-1.5">
                <Label>Campanhas Disponíveis</Label>
                <div className="flex flex-wrap gap-2">
                  {campanhas
                    .filter(
                      (c) =>
                        !c.id_grupo_produto ||
                        String(c.id_grupo_produto) === linha.id_grupo,
                    )
                    .map((c) => {
                      const ativa = linha.campanhas_ativas.includes(c.id)
                      const bloqueada =
                        c.condicao_pagamento === 'TRANSFERENCIA_DEPOSITO' &&
                        linha.forma_cobranca !== 'DEPOSITO'
                      return (
                        <button
                          key={c.id}
                          type="button"
                          disabled={bloqueada}
                          onClick={() => {
                            if (bloqueada) return
                            atualizarLinha(linha.id, {
                              campanhas_ativas: ativa
                                ? linha.campanhas_ativas.filter((id) => id !== c.id)
                                : [...linha.campanhas_ativas, c.id],
                            })
                          }}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                            bloqueada
                              ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300'
                              : ativa
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-400 hover:text-emerald-600'
                          }`}
                        >
                          {ativa ? '✓ ' : ''}{c.nome}
                          {bloqueada && ' (só depósito)'}
                        </button>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Parâmetros de custo */}
            {linha.id_grupo && parametrosPorGrupo[linha.id_grupo] && (
              <Accordion type="single" collapsible>
                <AccordionItem value="params" className="border-0">
                  <AccordionTrigger className="py-2 text-sm text-slate-600 hover:no-underline">
                    Parâmetros de Custo (editáveis)
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 pt-2">
                      {(
                        [
                          { field: 'perc_impostos', label: 'Impostos (% Net)', default: 3.5 },
                          { field: 'perc_agenciamento', label: 'Agenciamento (% Net)', default: 5.0 },
                          { field: 'perc_bonificacoes', label: 'Bonificações (% Net)', default: 5.0 },
                          { field: 'perc_admin', label: 'Admin (% Net)', default: 10.0 },
                        ] as const
                      ).map(({ field, label }) => (
                        <div key={field} className="space-y-1">
                          <Label className="text-xs">{label}</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={parametrosPorGrupo[linha.id_grupo][field]}
                            onChange={(e) =>
                              setParametrosPorGrupo((prev) => ({
                                ...prev,
                                [linha.id_grupo]: {
                                  ...prev[linha.id_grupo],
                                  [field]: Number(e.target.value),
                                },
                              }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => salvarParametros(linha.id_grupo)}
                    >
                      Salvar parâmetros para este grupo
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Botões */}
      <div className="flex items-center gap-3">
        <Button onClick={calcular} disabled={calculando} className="px-8">
          {calculando ? 'Calculando…' : 'Calcular Margem'}
        </Button>
        <Button variant="outline" onClick={adicionarLinha}>
          <Plus className="mr-1.5 h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>

      {/* ── Resultados ──────────────────────────────────────────────────── */}
      {resultados.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Resultado da Simulação</h2>

          {resultados.map((r, idx) => (
            <ResultadoCard key={r.form.id} resultado={r} indice={idx + 1} moeda={moeda} />
          ))}

          {/* Resumo multi-produto */}
          {resultados.length > 1 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Resumo Comparativo</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-xs text-slate-500">
                      <th className="pb-2 text-left font-medium">Produto</th>
                      <th className="pb-2 text-right font-medium">Bruto</th>
                      <th className="pb-2 text-right font-medium">Comissão</th>
                      <th className="pb-2 text-right font-medium">Net</th>
                      <th className="pb-2 text-right font-medium">Custos</th>
                      <th className="pb-2 text-right font-medium">Margem</th>
                      <th className="pb-2 text-right font-medium">% s/Bruto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((r) => (
                      <tr key={r.form.id} className="border-b last:border-0">
                        <td className="py-2 font-medium">{r.grupo.nome}</td>
                        <td className="py-2 text-right">{formatMoeda(r.resultado.bruto_final, moeda)}</td>
                        <td className="py-2 text-right">{formatMoeda(r.resultado.comissao_total, moeda)}</td>
                        <td className="py-2 text-right">{formatMoeda(r.resultado.net, moeda)}</td>
                        <td className="py-2 text-right">{formatMoeda(r.resultado.total_custos, moeda)}</td>
                        <td className="py-2 text-right font-semibold">
                          {formatMoeda(r.resultado.margem_valor, moeda)}
                        </td>
                        <td className="py-2 text-right">
                          <GuardrailBadge
                            guardrail={r.resultado.guardrail}
                            perc={r.resultado.margem_percentual}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ── Proposta Comercial ──────────────────────────────────────────── */}
      {mostrarProposta && (
        <PropostaComercial
          linhas={resultados.map((r) => ({
            grupo: r.grupo,
            variacao: r.variacao,
            agencia: r.agencia,
            resultado: r.resultado,
            dias: Number(r.form.dias),
            quantidade_pax: Number(r.form.quantidade_pax),
          }))}
          onClose={() => setMostrarProposta(false)}
        />
      )}
    </div>
  )
}

// ─── Card de resultado por produto ──────────────────────────────────────────

function ResultadoCard({
  resultado,
  indice,
  moeda,
}: {
  resultado: LinhaSimulacaoResultado
  indice: number
  moeda: string
}) {
  const { resultado: r, grupo, variacao } = resultado

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Produto {indice} — {grupo.nome}
            <span className="ml-2 text-sm font-normal text-slate-500">
              {variacao.destino} · {variacao.faixa_etaria}
            </span>
          </CardTitle>
          <GuardrailBadge guardrail={r.guardrail} perc={r.margem_percentual} />
        </div>
      </CardHeader>
      <CardContent>
        {/* Guardrail alert */}
        {r.guardrail !== 'OK' && (
          <Alert
            className={`mb-4 ${
              r.guardrail === 'CRITICO'
                ? 'border-red-200 bg-red-50 text-red-800'
                : 'border-yellow-200 bg-yellow-50 text-yellow-800'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {r.guardrail === 'CRITICO'
                ? `Margem crítica: ${formatPerc(r.margem_percentual)} s/Bruto — abaixo do piso de 15%. Redesenhar oferta antes de propor.`
                : `Margem em atenção: ${formatPerc(r.margem_percentual)} s/Bruto — entre 15% e 25%. Verifique alavancas de conversão antes de conceder desconto.`}
            </AlertDescription>
          </Alert>
        )}

        {/* Cascata visual */}
        <div className="space-y-1 text-sm">
          {/* Bruto */}
          <CascataLinha
            label="PV Bruto Original"
            valor={r.bruto_original}
            moeda={moeda}
            tipo="neutro"
          />
          {r.campanhas_aplicadas.map((c) => (
            <div key={c} className="flex items-center justify-between pl-4 text-xs text-emerald-600">
              <span>↳ Campanha: {c}</span>
            </div>
          ))}
          {r.bruto_original !== r.bruto_final && (
            <CascataLinha
              label="Bruto Final (após campanha)"
              valor={r.bruto_final}
              moeda={moeda}
              tipo="subtotal"
            />
          )}

          <Separator className="my-2" />

          {/* Comissão */}
          <CascataLinha
            label={`Comissão Total (${formatPerc(r.comissao_total / r.bruto_final * 100)} s/Bruto)`}
            valor={-r.comissao_total}
            moeda={moeda}
            tipo="deducao"
          />
          {r.comissoes_detalhe.map((c) => (
            <div
              key={String(c.id_agencia_recebedora)}
              className="flex items-center justify-between pl-6 text-xs text-slate-500"
            >
              <span>
                ↳ {c.tipo_comissao === 'DIRETA' ? 'Direta' : 'Indireta'}{' '}
                {formatPerc(c.percentual_aplicado)}
              </span>
              <span>−{formatMoeda(c.valor_moeda_nativa, moeda)}</span>
            </div>
          ))}

          <CascataLinha
            label="Net (Bruto − Comissão)"
            valor={r.net}
            moeda={moeda}
            tipo="subtotal"
          />

          <Separator className="my-2" />

          {/* Custos */}
          {r.linhas_custo.map((l) => (
            <div key={l.label} className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-600">
                {l.imutavel && <Lock className="h-3 w-3 text-slate-400" />}
                {l.label}
                <span className="text-xs text-slate-400">
                  ({formatPerc(l.percentual)} s/{l.base === 'NET' ? 'Net' : 'Bruto'})
                </span>
                {l.detalhe && (
                  <span className="text-xs text-slate-400">— {l.detalhe}</span>
                )}
              </span>
              <span className="font-mono text-slate-700">−{formatMoeda(l.valor, moeda)}</span>
            </div>
          ))}

          <Separator className="my-2" />

          {/* Margem */}
          <div
            className={`flex items-center justify-between rounded-md px-3 py-2 font-semibold ${
              r.guardrail === 'OK'
                ? 'bg-emerald-50 text-emerald-800'
                : r.guardrail === 'ATENCAO'
                ? 'bg-yellow-50 text-yellow-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            <span className="flex items-center gap-2">
              {r.guardrail === 'OK' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              Margem s/Bruto
            </span>
            <span>
              {formatMoeda(r.margem_valor, moeda)}{' '}
              <span className="text-sm font-normal">({formatPerc(r.margem_percentual)})</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CascataLinha({
  label,
  valor,
  moeda,
  tipo,
}: {
  label: string
  valor: number
  moeda: string
  tipo: 'neutro' | 'deducao' | 'subtotal'
}) {
  const isNeg = valor < 0
  return (
    <div
      className={`flex items-center justify-between ${
        tipo === 'subtotal' ? 'font-medium' : ''
      }`}
    >
      <span className="text-slate-700">{label}</span>
      <span
        className={`font-mono ${
          tipo === 'deducao' || isNeg ? 'text-red-600' : 'text-slate-900'
        }`}
      >
        {isNeg ? '−' : ''}{formatMoeda(Math.abs(valor), moeda)}
      </span>
    </div>
  )
}

function GuardrailBadge({
  guardrail,
  perc,
}: {
  guardrail: 'OK' | 'ATENCAO' | 'CRITICO'
  perc: number
}) {
  if (guardrail === 'OK') {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
        <CheckCircle className="mr-1 h-3 w-3" />
        {formatPerc(perc)} OK
      </Badge>
    )
  }
  if (guardrail === 'ATENCAO') {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        <AlertTriangle className="mr-1 h-3 w-3" />
        {formatPerc(perc)} Atenção
      </Badge>
    )
  }
  return (
    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
      <AlertTriangle className="mr-1 h-3 w-3" />
      {formatPerc(perc)} Crítico
    </Badge>
  )
}
