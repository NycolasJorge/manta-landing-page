-- Criar tabela para controlar emails autorizados como admin
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Política para permitir apenas admins autenticados lerem a tabela
CREATE POLICY "Only authenticated admins can read admin_users" 
ON public.admin_users 
FOR SELECT 
USING (auth.email() = email);

-- Criar função para verificar se um usuário é admin autorizado
CREATE OR REPLACE FUNCTION public.is_authorized_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.email()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Atualizar política da tabela survey_responses para restringir acesso apenas a admins autorizados
DROP POLICY IF EXISTS "Allow read access for survey responses" ON public.survey_responses;

CREATE POLICY "Only authorized admins can read survey responses" 
ON public.survey_responses 
FOR SELECT 
USING (public.is_authorized_admin());

-- Trigger para atualizar updated_at na tabela admin_users
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir um email exemplo (você deve substituir pelo seu email real)
-- INSERT INTO public.admin_users (email) VALUES ('seu-email@exemplo.com');