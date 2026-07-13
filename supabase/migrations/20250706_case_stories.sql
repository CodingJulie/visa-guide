-- Case stories archive — real anonymized immigration journeys

DO $$ BEGIN CREATE TYPE story_outcome AS ENUM ('approved', 'denied', 'pending', 'mixed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS case_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title_en TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    summary_ru TEXT NOT NULL,
    story_en TEXT NOT NULL,
    story_ru TEXT NOT NULL,
    person_alias_en TEXT NOT NULL,
    person_alias_ru TEXT NOT NULL,
    origin_country TEXT NOT NULL,
    visa_types TEXT[] NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',
    outcome story_outcome NOT NULL DEFAULT 'pending',
    is_complex BOOLEAN NOT NULL DEFAULT false,
    lawyer_involved BOOLEAN NOT NULL DEFAULT false,
    duration_months INT,
    lessons_learned_en TEXT,
    lessons_learned_ru TEXT,
    key_takeaways_en TEXT[] DEFAULT '{}',
    key_takeaways_ru TEXT[] DEFAULT '{}',
    status content_status NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_case_stories_status ON case_stories(status);
CREATE INDEX IF NOT EXISTS idx_case_stories_visa_types ON case_stories USING GIN (visa_types);
CREATE INDEX IF NOT EXISTS idx_case_stories_tags ON case_stories USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_case_stories_outcome ON case_stories(outcome);

ALTER TABLE case_stories ENABLE ROW LEVEL SECURITY;

-- Public read for published stories (no auth required)
DROP POLICY IF EXISTS case_stories_public_read ON case_stories;
CREATE POLICY case_stories_public_read ON case_stories
    FOR SELECT TO authenticated, anon
    USING (status = 'published' OR is_editor_or_admin());

DROP POLICY IF EXISTS case_stories_write ON case_stories;
CREATE POLICY case_stories_write ON case_stories
    FOR ALL USING (is_editor_or_admin());
