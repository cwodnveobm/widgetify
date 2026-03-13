
-- Create lastset-avatars storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lastset-avatars',
  'lastset-avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Authenticated users can upload lastset avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lastset-avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update/replace their own avatar
CREATE POLICY "Authenticated users can update their lastset avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'lastset-avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Authenticated users can delete their lastset avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'lastset-avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to all avatars
CREATE POLICY "Anyone can view lastset avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'lastset-avatars');
