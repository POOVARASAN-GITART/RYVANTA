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
        gunmetal: '#030712',
        surface: '#080e1e',
        elevated: '#0f172a',
        line: '#1e293b',
        metallic: '#94a3b8',
        highlight: '#f8fafc',
        accent: '#00f0ff',
        'cyber-cyan': '#00f0ff',
        'cyber-blue': '#0ea5e9',
        'cyber-purple': '#8b5cf6',
        'cyber-dark': '#030712',
        'cyber-surface': '#070d1d',
        'cyber-card': '#0c152b',
        'cyber-border': '#1e293b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 25px rgba(0, 240, 255, 0.25)',
        'neon-cyan-lg': '0 0 50px rgba(0, 240, 255, 0.35)',
        'neon-purple': '0 0 25px rgba(139, 92, 246, 0.25)',
        'cyber-card': '0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(0, 240, 255, 0.1)',
        'cyber-glow': '0 0 20px rgba(0, 240, 255, 0.2), inset 0 0 15px rgba(0, 240, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 5px rgba(0, 240, 255, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.8))' },
        },
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
}
