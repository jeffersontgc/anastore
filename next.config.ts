import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.graphql$/,
      use: [{ loader: "raw-loader" }],
    });
    return config;
  },
};

export default nextConfig;
