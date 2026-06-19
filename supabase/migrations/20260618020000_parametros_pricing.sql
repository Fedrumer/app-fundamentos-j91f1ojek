CREATE TABLE IF NOT EXISTS public.parametros_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_grupo_produto UUID REFERENCES public.grupos_produtos(id) ON DELETE CASCADE,
    pais VARCHAR(2) NOT NULL,
    perc_impostos DECIMAL(5,2) NOT NULL DEFAULT 3.5,
    perc_agenciamento DECIMAL(5,2) NOT NULL DEFAULT 5.0,
    perc_bonificacoes DECIMAL(5,2) NOT NULL DEFAULT 5.0,
    perc_admin DECIMAL(5,2) NOT NULL DEFAULT 10.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(id_grupo_produto, pais)
);
