import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    '192.168.0.114',
    '192.168.0.114:3000',
    '*.loca.lt',
    '*.ngrok-free.app',
    'localhost:3000'
  ]
};

export default nextConfig;
