/*
  # Create memes and tags tables

  1. New Tables
    - `memes`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `image_url` (text, required)
      - `description` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)
    - `tags`
      - `id` (uuid, primary key)
      - `name` (text, required)
    - `meme_tags`
      - Junction table for many-to-many relationship between memes and tags
      
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own memes
    - Allow public read access to memes and tags
*/

-- Create memes table
CREATE TABLE IF NOT EXISTS memes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || COALESCE(description, ''))
  ) STORED
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

-- Create junction table for memes and tags
CREATE TABLE IF NOT EXISTS meme_tags (
  meme_id uuid REFERENCES memes ON DELETE CASCADE,
  tag_id uuid REFERENCES tags ON DELETE CASCADE,
  PRIMARY KEY (meme_id, tag_id)
);

-- Create index for full text search
CREATE INDEX IF NOT EXISTS memes_search_idx ON memes USING gin(search_vector);

-- Enable Row Level Security
ALTER TABLE memes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE meme_tags ENABLE ROW LEVEL SECURITY;

-- Policies for memes
CREATE POLICY "Allow public read access to memes" 
  ON memes FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Allow authenticated users to insert their own memes" 
  ON memes FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own memes" 
  ON memes FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own memes" 
  ON memes FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Policies for tags
CREATE POLICY "Allow public read access to tags" 
  ON tags FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Allow authenticated users to insert tags" 
  ON tags FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Policies for meme_tags
CREATE POLICY "Allow public read access to meme_tags" 
  ON meme_tags FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Allow authenticated users to manage meme tags" 
  ON meme_tags FOR ALL 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM memes 
    WHERE memes.id = meme_id 
    AND memes.user_id = auth.uid()
  ));