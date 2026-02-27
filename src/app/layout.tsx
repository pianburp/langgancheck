import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GajiGuard",
  description: "Track subscriptions and BNPL commitments with a monthly calendar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
