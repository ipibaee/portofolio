/** @type {import('next').NextConfig} */
const nextConfig = {
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
