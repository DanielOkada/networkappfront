/** @type {import('next').NextConfig} */

// APIサーバーのURLを環境変数から取得
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

module.exports = {
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: apiUrl + '/:path*', // 実際のプロキシ先のURLに置き換えてください
        },
      ];
    },
  };
