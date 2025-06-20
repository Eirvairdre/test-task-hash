/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/hash',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 