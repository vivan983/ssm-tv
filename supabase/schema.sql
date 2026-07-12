-- ============================================================
-- SSM TV — Supabase Database Schema (REFERENCE / DESIGN DOC)
-- ============================================================
-- NOTE: This file is the DESIGN REFERENCE schema (UUID-based).
-- For production deployment, use migration.sql (BIGINT-based)
-- and migration-ads.sql instead. Those files are the canonical
-- production migrations with IF NOT EXISTS guards.
--
-- Do NOT run both schema.sql AND migration.sql on the same
-- database — they define conflicting table structures.
-- ============================================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase Auth users)
-- ============================================================
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         VARCHAR(255),
  display_name  VARCHAR(100) NOT NULL,
  avatar_url    VARCHAR(500),
  role          VARCHAR(20) NOT NULL DEFAULT 'editor'
                CHECK (role IN ('admin', 'editor', 'contributor')),
  bio           TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'editor'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          VARCHAR(100) UNIQUE NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_categories_slug ON categories(slug);

-- ============================================================
-- CATEGORY TRANSLATIONS
-- ============================================================
CREATE TABLE category_translations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  language_code VARCHAR(2) NOT NULL CHECK (language_code IN ('rw', 'en', 'fr')),
  name          VARCHAR(200) NOT NULL,
  description   TEXT,
  UNIQUE(category_id, language_code)
);

CREATE INDEX idx_cat_trans_category ON category_translations(category_id);

-- ============================================================
-- ARTICLES
-- ============================================================
CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(200) UNIQUE NOT NULL,
  category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  featured_image  VARCHAR(500),
  featured_image_alt VARCHAR(200),
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  is_video        BOOLEAN NOT NULL DEFAULT false,
  youtube_url     VARCHAR(500),
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  view_count      INTEGER NOT NULL DEFAULT 0,
  meta_title      VARCHAR(200),
  meta_description VARCHAR(500),
  og_image        VARCHAR(500)
);

CREATE UNIQUE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_published ON articles(is_published, published_at DESC);
CREATE INDEX idx_articles_featured ON articles(is_featured, is_published);

-- ============================================================
-- ARTICLE TRANSLATIONS
-- ============================================================
CREATE TABLE article_translations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id    UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  language_code VARCHAR(2) NOT NULL CHECK (language_code IN ('rw', 'en', 'fr')),
  title         VARCHAR(300) NOT NULL,
  excerpt       TEXT,
  content       TEXT,
  UNIQUE(article_id, language_code)
);

CREATE INDEX idx_art_trans_article ON article_translations(article_id);
CREATE INDEX idx_art_trans_lang ON article_translations(language_code);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  subject     VARCHAR(300),
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_read ON contact_messages(is_read);

-- ============================================================
-- ARTICLE VIEWS (analytics)
-- ============================================================
CREATE TABLE article_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id  UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address  VARCHAR(45),
  user_agent  TEXT
);

CREATE INDEX idx_views_article ON article_views(article_id);
CREATE INDEX idx_views_date ON article_views(viewed_at);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (id = auth.uid());

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert categories"
  ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update categories"
  ON categories FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete categories"
  ON categories FOR DELETE USING (auth.role() = 'authenticated');

-- Category Translations
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view cat translations"
  ON category_translations FOR SELECT USING (true);

CREATE POLICY "Authenticated can manage cat translations"
  ON category_translations FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update cat translations"
  ON category_translations FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete cat translations"
  ON category_translations FOR DELETE USING (auth.role() = 'authenticated');

-- Articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published articles"
  ON articles FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated can view all articles"
  ON articles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert articles"
  ON articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update articles"
  ON articles FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete articles"
  ON articles FOR DELETE USING (auth.role() = 'authenticated');

-- Article Translations
ALTER TABLE article_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published article translations"
  ON article_translations FOR SELECT USING (
    EXISTS (SELECT 1 FROM articles WHERE id = article_id AND is_published = true)
  );

CREATE POLICY "Authenticated can manage article translations"
  ON article_translations FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update article translations"
  ON article_translations FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete article translations"
  ON article_translations FOR DELETE USING (auth.role() = 'authenticated');

-- Contact Messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can view messages"
  ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- YOUTUBE VIDEOS (synced from YouTube channel)
-- ============================================================
CREATE TABLE youtube_videos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_video_id VARCHAR(20) NOT NULL UNIQUE,
  title           VARCHAR(500) NOT NULL,
  slug            VARCHAR(300) NOT NULL UNIQUE,
  thumbnail       VARCHAR(500),
  video_url       VARCHAR(500) NOT NULL,
  views           INTEGER NOT NULL DEFAULT 0,
  comments_count  INTEGER NOT NULL DEFAULT 0,
  description     TEXT,
  duration        VARCHAR(20),
  published_at    TIMESTAMPTZ NOT NULL,
  synced_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_yt_videos_published ON youtube_videos(published_at DESC);
CREATE INDEX idx_yt_videos_youtube_id ON youtube_videos(youtube_video_id);

ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view youtube videos"
  ON youtube_videos FOR SELECT USING (true);

CREATE POLICY "Authenticated can manage youtube videos"
  ON youtube_videos FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- After creating the schema, create buckets via the Supabase dashboard:
-- 1. 'article-images' — Public read, authenticated write
-- 2. 'avatars' — Public read, authenticated write
-- Or use the Storage API / dashboard to configure these.
