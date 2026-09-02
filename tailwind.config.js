/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base Platinum & Cream Palette
        background: '#F9F8F6',
        card: '#F3F1ED',
        'surface-elevated': '#FFFFFF',
        'subtle-border': '#E5E4E2',
        'accent-border': '#D8D7D5',

        // Typography Hierarchy
        'text-primary': '#1A1A1A',
        'text-secondary': '#4A4A4A',
        'text-muted': '#8C8A85',

        // Accents & Luxury Noir
        'accent-gold': '#C5A059',
        'luxury-noir': '#2C2C2C',
        'platinum-light': '#E5E4E2',
        'platinum-polished': '#D8D7D5',

        // Legacy compatibility mappings
        gunmetal: '#F9F8F6',
        surface: '#F3F1ED',
        elevated: '#FFFFFF',
        line: '#E5E4E2',
        metallic: '#4A4A4A',
        highlight: '#1A1A1A',
        accent: '#C5A059',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(26, 26, 26, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'luxury-lg': '0 20px 40px -15px rgba(26, 26, 26, 0.08), 0 0 0 1px rgba(216, 215, 213, 0.6)',
        'glow-platinum': '0 0 20px -2px rgba(216, 215, 213, 0.6)',
        'glow-gold': '0 0 25px rgba(197, 160, 89, 0.25)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
}
