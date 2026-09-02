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
        // Base Palette
        background: '#FAFAFA',
        card: '#FFFFFF',
        'surface-elevated': '#FFFFFF',
        'subtle-border': '#E2E8F0',
        'accent-border': '#F97316',

        // Typography Hierarchy
        'text-primary': '#0F172A',
        'text-secondary': '#334155',
        'text-muted': '#64748B',

        // Orange Theme Tokens
        'brand-orange': '#FF6B00',
        'brand-orange-light': '#FB923C',
        'brand-orange-dark': '#C2410C',

        // Green Theme Tokens
        'brand-green': '#10B981',
        'brand-green-light': '#34D399',
        'brand-green-dark': '#047857',

        // Blue Theme Tokens (for Animation & Accents)
        'brand-blue': '#0EA5E9',
        'brand-blue-deep': '#2563EB',
        'brand-blue-light': '#38BDF8',
        'brand-blue-glow': '#60A5FA',

        // Compatibility aliases
        gunmetal: '#FAFAFA',
        surface: '#FFFFFF',
        elevated: '#FFFFFF',
        line: '#E2E8F0',
        metallic: '#475569',
        highlight: '#0F172A',
        accent: '#FF6B00',
        'regal-gold': '#FF6B00',
        'regal-gold-light': '#F97316',
        'regal-gold-dark': '#EA580C',
        'luxury-noir': '#0F172A',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Inter', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(15, 23, 42, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'luxury-lg': '0 20px 40px -15px rgba(249, 115, 22, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.9)',
        'orange-glow': '0 0 25px rgba(249, 115, 22, 0.35)',
        'green-glow': '0 0 25px rgba(16, 185, 129, 0.35)',
        'blue-glow': '0 0 25px rgba(14, 165, 233, 0.35)',
      },
      backgroundImage: {
        'orange-gradient': 'linear-gradient(135deg, #FF6B00 0%, #F97316 50%, #EA580C 100%)',
        'green-gradient': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'blue-gradient': 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
        'orange-green-gradient': 'linear-gradient(135deg, #FF6B00 0%, #10B981 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FF6B00 0%, #10B981 100%)',
        'pearl-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
}
