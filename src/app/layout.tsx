import type { Metadata, Viewport } from "next";
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

// Separate viewport export as recommended by Next.js 15
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const origin = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'https://tokenfight.lol';

  return {
    title: "TokenFight - Trade tokens that kill each other",
    description: "Enter the arena. Trade tokens that kill each other.",
    openGraph: {
      type: 'website',
      url: origin,
      title: 'TokenFight - Trade tokens that kill each other',
      description: 'Enter the arena. Trade tokens that kill each other.',
      images: [{
        url: `${origin}/api/og`,
        width: 1200,
        height: 630,
        alt: 'TokenFight Invitation',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TokenFight - Trade tokens that kill each other',
      description: 'Enter the arena. Trade tokens that kill each other.',
      images: [`${origin}/api/og`],
    },
    icons: {
      icon: '/logo.png',
      apple: '/logo.png',
    },
  };
}

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
