/** @type {import('tailwindcss').Config} */
module.exports = {
     content: ['./src/**/*.{html,js}', './FrontEndApp/src/**/*.{vue,js,ts,jsx,tsx}'],
     theme: {
          extend: {
               colors: {
                    customBlue: '#1F3F83',
                    success: '#125029',
                    update: '#1C42D9',
               },
          },
     },
     plugins: [],
};
