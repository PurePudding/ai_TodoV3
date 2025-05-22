/*
  # User Authentication and Shared Tasks Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)

    - `shared_tasks`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `completed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `task_shares`
      - `task_id` (uuid, references shared_tasks)
      - `user_id` (uuid, references profiles)
      - `can_edit` (boolean)
      - `is_minimized` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create shared tasks table
CREATE TABLE IF NOT EXISTS shared_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create task shares table (for managing shared access)
CREATE TABLE IF NOT EXISTS task_shares (
  task_id uuid REFERENCES shared_tasks ON DELETE CASCADE,
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  can_edit boolean DEFAULT false,
  is_minimized boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (task_id, user_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_shares ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Shared tasks policies
CREATE POLICY "Users can view tasks they own or have access to"
  ON shared_tasks
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM task_shares
      WHERE task_id = shared_tasks.id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks"
  ON shared_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update tasks they own or have edit access"
  ON shared_tasks
  FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM task_shares
      WHERE task_id = shared_tasks.id
      AND user_id = auth.uid()
      AND can_edit = true
    )
  );

CREATE POLICY "Users can delete tasks they own"
  ON shared_tasks
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Task shares policies
CREATE POLICY "Users can view their task shares"
  ON task_shares
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM shared_tasks
      WHERE id = task_shares.task_id
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Task owners can manage shares"
  ON task_shares
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shared_tasks
      WHERE id = task_shares.task_id
      AND owner_id = auth.uid()
    )
  );

-- Function to check share limit
CREATE OR REPLACE FUNCTION check_share_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM task_shares
    WHERE task_id = NEW.task_id
  ) >= 5 THEN
    RAISE EXCEPTION 'Maximum of 5 shares per task allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce share limit
CREATE TRIGGER enforce_share_limit
  BEFORE INSERT ON task_shares
  FOR EACH ROW
  EXECUTE FUNCTION check_share_limit();