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

        // Single Primary Blue (#0EA5E9) & Supporting Slate
        primary: '#0EA5E9',
        'primary-hover': '#0284C7',
        'brand-blue': '#0EA5E9',
        'brand-blue-deep': '#0EA5E9',
        'brand-blue-dark': '#0284C7',
        'brand-blue-light': '#0EA5E9',
        'brand-blue-glow': '#0EA5E9',

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
        'regal-gold-light': '#0EA5E9',
        'regal-gold-dark': '#0284C7',
        'luxury-noir': '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.07), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'luxury-lg': '0 20px 40px -15px rgba(14, 165, 233, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.9)',
        'blue-glow': '0 0 20px rgba(14, 165, 233, 0.35)',
        'silver-glow': '0 0 20px rgba(148, 163, 184, 0.25)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
}
