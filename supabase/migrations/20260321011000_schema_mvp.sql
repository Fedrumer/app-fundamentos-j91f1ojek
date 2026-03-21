-- 1. agencias
CREATE TABLE IF NOT EXISTS public.agencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_fantasia TEXT,
    nome_legal TEXT,
    codigo TEXT UNIQUE,
    pais TEXT,
    nivel TEXT,
    id_agencia_pai UUID REFERENCES public.agencias(id) ON DELETE SET NULL,
    percentual_comissao NUMERIC DEFAULT 0,
    moeda_padrao TEXT,
    data_inicio_faturamento DATE,
    data_ultimo_fechamento DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.agencias ADD COLUMN IF NOT EXISTS nivel TEXT;
ALTER TABLE public.agencias ADD COLUMN IF NOT EXISTS id_agencia_pai UUID REFERENCES public.agencias(id) ON DELETE SET NULL;
ALTER TABLE public.agencias ADD COLUMN IF NOT EXISTS moeda_padrao TEXT;

-- 2. usuarios
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE NOT NULL,
    nome TEXT,
    nivel TEXT,
    id_agencia UUID REFERENCES public.agencias(id) ON DELETE SET NULL,
    pais TEXT,
    moeda_padrao TEXT,
    perfil_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. grupos_produtos
CREATE TABLE IF NOT EXISTS public.grupos_produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT,
    percentual_comissao_maximo NUMERIC DEFAULT 0,
    e_pre_venda BOOLEAN DEFAULT false,
    tem_tarifa_net BOOLEAN DEFAULT false,
    pais TEXT,
    moeda_cadastro TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. produtos
CREATE TABLE IF NOT EXISTS public.produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT,
    id_grupo UUID REFERENCES public.grupos_produtos(id) ON DELETE CASCADE,
    e_pre_venda BOOLEAN DEFAULT false,
    tarifa_net BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. variacoes_preco
