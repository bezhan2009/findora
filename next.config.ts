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
    // This line solves the 'require.extensions' issue in handlebars
    if (!isServer) {
      config.externals.push({ 'handlebars': 'commonjs handlebars' });
    }
    return config;
  },
};

export default nextConfig;
