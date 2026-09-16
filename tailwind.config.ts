import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7f6',
          100: '#e3eae8',
          200: '#c7d6d3',
          300: '#9fb9b4',
          400: '#719790',
          500: '#547d76',
          600: '#40635e',
          700: '#35514d',
          800: '#2d4340',
          900: '#273836',
          950: '#141f1e',
        },
        tech: {
          bg: '#0a0d0e',
          card: '#121618',
          border: '#1f2629',
          accent: '#20c997', // Precision teal for FDM 3D printing
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
export default config;
