import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a minimal standalone server bundle for the Docker runner stage.
  output: "standalone",
};

export default nextConfig;
