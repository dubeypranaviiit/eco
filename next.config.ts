import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
    MONGODB_URL:process.env.MONGODB_URL,
    WEB_3_AUTH_CLIENT_ID:process.env.WEB_3_AUTH_CLIENT_ID,
    GEMINI_API_KEY:process.env.GEMINI_API_KEY,
    GOOGLE_MAPS_API_KEY:process.env. GOOGLE_MAPS_API_KEY
  },
    typescript: {
    ignoreBuildErrors: true, 
  },
};

export default nextConfig;
