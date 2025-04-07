// Server Component - handles metadata generation
import { Metadata, ResolvingMetadata } from 'next';
import { getUserByReferralCode } from '@/lib/api';
import ReferralClient from './client';

// Define params as Promise for Next.js 15 - for metadata generation
type Params = Promise<{ username: string }>;

// Define the type for referrer data to match client component
type ReferrerData = {
  id: string;
  twitter_username?: string;
  email?: string;
  referral_code: string;
};

// Generate metadata for sharing
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
      url: `${baseUrl}/ref/${username}`,
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

// Page component that renders the client component
export default async function ReferralPage({ params }: { params: Params }) {
  // Await the params to get the username
  const { username } = await params;
  
  // Pre-fetch the referrer data on the server
  let referrerData: ReferrerData | null = null;
  try {
    referrerData = await getUserByReferralCode(username);
  } catch (error) {
    console.error('Error fetching referrer data:', error);
  }

  // Pass the username and pre-fetched data to the client component
  return <ReferralClient username={username} initialReferrerData={referrerData} />;
}
