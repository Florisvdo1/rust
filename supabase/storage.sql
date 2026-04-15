-- Storage buckets for RUST app
-- Idempotent: safe to run multiple times

-- Create private bucket for user photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-photos',
  'user-photos',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- RLS policies for user-photos bucket
DROP POLICY IF EXISTS "Users can upload own photos" ON storage.objects;
CREATE POLICY "Users can upload own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can view own photos" ON storage.objects;
CREATE POLICY "Users can view own photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;
CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Bucket for place images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'places',
  'places',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Authenticated users can upload place photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload place photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'places' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can view place photos" ON storage.objects;
CREATE POLICY "Authenticated users can view place photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'places' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete own place photos" ON storage.objects;
CREATE POLICY "Users can delete own place photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'places' AND auth.uid()::text = (storage.foldername(name))[1]);
