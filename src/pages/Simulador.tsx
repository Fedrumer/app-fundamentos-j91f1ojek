import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useRepositories } from '@/contexts/RepositoryContext'
import { useTenant } from '@/contexts/TenantContext'
import {
  IProductGroup,
  IProductVariation,
  IAgencia,
  IParametrosPricing,
  ICampanha,
  IResultadoSimulacao,
  ISimulacaoSalva,
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
  DollarSign,
  Percent,
  Minus,
  Loader2,
  Save,
  History,
  FolderOpen,
} from 'lucide-react'

// ─── Tipos locais ─────────────────────────────────────────────────────────────

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

// ─── Constantes ───────────────────────────────────────────────────────────────

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

function defaultParametros(id_grupo: string, pais: 'BR' | 'AR'): IParametrosPricing {
  return { id_grupo_produto: id_grupo, pais, perc_impostos: 3.5, perc_agenciamento: 5, perc_bonificacoes: 5, perc_admin: 10 }
}

function fmt(valor: number, moeda: string) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: moeda === 'BRL' ? 'BRL' : moeda === 'ARS' ? 'ARS' : 'USD',
    minimumFractionDigits: 2,
  })
}

function pct(v: number) {
  return `${v.toFixed(1)}%`
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Simulador() {
  const { simulacaoRepo, produtosRepo, agenciasRepo } = useRepositories()
  const { session } = useTenant()
  const pais = session?.pais_ativo ?? 'BR'
  const moeda = pais === 'BR' ? 'BRL' : 'USD'

  // ── Dados de referência ────────────────────────────────────────────────────
  const [grupos, setGrupos] = useState<IProductGroup[]>([])
  const [variacoesPorGrupo, setVariacoesPorGrupo] = useState<Record<string, IProductVariation[]>>({})
  const [agencias, setAgencias] = useState<IAgencia[]>([])
  const [campanhas, setCampanhas] = useState<ICampanha[]>([])
  const [parametrosPorGrupo, setParametrosPorGrupo] = useState<Record<string, IParametrosPricing>>({})
  const [tpaPorGrupo, setTpaPorGrupo] = useState<Record<string, number>>({})

  // ── Estado do formulário ───────────────────────────────────────────────────
  const [linhas, setLinhas] = useState<LinhaSimulacaoForm[]>([criarLinhaVazia(1)])
  const [tabAtiva, setTabAtiva] = useState(0)
  const [resultados, setResultados] = useState<LinhaSimulacaoResultado[]>([])
  const [mostrarProposta, setMostrarProposta] = useState(false)
  const [calculando, setCalculando] = useState(false)

  // ── Save / History ─────────────────────────────────────────────────────────
  const [mostrarSalvar, setMostrarSalvar] = useState(false)
  const [nomeCotacao, setNomeCotacao] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [simulacoesSalvas, setSimulacoesSalvas] = useState<ISimulacaoSalva[]>([])
  const [carregandoHistorico, setCarregandoHistorico] = useState(false)

  // ── Carga inicial ──────────────────────────────────────────────────────────
  useEffect(() => {
    produtosRepo.getGroups(pais).then(setGrupos)
    agenciasRepo.getAgencias(pais).then(setAgencias)
    simulacaoRepo.getCampanhas(pais).then(setCampanhas)
  }, [pais, produtosRepo, agenciasRepo, simulacaoRepo])

  // ── Carregar dados do grupo (async — uma vez por grupo) ───────────────────
  const carregarDadosGrupo = useCallback(
    async (id_grupo: string, destino?: string) => {
      if (!id_grupo) return
      if (!variacoesPorGrupo[id_grupo]) {
        const vars = await produtosRepo.getVariations(id_grupo)
        setVariacoesPorGrupo((prev) => ({ ...prev, [id_grupo]: vars }))
      }
      const [params, tpa] = await Promise.all([
        simulacaoRepo.getParametros(id_grupo, pais),
        simulacaoRepo.getTPA(id_grupo, pais, destino),
      ])
      if (params) setParametrosPorGrupo((prev) => ({ ...prev, [id_grupo]: params }))
      setTpaPorGrupo((prev) => ({ ...prev, [id_grupo]: tpa?.custo_tpa_diario ?? 0 }))
    },
    [pais, produtosRepo, simulacaoRepo, variacoesPorGrupo],
  )

  // ── Cálculo síncrono (usa apenas estado em cache) ─────────────────────────
  const calcularSync = useCallback(() => {
    const novos: LinhaSimulacaoResultado[] = []
    for (const linha of linhas) {
      if (!linha.id_grupo || !linha.id_variacao || !linha.id_agencia || !linha.pv_unitario) continue
      const grupo = grupos.find((g) => String(g.id) === linha.id_grupo)
      if (!grupo) continue
      const vars = variacoesPorGrupo[linha.id_grupo] ?? []
      const variacao = vars.find((v) => String(v.id) === linha.id_variacao)
      if (!variacao) continue
      const agencia = agencias.find((a) => String(a.id) === linha.id_agencia)
      if (!agencia) continue
      const parametros = parametrosPorGrupo[linha.id_grupo] ?? defaultParametros(linha.id_grupo, pais)
      const tpa_diario = tpaPorGrupo[linha.id_grupo] ?? 0
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
      novos.push({ form: linha, grupo, variacao, agencia, resultado })
    }
    setResultados(novos)
    setCalculando(false)
  }, [linhas, grupos, variacoesPorGrupo, agencias, campanhas, parametrosPorGrupo, tpaPorGrupo, pais, moeda])

  // ── Auto-cálculo com debounce ─────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    setCalculando(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(calcularSync, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [calcularSync])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const atualizarLinha = (id: number, campo: Partial<LinhaSimulacaoForm>) => {
    setLinhas((prev) => prev.map((l) => (l.id === id ? { ...l, ...campo } : l)))
  }

  const aoMudarGrupo = (linhaId: number, id_grupo: string) => {
    atualizarLinha(linhaId, { id_grupo, id_variacao: '' })
    carregarDadosGrupo(id_grupo)
  }

  const aoMudarVariacao = (linhaId: number, id_variacao: string, id_grupo: string) => {
    const vars = variacoesPorGrupo[id_grupo] ?? []
    const variacao = vars.find((v) => String(v.id) === id_variacao)
    atualizarLinha(linhaId, {
      id_variacao,
      pv_unitario: variacao ? String(variacao.preco) : '',
    })
  }

  const adicionarLinha = () => {
    const novoId = Math.max(...linhas.map((l) => l.id)) + 1
    setLinhas((prev) => [...prev, criarLinhaVazia(novoId)])
    setTabAtiva(linhas.length)
  }

  const removerLinha = (id: number) => {
    if (linhas.length === 1) return
    const idx = linhas.findIndex((l) => l.id === id)
    setLinhas((prev) => prev.filter((l) => l.id !== id))
    setTabAtiva(Math.max(0, idx - 1))
  }

  const salvarParametros = async (id_grupo: string) => {
    const params = parametrosPorGrupo[id_grupo]
    if (!params) return
    await simulacaoRepo.saveParametros(params)
  }

  const salvarTPA = async (id_grupo: string, custo_tpa_diario: number, tpamoeda: string) => {
    await simulacaoRepo.saveTPA({ id_grupo_produto: id_grupo, pais, destino: 'MUNDIAL', custo_tpa_diario, moeda: tpamoeda })
    setTpaPorGrupo((prev) => ({ ...prev, [id_grupo]: custo_tpa_diario }))
  }

  const abrirSalvar = () => {
    setNomeCotacao('')
    setMostrarSalvar(true)
  }

  const confirmarSalvar = async () => {
    if (!session || !nomeCotacao.trim()) return
    setSalvando(true)
    try {
      await simulacaoRepo.salvarSimulacao(
        nomeCotacao.trim(),
        pais,
        linhas as unknown[],
        resultados.map((r) => r.resultado) as unknown[],
      )
      setMostrarSalvar(false)
    } finally {
      setSalvando(false)
    }
  }

  const abrirHistorico = async () => {
    setCarregandoHistorico(true)
    const sims = await simulacaoRepo.listarSimulacoes(pais)
    setSimulacoesSalvas(sims)
    setCarregandoHistorico(false)
  }

  const carregarSimulacaoSalva = async (sim: ISimulacaoSalva) => {
    const savedLinhas = sim.inputs_json as LinhaSimulacaoForm[]
    if (!savedLinhas?.length) return
    setLinhas(savedLinhas)
    setTabAtiva(0)
    for (const l of savedLinhas) {
      if (l.id_grupo) await carregarDadosGrupo(l.id_grupo)
    }
  }

  const linhaAtiva = linhas[tabAtiva] ?? linhas[0]
  const resultadoAtivo = resultados.find((r) => r.form.id === linhaAtiva?.id)
  const temResultados = resultados.length > 0

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Simulador de Cotação</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Motor de cotação — Now Assistance · Margem calculada sobre Bruto
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" onClick={abrirHistorico}>
                <History className="mr-1.5 h-4 w-4" />
                Cotações Salvas
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[360px] sm:w-[420px]">
              <SheetHeader>
                <SheetTitle>Cotações Salvas</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-2">
                {carregandoHistorico ? (
                  <div className="flex items-center justify-center py-10 text-slate-400">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando…
                  </div>
                ) : simulacoesSalvas.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-400">Nenhuma cotação salva ainda</p>
                ) : (
                  simulacoesSalvas.map((sim) => (
                    <div key={sim.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{sim.nome}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(sim.updated_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => carregarSimulacaoSalva(sim)}
                        className="text-primary"
                      >
                        <FolderOpen className="mr-1.5 h-3.5 w-3.5" />
                        Carregar
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            size="sm"
            onClick={abrirSalvar}
            disabled={!temResultados}
          >
            <Save className="mr-1.5 h-4 w-4" />
            Salvar Cotação
          </Button>

          <Button
            onClick={() => setMostrarProposta(true)}
            disabled={!temResultados}
          >
            <FileText className="mr-2 h-4 w-4" />
            Gerar Proposta
          </Button>
        </div>
      </div>

      {/* Dialog: Salvar cotação */}
      <Dialog open={mostrarSalvar} onOpenChange={setMostrarSalvar}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Salvar Cotação</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label className="text-sm">Nome da cotação</Label>
            <Input
              autoFocus
              placeholder="Ex: Ag. América do Sul — Europa 10d 2pax"
              value={nomeCotacao}
              onChange={(e) => setNomeCotacao(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmarSalvar()}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setMostrarSalvar(false)}>Cancelar</Button>
            <Button onClick={confirmarSalvar} disabled={!nomeCotacao.trim() || salvando}>
              {salvando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grid dois painéis */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">

        {/* ── Painel Esquerdo: Formulário ──────────────────────────────────── */}
        <div className="md:col-span-2 space-y-4">

          {/* Tabs multi-produto */}
          {linhas.length > 1 && (
            <Tabs
              value={String(tabAtiva)}
              onValueChange={(v) => setTabAtiva(Number(v))}
            >
              <TabsList className="w-full">
                {linhas.map((l, i) => (
                  <TabsTrigger key={l.id} value={String(i)} className="flex-1 text-xs">
                    Produto {i + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          {/* Card do formulário ativo */}
          {linhaAtiva && (
            <FormCard
              linha={linhaAtiva}
              grupos={grupos}
              variacoesPorGrupo={variacoesPorGrupo}
              agencias={agencias}
              campanhas={campanhas}
              parametrosPorGrupo={parametrosPorGrupo}
              tpaPorGrupo={tpaPorGrupo}
              linhas={linhas}
              onAtualizarLinha={atualizarLinha}
              onMudarGrupo={aoMudarGrupo}
              onMudarVariacao={aoMudarVariacao}
              onSalvarParametros={salvarParametros}
              onSetParametros={setParametrosPorGrupo}
              onSalvarTPA={salvarTPA}
              pais={pais}
              isAdmin={session?.perfil_admin ?? false}
              moeda={moeda}
            />
          )}

          {/* Ações */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={adicionarLinha}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Adicionar Produto
            </Button>
            {linhas.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removerLinha(linhaAtiva.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Remover Produto {tabAtiva + 1}
              </Button>
            )}
          </div>
        </div>

        {/* ── Painel Direito: Resultado ─────────────────────────────────────── */}
        <div className="md:col-span-3">
          <div className="sticky top-20 space-y-4">
            {calculando && !resultadoAtivo ? (
              <Card>
                <CardContent className="flex items-center justify-center py-16 text-slate-400">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span className="text-sm">Calculando…</span>
                </CardContent>
              </Card>
            ) : resultadoAtivo ? (
              <PainelResultado
                resultado={resultadoAtivo}
                moeda={moeda}
                calculando={calculando}
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                  <DollarSign className="mb-3 h-10 w-10 opacity-30" />
                  <p className="text-sm">Preencha os campos ao lado para ver a margem</p>
                  <p className="mt-1 text-xs">Grupo · Variação · Agência · PV</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabela comparativa (multi-produto) ─────────────────────────────── */}
      {resultados.length > 1 && (
        <TabelaComparativa resultados={resultados} moeda={moeda} />
      )}

      {/* ── Proposta comercial ──────────────────────────────────────────────── */}
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

// ─── FormCard ─────────────────────────────────────────────────────────────────

interface FormCardProps {
  linha: ReturnType<typeof criarLinhaVazia>
  grupos: IProductGroup[]
  variacoesPorGrupo: Record<string, IProductVariation[]>
  agencias: IAgencia[]
  campanhas: ICampanha[]
  parametrosPorGrupo: Record<string, IParametrosPricing>
  tpaPorGrupo: Record<string, number>
  linhas: ReturnType<typeof criarLinhaVazia>[]
  onAtualizarLinha: (id: number, campo: Partial<ReturnType<typeof criarLinhaVazia>>) => void
  onMudarGrupo: (linhaId: number, id_grupo: string) => void
  onMudarVariacao: (linhaId: number, id_variacao: string, id_grupo: string) => void
  onSalvarParametros: (id_grupo: string) => void
  onSetParametros: React.Dispatch<React.SetStateAction<Record<string, IParametrosPricing>>>
  onSalvarTPA: (id_grupo: string, custo: number, moeda: string) => Promise<void>
  pais: 'BR' | 'AR'
  isAdmin: boolean
  moeda: string
}

function FormCard({
  linha,
  grupos,
  variacoesPorGrupo,
  agencias,
  campanhas,
  parametrosPorGrupo,
  tpaPorGrupo,
  onAtualizarLinha,
  onMudarGrupo,
  onMudarVariacao,
  onSalvarParametros,
  onSetParametros,
  onSalvarTPA,
  pais,
  isAdmin,
  moeda: formMoeda,
}: FormCardProps) {
  const [tpaEditando, setTpaEditando] = useState<string>('')
  const [tpaSalvando, setTpaSalvando] = useState(false)
  const upd = (campo: Partial<typeof linha>) => onAtualizarLinha(linha.id, campo)

  return (
    <Card>
      <CardContent className="space-y-4 pt-5">
        {/* Grupo */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Produto</Label>
          <Select value={linha.id_grupo} onValueChange={(v) => onMudarGrupo(linha.id, v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar grupo/produto…" />
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

        {/* Variação */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Variação (destino + faixa etária)</Label>
          <Select
            value={linha.id_variacao}
            onValueChange={(v) => onMudarVariacao(linha.id, v, linha.id_grupo)}
            disabled={!linha.id_grupo}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar variação…" />
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

        <Separator />

        {/* Agência + Canal */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Agência Parceira</Label>
            <Select value={linha.id_agencia} onValueChange={(v) => upd({ id_agencia: v })}>
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
            <Label className="text-xs text-slate-500">Canal</Label>
            <Select value={linha.tipo_canal} onValueChange={(v) => upd({ tipo_canal: v })}>
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

        <Separator />

        {/* PV + Pax + Dias */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">PV Unitário</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={linha.pv_unitario}
              onChange={(e) => upd({ pv_unitario: e.target.value })}
              placeholder="0,00"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Pax</Label>
            <Input
              type="number"
              min="1"
              value={linha.quantidade_pax}
              onChange={(e) => upd({ quantidade_pax: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Dias</Label>
            <Input
              type="number"
              min="1"
              value={linha.dias}
              onChange={(e) => upd({ dias: e.target.value })}
            />
          </div>
        </div>

        {/* Forma de cobrança */}
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Forma de Cobrança</Label>
          <Select
            value={linha.forma_cobranca}
            onValueChange={(v) => upd({ forma_cobranca: v as FormaCobranca })}
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

        {/* Gift Card + Provider */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Gift Card extra (%)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={linha.perc_gift_card}
              onChange={(e) => upd({ perc_gift_card: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Provider GC</Label>
            <Select
              value={linha.provider_gc ?? 'NENHUM'}
              onValueChange={(v) => upd({ provider_gc: v === 'NENHUM' ? null : (v as ProviderGC) })}
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
          <div className="space-y-2">
            <Label className="text-xs text-slate-500">Campanhas</Label>
            <div className="flex flex-wrap gap-1.5">
              {campanhas
                .filter((c) => !c.id_grupo_produto || String(c.id_grupo_produto) === linha.id_grupo)
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
                        upd({
                          campanhas_ativas: ativa
                            ? linha.campanhas_ativas.filter((id) => id !== c.id)
                            : [...linha.campanhas_ativas, c.id],
                        })
                      }}
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                        bloqueada
                          ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300'
                          : ativa
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                          : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-300'
                      }`}
                    >
                      {ativa ? '✓ ' : ''}{c.nome}
                      {bloqueada ? ' (só depósito)' : ''}
                    </button>
                  )
                })}
            </div>
          </div>
        )}

        {/* Aviso TPA zerado (não-admin) */}
        {linha.id_grupo && !isAdmin && (tpaPorGrupo[linha.id_grupo] === 0 || tpaPorGrupo[linha.id_grupo] === undefined) && (
          <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            Custo de risco (TPA) não configurado — contacte o administrador
          </div>
        )}

        {/* Parâmetros de custo */}
        {linha.id_grupo && parametrosPorGrupo[linha.id_grupo] && (
          <Accordion type="single" collapsible>
            <AccordionItem value="params" className="border-0">
              <AccordionTrigger className="py-2 text-xs text-slate-500 hover:no-underline">
                Parâmetros de Custo (editáveis)
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {(
                    [
                      { field: 'perc_impostos' as const, label: 'Impostos (% Net)' },
                      { field: 'perc_agenciamento' as const, label: 'Agenciamento (% Net)' },
                      { field: 'perc_bonificacoes' as const, label: 'Bonificações (% Net)' },
                      { field: 'perc_admin' as const, label: 'Admin (% Net)' },
                    ]
                  ).map(({ field, label }) => (
                    <div key={field} className="space-y-1">
                      <Label className="text-xs text-slate-400">{label}</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={parametrosPorGrupo[linha.id_grupo][field]}
                        onChange={(e) =>
                          onSetParametros((prev) => ({
                            ...prev,
                            [linha.id_grupo]: {
                              ...prev[linha.id_grupo],
                              [field]: Number(e.target.value),
                            },
                          }))
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 h-7 text-xs"
                  onClick={() => onSalvarParametros(linha.id_grupo)}
                >
                  Salvar para este grupo
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* TPA admin — somente admin */}
            {isAdmin && (
              <AccordionItem value="tpa" className="border-0">
                <AccordionTrigger className="py-2 text-xs text-slate-500 hover:no-underline">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    TPA WMMS (custo de risco — imutável para cotação)
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-1">
                    {tpaPorGrupo[linha.id_grupo] === 0 || tpaPorGrupo[linha.id_grupo] === undefined ? (
                      <p className="text-xs font-medium text-red-600">
                        TPA não configurado para este grupo — margem pode estar inflada
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500">
                        Atual: <strong>{tpaPorGrupo[linha.id_grupo]?.toFixed(4)}</strong> {formMoeda}/dia
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.0001"
                        placeholder="Custo TPA por dia"
                        value={tpaEditando}
                        onChange={(e) => setTpaEditando(e.target.value)}
                        className="h-8 text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 shrink-0 text-xs"
                        disabled={!tpaEditando || tpaSalvando}
                        onClick={async () => {
                          setTpaSalvando(true)
                          await onSalvarTPA(linha.id_grupo, Number(tpaEditando), formMoeda)
                          setTpaEditando('')
                          setTpaSalvando(false)
                        }}
                      >
                        {tpaSalvando ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Salvar'}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400">Destino: MUNDIAL (referência universal)</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Painel de Resultado ──────────────────────────────────────────────────────

function PainelResultado({
  resultado,
  moeda,
  calculando,
}: {
  resultado: LinhaSimulacaoResultado
  moeda: string
  calculando: boolean
}) {
  const { resultado: r, grupo, variacao } = resultado

  const guardrailConfig = {
    OK: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle, label: 'Margem OK' },
    ATENCAO: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: AlertTriangle, label: 'Atenção' },
    CRITICO: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: AlertTriangle, label: 'Crítico' },
  }[r.guardrail]

  return (
    <div className="space-y-4">
      {/* Cabeçalho do resultado */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">{grupo.nome}</p>
          <p className="text-xs text-slate-400">{variacao.destino} · {variacao.faixa_etaria}</p>
        </div>
        {calculando && <Loader2 className="h-4 w-4 animate-spin text-slate-300" />}
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard
          label="Bruto Final"
          valor={fmt(r.bruto_final, moeda)}
          icon={DollarSign}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          sub={r.bruto_original !== r.bruto_final ? fmt(r.bruto_original, moeda) : undefined}
          subCrossed
        />
        <StatCard
          label="Comissão"
          valor={fmt(r.comissao_total, moeda)}
          icon={Percent}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
          sub={pct(r.comissao_total / r.bruto_final * 100) + ' s/Bruto'}
        />
        <StatCard
          label="Net"
          valor={fmt(r.net, moeda)}
          icon={Minus}
          iconBg="bg-slate-100"
          iconColor="text-slate-500"
        />
        <StatCard
          label="Margem"
          valor={fmt(r.margem_valor, moeda)}
          icon={r.guardrail === 'OK' ? TrendingUp : TrendingDown}
          iconBg={r.guardrail === 'OK' ? 'bg-emerald-100' : r.guardrail === 'ATENCAO' ? 'bg-yellow-100' : 'bg-red-100'}
          iconColor={r.guardrail === 'OK' ? 'text-emerald-600' : r.guardrail === 'ATENCAO' ? 'text-yellow-600' : 'text-red-600'}
          sub={pct(r.margem_percentual) + ' s/Bruto'}
          highlight={r.guardrail}
        />
      </div>

      {/* Tabela cascata */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Descrição</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-right w-16">Base</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-right w-16">%</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-right w-28">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* PV Bruto */}
            <TableRow>
              <TableCell className="py-2 text-sm font-medium text-slate-700">
                PV Bruto ({resultado.form.quantidade_pax} pax × {fmt(Number(resultado.form.pv_unitario), moeda)})
              </TableCell>
              <TableCell className="py-2 text-right text-xs text-slate-400">—</TableCell>
              <TableCell className="py-2 text-right text-xs text-slate-400">—</TableCell>
              <TableCell className="py-2 text-right text-sm font-mono text-slate-900">{fmt(r.bruto_original, moeda)}</TableCell>
            </TableRow>

            {/* Campanhas */}
            {r.campanhas_aplicadas.map((c) => (
              <TableRow key={c} className="bg-emerald-50/50">
                <TableCell className="py-1.5 pl-6 text-xs text-emerald-700">↳ {c}</TableCell>
                <TableCell colSpan={2} />
                <TableCell className="py-1.5 text-right text-xs font-mono text-emerald-600">
                  −{fmt(r.bruto_original - r.bruto_final, moeda)}
                </TableCell>
              </TableRow>
            ))}

            {/* Bruto final (só se houve campanha) */}
            {r.bruto_original !== r.bruto_final && (
              <TableRow className="border-b-2">
                <TableCell className="py-2 text-sm font-semibold text-slate-800">Bruto Final</TableCell>
                <TableCell />
                <TableCell />
                <TableCell className="py-2 text-right text-sm font-semibold font-mono text-slate-900">{fmt(r.bruto_final, moeda)}</TableCell>
              </TableRow>
            )}

            {/* Comissão total */}
            <TableRow>
              <TableCell className="py-2 text-sm font-medium text-slate-700">Comissão Total</TableCell>
              <TableCell className="py-2 text-right text-xs text-slate-400">Bruto</TableCell>
              <TableCell className="py-2 text-right text-xs font-mono text-slate-600">{pct(r.comissao_total / r.bruto_final * 100)}</TableCell>
              <TableCell className="py-2 text-right text-sm font-mono text-red-600">−{fmt(r.comissao_total, moeda)}</TableCell>
            </TableRow>

            {/* Detalhes comissão */}
            {r.comissoes_detalhe.map((c) => (
              <TableRow key={String(c.id_agencia_recebedora)} className="bg-slate-50/50">
                <TableCell className="py-1.5 pl-6 text-xs text-slate-500">
                  ↳ {c.tipo_comissao === 'DIRETA' ? 'Direta' : 'Indireta'}
                </TableCell>
                <TableCell />
                <TableCell className="py-1.5 text-right text-xs font-mono text-slate-400">{pct(c.percentual_aplicado)}</TableCell>
                <TableCell className="py-1.5 text-right text-xs font-mono text-slate-500">−{fmt(c.valor_moeda_nativa, moeda)}</TableCell>
              </TableRow>
            ))}

            {/* Net */}
            <TableRow className="border-y-2 border-slate-200 bg-slate-50">
              <TableCell className="py-2.5 text-sm font-bold text-slate-900">Net (Bruto − Comissão)</TableCell>
              <TableCell />
              <TableCell />
              <TableCell className="py-2.5 text-right text-sm font-bold font-mono text-slate-900">{fmt(r.net, moeda)}</TableCell>
            </TableRow>

            {/* Linhas de custo */}
            {r.linhas_custo.map((l) => (
              <TableRow key={l.label}>
                <TableCell className="py-2 text-sm text-slate-700">
                  <span className="flex items-center gap-1">
                    {l.imutavel && <Lock className="h-3 w-3 text-slate-400" />}
                    {l.label}
                    {l.detalhe && <span className="text-xs text-slate-400">— {l.detalhe}</span>}
                  </span>
                </TableCell>
                <TableCell className="py-2 text-right text-xs text-slate-400">{l.base === 'NET' ? 'Net' : 'Bruto'}</TableCell>
                <TableCell className="py-2 text-right text-xs font-mono text-slate-600">{pct(l.percentual)}</TableCell>
                <TableCell className="py-2 text-right text-sm font-mono text-red-600">−{fmt(l.valor, moeda)}</TableCell>
              </TableRow>
            ))}

            {/* Margem */}
            <TableRow className={`border-t-2 ${guardrailConfig.bg}`}>
              <TableCell className={`py-3 text-sm font-bold ${guardrailConfig.text}`}>
                <span className="flex items-center gap-1.5">
                  {r.guardrail === 'OK'
                    ? <TrendingUp className="h-4 w-4" />
                    : <TrendingDown className="h-4 w-4" />}
                  Margem
                </span>
              </TableCell>
              <TableCell className={`py-3 text-right text-xs ${guardrailConfig.text}`}>Bruto</TableCell>
              <TableCell className={`py-3 text-right text-sm font-bold font-mono ${guardrailConfig.text}`}>{pct(r.margem_percentual)}</TableCell>
              <TableCell className={`py-3 text-right text-sm font-bold font-mono ${guardrailConfig.text}`}>{fmt(r.margem_valor, moeda)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Guardrail banner */}
        <div className={`flex items-center justify-between px-4 py-2.5 text-sm ${guardrailConfig.bg} ${guardrailConfig.text} border-t ${guardrailConfig.border}`}>
          <span className="flex items-center gap-1.5 font-medium">
            <guardrailConfig.icon className="h-4 w-4" />
            {guardrailConfig.label} — {pct(r.margem_percentual)} s/Bruto
          </span>
          <span className="text-xs opacity-70">Alvo: 25–35% · Piso absoluto: 15%</span>
        </div>
      </Card>
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  valor,
  icon: Icon,
  iconBg,
  iconColor,
  sub,
  subCrossed,
  highlight,
}: {
  label: string
  valor: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  sub?: string
  subCrossed?: boolean
  highlight?: 'OK' | 'ATENCAO' | 'CRITICO'
}) {
  const borderColor = highlight
    ? highlight === 'OK' ? 'border-emerald-200' : highlight === 'ATENCAO' ? 'border-yellow-200' : 'border-red-200'
    : 'border-slate-200'

  return (
    <Card className={`border ${borderColor}`}>
      <CardContent className="p-3">
        <div className={`mb-2 flex h-7 w-7 items-center justify-center rounded-full ${iconBg}`}>
          <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
        </div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-0.5 text-sm font-bold tabular-nums text-slate-900 leading-tight">{valor}</p>
        {sub && (
          <p className={`mt-0.5 text-xs ${subCrossed ? 'text-slate-400 line-through' : 'text-slate-400'}`}>
            {sub}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Tabela Comparativa ───────────────────────────────────────────────────────

function TabelaComparativa({
  resultados,
  moeda,
}: {
  resultados: LinhaSimulacaoResultado[]
  moeda: string
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Resumo Comparativo</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="text-xs text-slate-500 uppercase tracking-wide">Produto</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase tracking-wide text-right">Bruto</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase tracking-wide text-right">Comissão</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase tracking-wide text-right">Net</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase tracking-wide text-right">Custos</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase tracking-wide text-right">Margem</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase tracking-wide text-right">% s/Bruto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resultados.map((r, i) => (
              <TableRow key={r.form.id}>
                <TableCell className="py-3">
                  <p className="text-sm font-medium">{r.grupo.nome}</p>
                  <p className="text-xs text-slate-400">{r.variacao.destino} · {r.variacao.faixa_etaria}</p>
                </TableCell>
                <TableCell className="py-3 text-right text-sm font-mono">{fmt(r.resultado.bruto_final, moeda)}</TableCell>
                <TableCell className="py-3 text-right text-sm font-mono text-slate-500">{fmt(r.resultado.comissao_total, moeda)}</TableCell>
                <TableCell className="py-3 text-right text-sm font-mono text-slate-500">{fmt(r.resultado.net, moeda)}</TableCell>
                <TableCell className="py-3 text-right text-sm font-mono text-slate-500">{fmt(r.resultado.total_custos, moeda)}</TableCell>
                <TableCell className="py-3 text-right text-sm font-bold font-mono">{fmt(r.resultado.margem_valor, moeda)}</TableCell>
                <TableCell className="py-3 text-right">
                  <GuardrailBadge guardrail={r.resultado.guardrail} perc={r.resultado.margem_percentual} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// ─── GuardrailBadge ───────────────────────────────────────────────────────────

function GuardrailBadge({ guardrail, perc }: { guardrail: 'OK' | 'ATENCAO' | 'CRITICO'; perc: number }) {
  if (guardrail === 'OK') {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
        <CheckCircle className="mr-1 h-3 w-3" />{pct(perc)}
      </Badge>
    )
  }
  if (guardrail === 'ATENCAO') {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        <AlertTriangle className="mr-1 h-3 w-3" />{pct(perc)}
      </Badge>
    )
  }
  return (
    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
      <AlertTriangle className="mr-1 h-3 w-3" />{pct(perc)}
    </Badge>
  )
}
