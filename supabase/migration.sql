-- ============================================================================
-- SSM TV — Complete Supabase Database Schema
-- ============================================================================
-- Run this entire script in the Supabase SQL Editor:
--   https://app.supabase.com → Your Project → SQL Editor → New Query
--
-- Tables created:
--   1. profiles              — Admin/staff user profiles (extends auth.users)
--   2. categories            — Article categories
--   3. category_translations — i18n for categories (rw/en/fr)
--   4. articles              — News articles & video posts
--   5. article_translations  — i18n for articles (rw/en/fr)
--   6. contact_messages      — Contact form submissions
--   7. youtube_videos        — Synced YouTube channel videos
--
-- Storage: article-images bucket
-- Auth: email/password via Supabase Auth
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PROFILES (extends auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        text NOT NULL,
  display_name text NOT NULL DEFAULT '',
  avatar_url   text,
  role         text NOT NULL DEFAULT 'contributor'
               CHECK (role IN ('admin', 'editor', 'contributor')),
  bio          text,
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Auto-create a profile row when a new user signs up.
-- First user ever → admin. Subsequent users → contributor (admin promotes them later).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  profile_count integer;
  assigned_role text;
BEGIN
  SELECT COUNT(*) INTO profile_count FROM public.profiles;

  IF profile_count = 0 THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'contributor';
  END IF;

  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)),
    assigned_role
  );
  RETURN NEW;
END;
$$;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. CATEGORIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug          text NOT NULL UNIQUE,
  is_active     boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. CATEGORY TRANSLATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.category_translations (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id   bigint NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  language_code text NOT NULL CHECK (language_code IN ('rw', 'en', 'fr')),
  name          text NOT NULL,
  description   text,
  UNIQUE (category_id, language_code)
);

-- ----------------------------------------------------------------------------
-- 4. ARTICLES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id                 bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug               text NOT NULL UNIQUE,
  category_id        bigint REFERENCES public.categories(id) ON DELETE SET NULL,
  featured_image     text,
  featured_image_alt text,
  is_featured        boolean NOT NULL DEFAULT false,
  is_published       boolean NOT NULL DEFAULT false,
  is_video           boolean NOT NULL DEFAULT false,
  youtube_url        text,
  view_count         integer NOT NULL DEFAULT 0,
  comments_count     integer NOT NULL DEFAULT 0,
  published_at       timestamptz,
  meta_title         text,
  meta_description   text,
  og_image           text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- NOTE: author_id FK already exists in the production database.
-- The column is: author_id bigint REFERENCES public.profiles(id) ON DELETE SET NULL

-- ----------------------------------------------------------------------------
-- 5. ARTICLE TRANSLATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.article_translations (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  article_id    bigint NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  language_code text NOT NULL CHECK (language_code IN ('rw', 'en', 'fr')),
  title         text NOT NULL,
  excerpt       text,
  content       text,
  UNIQUE (article_id, language_code)
);

-- ----------------------------------------------------------------------------
-- 6. CONTACT MESSAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text,
  message    text NOT NULL,
  is_read    boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 7. YOUTUBE VIDEOS (synced from YouTube Data API v3)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.youtube_videos (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  youtube_video_id text NOT NULL UNIQUE,
  title            text NOT NULL DEFAULT '',
  slug             text NOT NULL DEFAULT '',
  thumbnail        text NOT NULL DEFAULT '',
  video_url        text NOT NULL DEFAULT '',
  views            integer NOT NULL DEFAULT 0,
  comments_count   integer NOT NULL DEFAULT 0,
  description      text NOT NULL DEFAULT '',
  duration         text NOT NULL DEFAULT '',
  published_at     timestamptz NOT NULL DEFAULT now(),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_articles_published     ON public.articles (is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured      ON public.articles (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_articles_category      ON public.articles (category_id);
CREATE INDEX IF NOT EXISTS idx_articles_view_count    ON public.articles (view_count DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug          ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_translations_article   ON public.article_translations (article_id, language_code);
CREATE INDEX IF NOT EXISTS idx_translations_category  ON public.category_translations (category_id, language_code);
CREATE INDEX IF NOT EXISTS idx_categories_slug        ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_active      ON public.categories (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_contact_created        ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_video_id       ON public.youtube_videos (youtube_video_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role          ON public.profiles (role);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Profiles ----------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles: users can read own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Profiles: admins can read all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Profiles: admins can insert"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Profiles: admins can update"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Categories ---------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories: public read active"
  ON public.categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Categories: editor CRUD"
  ON public.categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

-- Category translations ----------------------------------------------------
ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Category translations: public read"
  ON public.category_translations FOR SELECT
  USING (true);

CREATE POLICY "Category translations: editor CRUD"
  ON public.category_translations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

-- Articles -----------------------------------------------------------------
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles: public read published"
  ON public.articles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Articles: editor read all"
  ON public.articles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Articles: editor insert"
  ON public.articles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Articles: editor update"
  ON public.articles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Articles: editor delete"
  ON public.articles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

-- Article translations -----------------------------------------------------
ALTER TABLE public.article_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Article translations: public read"
  ON public.article_translations FOR SELECT
  USING (true);

CREATE POLICY "Article translations: editor insert"
  ON public.article_translations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Article translations: editor update"
  ON public.article_translations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Article translations: editor delete"
  ON public.article_translations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

-- Contact messages ---------------------------------------------------------
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contact: anyone can submit"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Contact: admin can read"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

-- YouTube videos -----------------------------------------------------------
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "YouTube: public read"
  ON public.youtube_videos FOR SELECT
  TO anon, authenticated
  USING (true);

-- BUG FIX: Restrict write access to service_role only.
-- Previously this allowed anon (unauthenticated) full CRUD — a critical
-- security hole that let anyone insert/update/delete video records.
CREATE POLICY "YouTube: server upsert"
  ON public.youtube_videos FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- STORAGE BUCKET (for article images)
-- ============================================================================

-- Create the bucket (this is done via dashboard or storage API, but the
-- SQL below sets up the RLS policies)

-- Run these AFTER creating the 'article-images' bucket in:
--   Dashboard → Storage → New Bucket → name: article-images → Public bucket: YES

-- Allow public read access to article images
CREATE POLICY "Storage: public read article images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'article-images');

-- Allow authenticated editors to upload
CREATE POLICY "Storage: editor upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'article-images'
    AND (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
      )
    )
  );

-- Allow authenticated editors to delete their uploads
CREATE POLICY "Storage: editor delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'article-images'
    AND (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
      )
    )
  );

-- ============================================================================
-- SEED: default categories (optional — comment out if not wanted)
-- ============================================================================

-- INSERT INTO public.categories (slug, display_order) VALUES
--   ('politiki',         1),
--   ('imyidagaduro',     2),
--   ('ubuzima',          3),
--   ('ubucuruzi',        4),
--   ('imikino',          5),
--   ('ikoranabuhanga',   6)
-- ON CONFLICT (slug) DO NOTHING;

-- Then insert translations separately in the Supabase dashboard or via API.
