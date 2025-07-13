/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
  remotePatterns: [
   {
    protocol: 'https',
    hostname: 'rickandmortyapi.com',
    port: '',
    pathname: '/api/character/avatar/**' // Opcional: para especificar um caminho, se houver
   }
  ]
 }
}

module.exports = nextConfig
