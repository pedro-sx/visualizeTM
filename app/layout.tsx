import type { Metadata } from "next";
import "./globals.css";
import "./experience.css";

export const metadata: Metadata = {
  title: "Visualize Studio — Marcas com intenção",
  description: "Identidade, estratégia e experiências digitais. Conheça a Visualize Studio: um estúdio criativo para empresas em transformação.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
