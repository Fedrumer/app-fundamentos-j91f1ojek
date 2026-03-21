-- Enable RLS on the target tables
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faturamento_net ENABLE ROW LEVEL SECURITY;

-- Clean up any existing permissive policies
DROP POLICY IF EXISTS "authenticated_select" ON public.usuarios;
DROP POLICY IF EXISTS "authenticated_insert" ON public.usuarios;
DROP POLICY IF EXISTS "authenticated_update" ON public.usuarios;
DROP POLICY IF EXISTS "authenticated_delete" ON public.usuarios;

DROP POLICY IF EXISTS "authenticated_select" ON public.agencias;
DROP POLICY IF EXISTS "authenticated_insert" ON public.agencias;
DROP POLICY IF EXISTS "authenticated_update" ON public.agencias;
DROP POLICY IF EXISTS "authenticated_delete" ON public.agencias;

DROP POLICY IF EXISTS "authenticated_select" ON public.vouchers;
DROP POLICY IF EXISTS "authenticated_insert" ON public.vouchers;
DROP POLICY IF EXISTS "authenticated_update" ON public.vouchers;
DROP POLICY IF EXISTS "authenticated_delete" ON public.vouchers;

DROP POLICY IF EXISTS "authenticated_select" ON public.faturamento_net;
DROP POLICY IF EXISTS "authenticated_insert" ON public.faturamento_net;
DROP POLICY IF EXISTS "authenticated_update" ON public.faturamento_net;
DROP POLICY IF EXISTS "authenticated_delete" ON public.faturamento_net;

-- 1. Policies for 'usuarios'
-- Leitura e atualização apenas do próprio registro
DROP POLICY IF EXISTS "tenant_usuarios_select" ON public.usuarios;
CREATE POLICY "tenant_usuarios_select" ON public.usuarios
  FOR SELECT TO authenticated 
  USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "tenant_usuarios_update" ON public.usuarios;
CREATE POLICY "tenant_usuarios_update" ON public.usuarios
  FOR UPDATE TO authenticated 
  USING (auth_user_id = auth.uid()) 
  WITH CHECK (auth_user_id = auth.uid());

-- 2. Policies for 'agencias'
-- Admin: acesso total / Regional: apenas seu país
DROP POLICY IF EXISTS "tenant_agencias_all" ON public.agencias;
CREATE POLICY "tenant_agencias_all" ON public.agencias
  FOR ALL TO authenticated 
  USING (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
    OR pais = (SELECT pais FROM public.usuarios WHERE auth_user_id = auth.uid())
  )
  WITH CHECK (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
    OR pais = (SELECT pais FROM public.usuarios WHERE auth_user_id = auth.uid())
  );

-- 3. Policies for 'vouchers'
-- Admin: acesso total / Regional: apenas seu país
DROP POLICY IF EXISTS "tenant_vouchers_all" ON public.vouchers;
CREATE POLICY "tenant_vouchers_all" ON public.vouchers
  FOR ALL TO authenticated 
  USING (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
    OR pais = (SELECT pais FROM public.usuarios WHERE auth_user_id = auth.uid())
  )
  WITH CHECK (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
    OR pais = (SELECT pais FROM public.usuarios WHERE auth_user_id = auth.uid())
  );

-- 4. Policies for 'faturamento_net'
-- Admin: acesso total / Regional: apenas seu país
DROP POLICY IF EXISTS "tenant_faturamento_net_all" ON public.faturamento_net;
CREATE POLICY "tenant_faturamento_net_all" ON public.faturamento_net
  FOR ALL TO authenticated 
  USING (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
    OR pais = (SELECT pais FROM public.usuarios WHERE auth_user_id = auth.uid())
  )
  WITH CHECK (
    (SELECT perfil_admin FROM public.usuarios WHERE auth_user_id = auth.uid()) = true
    OR pais = (SELECT pais FROM public.usuarios WHERE auth_user_id = auth.uid())
  );
