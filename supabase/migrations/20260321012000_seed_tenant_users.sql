-- Migrate para inserir usuários do Tenant

DO $$
DECLARE
  admin_id uuid;
  br_id uuid;
  ar_id uuid;
BEGIN
  -- Admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@now.com') THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      admin_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@now.com',
      crypt('Teste123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin Now"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    INSERT INTO public.usuarios (auth_user_id, nome, nivel, pais, moeda_padrao, perfil_admin)
    VALUES (admin_id, 'Admin Global', 'Master', 'BR', 'BRL', true)
    ON CONFLICT (auth_user_id) DO NOTHING;
  END IF;

  -- BR
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'teste_br@now.com') THEN
    br_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      br_id,
      '00000000-0000-0000-0000-000000000000',
      'teste_br@now.com',
      crypt('Teste123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Regional Brasil"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    INSERT INTO public.usuarios (auth_user_id, nome, nivel, pais, moeda_padrao, perfil_admin)
    VALUES (br_id, 'Regional Brasil', 'Regional', 'BR', 'BRL', false)
    ON CONFLICT (auth_user_id) DO NOTHING;
  END IF;

  -- AR
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'teste_ar@now.com') THEN
    ar_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      ar_id,
      '00000000-0000-0000-0000-000000000000',
      'teste_ar@now.com',
      crypt('Teste123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Regional Argentina"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    INSERT INTO public.usuarios (auth_user_id, nome, nivel, pais, moeda_padrao, perfil_admin)
    VALUES (ar_id, 'Regional Argentina', 'Regional', 'AR', 'ARS', false)
    ON CONFLICT (auth_user_id) DO NOTHING;
  END IF;
END $$;
