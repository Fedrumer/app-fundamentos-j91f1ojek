import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { IAgencia, IProductGroup, IProductVariation, IResultadoSimulacao } from '@/domain/contracts'
import { Printer, X } from 'lucide-react'

interface LinhaSimulacao {
  grupo: IProductGroup
  variacao: IProductVariation
  agencia: IAgencia
  resultado: IResultadoSimulacao
  dias: number
  quantidade_pax: number
}

interface PropostaComercialProps {
  linhas: LinhaSimulacao[]
  onClose: () => void
}

function formatMoeda(valor: number, moeda: string) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: moeda === 'BRL' ? 'BRL' : moeda === 'ARS' ? 'ARS' : 'USD',
    minimumFractionDigits: 2,
  })
}

export default function PropostaComercial({ linhas, onClose }: PropostaComercialProps) {
  const dataHoje = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const agenciaNome = linhas[0]?.agencia?.nome_fantasia ?? '—'
  const pais = linhas[0]?.resultado?.moeda === 'BRL' ? '🇧🇷 Brasil' : '🇦🇷 Argentina'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white print:static print:overflow-visible">
      {/* Barra de ações — oculta na impressão */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm print:hidden">
        <span className="text-sm font-medium text-slate-600">Proposta Comercial — Now Assistance</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-1.5 h-4 w-4" />
            Imprimir / Salvar PDF
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Conteúdo da proposta */}
      <div className="mx-auto max-w-3xl px-8 py-10 print:px-0 print:py-0">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Now Assistance</h1>
            <p className="mt-0.5 text-sm text-slate-500">Proposta Comercial {pais}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">{dataHoje}</p>
            <p className="mt-1 text-sm font-medium text-slate-700">Para: {agenciaNome}</p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Introdução */}
        <p className="text-sm leading-relaxed text-slate-600">
          Prezado parceiro, apresentamos abaixo as condições comerciais vigentes para os produtos
          selecionados. Os preços e condições são válidos para a data desta proposta e sujeitos a
          confirmação no momento da emissão.
        </p>

        <Separator className="my-6" />

        {/* Tabela de produtos */}
        <h2 className="mb-4 text-base font-semibold text-slate-800">Produtos e Condições</h2>

        {linhas.length === 1 ? (
          // Layout único produto
          <SingleProductLayout linha={linhas[0]} />
        ) : (
          // Layout 3 opções (decoy/anchoring)
          <MultiProductLayout linhas={linhas} />
        )}

        <Separator className="my-6" />

        {/* Condições gerais */}
        <div className="space-y-2 text-xs text-slate-500">
          <p className="font-medium text-slate-700">Condições Gerais</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Preços expressos na moeda indicada por produto.</li>
            <li>Comissão calculada sobre o Preço de Venda Bruto (PV), conforme hierarquia cadastrada.</li>
            <li>Proposta válida por 5 dias úteis a partir da data de emissão.</li>
            <li>Sujeito às condições gerais do seguro/assistência vigentes.</li>
          </ul>
        </div>

        <Separator className="my-6" />

        {/* Rodapé */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Now Assistance — Sistema Cotação Now v6</span>
          <span>Documento gerado em {dataHoje}</span>
        </div>
      </div>
    </div>
  )
}

function formatPerc(v: number) {
  return `${v.toFixed(1)}%`
}

function SingleProductLayout({ linha }: { linha: LinhaSimulacao }) {
  const { grupo, variacao, resultado, dias, quantidade_pax } = linha
  const comissaoTotal = resultado.comissoes_detalhe.reduce(
    (s, c) => s + c.percentual_aplicado,
    0,
  )
  const comissaoValor = resultado.comissao_total

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{grupo.nome}</h3>
          <p className="text-sm text-slate-500">
            {variacao.destino} · {variacao.faixa_etaria}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-slate-900">
            {formatMoeda(resultado.bruto_final / quantidade_pax, resultado.moeda)}
            <span className="ml-1 text-sm font-normal text-slate-400">/ pax</span>
          </p>
          {resultado.bruto_original !== resultado.bruto_final && (
            <p className="text-xs text-slate-400 line-through">
              {formatMoeda(resultado.bruto_original / quantidade_pax, resultado.moeda)}
            </p>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-xs text-slate-400">Dias de cobertura</p>
          <p className="font-medium">{dias}d</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Passageiros</p>
          <p className="font-medium">{quantidade_pax} pax</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Total da proposta</p>
          <p className="font-medium">{formatMoeda(resultado.bruto_final, resultado.moeda)}</p>
        </div>
      </div>

      {resultado.campanhas_aplicadas.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {resultado.campanhas_aplicadas.map((c) => (
            <span
              key={c}
              className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      <Separator className="my-4" />

      <div className="space-y-1 text-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Sua remuneração</p>
        <p className="text-base font-semibold text-slate-900">
          {formatPerc(comissaoTotal)} ={' '}
          <span className="text-emerald-700">{formatMoeda(comissaoValor, resultado.moeda)}</span>
        </p>
        {resultado.comissoes_detalhe.map((c) => (
          <p key={String(c.id_agencia_recebedora)} className="text-xs text-slate-500">
            {c.tipo_comissao === 'DIRETA' ? 'Comissão Direta' : 'Comissão Indireta'}:{' '}
            {formatPerc(c.percentual_aplicado)} ={' '}
            {formatMoeda(c.valor_moeda_nativa, resultado.moeda)}
          </p>
        ))}
      </div>
    </div>
  )
}

function MultiProductLayout({ linhas }: { linhas: LinhaSimulacao[] }) {
  const labels =
    linhas.length === 3
      ? ['Econômico', 'Recomendado ★', 'Premium']
      : linhas.map((_, i) => `Opção ${i + 1}`)

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${linhas.length}, 1fr)` }}>
      {linhas.map((linha, i) => {
        const isRecomendado = linhas.length === 3 && i === 1
        const comissaoTotal = linha.resultado.comissoes_detalhe.reduce(
          (s, c) => s + c.percentual_aplicado,
          0,
        )

        return (
          <div
            key={i}
            className={`rounded-lg border p-4 ${
              isRecomendado
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <p
              className={`mb-1 text-xs font-semibold uppercase tracking-wide ${
                isRecomendado ? 'text-primary' : 'text-slate-400'
              }`}
            >
              {labels[i]}
            </p>
            <h3 className="font-semibold text-slate-900 leading-tight">{linha.grupo.nome}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {linha.variacao.destino} · {linha.variacao.faixa_etaria}
            </p>

            <p className="mt-3 text-xl font-bold text-slate-900">
              {formatMoeda(
                linha.resultado.bruto_final / linha.quantidade_pax,
                linha.resultado.moeda,
              )}
              <span className="ml-1 text-xs font-normal text-slate-400">/ pax</span>
            </p>

            <Separator className="my-3" />

            <div className="space-y-1 text-xs">
              <p className="text-slate-400">
                {linha.dias}d · {linha.quantidade_pax} pax
              </p>
              <p className="font-medium text-slate-700">
                Total: {formatMoeda(linha.resultado.bruto_final, linha.resultado.moeda)}
              </p>
              <p className="text-emerald-700 font-medium">
                Sua comissão: {formatPerc(comissaoTotal)}
              </p>
            </div>

            {linha.resultado.campanhas_aplicadas.length > 0 && (
              <div className="mt-2 flex flex-col gap-1">
                {linha.resultado.campanhas_aplicadas.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
