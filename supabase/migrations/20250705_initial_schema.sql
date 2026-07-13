-- Visa Guide Platform — initial schema

DO $$ BEGIN CREATE TYPE user_role AS ENUM ('user', 'editor', 'admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE update_severity AS ENUM ('info', 'warning', 'critical'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE checklist_status AS ENUM ('not_started', 'in_progress', 'ready'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'user',
    full_name TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'ru')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Visa categories & types
CREATE TABLE IF NOT EXISTS visa_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visa_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES visa_categories(id) ON DELETE SET NULL,
    code TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    description_en TEXT,
    description_ru TEXT,
    lawyer_recommended BOOLEAN NOT NULL DEFAULT false,
    status content_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visa_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visa_type_id UUID NOT NULL REFERENCES visa_types(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    title_en TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_ru TEXT NOT NULL,
    conditions_json JSONB DEFAULT '[]',
    required_forms TEXT[] DEFAULT '{}',
    estimated_days INT,
    status content_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (visa_type_id, step_number)
);

CREATE TABLE IF NOT EXISTS visa_document_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visa_type_id UUID NOT NULL REFERENCES visa_types(id) ON DELETE CASCADE,
    doc_name_en TEXT NOT NULL,
    doc_name_ru TEXT NOT NULL,
    description_en TEXT,
    description_ru TEXT,
    conditions_json JSONB DEFAULT '[]',
    is_mandatory BOOLEAN NOT NULL DEFAULT true,
    status content_status NOT NULL DEFAULT 'draft',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visa_eligibility_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visa_type_id UUID NOT NULL REFERENCES visa_types(id) ON DELETE CASCADE,
    rules_json JSONB NOT NULL,
    version INT NOT NULL DEFAULT 1,
    status content_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Questionnaire
CREATE TABLE IF NOT EXISTS questionnaire_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    title_en TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS questionnaire_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES questionnaire_sections(id) ON DELETE SET NULL,
    key TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    label_en TEXT NOT NULL,
    label_ru TEXT NOT NULL,
    options_json JSONB,
    conditions_json JSONB DEFAULT '[]',
    required BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    status content_status NOT NULL DEFAULT 'published'
);

-- Legal content
CREATE TABLE IF NOT EXISTS legal_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title_en TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    summary_en TEXT,
    summary_ru TEXT,
    content_en TEXT NOT NULL,
    content_ru TEXT NOT NULL,
    source_url TEXT,
    affected_visa_types TEXT[] DEFAULT '{}',
    last_verified_at TIMESTAMPTZ,
    status content_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legal_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    summary_ru TEXT NOT NULL,
    severity update_severity NOT NULL DEFAULT 'info',
    affected_visa_types TEXT[] DEFAULT '{}',
    effective_date DATE,
    banner_active BOOLEAN NOT NULL DEFAULT false,
    banner_expires_at TIMESTAMPTZ,
    source_url TEXT,
    status content_status NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User cases
CREATE TABLE IF NOT EXISTS user_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    answers_json JSONB NOT NULL,
    recommended_visa_type TEXT,
    recommendation_json JSONB,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_case_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES user_cases(id) ON DELETE CASCADE,
    step_id UUID NOT NULL REFERENCES visa_steps(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (case_id, step_id)
);

CREATE TABLE IF NOT EXISTS user_checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES user_cases(id) ON DELETE CASCADE,
    doc_requirement_id UUID NOT NULL REFERENCES visa_document_requirements(id) ON DELETE CASCADE,
    status checklist_status NOT NULL DEFAULT 'not_started',
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (case_id, doc_requirement_id)
);

-- CMS versioning
CREATE TABLE IF NOT EXISTS content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    version_number INT NOT NULL,
    content_json JSONB NOT NULL,
    change_summary TEXT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_visa_steps_visa_type ON visa_steps(visa_type_id);
