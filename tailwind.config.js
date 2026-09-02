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
        // Regal Gold & White Palette
        background: '#FAFAFA',
        card: '#FFFFFF',
        'surface-elevated': '#FFFFFF',
        'subtle-border': '#EAE6DF',
        'accent-border': '#D4AF37',

        // Typography Hierarchy
        'text-primary': '#1C1C1C',
        'text-secondary': '#383838',
        'text-muted': '#767676',

        // Regal Gold Accents
        'regal-gold': '#D4AF37',
        'regal-gold-light': '#FFD700',
        'regal-gold-dark': '#AA820A',
        'luxury-noir': '#1C1C1C',

        // Legacy compatibility mappings
        gunmetal: '#FAFAFA',
        surface: '#FFFFFF',
        elevated: '#FFFFFF',
        line: '#EAE6DF',
        metallic: '#555555',
        highlight: '#1C1C1C',
        accent: '#D4AF37',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Inter', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(28, 28, 28, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'luxury-lg': '0 20px 40px -15px rgba(212, 175, 55, 0.12), 0 0 0 1px rgba(234, 230, 223, 0.9)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.35)',
        'gold-subtle': '0 4px 20px rgba(212, 175, 55, 0.15)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
        'gold-gradient-subtle': 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 215, 0, 0.15) 100%)',
        'pearl-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
}
