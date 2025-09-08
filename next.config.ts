import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  //config necessária para que o pino não seja excluído do bundle
  serverExternalPackages: ["pino"],
};
export default nextConfig;
