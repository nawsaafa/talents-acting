-- Search Vector Setup for PostgreSQL Full-Text Search
-- Run this SQL against your PostgreSQL database to enable FTS
--
-- Usage: psql $DATABASE_URL -f prisma/search-setup.sql
--
-- This creates a computed tsvector column and GIN index for fast text search
-- across talent profile fields (firstName, lastName, bio, languages, skills)

-- Add search_vector column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'TalentProfile' AND column_name = 'search_vector'
  ) THEN
    ALTER TABLE "TalentProfile" ADD COLUMN search_vector tsvector;
  END IF;
END $$;

-- Create function to generate search vector from profile fields
CREATE OR REPLACE FUNCTION talent_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', COALESCE(NEW."firstName", '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW."lastName", '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.bio, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.location, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(array_to_string(NEW.languages, ' '), '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(array_to_string(NEW."performanceSkills", ' '), '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(array_to_string(NEW."athleticSkills", ' '), '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(array_to_string(NEW."danceStyles", ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update search_vector on insert/update
DROP TRIGGER IF EXISTS talent_search_vector_trigger ON "TalentProfile";
CREATE TRIGGER talent_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "TalentProfile"
  FOR EACH ROW
  EXECUTE FUNCTION talent_search_vector_update();

-- Update existing rows to populate search_vector
UPDATE "TalentProfile" SET
  search_vector =
    setweight(to_tsvector('simple', COALESCE("firstName", '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE("lastName", '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(bio, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(location, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(array_to_string(languages, ' '), '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(array_to_string("performanceSkills", ' '), '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(array_to_string("athleticSkills", ' '), '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(array_to_string("danceStyles", ' '), '')), 'C');

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS "TalentProfile_search_vector_idx"
  ON "TalentProfile" USING GIN (search_vector);

-- Verify setup
SELECT
  'Search vector setup complete. ' ||
  COUNT(*) || ' profiles indexed.' as status
FROM "TalentProfile"
WHERE search_vector IS NOT NULL;
