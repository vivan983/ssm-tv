-- ============================================================
-- SSM TV — Seed Data (safe to run anytime — uses ON CONFLICT)
-- ============================================================
-- Run this in Supabase SQL Editor to ensure the 6 editorial
-- categories exist. Does NOT overwrite existing data.

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (slug, display_order) VALUES
  ('politiki', 1),
  ('imyidagaduro', 2),
  ('ubuzima', 3),
  ('ubucuruzi', 4),
  ('imikino', 5),
  ('ikoranabuhanga', 6)
ON CONFLICT (slug) DO NOTHING;

-- Category translations (Kinyarwanda) — safe to re-run
INSERT INTO category_translations (category_id, language_code, name, description)
SELECT id, 'rw', name, description FROM (VALUES
  ('politiki', 'Politiki', 'Inkuru zijyanye na politiki mu Rwanda no ku isi'),
  ('imyidagaduro', 'Imyidagaduro', 'Inkuru zijyanye n''imyidagaduro, umuziki, na filime'),
  ('ubuzima', 'Ubuzima', 'Inkuru zijyanye n''ubuzima, ubuvuzi, n''imibereho myiza'),
  ('ubucuruzi', 'Ubucuruzi', 'Inkuru zijyanye n''ubucuruzi, isoko, n''ubukungu'),
  ('imikino', 'Imikino', 'Inkuru zijyanye n''imikino mu Rwanda no ku isi'),
  ('ikoranabuhanga', 'Ikoranabuhanga', 'Inkuru zijyanye n''ikoranabuhanga, mudasobwa, na interineti')
) AS t(slug, name, description)
JOIN categories ON categories.slug = t.slug
ON CONFLICT (category_id, language_code) DO NOTHING;

-- Category translations (English) — safe to re-run
INSERT INTO category_translations (category_id, language_code, name, description)
SELECT id, 'en', name, description FROM (VALUES
  ('politiki', 'Politics', 'News about politics in Rwanda and worldwide'),
  ('imyidagaduro', 'Entertainment', 'News about entertainment, music, and film'),
  ('ubuzima', 'Health', 'News about health, medicine, and wellbeing'),
  ('ubucuruzi', 'Business', 'News about business, markets, and the economy'),
  ('imikino', 'Sports', 'Sports news from Rwanda and worldwide'),
  ('ikoranabuhanga', 'Technology', 'News about technology, computers, and the internet')
) AS t(slug, name, description)
JOIN categories ON categories.slug = t.slug
ON CONFLICT (category_id, language_code) DO NOTHING;

-- Category translations (French) — safe to re-run
INSERT INTO category_translations (category_id, language_code, name, description)
SELECT id, 'fr', name, description FROM (VALUES
  ('politiki', 'Politique', 'Actualités sur la politique au Rwanda et dans le monde'),
  ('imyidagaduro', 'Divertissement', 'Actualités sur le divertissement, la musique et le cinéma'),
  ('ubuzima', 'Santé', 'Actualités sur la santé, la médecine et le bien-être'),
  ('ubucuruzi', 'Affaires', 'Actualités sur les affaires, les marchés et l''économie'),
  ('imikino', 'Sports', 'Actualités sportives du Rwanda et du monde'),
  ('ikoranabuhanga', 'Technologie', 'Actualités sur la technologie, les ordinateurs et internet')
) AS t(slug, name, description)
JOIN categories ON categories.slug = t.slug
ON CONFLICT (category_id, language_code) DO NOTHING;

-- ============================================================
-- ARTICLES (Placeholder — real admin creates these via CMS)
-- ============================================================
-- This is just placeholder. In production, articles are created
-- through the admin panel.
-- The homepage will show a BaseEmptyState if no articles exist,
-- prompting the admin to create content via the CMS.
