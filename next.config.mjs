/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/internal/Farm",
        destination: "/internal/farm",
      },
      {
        source: "/internal/Form",
        destination: "/internal/farm",
      },
      {
        source: "/internal/form",
        destination: "/internal/farm",
      },
    ];
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;
