/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("better-sqlite3")
    }
    return config
  },
  // Ensure API routes are properly handled
  // No rewrites or redirects are needed here that would interfere with /api/appointments
  async rewrites() {
    return []
  },
  async redirects() {
    return []
  },
}

module.exports = nextConfig
