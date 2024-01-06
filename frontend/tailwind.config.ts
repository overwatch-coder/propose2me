import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'primary': "#F6638E",
        // 'primary': "#DC5B57",
        "secondary": "#484747",
        'secondary-subtle': "#5F5E5E",
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'nunito': ['Nunito', 'sans-serif'],
        'pacifico': ['Pacifico', 'cursive'],
        'oswald': ['Oswald', 'sans-serif']
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}
export default config
