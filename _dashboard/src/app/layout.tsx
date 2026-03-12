import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AFGT Dashboard",
  description: "Content dashboard for Astro content-store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
