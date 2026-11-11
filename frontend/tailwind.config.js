/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0b0b0a', 2: '#131311', 3: '#1c1c19' },
        bone: { DEFAULT: '#ede8df', dim: '#a8a39a', mute: '#6f6b64' },
        signal: { DEFAULT: '#ff5a1f', soft: '#ff7a47' },
        line: 'rgba(237, 232, 223, 0.12)',
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: { label: '0.18em' },
      maxWidth: { site: '1440px' },
    },
  },
  plugins: [],
};
