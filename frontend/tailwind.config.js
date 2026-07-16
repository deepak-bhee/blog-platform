/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand — warm indigo
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Rose accent
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
          light: '#e879a0',
        },
        // Amber accent
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        // Dark surface palette
        surface: {
          950: '#080b12',
          900: '#0c0f1a',
          800: '#111827',
          700: '#1e2535',
          600: '#2a3347',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['Lora', 'Georgia', 'serif'],
        ui:      ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-up':  'fadeInUp 0.6s ease-out both',
        'fade-in':     'fadeIn 0.5s ease-out both',
        'scale-in':    'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'slide-down':  'slideDown 0.3s ease-out both',
        'slide-up':    'slideUp 0.4s ease-out both',
        'float':       'float 4s ease-in-out infinite',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'drift1':      'drift1 18s ease-in-out infinite',
        'drift2':      'drift2 22s ease-in-out infinite',
        'drift3':      'drift3 26s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp:  { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.9)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float:     { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
