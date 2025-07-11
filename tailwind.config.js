/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Esta linha é crucial!
  ],
  theme: {
    extend: {
      // Garanta que não há nenhuma configuração aqui que possa estar "bloqueando"
      // ou sobrescrevendo os filtros ou cores do Tailwind.
    },
  },
  plugins: [],
}