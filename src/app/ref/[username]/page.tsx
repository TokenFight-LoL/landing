// app/ref/[username]/page.tsx

import { Metadata, ResolvingMetadata } from 'next';
import { getUserByReferralCode } from '@/lib/api';

// Define params as Promise for Next.js 15
type Params = Promise<{ username: string }>;

// 1. Correct signature for generateMetadata with Promise-based params
export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Await the params to get the username
  const { username } = await params;

  // Get parent metadata if needed
  const previous = await parent;
  const previousImages = previous.openGraph?.images || [];

  // Fetch user data to verify username exists
  let referrerName = '';
  try {
    const user = await getUserByReferralCode(username);
    if (user?.twitter_username) {
      referrerName = user.twitter_username;
    }
  } catch (error) {
    console.error('Error fetching user data for OG image:', error);
  }

  // Create absolute URL for OG image
  // For Netlify deployments, we use NEXT_PUBLIC_WEBSITE_URL
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000';
    
  // Make sure we have a fully qualified URL for the OG image
  const ogUrl = new URL('/api/og', baseUrl);
  
  if (referrerName) {
    ogUrl.searchParams.set('username', referrerName);
  }

  return {
    title: referrerName
      ? `Join ${referrerName} on TokenFight`
      : 'You\'ve been invited to TokenFight',
    description: 'Trade tokens that kill each other',
    openGraph: {
      title: referrerName
        ? `${referrerName} is inviting you to TokenFight`
        : 'You\'ve been invited to TokenFight',
      description: 'Trade tokens that kill each other',
      type: 'website',
      url: baseUrl,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: 'TokenFight Invitation',
        },
        ...previousImages, // pulled from parent metadata
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: referrerName
        ? `${referrerName} is inviting you to TokenFight`
        : 'You\'ve been invited to TokenFight',
      description: 'Trade tokens that kill each other',
      images: [{
        url: ogUrl.toString(),
        width: 1200,
        height: 630,
        alt: 'TokenFight Invitation',
      }],
    },
  };
}

// 2. Update page component to handle both users and crawlers
export default async function ReferralPage({
  params,
}: {
  params: Params;
}) {
  // Await the params to get the username
  const { username } = await params;
  
  // Create a simple landing page for crawlers but redirect regular users
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0;url=/?ref=${username}`} />
      </head>
      <body>
        <p>Redirecting to TokenFight...</p>
        <p>
          If you are not redirected automatically, please{' '}
          <a href={`/?ref=${username}`}>click here</a>.
        </p>
        {/* This page exists primarily for OpenGraph metadata */}
        {/* Normal users will be redirected immediately */}
      </body>
    </html>
  );
}
