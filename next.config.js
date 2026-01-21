/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'nft-cdn.alchemy.com' },
      { protocol: 'https', hostname: 'ipfs.io' },
      { protocol: 'https', hostname: 'gufiles.art' },
      { protocol: 'https', hostname: '**.seadn.io' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = nextConfig;
