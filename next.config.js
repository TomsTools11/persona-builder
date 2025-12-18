/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdf-parse"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://api.anthropic.com https://r.jina.ai;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
