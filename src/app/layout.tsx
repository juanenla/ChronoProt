import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChronoPro | Cronoterapia para Hipertrofia",
  description: "Optimiza tu suplementación según tu cronotipo. Herramienta educativa basada en evidencia científica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
