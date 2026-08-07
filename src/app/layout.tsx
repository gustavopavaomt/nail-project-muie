import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Grotesca de interface: corpo, labels, navegacao. Definida no 02_DESIGN_SYSTEM.md.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Serifada de display: wordmark e headlines. Nao esta no .md, veio do print
// (headline "Sua beleza, / no seu tempo." e o logo tem serifa de alto contraste).
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Adriana Nail Designer",
    template: "%s · Adriana Nail Designer",
  },
  description:
    "Agende seu horario de forma rapida e pratica e realce sua melhor versao.",
  applicationName: "Adriana Nail Designer",
  appleWebApp: {
    capable: true,
    title: "Adriana Nail Designer",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#C26A8A",
  // O app e mobile-first e tem bottom nav: zoom livre quebraria o layout fixo,
  // mas bloquear zoom prejudica acessibilidade. Permitimos ate 5x.
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
