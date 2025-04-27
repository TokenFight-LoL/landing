import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Background from "@/components/background";

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
        url: `${origin}/static-og.png`,
        width: 1200,
        height: 630,
        alt: 'TokenFight Invitation',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TokenFight - Trade tokens that kill each other',
      description: 'Enter the arena. Trade tokens that kill each other.',
      images: [`${origin}/static-og.png`],
    },
    icons: {
      icon: '/logo-black-bg.png',
      apple: '/logo-black-bg.png',
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
        <link rel="icon" href="/logo-black-bg.png" />
      </head>
      <body
        className={`antialiased min-h-screen flex flex-col relative`}
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
