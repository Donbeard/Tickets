/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    'node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {
      width: {
        '17': '17rem',
      },
      left:{
        30: '30rem',
      }
    },
  },
  plugins: [
    async () => {
      try {
        // Intentar importar con la extensión .js como sugiere el error
        const flowbite = await import('flowbite/plugin.js');
        return flowbite.default;
      } catch (error) {
        console.error('Error al cargar flowbite/plugin.js:', error);
        return null;
      }
    }
  ],
}
