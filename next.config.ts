import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O badge flutuante do Next em dev cobre o canto inferior esquerdo e atrapalha
  // comparar a tela com o print. Nao afeta producao.
  devIndicators: false,
};

export default nextConfig;
