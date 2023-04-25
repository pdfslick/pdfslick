// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   transpilePackages: ["ui"],
// };

// module.exports = nextConfig;

const withMarkdoc = require('@markdoc/next.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md'],
  experimental: {
    scrollRestoration: true,
  },
}
// module.exports = withMarkdoc({ mode: 'static' })(nextConfig)
module.exports = withMarkdoc()(nextConfig)
