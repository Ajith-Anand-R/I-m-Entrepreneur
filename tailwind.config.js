/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Brand accent ─────────────────────── */
        accent: {
          DEFAULT: '#6C47FF',
          soft:    '#8B7AFF',
          ghost:   '#F0EDFF',
          deep:    '#4A2FD4',
        },
        /* ── Semantic colours ────────────────── */
        mint:   '#34D399',
        rose:   '#F43F5E',
        amber:  '#F59E0B',
        sky:    '#38BDF8',
        coral:  '#FF6B6B',
        teal:   '#2DD4BF',
        /* ── Surfaces ────────────────────────── */
        surface: {
          0:     '#FAFAFF',
          1:     '#FFFFFF',
          2:     '#F5F4FF',
        },
        /* ── Text ────────────────────────────── */
        ink: {
          DEFAULT: '#1A1A2E',
          900:     '#1A1A2E',
          700:     '#2D2D4A',
          500:     '#64648C',
          300:     '#9CA3C0',
          100:     '#D4D4E8',
        },
        /* ── Sidebar dark ────────────────────── */
        sidebar: {
          bg:     '#0F0F1A',
          hover:  'rgba(255,255,255,0.05)',
          active: 'rgba(108,71,255,0.14)',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', '-apple-system', 'sans-serif'],
        sans:    ['DM Sans', '-apple-system', 'sans-serif'],
        mono:    ['DM Mono', 'IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        /* Elevation stack — lavender-tinted */
        'xs':      '0 1px 2px rgba(0,0,0,0.04)',
        'sm':      '0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        'md':      '0 8px 24px rgba(108,71,255,0.06), 0 2px 6px rgba(0,0,0,0.04)',
        'lg':      '0 16px 48px rgba(108,71,255,0.08), 0 6px 16px rgba(0,0,0,0.04)',
        'xl':      '0 24px 64px rgba(108,71,255,0.10), 0 8px 20px rgba(0,0,0,0.05)',
        'float':   '0 32px 80px rgba(108,71,255,0.12), 0 12px 28px rgba(0,0,0,0.06)',
        /* Brand glow */
        'accent':  '0 8px 32px rgba(108,71,255,0.25), 0 2px 8px rgba(108,71,255,0.15)',
        'mint':    '0 8px 32px rgba(52,211,153,0.25), 0 2px 8px rgba(52,211,153,0.12)',
        'rose':    '0 8px 32px rgba(244,63,94,0.25), 0 2px 8px rgba(244,63,94,0.12)',
        'amber':   '0 8px 32px rgba(245,158,11,0.25), 0 2px 8px rgba(245,158,11,0.12)',
        'sky':     '0 8px 32px rgba(56,189,248,0.25), 0 2px 8px rgba(56,189,248,0.12)',
        /* Inner glow */
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.5)',
        /* Active nav */
        'nav-active': 'inset 0 0 0 1px rgba(108,71,255,0.2), 0 0 0 3px rgba(108,71,255,0.06)',
      },
      backgroundImage: {
        /* ── Gradients ── */
        'gradient-brand':   'linear-gradient(135deg, #6C47FF, #8B7AFF)',
        'gradient-energy':  'linear-gradient(135deg, #6C47FF, #8B7AFF, #38BDF8)',
        'gradient-aurora':  'linear-gradient(135deg, #6C47FF, #A78BFA, #38BDF8)',
        'gradient-warm':    'linear-gradient(135deg, #F59E0B, #F43F5E)',
        'gradient-cool':    'linear-gradient(135deg, #38BDF8, #34D399)',
        'gradient-mint':    'linear-gradient(135deg, #34D399, #2DD4BF)',
        /* ── Card gradient ── */
        'card-subtle':      'linear-gradient(145deg, #FFFFFF 0%, #F5F4FF 100%)',
        /* ── Mesh background ── */
        'mesh-light':       'radial-gradient(at 20% 15%, rgba(108,71,255,0.06) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(139,122,255,0.05) 0px, transparent 50%), radial-gradient(at 10% 85%, rgba(56,189,248,0.05) 0px, transparent 45%), radial-gradient(at 90% 80%, rgba(52,211,153,0.04) 0px, transparent 45%)',
        /* ── Hero gradient ── */
        'hero-light':       'radial-gradient(ellipse at 20% 50%, rgba(108,71,255,0.10), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(56,189,248,0.08), transparent 55%), radial-gradient(ellipse at 50% 80%, rgba(52,211,153,0.06), transparent 55%)',
      },
      animation: {
        'float':          'float-bob 5s ease-in-out infinite',
        'float-slow':     'float-bob 8s ease-in-out infinite',
        'spin-slow':      'spin 10s linear infinite',
        'spin-reverse':   'spin-ccw 8s linear infinite',
        'shimmer':        'shimmer 2.5s linear infinite',
        'shimmer-load':   'shimmer-load 1.8s ease infinite',
        'pulse-glow':     'pulse-glow 3s ease-in-out infinite',
        'ping-soft':      'ping-soft 2s ease-in-out infinite',
        'slide-up':       'slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':        'fade-in 0.4s ease both',
        'scale-in':       'scale-in 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'border-spin':    'border-spin 4s linear infinite',
        'mesh-drift':     'mesh-drift 20s ease infinite',
        'gentle-bounce':  'gentle-bounce 2s ease-in-out infinite',
        'breathe':        'breathe 3.5s ease-in-out infinite',
        'dot-bounce':     'dot-bounce 1.4s ease-in-out infinite',
      },
      keyframes: {
        'float-bob': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        'spin-ccw': {
          from: { transform: 'rotate(360deg)' },
          to:   { transform: 'rotate(0deg)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'shimmer-load': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%,100%': { boxShadow: '0 0 16px rgba(108,71,255,0.1)' },
          '50%':     { boxShadow: '0 0 32px rgba(108,71,255,0.2)' },
        },
        'ping-soft': {
          '0%':      { transform: 'scale(1)',   opacity: '0.6' },
          '75%,100%':{ transform: 'scale(2)',   opacity: '0' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'border-spin': {
          to: { transform: 'rotate(360deg)' },
        },
        'mesh-drift': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '25%':     { backgroundPosition: '50% 0%' },
          '50%':     { backgroundPosition: '100% 50%' },
          '75%':     { backgroundPosition: '50% 100%' },
        },
        'gentle-bounce': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-4px)' },
        },
        'breathe': {
          '0%,100%': { transform: 'scale(1)',    opacity: '0.7' },
          '50%':     { transform: 'scale(1.05)', opacity: '1' },
        },
        'dot-bounce': {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-6px)' },
        },
      },
      borderRadius: {
        'xl':    '16px',
        '2xl':   '20px',
        '3xl':   '24px',
        '4xl':   '32px',
      },
    },
  },
  plugins: [],
}
