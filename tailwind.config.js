/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Brand palette ─────────────────────── */
        brand: {
          purple: '#6C47FF',
          violet: '#8B5CF6',
          pink:   '#F40076',
          coral:  '#FF4D6D',
          cyan:   '#00C2FF',
          lime:   '#AEFF00',
          amber:  '#FFAA00',
          teal:   '#00D4AA',
          green:  '#22C55E',
        },
        /* ── Dark surfaces ─────────────────────── */
        dark: {
          50:  '#F0F0FF',
          900: '#0A0A0F',
          800: '#111118',
          700: '#18181F',
          600: '#1E1E28',
          500: '#252533',
          400: '#32324A',
          300: '#4A4A68',
        },
        /* ── Light surfaces ───────────────────── */
        light: {
          bg:    '#F6F5FF',
          card:  '#FFFFFF',
          muted: '#F8F7FF',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', '-apple-system', 'sans-serif'],
        sans:    ['DM Sans', '-apple-system', 'sans-serif'],
        mono:    ['DM Mono', 'IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        /* Elevation stack */
        'e0':    '0 1px 2px rgba(0,0,0,0.04)',
        'e1':    '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'e2':    '0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
        'e3':    '0 20px 50px rgba(0,0,0,0.1), 0 6px 16px rgba(0,0,0,0.05)',
        'e4':    '0 36px 80px rgba(0,0,0,0.14), 0 12px 28px rgba(0,0,0,0.06)',
        /* Brand glow shadows */
        'purple':  '0 8px 32px rgba(108,71,255,0.35), 0 2px 8px rgba(108,71,255,0.2)',
        'pink':    '0 8px 32px rgba(244,0,118,0.35), 0 2px 8px rgba(244,0,118,0.2)',
        'cyan':    '0 8px 32px rgba(0,194,255,0.35), 0 2px 8px rgba(0,194,255,0.2)',
        'amber':   '0 8px 32px rgba(255,170,0,0.35), 0 2px 8px rgba(255,170,0,0.2)',
        'teal':    '0 8px 32px rgba(0,212,170,0.35), 0 2px 8px rgba(0,212,170,0.2)',
        /* Inner glow */
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.08)',
        /* Sidebar nav active */
        'nav-active': 'inset 0 0 0 1px rgba(108,71,255,0.3), 0 0 0 3px rgba(108,71,255,0.08)',
      },
      backgroundImage: {
        /* Brand gradients */
        'gradient-brand':   'linear-gradient(135deg, #6C47FF, #F40076)',
        'gradient-energy':  'linear-gradient(135deg, #00C2FF, #6C47FF, #F40076)',
        'gradient-aurora':  'linear-gradient(135deg, #6C47FF, #8B5CF6, #F40076)',
        'gradient-warm':    'linear-gradient(135deg, #FFAA00, #FF4D6D)',
        'gradient-cool':    'linear-gradient(135deg, #00C2FF, #00D4AA)',
        /* Dark hero background */
        'hero-dark':        'linear-gradient(145deg, #0A0A0F 0%, #120A24 40%, #0A1230 80%, #0A0A0F 100%)',
        /* Card gradient */
        'card-subtle':      'linear-gradient(145deg, #FFFFFF 0%, #F8F7FF 100%)',
        /* Mesh background */
        'mesh-light':       'radial-gradient(at 20% 10%, hsla(250,100%,97%,1) 0px, transparent 50%), radial-gradient(at 80% 5%, hsla(280,100%,97%,1) 0px, transparent 50%), radial-gradient(at 5% 90%, hsla(220,100%,97%,1) 0px, transparent 45%), radial-gradient(at 95% 85%, hsla(310,100%,97%,1) 0px, transparent 45%)',
      },
      animation: {
        'float':        'float 5s ease-in-out infinite',
        'float-slow':   'float 8s ease-in-out infinite',
        'spin-slow':    'spin 10s linear infinite',
        'spin-reverse': 'spin-reverse 8s linear infinite',
        'shimmer':      'shimmer 2.5s linear infinite',
        'pulse-glow':   'pulse-glow 2.5s ease-in-out infinite',
        'ping-soft':    'ping-soft 2s ease-in-out infinite',
        'slide-up':     'slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':      'fade-in 0.4s ease both',
        'scale-in':     'scale-in 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'border-spin':  'border-spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to:   { transform: 'rotate(0deg)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-glow': {
          '0%,100%': { boxShadow: '0 0 20px rgba(108,71,255,0.15)' },
          '50%':     { boxShadow: '0 0 45px rgba(108,71,255,0.35)' },
        },
        'ping-soft': {
          '0%':      { transform: 'scale(1)',   opacity: '0.7' },
          '75%,100%':{ transform: 'scale(2.2)', opacity: '0' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'border-spin': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      borderRadius: {
        '2.5xl': '20px',
        '3xl':   '24px',
        '4xl':   '32px',
      },
    },
  },
  plugins: [],
}
