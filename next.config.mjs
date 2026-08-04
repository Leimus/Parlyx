/** @type {import('next').NextConfig} */
const nextConfig = {
  // SPA estática sin backend de gameplay (PRD §16). La única pieza
  // server-side del producto (og:image dinámica) llega en F4 como
  // edge function separada.
  output: "export",
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
