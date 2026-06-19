CREATE TABLE IF NOT EXISTS public.campanhas_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    pais VARCHAR(2) NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('DESCONTO_PERCENTUAL', '2X1')),
    percentual DECIMAL(5,2) NOT NULL DEFAULT 0,
    condicao_pagamento TEXT NOT NULL DEFAULT 'TRANSFERENCIA_DEPOSITO',
    id_grupo_produto UUID REFERENCES public.grupos_produtos(id) ON DELETE SET NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    data_inicio DATE,
    data_fim DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.campanhas_pricing (nome, pais, tipo, percentual, condicao_pagamento) VALUES
    ('20% Desconto Transferência/Depósito', 'AR', 'DESCONTO_PERCENTUAL', 20, 'TRANSFERENCIA_DEPOSITO'),
    ('2x1 Now Multi 150', 'AR', '2X1', 0, 'TRANSFERENCIA_DEPOSITO')
ON CONFLICT DO NOTHING;
