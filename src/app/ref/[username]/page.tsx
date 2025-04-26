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
  twitter_profile_pic?: string;
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
  let referrerName = username; // Default to the URL param so we always have something
  let profilePic = ''; // Default empty
  
  try {
    const user = await getUserByReferralCode(username);
    if (user?.twitter_username) {
      referrerName = user.twitter_username;
    }
    if (user?.twitter_profile_pic) {
      profilePic = user.twitter_profile_pic;
      console.log('Found profile pic:', profilePic); // Debug log
    }
  } catch (error) {
    console.error('Error fetching user data for OG image:', error);
    // We'll use the username from params as fallback
  }

  // Create absolute URL for OG image
  // Always use the canonical URL first, with fallbacks
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'https://tokenfight.lol';
    
  // Make sure we have a fully qualified URL for the OG image with the USERNAME AS PART OF THE PATH
  // This is much more reliable for Twitter cache than query parameters
  const ogUrl = new URL(`/api/og/${encodeURIComponent(referrerName)}`, baseUrl);
  
  // If we have a profile pic, pass it as a query parameter
  if (profilePic && profilePic.startsWith('http')) {
    try {
      // Validate the URL is properly formed
      new URL(profilePic);
      ogUrl.searchParams.set('profilePic', profilePic);
      console.log('Setting profilePic param:', profilePic); // Debug log
    } catch (error) {
      console.error('Invalid profile pic URL:', profilePic, error);
    }
  }
  
  console.log('Final OG URL with path parameter:', ogUrl.toString()); // Debug the full URL

  return {
    title: `Join ${referrerName} on TokenFight`,
    description: 'Trade tokens that kill each other',
    openGraph: {
      title: `${referrerName} is inviting you to TokenFight`,
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
      title: `${referrerName} is inviting you to TokenFight`,
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
