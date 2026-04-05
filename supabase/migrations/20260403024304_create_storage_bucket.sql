/*
  # Storage Bucket for Payment Proofs

  1. Storage
    - `payment-proofs` bucket for receipt images and PDFs
    - 10MB file size limit
    - Allowed types: JPEG, PNG, GIF, PDF

  2. Security Policies
    - Authenticated users (admins) can upload, view, and delete proofs
    - Anonymous users (parents) can upload proofs for parent portal
    - Anonymous users can view proofs (for confirmation pages)
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-proofs',
  'payment-proofs',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can upload payment proofs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Parents can upload payment proofs"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Admins can view payment proofs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'payment-proofs');

CREATE POLICY "Public can view payment proofs"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'payment-proofs');

CREATE POLICY "Admins can update payment proofs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'payment-proofs')
  WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Admins can delete payment proofs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'payment-proofs');
