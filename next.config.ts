
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
    // This is to solve the 'require.extensions' issue in handlebars, a dependency of genkit.
    if (!isServer) {
      config.externals.push({ 'handlebars': 'commonjs handlebars' });
    }
    return config;
  },
};

export default nextConfig;

    