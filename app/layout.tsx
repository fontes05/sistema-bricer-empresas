import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bricer Company",
  description:
    "Simulador de proteção empresarial da Bricer.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        {children}
      </body>
    </html>
  );
}