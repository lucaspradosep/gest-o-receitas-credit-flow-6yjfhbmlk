ALTER TABLE public.solicitacoes_credito ADD COLUMN IF NOT EXISTS cep TEXT;
ALTER TABLE public.solicitacoes_credito ADD COLUMN IF NOT EXISTS documentation TEXT;

-- Create bucket for documents if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true) 
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public access
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'documents');

-- Policy to allow uploads
DROP POLICY IF EXISTS "Allow Uploads" ON storage.objects;
CREATE POLICY "Allow Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
