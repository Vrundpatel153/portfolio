/*
  # Initial Schema Setup for Portfolio Site

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `image_url` (text, not null)
      - `live_url` (text)
      - `repo_url` (text)
      - `technologies` (text array)
      - `created_at` (timestamptz, default now())
    - `certifications`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `issuer` (text, not null)
      - `date_issued` (date, not null)
      - `credential_url` (text)
      - `image_url` (text)
      - `description` (text)
    - `skills`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `icon` (text, not null)
      - `category` (text, not null)
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `subject` (text, not null)
      - `message` (text, not null)
      - `created_at` (timestamptz, default now())
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users(id) on delete cascade)
      - `full_name` (text)
      - `bio` (text)
      - `avatar_url` (text)
      - `location` (text)
      - `website_url` (text)
      - `github_url` (text)
      - `linkedin_url` (text)
      - `twitter_url` (text)
      - `updated_at` (timestamptz, default now())
      
  2. Security
    - Enable RLS on all tables
    - Set up policies for authenticated users to manage content
    - Allow public read access to projects, certifications, and skills
*/

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  live_url text,
  repo_url text,
  technologies text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  date_issued date NOT NULL,
  credential_url text,
  image_url text,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  bio text,
  avatar_url text,
  location text,
  website_url text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Projects Policies
CREATE POLICY "Public can view projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (true);

-- Certifications Policies
CREATE POLICY "Public can view certifications"
  ON certifications
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert certifications"
  ON certifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update certifications"
  ON certifications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete certifications"
  ON certifications
  FOR DELETE
  TO authenticated
  USING (true);

-- Skills Policies
CREATE POLICY "Public can view skills"
  ON skills
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert skills"
  ON skills
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update skills"
  ON skills
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete skills"
  ON skills
  FOR DELETE
  TO authenticated
  USING (true);

-- Contact Messages Policies
CREATE POLICY "Public can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete contact messages"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);