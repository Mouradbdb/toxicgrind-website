import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'gray-900': '#111827',
        'gray-800': '#1F2A44',
        'gray-700': '#374151',
        'lime-400': '#A3E635',
        'red-500': '#EF4444',
        'purple-500': '#A78BFA',
      },
    },
  },
  plugins: [],
};

export default config;