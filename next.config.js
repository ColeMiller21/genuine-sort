/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["nft-cdn.alchemy.com"],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = nextConfig;
