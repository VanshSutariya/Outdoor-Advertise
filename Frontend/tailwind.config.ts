// /** @type {import('tailwindcss').Config} */
// module.exports = {};
// @ts-check
const { withUt } = require('uploadthing/tw');

module.exports = withUt({
  // your config goes here
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        ubuntu: ['Ubuntu', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      screens: {
        xs: '480px',
        ss: '620px',
        sm: '768px',
        md: '1060px',
        lg: '1200px',
        xl: '1700px',
        mxxl: { max: '1535px' },
        // => @media (max-width: 1535px) { ... }
        mxl: { max: '1279px' },
        // => @media (max-width: 1279px) { ... }
        mlg: { max: '1023px' },
        // => @media (max-width: 1023px) { ... }
        mmd: { max: '767px' },
        // => @media (max-width: 767px) { ... }
        msm: { max: '639px' },
        // => @media (max-width: 639px) { ... }
        mss: { max: '550px' },
        // => @media (max-width: 550px) { ... }
        mxs: { max: '480px' },
        // => @media (max-width: 480px) { ... }
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light'],
  },
});
