CREATE TABLE IF NOT EXISTS public.tpa_produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_grupo_produto UUID REFERENCES public.grupos_produtos(id) ON DELETE CASCADE,
    pais VARCHAR(2) NOT NULL,
    destino TEXT NOT NULL DEFAULT 'MUNDIAL',
    custo_tpa_diario NUMERIC(10,4) NOT NULL DEFAULT 0,
    moeda TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(id_grupo_produto, pais, destino)
);
