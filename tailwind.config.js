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
        // Black & White Base Palette
        background: '#FFFFFF',
        'background-alt': '#F8FAFC',
        card: '#FFFFFF',
        'surface-elevated': '#FFFFFF',
        'subtle-border': '#E2E8F0',
        'accent-border': '#0EA5E9',

        // Typography Hierarchy
        'text-primary': '#000000',
        'text-secondary': '#1E293B',
        'text-muted': '#64748B',

        // Electric & Sapphire Blue Tokens
        'brand-blue': '#0EA5E9',
        'brand-blue-deep': '#2563EB',
        'brand-blue-dark': '#1D4ED8',
        'brand-blue-light': '#38BDF8',
        'brand-blue-glow': '#60A5FA',

        // Polished Metallic Silver Tokens
        'silver-light': '#F1F5F9',
        'silver-border': '#E2E8F0',
        'silver-metallic': '#94A3B8',
        'silver-dark': '#475569',
        'silver-chrome': '#CBD5E1',

        // Monochromatic Black Tokens
        'pure-black': '#000000',
        'noir': '#0A0A0A',
        'charcoal': '#1E293B',

        // Backward compatibility mappings
        gunmetal: '#FFFFFF',
        surface: '#FFFFFF',
        elevated: '#FFFFFF',
        line: '#E2E8F0',
        metallic: '#64748B',
        highlight: '#000000',
        accent: '#0EA5E9',
        'regal-gold': '#0EA5E9',
        'regal-gold-light': '#38BDF8',
        'regal-gold-dark': '#2563EB',
        'luxury-noir': '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Inter', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.07), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'luxury-lg': '0 20px 40px -15px rgba(14, 165, 233, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.9)',
        'blue-glow': '0 0 25px rgba(14, 165, 233, 0.4)',
        'silver-glow': '0 0 20px rgba(148, 163, 184, 0.3)',
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
        'blue-silver-gradient': 'linear-gradient(135deg, #0EA5E9 0%, #94A3B8 100%)',
        'silver-gradient': 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)',
        'black-gradient': 'linear-gradient(135deg, #1E293B 0%, #000000 100%)',
        'gold-gradient': 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
        'pearl-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
}
