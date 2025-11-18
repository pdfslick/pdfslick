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
    scrollRestoration: true,
    // esmExternals: 'loose',
  },
  // rewrites: async () => [
  //   {
  //     source: "/docs/:slug",
  //     destination: "/d/:slug.html",
  //   }
  // ]
}
// module.exports = withMarkdoc({ mode: 'static' })(nextConfig)
module.exports = withMarkdoc({
  dir: process.cwd(), // Required for Turbopack file resolution
})(nextConfig)
