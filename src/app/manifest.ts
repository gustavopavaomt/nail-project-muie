import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Adriana Nail Designer",
    short_name: "Adriana Nails",
    description:
      "Agende seu horario de forma rapida e pratica e realce sua melhor versao.",
    lang: "pt-BR",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFF8F7",
    theme_color: "#C26A8A",
    icons: [
      // PLACEHOLDER: gerados no Sprint 1.1 so pra tornar o PWA instalavel.
      // Trocar pelo logo real (mao + sparkles do print) quando a marca fechar.
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
