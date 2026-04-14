/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'task-manager-roan-kappa.vercel.app'],
    },
  },
}

export default nextConfig
