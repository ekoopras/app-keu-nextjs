import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    skipWaiting: true, // 🔑 Pindahkan skipWaiting ke dalam workboxOptions
  },
});

const nextConfig: NextConfig = {
  /* opsi Next.js Anda jika ada */
};

export default withPWA(nextConfig);
