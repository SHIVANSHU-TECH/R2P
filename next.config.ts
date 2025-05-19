import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'pdfjs-dist', 'mammoth'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // More explicit fallbacks for Node.js modules
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        http: false,
        https: false,
        url: false,
        path: false,
        os: false,
        stream: false,
        zlib: false,
        crypto: false,
        querystring: false,
        util: false,
      };
    }
    
    // Add an alias to mock problematic modules
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdf-parse': isServer ? 'pdf-parse' : false,
    };
    
    return config;
  },
};

export default nextConfig;