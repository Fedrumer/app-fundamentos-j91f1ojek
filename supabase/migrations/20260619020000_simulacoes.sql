CREATE TABLE IF NOT EXISTS public.simulacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL DEFAULT 'Cotação sem título',
  id_usuario UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  pais VARCHAR(2) NOT NULL,
  inputs_json JSONB NOT NULL,
  resultados_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.simulacoes ENABLE ROW LEVEL SECURITY;

-- Admin sees all; user sees only their own
DROP POLICY IF EXISTS "simulacoes_select" ON public.simulacoes;
CREATE POLICY "simulacoes_select" ON public.simulacoes
  FOR SELECT TO authenticated
  USING (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
    OR id_usuario = (SELECT id FROM public.usuarios WHERE auth_user_id = auth.uid())
  );

DROP POLICY IF EXISTS "simulacoes_insert" ON public.simulacoes;
CREATE POLICY "simulacoes_insert" ON public.simulacoes
  FOR INSERT TO authenticated
  WITH CHECK (
    id_usuario = (SELECT id FROM public.usuarios WHERE auth_user_id = auth.uid())
  );

DROP POLICY IF EXISTS "simulacoes_update" ON public.simulacoes;
CREATE POLICY "simulacoes_update" ON public.simulacoes
  FOR UPDATE TO authenticated
  USING (
    id_usuario = (SELECT id FROM public.usuarios WHERE auth_user_id = auth.uid())
  )
  WITH CHECK (
    id_usuario = (SELECT id FROM public.usuarios WHERE auth_user_id = auth.uid())
  );

DROP POLICY IF EXISTS "simulacoes_delete" ON public.simulacoes;
CREATE POLICY "simulacoes_delete" ON public.simulacoes
  FOR DELETE TO authenticated
  USING (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
    OR id_usuario = (SELECT id FROM public.usuarios WHERE auth_user_id = auth.uid())
  );
