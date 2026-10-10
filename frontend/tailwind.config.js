export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#080B12',
        darkSurface: '#0D1220',
        darkCard: '#111827',
        darkElevated: '#172033',
        darkText: '#F8FAFC',
        darkTextSecondary: '#B8C2D1',

        lightBg: '#F7F8FC',
        lightSurface: '#FFFFFF',
        lightElevated: '#F1F5F9',
        lightText: '#172033',
        lightTextSecondary: '#475569',

        brandNavy: '#1E3A8A',
        brandBlue: '#2563EB',
        brandViolet: '#7C3AED',
        brandIndigo: '#4F46E5',
        brandGreen: '#15803D',
        brandOrange: '#EA580C',
        brandPink: '#DB2777',
        brandYellow: '#EAB308'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      },
      boxShadow: {
        'glow-violet': '0 0 25px -5px rgba(124, 58, 237, 0.35)',
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.35)',
        'glow-orange': '0 0 25px -5px rgba(234, 88, 12, 0.35)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'card-dark-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(124, 58, 237, 0.4)',
        'card-light': '0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(15, 23, 42, 0.04)',
        'card-light-hover': '0 20px 35px -10px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(37, 99, 235, 0.25)'
      }
    }
  },
  plugins: []
};
