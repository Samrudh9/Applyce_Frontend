import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Surfaces ── */
        ink: '#f5f7fa',           /* page background – light blue-gray */
        surface: '#ffffff',       /* card/container background – white */
        'surface-elevated': '#f0f2f5',

        /* ── Brand accents ── */
        mint: '#34d399',          /* primary accent – mint green */
        'mint-dark': '#10b981',
        purple: '#7c3aed',        /* CTA accent – vivid purple */
        'purple-dark': '#6d28d9',

        /* ── Text ── */
        text: '#1e293b',          /* primary – near-black / charcoal */
        muted: '#64748b',         /* secondary – muted gray */
        stone: '#94a3b8',         /* tertiary / placeholder */

        /* ── Borders ── */
        border: '#e2e8f0',        /* soft cool gray */
        'border-hover': '#cbd5e1',

        /* ── Semantic ── */
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',

        /* ── Legacy aliases (for gradual migration) ── */
        amber: '#34d399',
        ember: '#7c3aed',
        parchment: '#1e293b',
        cyan: '#34d399',
        gold: '#10b981',
        violet: '#7c3aed',
        sage: '#22c55e',
        card: '#ffffff',
        'card-hover': '#f8fafc',
        space: '#ffffff',
        nebula: '#f5f7fa',
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'glow-lg': '0 4px 16px rgba(0, 0, 0, 0.08)',
        card: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(52, 211, 153, 0.12)',
        violet: '0 8px 30px rgba(124, 58, 237, 0.08)',
        'violet-lg': '0 12px 40px rgba(124, 58, 237, 0.12)',
        success: '0 4px 16px rgba(34, 197, 94, 0.1)',
        soft: '0 1px 2px rgba(0, 0, 0, 0.04)',
        md: '0 4px 12px rgba(0, 0, 0, 0.06)',
        lg: '0 8px 30px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(52, 211, 153, 0.08)' },
          '50%': { boxShadow: '0 0 24px rgba(52, 211, 153, 0.15)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
