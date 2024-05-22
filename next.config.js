/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  transpilePackages: ["three"], //untranspiled add-ons in the three.js ecosystem
};

module.exports = nextConfig;
