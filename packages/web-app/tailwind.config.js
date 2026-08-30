/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../dashboard-widgets/src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Prompt', 'IBM Plex Sans Thai', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      colors: {
        dark: {
          950: '#07090e',
          900: '#0b0f19',
          850: '#111827',
          800: '#1e293b',
          700: '#334155'
        }
      }
    },
  },
  plugins: [],
}
