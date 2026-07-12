import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.{vue,js,ts}',
    './app/pages/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Green — primary
        green: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        // Brand Blue — secondary
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A5F',
        },
        // Brand Red/Pink — accent
        red: {
          50: '#FFF1F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#BE123C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        // Neutral grays for text and surfaces
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // SSM brand shorthands
        brand: {
          green: '#15803D',
          blue: '#1D4ED8',
          red: '#BE123C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        layout: '1280px',
        article: '720px',
      },
      zIndex: {
        header: '100',
        modal: '200',
        toast: '300',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
        header: '0 1px 3px rgba(0,0,0,0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#111827',
            a: { color: '#2563EB', '&:hover': { color: '#1D4ED8' } },
            h1: { color: '#111827', fontWeight: '800' },
            h2: { color: '#111827', fontWeight: '700' },
            h3: { color: '#111827', fontWeight: '600' },
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config
