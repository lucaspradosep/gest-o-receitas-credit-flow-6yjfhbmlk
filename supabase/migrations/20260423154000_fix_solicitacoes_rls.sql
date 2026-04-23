DROP POLICY IF EXISTS "Allow select for all" ON public.solicitacoes_credito;
CREATE POLICY "Allow select for all" ON public.solicitacoes_credito
  FOR SELECT USING (true);
