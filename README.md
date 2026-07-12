# SSM TV — News & Media Website

Kinyarwanda-first news and media website for SSM TV, built with Nuxt 3, Pinia, Tailwind CSS, and Supabase.

## Tech Stack

- **Frontend**: Nuxt 3 (Vue 3 Composition API), Pinia, Tailwind CSS
- **Backend**: Nitro server routes (Nuxt 3 built-in)
- **Database & Auth**: Supabase (PostgreSQL, Auth, Storage)
- **Internationalization**: @nuxtjs/i18n (rw default, en, fr)
- **Rich Text Editor**: TipTap (admin panel)

## Site Structure

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero, latest news grid, category previews, video section, most-read sidebar |
| Category | `/category/[slug]` | Paginated articles by category |
| Article | `/article/[slug]` | Full article with share, related articles, JSON-LD |
| SSM TV | `/ssm-tv` | Video articles grid, YouTube subscription CTA |
| About | `/about` | Mission, vision, team |
| Contact | `/contact` | Contact form → Supabase |
| Search | `/search?q=` | Search articles |
| Admin Login | `/admin/login` | Supabase Auth |
| Admin Dashboard | `/admin` | Stats, recent articles |
| Admin Articles | `/admin/articles` | CRUD articles with multi-language translations |
| Admin Categories | `/admin/categories` | CRUD categories |
| Admin Messages | `/admin/messages` | Contact message inbox |

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project ([supabase.com](https://supabase.com))
- npm

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
SITE_URL=http://localhost:3000
# YouTube Data API v3 — see YouTube Integration section below
YOUTUBE_API_KEY=your-youtube-api-key
```

### Installation

```bash
npm install
```

### Database Setup

1. Go to your Supabase project dashboard → SQL Editor
2. Run `supabase/schema.sql` to create all tables, indexes, and RLS policies
3. Run `supabase/seed.sql` to insert initial categories
4. Create storage buckets in Supabase dashboard:
   - `article-images` — Public read
   - `avatars` — Public read
5. Create an admin user:
   - Go to Authentication → Users → Add User
   - After creating, update the user's profile role to `admin`:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
   ```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` for the Kinyarwanda homepage.

### Production Build

```bash
npm run build
npm run preview
```

## Internationalization

- **Default locale**: Kinyarwanda (`rw`) — no prefix (`/article/slug`)
- **English**: `/en/article/slug`
- **French**: `/fr/article/slug`
- UI strings in `app/locales/{rw,en,fr}.json`
- Article content translations stored in `article_translations` table

## Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Primary (Green) | Brand green | `#15803D` |
| Secondary (Blue) | Brand blue | `#1D4ED8` |
| Accent (Red/Pink) | Brand red | `#BE123C` |
| Body text | Neutral 900 | `#111827` |
| Page background | Neutral 50 | `#F9FAFB` |

## Admin Panel

Access at `/admin/login`. Features:

- **Dashboard**: Stats overview and recent articles
- **Articles**: Create/edit/delete with:
  - Multi-language translations (RW/EN/FR) per article
  - Image upload to Supabase Storage
  - SEO metadata (meta title, description, OG image)
  - Featured/published/video toggles
- **Categories**: CRUD with translations
- **Messages**: Contact form submission inbox

## Project Structure

```
ssm-tv/
├── app/                    # Nuxt application
│   ├── components/         # Vue components
│   │   ├── admin/          # Admin panel components
│   │   ├── article/        # Article cards, grid, hero, share, related
│   │   ├── home/           # Homepage sections
│   │   ├── layout/         # Header, footer, sidebar, navigation
│   │   ├── ui/             # Reusable UI primitives
│   │   └── video/          # Video card, grid, embed, modal
│   ├── composables/        # Vue composables
│   ├── layouts/            # Page layouts (default, admin, minimal)
│   ├── locales/            # i18n JSON files (rw, en, fr)
│   ├── middleware/         # Auth middleware
│   ├── pages/              # File-based routes
│   ├── plugins/            # Nuxt plugins
│   └── stores/             # Pinia stores
├── server/                 # Nitro server
│   ├── api/                # API routes
│   │   └── youtube/        # YouTube video fetch (cached, paginated)
│   ├── routes/             # Server routes (sitemap.xml)
│   └── utils/              # Server utilities
├── supabase/               # SQL schema and seed data
├── types/                  # TypeScript interfaces
├── utils/                  # Shared utilities
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── i18n.config.ts          # i18n configuration
```

## YouTube Integration

The **SSM TV** page (`/ssm-tv`) pulls videos directly from our YouTube channel and plays them **in-page** via an embedded player — visitors never leave the site.

### Zero-setup: works immediately

**No API key is required.** The server automatically uses YouTube's public RSS feed to fetch videos. This means the SSM TV page works right away with zero configuration — just `npm run dev` and the videos appear.

### How it works

1. **Channel resolution** — The server resolves `@THESTRUGGLESOFSINGLESMOTHERS` to a channel ID, then fetches videos from YouTube's public feed.
2. **Dual mode** — If you set `YOUTUBE_API_KEY` in `.env`, it uses the official API v3 (more reliable). If not, it falls back to the free public RSS feed automatically. Both modes produce identical results.
3. **Server-side caching** — Results are cached in memory for **30 minutes**. On errors, stale cache is served instead of a broken page.
4. **In-page playback** — Clicking a video opens it in a modal with an embedded `youtube-nocookie.com` player. The visitor never navigates to YouTube.

### Optional: adding a YouTube API key

For production use, adding an API key improves reliability and avoids dependency on HTML scraping. It's optional — the site works without it.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or select an existing one).
3. Go to **APIs & Services → Library**, search for **YouTube Data API v3**, and click **Enable**.
4. Go to **Credentials → Create Credentials → API Key**.
5. (Recommended) Restrict the key to the YouTube Data API v3.
6. Add to `.env`:
   ```bash
   YOUTUBE_API_KEY=AIzaSy...
   ```
7. Restart the dev server.

**Quota:** 10,000 units/day free. Each 30-min refresh uses ~2 units (~96/day, under 1% of quota).

### Cache behavior

| Scenario | Behavior |
|----------|----------|
| Request < 30 min since last fetch | Serve from cache |
| Request ≥ 30 min since last fetch | Fresh fetch from YouTube |
| Fetch fails, cache exists | Serve stale cache (with notice) |
| Fetch fails, no cache | Show error + retry button |

## License

Private — SSM TV
