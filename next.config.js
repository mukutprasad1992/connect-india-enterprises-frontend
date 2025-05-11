/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Static export configuration
  output: 'export',
  distDir: 'build', // Optional: Specify custom build directory
};

module.exports = nextConfig;
