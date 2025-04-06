import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';
import { getUserByReferralCode } from '@/lib/api';

// Define props type
type Props = {
  params: { username: string };
};

// Generate dynamic metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Get username from route params
  const username = params.username;
  
  // Fetch user data to verify username exists
  let referrerName = '';
  try {
    const user = await getUserByReferralCode(username);
    if (user && user.twitter_username) {
      referrerName = user.twitter_username;
    }
  } catch (error) {
    console.error('Error fetching user data for OG image:', error);
  }

  // Get parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  
  // Create absolute URL for OG image
  const ogUrl = new URL(`${process.env.NEXT_PUBLIC_WEBSITE_URL || process.env.VERCEL_URL || 'http://localhost:3000'}/api/og`);
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
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: 'TokenFight Invitation',
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: referrerName 
        ? `${referrerName} is inviting you to TokenFight`
        : 'You\'ve been invited to TokenFight',
      description: 'Trade tokens that kill each other',
      images: [ogUrl.toString()],
    },
  };
}

// Page component that redirects to home with the referral code as query param
export default async function ReferralPage({ params }: Props) {
  const { username } = params;
  
  // Redirect to the home page with ref query parameter
  redirect(`/?ref=${username}`);
} 