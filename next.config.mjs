/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['res.cloudinary.com'], // Cloudinary 도메인 추가
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/, //
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
