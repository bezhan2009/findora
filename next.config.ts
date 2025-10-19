import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
   webpack: (config, { isServer }) => {
    // Эта строка решает проблему с 'require.extensions' в handlebars
    config.externals.push({ 'handlebars': 'commonjs handlebars' });
    return config;
  },
};

export default nextConfig;