CREATE TABLE IF NOT EXISTS public.variacoes_preco (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_produto UUID REFERENCES public.produtos(id) ON DELETE CASCADE,
    destino TEXT,
    faixa_etaria TEXT,
    preco_moeda_cadastro NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. vouchers
CREATE TABLE IF NOT EXISTS public.vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_code TEXT UNIQUE,
    cliente TEXT,
    id_agencia_original UUID REFERENCES public.agencias(id) ON DELETE SET NULL,
    id_agencia_atual UUID REFERENCES public.agencias(id) ON DELETE SET NULL,
    agencia_original TEXT,
    agencia_atual TEXT,
    amount_paid NUMERIC DEFAULT 0,
    moeda_monto TEXT,
    pais TEXT NOT NULL,
    id_produto UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
    destino TEXT,
    data_inicio_viagem DATE,
    data_fim_viagem DATE,
    tipo_canal_origem TEXT NOT NULL,
    tipo_canal_atual TEXT,
    tipo_zero_amount TEXT,
    status_voucher TEXT,
    status_pagamento TEXT,
    data_vencimento_pagamento TIMESTAMPTZ,
    versao_calculo INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS voucher_code TEXT;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS id_agencia_original UUID REFERENCES public.agencias(id) ON DELETE SET NULL;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS id_agencia_atual UUID REFERENCES public.agencias(id) ON DELETE SET NULL;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS agencia_original TEXT;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS agencia_atual TEXT;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS amount_paid NUMERIC DEFAULT 0;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS moeda_monto TEXT;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS pais TEXT;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS id_produto UUID REFERENCES public.produtos(id) ON DELETE SET NULL;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS destino TEXT;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS data_inicio_viagem DATE;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS data_fim_viagem DATE;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS tipo_canal_origem TEXT;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS tipo_canal_atual TEXT;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS tipo_zero_amount TEXT;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS status_voucher TEXT;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS status_pagamento TEXT;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS data_vencimento_pagamento TIMESTAMPTZ;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS versao_calculo INT DEFAULT 1;

UPDATE public.vouchers SET pais = 'BR' WHERE pais IS NULL;
UPDATE public.vouchers SET tipo_canal_origem = 'B2C' WHERE tipo_canal_origem IS NULL;

-- 7. faturas
CREATE TABLE IF NOT EXISTS public.faturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_agencia UUID REFERENCES public.agencias(id) ON DELETE CASCADE,
    pais TEXT,
    moeda TEXT,
    competencia_mes INT,
    competencia_ano INT,
    status_lock BOOLEAN DEFAULT false,
    data_lock TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.faturas ADD COLUMN IF NOT EXISTS pais TEXT;
ALTER TABLE public.faturas ADD COLUMN IF NOT EXISTS moeda TEXT;
ALTER TABLE public.faturas ADD COLUMN IF NOT EXISTS competencia_mes INT;
ALTER TABLE public.faturas ADD COLUMN IF NOT EXISTS competencia_ano INT;
ALTER TABLE public.faturas ADD COLUMN IF NOT EXISTS status_lock BOOLEAN DEFAULT false;

-- 8. faturamento_net
CREATE TABLE IF NOT EXISTS public.faturamento_net (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_voucher UUID REFERENCES public.vouchers(id) ON DELETE CASCADE,
    versao_calculo INT NOT NULL,
    id_agencia_vendedora UUID REFERENCES public.agencias(id) ON DELETE SET NULL,
    id_agencia_recebedora UUID REFERENCES public.agencias(id) ON DELETE SET NULL,
    pais TEXT NOT NULL,
    tipo_comissao TEXT,
    tipo_lancamento TEXT,
    percentual_aplicado NUMERIC DEFAULT 0,
    valor_moeda_nativa NUMERIC DEFAULT 0,
    moeda TEXT,
    status_quitacao TEXT,
    data_vencimento_quitacao TIMESTAMPTZ,
    id_lancamento_origem UUID REFERENCES public.faturamento_net(id) ON DELETE SET NULL,
    id_fatura UUID REFERENCES public.faturas(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.faturamento_net ADD COLUMN IF NOT EXISTS versao_calculo INT;
ALTER TABLE public.faturamento_net ADD COLUMN IF NOT EXISTS id_agencia_vendedora UUID REFERENCES public.agencias(id) ON DELETE SET NULL;
ALTER TABLE public.faturamento_net ADD COLUMN IF NOT EXISTS id_agencia_recebedora UUID REFERENCES public.agencias(id) ON DELETE SET NULL;
ALTER TABLE public.faturamento_net ADD COLUMN IF NOT EXISTS pais TEXT;
ALTER TABLE public.faturamento_net ADD COLUMN IF NOT EXISTS percentual_aplicado NUMERIC DEFAULT 0;
ALTER TABLE public.faturamento_net ADD COLUMN IF NOT EXISTS valor_moeda_nativa NUMERIC DEFAULT 0;
ALTER TABLE public.faturamento_net ADD COLUMN IF NOT EXISTS moeda TEXT;
ALTER TABLE public.faturamento_net ADD COLUMN IF NOT EXISTS status_quitacao TEXT;
ALTER TABLE public.faturamento_net ADD COLUMN IF NOT EXISTS data_vencimento_quitacao TIMESTAMPTZ;
ALTER TABLE public.faturamento_net ADD COLUMN IF NOT EXISTS id_lancamento_origem UUID REFERENCES public.faturamento_net(id) ON DELETE SET NULL;

UPDATE public.faturamento_net SET versao_calculo = 1 WHERE versao_calculo IS NULL;
UPDATE public.faturamento_net SET pais = 'BR' WHERE pais IS NULL;

-- 9. voucher_processamentos
CREATE TABLE IF NOT EXISTS public.voucher_processamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_voucher UUID REFERENCES public.vouchers(id) ON DELETE CASCADE,
    status_voucher TEXT,
    versao_calculo INT,
    processado_em TIMESTAMPTZ DEFAULT now(),
    hash_input TEXT,
    resultado_status TEXT CHECK (resultado_status IN ('SUCESSO', 'FALHA')),
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.voucher_processamentos DROP CONSTRAINT IF EXISTS unq_voucher_processamento;
ALTER TABLE public.voucher_processamentos ADD CONSTRAINT unq_voucher_processamento UNIQUE (id_voucher, status_voucher, versao_calculo);

-- 10. passageiros
CREATE TABLE IF NOT EXISTS public.passageiros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_voucher UUID NOT NULL REFERENCES public.vouchers(id) ON DELETE CASCADE,
    voucher_passenger_code TEXT,
    nome TEXT,
    documento_tipo TEXT,
    documento_numero TEXT,
    data_nascimento DATE,
    contato_telefone TEXT,
    contato_email TEXT,
    contato_emergencia_nome TEXT,
    contato_emergencia_telefone TEXT,
    ultima_atualizacao TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.passageiros DROP CONSTRAINT IF EXISTS unq_voucher_passenger;
ALTER TABLE public.passageiros ADD CONSTRAINT unq_voucher_passenger UNIQUE (id_voucher, voucher_passenger_code);

-- 11. contratos_pre_venda
CREATE TABLE IF NOT EXISTS public.contratos_pre_venda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_agencia UUID REFERENCES public.agencias(id) ON DELETE CASCADE,
    id_produto UUID REFERENCES public.produtos(id) ON DELETE CASCADE,
    dias_iniciais INT DEFAULT 0,
    dias_consumidos INT DEFAULT 0,
    data_validade DATE,
    status TEXT,
    pais TEXT,
    moeda TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. extrato_pre_venda
CREATE TABLE IF NOT EXISTS public.extrato_pre_venda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_contrato UUID REFERENCES public.contratos_pre_venda(id) ON DELETE CASCADE,
    id_voucher UUID REFERENCES public.vouchers(id) ON DELETE CASCADE,
    tipo_movimento TEXT CHECK (tipo_movimento IN ('DEBITO', 'CREDITO')),
    dias_consumidos INT DEFAULT 0,
    data_movimento TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. ingestao_logs
CREATE TABLE IF NOT EXISTS public.ingestao_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_ingestao TIMESTAMPTZ DEFAULT now(),
    quantidade_registros INT DEFAULT 0,
    quantidade_falhadas INT DEFAULT 0,
    status TEXT,
    mensagem_erro TEXT,
    pais_processado TEXT,
    moedas_processadas TEXT[],
    id_usuario UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. audit_reclassificacao
CREATE TABLE IF NOT EXISTS public.audit_reclassificacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_voucher UUID REFERENCES public.vouchers(id) ON DELETE CASCADE,
    tipo_anterior TEXT,
    tipo_novo TEXT,
    motivo TEXT,
    classificado_por UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    classificado_em TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed Auth User and Link
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fedrumer@gmail.com') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'fedrumer@gmail.com',
      crypt('securepassword123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    INSERT INTO public.usuarios (auth_user_id, nome, nivel, pais, moeda_padrao, perfil_admin)
    VALUES (new_user_id, 'Admin User', 'Master', 'BR', 'BRL', true)
    ON CONFLICT (auth_user_id) DO NOTHING;
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_faturamento_net_voucher_versao ON public.faturamento_net(id_voucher, versao_calculo DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_estorno_unico ON public.faturamento_net(id_lancamento_origem) WHERE tipo_lancamento = 'ESTORNO';

-- Immutability Trigger
CREATE OR REPLACE FUNCTION public.check_imutabilidade_tipo_canal()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.tipo_canal_origem IS DISTINCT FROM NEW.tipo_canal_origem THEN
        RAISE EXCEPTION 'tipo_canal_origem não pode ser modificado após inserção';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_vouchers_tipo_canal_origem ON public.vouchers;
CREATE TRIGGER trg_vouchers_tipo_canal_origem
BEFORE UPDATE ON public.vouchers
FOR EACH ROW
EXECUTE FUNCTION public.check_imutabilidade_tipo_canal();

-- Teto Limit Trigger
CREATE OR REPLACE FUNCTION public.check_teto_operacional()
RETURNS TRIGGER AS $$
DECLARE
    v_total_aplicado NUMERIC;
    v_teto NUMERIC;
BEGIN
    IF NEW.tipo_lancamento = 'COMISSAO' THEN
        SELECT gp.percentual_comissao_maximo INTO v_teto
        FROM public.vouchers v
        JOIN public.produtos p ON v.id_produto = p.id
        JOIN public.grupos_produtos gp ON p.id_grupo = gp.id
        WHERE v.id = NEW.id_voucher;

        SELECT COALESCE(SUM(percentual_aplicado), 0) INTO v_total_aplicado
        FROM public.faturamento_net
        WHERE id_voucher = NEW.id_voucher 
          AND versao_calculo = NEW.versao_calculo
          AND tipo_lancamento = 'COMISSAO'
          AND id != NEW.id;

        IF (v_total_aplicado + COALESCE(NEW.percentual_aplicado, 0)) > COALESCE(v_teto, 100) THEN
            RAISE EXCEPTION 'Teto de comissão excedido. Limite: %, Tentado: %', v_teto, (v_total_aplicado + COALESCE(NEW.percentual_aplicado, 0));
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_teto ON public.faturamento_net;
CREATE TRIGGER trg_check_teto
BEFORE INSERT OR UPDATE ON public.faturamento_net
FOR EACH ROW
EXECUTE FUNCTION public.check_teto_operacional();

-- View para Versão Vigente
CREATE OR REPLACE VIEW public.vouchers_vigentes AS
SELECT v.*
FROM public.vouchers v
INNER JOIN (
    SELECT id_voucher, MAX(versao_calculo) as versao_vigente
    FROM public.voucher_processamentos
    WHERE resultado_status = 'SUCESSO'
    GROUP BY id_voucher
) vp ON v.id = vp.id_voucher AND v.versao_calculo = vp.versao_vigente;

-- Apply RLS
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT t.table_name 
    FROM information_schema.tables t 
    WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_name);
    
    EXECUTE format('DROP POLICY IF EXISTS "authenticated_select" ON public.%I;', table_name);
    EXECUTE format('CREATE POLICY "authenticated_select" ON public.%I FOR SELECT TO authenticated USING (true);', table_name);
    
    EXECUTE format('DROP POLICY IF EXISTS "authenticated_insert" ON public.%I;', table_name);
    EXECUTE format('CREATE POLICY "authenticated_insert" ON public.%I FOR INSERT TO authenticated WITH CHECK (true);', table_name);
    
    EXECUTE format('DROP POLICY IF EXISTS "authenticated_update" ON public.%I;', table_name);
    EXECUTE format('CREATE POLICY "authenticated_update" ON public.%I FOR UPDATE TO authenticated USING (true) WITH CHECK (true);', table_name);
    
    EXECUTE format('DROP POLICY IF EXISTS "authenticated_delete" ON public.%I;', table_name);
    EXECUTE format('CREATE POLICY "authenticated_delete" ON public.%I FOR DELETE TO authenticated USING (true);', table_name);
  END LOOP;
END $$;
