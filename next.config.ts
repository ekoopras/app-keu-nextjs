import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    skipWaiting: true,
  },
});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Masih didukung jika ingin mengabaikan type error saat build
  },
};

export default withPWA(nextConfig);
