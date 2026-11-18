/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 is a native Node.js module - must NOT be bundled by webpack
  serverExternalPackages: ['better-sqlite3'],

  async redirects() {
    return [
      {
        source: '/login',
        destination: '/admin/login',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/register',
        destination: '/admin/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
