import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Background from "@/components/background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Token Fight - Trade tokens that kill each other",
  description: "Enter the arena. Trade tokens that kill each other.",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative`}
      >
        {/* Background component will position itself with fixed positioning */}
        <Background />

        <Providers>
          <div className="flex-1 flex items-center justify-center relative z-10">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
