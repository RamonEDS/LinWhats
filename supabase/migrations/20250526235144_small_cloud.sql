/*
  # Authentication and Profile Setup

  1. Tables
    - Creates profiles table with:
      - User information (id, email, name)
      - Profile data (avatar, plan, settings)
      - Timestamps and constraints
  
  2. Security
    - Enables RLS
    - Sets up policies for profile access
    - Creates email uniqueness constraint
    
  3. Triggers
    - Adds updated_at timestamp trigger
*/

-- Drop existing table and related objects
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  email text,
  name text,
  avatar_url text,
  plan text DEFAULT 'free',
  settings jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_id UNIQUE (user_id),
  CONSTRAINT unique_email UNIQUE (email)
);

-- Create index on email
CREATE INDEX idx_profiles_email ON profiles (email);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can check if email exists"
  ON profiles
  FOR SELECT
  TO anon
  USING (true);

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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();