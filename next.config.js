/** @type {import('next').NextConfig} */
module.exports = {
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: 'http://127.0.0.1:5000/:path*', // 実際のプロキシ先のURLに置き換えてください
        },
      ];
    },
  };
