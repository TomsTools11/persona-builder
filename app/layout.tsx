import type { Metadata } from "next";
import { Lato, Geist_Mono } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Personas — by s3 labs",
  description:
    "Turn a website URL into clear, actionable user personas — goals, JTBDs, pain points, and a print-ready PDF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.variable} ${geistMono.variable}`}>
      <body>
        <div className="app">
          <div className="app-bg" />
          {children}
        </div>
      </body>
    </html>
  );
}
