import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.notion.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "itujkvzsho.ufs.sh" },
    ],
  },
};

export default nextConfig;