CREATE INDEX IF NOT EXISTS idx_user_cases_user ON user_cases(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_updates_banner ON legal_updates(banner_active, banner_expires_at);
CREATE INDEX IF NOT EXISTS idx_content_versions_entity ON content_versions(entity_type, entity_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON TABLE public.profiles TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_document_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_eligibility_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_case_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;

-- Helper: check editor/admin role
CREATE OR REPLACE FUNCTION is_editor_or_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role IN ('editor', 'admin')
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles policies
DROP POLICY IF EXISTS profiles_select_own ON profiles;
CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS profiles_update_own ON profiles;
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id);

-- Public read for published content
DROP POLICY IF EXISTS visa_categories_read ON visa_categories;
CREATE POLICY visa_categories_read ON visa_categories FOR SELECT TO authenticated, anon USING (true);
DROP POLICY IF EXISTS visa_types_read ON visa_types;
CREATE POLICY visa_types_read ON visa_types FOR SELECT TO authenticated, anon
    USING (status = 'published' OR is_editor_or_admin());
DROP POLICY IF EXISTS visa_steps_read ON visa_steps;
CREATE POLICY visa_steps_read ON visa_steps FOR SELECT TO authenticated, anon
    USING (status = 'published' OR is_editor_or_admin());
DROP POLICY IF EXISTS visa_docs_read ON visa_document_requirements;
CREATE POLICY visa_docs_read ON visa_document_requirements FOR SELECT TO authenticated, anon
    USING (status = 'published' OR is_editor_or_admin());
DROP POLICY IF EXISTS visa_rules_read ON visa_eligibility_rules;
CREATE POLICY visa_rules_read ON visa_eligibility_rules FOR SELECT TO authenticated, anon
    USING (status = 'published' OR is_editor_or_admin());
DROP POLICY IF EXISTS questionnaire_sections_read ON questionnaire_sections;
CREATE POLICY questionnaire_sections_read ON questionnaire_sections FOR SELECT TO authenticated, anon USING (true);
DROP POLICY IF EXISTS questionnaire_questions_read ON questionnaire_questions;
CREATE POLICY questionnaire_questions_read ON questionnaire_questions FOR SELECT TO authenticated, anon
    USING (status = 'published' OR is_editor_or_admin());
DROP POLICY IF EXISTS legal_articles_read ON legal_articles;
CREATE POLICY legal_articles_read ON legal_articles FOR SELECT TO authenticated, anon
    USING (status = 'published' OR is_editor_or_admin());
DROP POLICY IF EXISTS legal_updates_read ON legal_updates;
CREATE POLICY legal_updates_read ON legal_updates FOR SELECT TO authenticated, anon
    USING (status = 'published' OR is_editor_or_admin());

-- Editor write policies
DROP POLICY IF EXISTS visa_types_write ON visa_types;
CREATE POLICY visa_types_write ON visa_types FOR ALL USING (is_editor_or_admin());
DROP POLICY IF EXISTS visa_steps_write ON visa_steps;
CREATE POLICY visa_steps_write ON visa_steps FOR ALL USING (is_editor_or_admin());
DROP POLICY IF EXISTS visa_docs_write ON visa_document_requirements;
CREATE POLICY visa_docs_write ON visa_document_requirements FOR ALL USING (is_editor_or_admin());
DROP POLICY IF EXISTS visa_rules_write ON visa_eligibility_rules;
CREATE POLICY visa_rules_write ON visa_eligibility_rules FOR ALL USING (is_editor_or_admin());
DROP POLICY IF EXISTS questionnaire_questions_write ON questionnaire_questions;
CREATE POLICY questionnaire_questions_write ON questionnaire_questions FOR ALL USING (is_editor_or_admin());
DROP POLICY IF EXISTS legal_articles_write ON legal_articles;
CREATE POLICY legal_articles_write ON legal_articles FOR ALL USING (is_editor_or_admin());
DROP POLICY IF EXISTS legal_updates_write ON legal_updates;
CREATE POLICY legal_updates_write ON legal_updates FOR ALL USING (is_editor_or_admin());
DROP POLICY IF EXISTS content_versions_read ON content_versions;
CREATE POLICY content_versions_read ON content_versions FOR SELECT USING (is_editor_or_admin());
DROP POLICY IF EXISTS content_versions_write ON content_versions;
CREATE POLICY content_versions_write ON content_versions FOR INSERT WITH CHECK (is_editor_or_admin());

-- User cases: own data only
DROP POLICY IF EXISTS user_cases_select ON user_cases;
CREATE POLICY user_cases_select ON user_cases FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS user_cases_insert ON user_cases;
CREATE POLICY user_cases_insert ON user_cases FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS user_cases_update ON user_cases;
CREATE POLICY user_cases_update ON user_cases FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS user_cases_delete ON user_cases;
CREATE POLICY user_cases_delete ON user_cases FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_case_progress_all ON user_case_progress;
CREATE POLICY user_case_progress_all ON user_case_progress FOR ALL
    USING (EXISTS (SELECT 1 FROM user_cases c WHERE c.id = case_id AND c.user_id = auth.uid()));

DROP POLICY IF EXISTS user_checklist_all ON user_checklist_items;
CREATE POLICY user_checklist_all ON user_checklist_items FOR ALL
    USING (EXISTS (SELECT 1 FROM user_cases c WHERE c.id = case_id AND c.user_id = auth.uid()));
