import daisyui from 'daisyui';

// Tailwind config.
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0F172A',
          secondary: '#111827',
        },
        surface: {
          DEFAULT: '#1E293B',
          hover: '#253449',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.12)',
        },
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          muted: 'rgba(99,102,241,0.15)',
        },
        success: {
          DEFAULT: '#22C55E',
          muted: 'rgba(34,197,94,0.15)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          muted: 'rgba(245,158,11,0.15)',
        },
        danger: {
          DEFAULT: '#EF4444',
          muted: 'rgba(239,68,68,0.15)',
        },
        content: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        display: ['1.875rem', { lineHeight: '2.25rem', fontWeight: '600', letterSpacing: '-0.02em' }],
        heading: ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600', letterSpacing: '-0.01em' }],
        subheading: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        body: ['0.875rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
        'btn-sm': ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        'btn-md': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.24), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.06)',
        button: '0 1px 2px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
        modal: '0 24px 48px rgba(0,0,0,0.48), 0 0 0 1px rgba(255,255,255,0.06)',
        focus: '0 0 0 3px rgba(99,102,241,0.35)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      backdropBlur: {
        modal: '12px',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['dark'],
  },
};
