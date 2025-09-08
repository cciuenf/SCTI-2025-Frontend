import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Configuração para qr-scanner funcionar corretamente
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  // Headers para permitir acesso à câmera
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: "camera=*, microphone=*",
          },
        ],
      },
    ];
  },
  serverExternalPackages: ["pino"],
};

export default nextConfig;
