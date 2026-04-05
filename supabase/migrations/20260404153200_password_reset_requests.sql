-- Create password reset requests table
CREATE TABLE IF NOT EXISTS password_reset_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  viewer_id UUID NOT NULL REFERENCES admin_profiles(id) ON DELETE CASCADE,
  viewer_name TEXT NOT NULL,
  viewer_email TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed')),
  processed_by UUID REFERENCES admin_profiles(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- RLS Policy
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Only superadmin can see password reset requests
CREATE POLICY "Superadmins can view all password reset requests" ON password_reset_requests
  FOR SELECT USING (is_superadmin());

-- Only superadmin can update password reset requests
CREATE POLICY "Superadmins can update password reset requests" ON password_reset_requests
  FOR UPDATE USING (is_superadmin());

-- Only superadmin can insert password reset requests
CREATE POLICY "Superadmins can insert password reset requests" ON password_reset_requests
  FOR INSERT WITH CHECK (is_superadmin());

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_password_reset_requests_status ON password_reset_requests(status);
CREATE INDEX IF NOT EXISTS idx_password_reset_requests_requested_at ON password_reset_requests(requested_at);
