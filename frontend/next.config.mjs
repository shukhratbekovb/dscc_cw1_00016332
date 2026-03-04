/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  poweredByHeader: false,
  typedRoutes: true,
  output: "standalone",
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  images: {
    qualities: [75, 100],
    
  },
  reactCompiler: false,
  headers: async () => {
    return [
      {
        source: "/:path*{/}?",
        headers: [
          {
            key: "X-Accel-Buffering",
            value: "no",
          },
        ],
      }
    ];
  },
};



export default nextConfig
