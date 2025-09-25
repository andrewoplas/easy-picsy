//@ts-check
const path = require('path');

 
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},

  // Configure allowed image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  
  // Add redirects to fix the www/non-www redirect issues
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'easypicsybooths.com',
          },
        ],
        destination: 'https://www.easypicsybooths.com/:path*',
        permanent: true,
      },
    ];
  },
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add webpack aliases for workspace packages
    config.resolve.alias = {
      ...config.resolve.alias,
      '@org/api-lib': path.resolve(__dirname, '../../libs/api-lib'),
      '@org/commons': path.resolve(__dirname, '../../libs/commons/src'),
    };
    
    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
