import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f0e0c',
        surface: '#1c1a16',
        'surface-elevated': '#262320',
        amber: '#f0a03c',
        ember: '#e85d3a',
        parchment: '#e8e0d4',
        stone: '#7a7168',
        clay: '#b5846a',
        gold: '#d4a843',
        sage: '#6dba6a',
        space: '#0f0e0c',
        nebula: '#1c1a16',
        cyan: '#f0a03c',
        mint: '#d4a843',
        violet: '#e85d3a',
        success: '#6dba6a',
        warning: '#e8a838',
        danger: '#d94444',
        text: '#e8e0d4',
        muted: '#7a7168',
        card: '#1c1a16',
        'card-hover': '#262320',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 4px 24px rgba(240, 160, 60, 0.15)',
        'glow-lg': '0 8px 40px rgba(240, 160, 60, 0.2)',
        violet: '0 4px 24px rgba(232, 93, 58, 0.15)',
        'violet-lg': '0 8px 40px rgba(232, 93, 58, 0.2)',
        success: '0 4px 24px rgba(109, 186, 106, 0.15)',
        card: '0 4px 24px rgba(0, 0, 0, 0.35)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(240, 160, 60, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        '3xl': '64px',
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
          '0%, 100%': { boxShadow: '0 0 12px rgba(240, 160, 60, 0.1)' },
          '50%': { boxShadow: '0 0 24px rgba(240, 160, 60, 0.2)' },
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
