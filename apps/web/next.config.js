const withMarkdoc = require('@markdoc/next.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md'],
  turbopack: {},
  experimental: {
    scrollRestoration: true
  },
}

module.exports = withMarkdoc({
  dir: process.cwd(), // Required for Turbopack file resolution
})(nextConfig)
