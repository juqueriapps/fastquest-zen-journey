/*
  # Create current fasting sessions table for real-time synchronization

  1. New Tables
    - `current_fasting_sessions`
      - `user_id` (uuid, primary key, references auth.users)
      - `start_time` (timestamptz, when fasting started)
      - `target_hours` (integer, fasting goal in hours)
      - `status` (text, active/completed/cancelled)
      - `created_at` (timestamptz, when record was created)
      - `updated_at` (timestamptz, when record was last updated)

  2. Security
    - Enable RLS on `current_fasting_sessions` table
    - Add policy for authenticated users to manage their own fasting sessions
    - Add policy for users to read their own fasting sessions

  3. Constraints
    - Ensure only one active fasting session per user
    - Default status is 'active'
    - Automatic timestamp updates
*/

CREATE TABLE IF NOT EXISTS current_fasting_sessions (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  target_hours integer NOT NULL DEFAULT 16,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE current_fasting_sessions ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own fasting sessions
CREATE POLICY "Users can manage own fasting sessions"
  ON current_fasting_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_current_fasting_sessions_updated_at
  BEFORE UPDATE ON current_fasting_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_current_fasting_sessions_user_status 
  ON current_fasting_sessions(user_id, status);
