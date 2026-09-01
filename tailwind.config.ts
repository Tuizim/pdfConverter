import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef0f2',
          100: '#fedde0',
          200: '#fcbac1',
          300: '#fa8a95',
          400: '#f85968',
          500: '#f74052',
          600: '#f62a3e',
          700: '#e10a1f',
          800: '#ba0819',
          900: '#8e0613',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.12)',
        card: '0 1px 3px rgba(15, 23, 42, 0.06), 0 12px 32px -16px rgba(15, 23, 42, 0.15)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
