/** @type {import('next').NextConfig} */
module.exports = {
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: 'http://danielokada.pythonanywhere.com/:path*', // 実際のプロキシ先のURLに置き換えてください
        },
      ];
    },
  };
