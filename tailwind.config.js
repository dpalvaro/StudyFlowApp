/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Tu paleta de colores personalizada
          primary: '#3b82f6', // Blue 500
          secondary: '#64748b', // Slate 500
          background: '#f8fafc', // Slate 50
          surface: '#ffffff',
        }
      },
    },
    plugins: [],
  }