import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LightHouse Kids",
  description: "A safe place to explore God's Word",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
