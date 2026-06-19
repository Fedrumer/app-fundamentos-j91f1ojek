-- Seed inicial de TPA (custo de risco diário por grupo de produto).
-- Os valores abaixo são referências de partida — o admin deve ajustar via UI do Simulador
-- (accordion "TPA WMMS" em cada grupo) após confirmar os custos reais com o time de risco.
--
-- A subquery usa ILIKE no nome do grupo para evitar depender de UUIDs hardcoded.
-- Grupos que não existirem no banco simplesmente não geram linha (ON CONFLICT DO NOTHING).

-- ── Brasil (BRL) ──────────────────────────────────────────────────────────────

INSERT INTO public.tpa_produtos (id_grupo_produto, pais, destino, custo_tpa_diario, moeda)
SELECT id, 'BR', 'MUNDIAL', 2.50, 'BRL'
FROM public.grupos_produtos
WHERE pais = 'BR'
ON CONFLICT (id_grupo_produto, pais, destino) DO NOTHING;

-- ── Argentina (USD) ───────────────────────────────────────────────────────────

INSERT INTO public.tpa_produtos (id_grupo_produto, pais, destino, custo_tpa_diario, moeda)
SELECT id, 'AR', 'MUNDIAL', 0.85, 'USD'
FROM public.grupos_produtos
WHERE pais = 'AR'
ON CONFLICT (id_grupo_produto, pais, destino) DO NOTHING;

-- ── Nota para o time de pricing ───────────────────────────────────────────────
-- Após executar esta migration, acesse o Simulador como admin e revise cada grupo:
--   1. Selecione o grupo de produto
--   2. Abra o accordion "TPA WMMS"
--   3. Ajuste o custo/dia com o valor real e clique em "Salvar"
-- Destinos específicos (EUA_CANADA, EUROPA, etc.) devem ser adicionados diretamente
-- na tabela tpa_produtos conforme necessário.
