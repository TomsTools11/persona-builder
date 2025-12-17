import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Persona Builder",
  description:
    "Turn website URLs and research materials into actionable user personas with AI-powered analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-primary-dark text-white antialiased">
        {children}
      </body>
    </html>
  );
}
