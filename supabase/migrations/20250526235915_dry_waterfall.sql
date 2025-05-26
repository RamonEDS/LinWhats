/*
  # Auth and Profile Setup

  1. Tables
    - Creates profiles table with user data
    - Links to auth.users via foreign key
    - Includes plan, settings, and timestamps
  
  2. Security
    - Enables RLS
    - Adds policies for user data access
    
  3. Triggers
    - Adds updated_at timestamp trigger
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text,
  avatar_url text,
  plan text DEFAULT 'free',
  settings jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_id UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Create trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();