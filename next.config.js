/** @type {import('next').NextConfig} */
module.exports = {
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: 'DanielOkada.pythonanywhere.com/:path*', // 実際のプロキシ先のURLに置き換えてください
        },
      ];
    },
  };
