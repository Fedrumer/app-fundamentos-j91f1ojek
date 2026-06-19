-- Enable RLS on pricing tables
ALTER TABLE public.parametros_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tpa_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campanhas_pricing ENABLE ROW LEVEL SECURITY;

-- parametros_pricing: any authenticated user can read (needed to calculate);
-- only admins can write (no pais column, isolation via grupo ownership)
DROP POLICY IF EXISTS "pricing_params_select" ON public.parametros_pricing;
CREATE POLICY "pricing_params_select" ON public.parametros_pricing
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "pricing_params_write" ON public.parametros_pricing;
CREATE POLICY "pricing_params_write" ON public.parametros_pricing
  FOR ALL TO authenticated
  USING (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
  )
  WITH CHECK (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
  );

-- tpa_produtos: same pattern
DROP POLICY IF EXISTS "tpa_select" ON public.tpa_produtos;
CREATE POLICY "tpa_select" ON public.tpa_produtos
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "tpa_write" ON public.tpa_produtos;
CREATE POLICY "tpa_write" ON public.tpa_produtos
  FOR ALL TO authenticated
  USING (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
  )
  WITH CHECK (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
  );

-- campanhas_pricing: read filtered by country, write admin only
DROP POLICY IF EXISTS "campanhas_select" ON public.campanhas_pricing;
CREATE POLICY "campanhas_select" ON public.campanhas_pricing
  FOR SELECT TO authenticated
  USING (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
    OR pais = (SELECT pais FROM public.usuarios WHERE auth_user_id = auth.uid())
  );

DROP POLICY IF EXISTS "campanhas_write" ON public.campanhas_pricing;
CREATE POLICY "campanhas_write" ON public.campanhas_pricing
  FOR ALL TO authenticated
  USING (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
  )
  WITH CHECK (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
  );
