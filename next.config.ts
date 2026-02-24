import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
  // Uncomment for GitHub Pages deploy:
  // output: 'export',
  // basePath: '/Laura',

  /**
   * Serve the standalone HTML landing (pure HTML5 + Tailwind CDN, fully isolated
   * from the Next.js app styles) at the clean /aleksandrovska-hub URL.
   */
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/aleksandrovska-hub',
          destination: '/aleksandrovska-hub/index.html',
        },
      ],
    };
  },
};

export default nextConfig;
