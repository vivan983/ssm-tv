-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║                    SSM TV — ADVERTISING MODULE                       ║
-- ║                    Production Database Migration                     ║
-- ╚══════════════════════════════════════════════════════════════════════╝
-- │
-- │  Run this entire script in your Supabase SQL Editor:
-- │    Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- │
-- │  What this creates:
-- │    1. advertisements table — campaign storage
-- │    2. Performance indexes
-- │    3. updated_at auto-trigger
-- │    4. Row Level Security (RLS) policies
-- │    5. Sample seed data for testing
-- │
-- ╚══════════════════════════════════════════════════════════════════════╝

-- ================================================================
-- 1. ADVERTISEMENTS TABLE
-- ================================================================
-- BUG FIX: Use CREATE TABLE IF NOT EXISTS instead of DROP TABLE ... CASCADE.
-- The previous DROP TABLE would silently destroy all ad data in production.
CREATE TABLE IF NOT EXISTS advertisements (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(200)  NOT NULL,
  advertiser       VARCHAR(200)  NOT NULL,
  desktop_image    VARCHAR(500),
  mobile_image     VARCHAR(500),
  destination_url  VARCHAR(1000),
  placement        VARCHAR(50)   NOT NULL DEFAULT 'sidebar'
                   CHECK (placement IN (
                     'homepage_banner',
                     'sidebar',
                     'in_article',
                     'footer_sponsor'
                   )),
  priority         INTEGER       NOT NULL DEFAULT 0,
  is_active        BOOLEAN       NOT NULL DEFAULT true,
  starts_at        TIMESTAMPTZ,
  expires_at       TIMESTAMPTZ,
  click_count      INTEGER       NOT NULL DEFAULT 0,
  impression_count INTEGER       NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ================================================================
-- 2. INDEXES
-- ================================================================
CREATE INDEX idx_ads_placement   ON advertisements (placement, is_active);
CREATE INDEX idx_ads_active_dates ON advertisements (is_active, starts_at, expires_at);
CREATE INDEX idx_ads_priority    ON advertisements (priority DESC);

-- ================================================================
-- 3. UPDATED_AT AUTO-TRIGGER
-- ================================================================
CREATE OR REPLACE FUNCTION update_advertisements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ads_updated_at ON advertisements;
CREATE TRIGGER trg_ads_updated_at
  BEFORE UPDATE ON advertisements
  FOR EACH ROW EXECUTE FUNCTION update_advertisements_updated_at();

-- ================================================================
-- 4. ROW LEVEL SECURITY
-- ================================================================
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

-- Public visitors can only see active ads within their date range
CREATE POLICY "Public_read_active_ads"
  ON advertisements FOR SELECT
  USING (
    is_active = true
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (expires_at IS NULL OR expires_at >= NOW())
  );

-- BUG FIX: Check the user's actual role in profiles, not just authenticated status.
-- Previously any logged-in user (including contributors) could manage all ads.
CREATE POLICY "Authenticated_manage_ads"
  ON advertisements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- ================================================================
-- 5. SEED DATA (sample campaigns for testing)
-- ================================================================
-- Remove these INSERTs once you've created your own campaigns
-- via the admin panel at /admin/ads

INSERT INTO advertisements (name, advertiser, placement, priority, is_active, destination_url) VALUES
  ('SSM TV — Reba Amashusho Mashya', 'SSM TV', 'homepage_banner', 10, true, 'https://www.youtube.com/@THESTRUGGLESOFSINGLESMOTHERS'),
  ('Ubucuruzi Bwawe Burashobora Kuba Hano', 'SSM TV Advertising', 'sidebar', 5, true, '/contact'),
  ('Amakuru Agezweho — Subikira Umunsi ku Wundi', 'SSM TV News', 'in_article', 3, true, '/'),
  ('MTN Rwanda', 'MTN', 'footer_sponsor', 1, true, 'https://www.mtn.co.rw'),
  ('BK Group', 'Bank of Kigali', 'footer_sponsor', 1, true, 'https://www.bk.rw'),
  ('RwandaAir', 'RwandAir', 'footer_sponsor', 1, true, 'https://www.rwandair.com');

-- ================================================================
-- DONE — Refresh your site. Ads table is ready.
-- Visit /admin/ads to manage campaigns.
-- ================================================================
