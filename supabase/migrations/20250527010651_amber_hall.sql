/*
  # Initial Schema Setup

  1. Tables
    - profiles: User profiles with authentication data
    - links: WhatsApp link management
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Drop existing tables if they exist
drop table if exists links;
drop table if exists profiles;

-- Create profiles table
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  email text unique,
  name text,
  avatar_url text,
  plan text default 'free',
  settings jsonb default '{}',
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Create RLS policies
create policy "Users can view their own profile"
  on profiles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Anyone can check if email exists" 
  on profiles for select 
  to anon
  using (true);

-- Create links table
create table links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  slug text unique,
  whatsapp text not null,
  message text,
  bg_color text default '#ffffff',
  btn_color text default '#25D366',
  is_active boolean default true,
  clicks integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table links enable row level security;

-- Create RLS policies
create policy "Anyone can view active links"
  on links for select
  to anon
  using (is_active = true);

create policy "Users can view their own links"
  on links for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own links"
  on links for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own links"
  on links for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own links"
  on links for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create indexes
create index idx_profiles_email on profiles(email);
create index idx_links_slug on links(slug);
create index idx_links_user on links(user_id);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add triggers
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

create trigger update_links_updated_at
  before update on links
  for each row
  execute function update_updated_at_column();