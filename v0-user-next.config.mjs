/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placeholder.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: 'dhhidlah5'
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
