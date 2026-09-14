import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1a211d',
        muted: '#5d6962',
        brand: '#1e5a49',
        canvas: '#f3efe8',
        sidebar: '#071d2d',
      },
      boxShadow: {
        soft: '0 18px 40px rgba(13, 25, 22, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
