-- Add email column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles (email);

-- Update policies to allow email checks during registration
CREATE POLICY "Anyone can check if email exists"
  ON profiles
  FOR SELECT
  TO anon
  USING (true);