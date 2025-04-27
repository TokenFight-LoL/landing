'use client';

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from 'react';
import { LandingHero } from "@/components/landing-hero";
import { createOrUpdateUser, getUserByPrivyId, trackReferral, isUserAlreadyReferred, getReferrerByUserId } from '@/lib/api';
import { Klee_One } from "next/font/google";
import { useRouter } from 'next/navigation';

const klee = Klee_One({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

// Define the type for referrer data
type ReferrerData = {
  id: string;
  twitter_username?: string;
  email?: string;
  referral_code: string;
};

// Client component props
interface ReferralClientProps {
  username: string;
  initialReferrerData: ReferrerData | null;
}

// Client component to handle user authentication and referrals
export default function ReferralClient({ username, initialReferrerData }: ReferralClientProps) {
  const { ready, authenticated, user } = usePrivy();
  const [referrerData] = useState<ReferrerData | null>(initialReferrerData);
  const [processingAuth, setProcessingAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const refCode = username;
  const router = useRouter();
  
  // Set mounted for hydration
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Handle post-authentication
  useEffect(() => {
    const handleAuthentication = async () => {
      if (!ready) return;
      
      setProcessingAuth(true);
      
      if (authenticated && user?.id) {
        try {
          // Check if user exists
          let userRecord = await getUserByPrivyId(user.id);
          
          // If user is authenticated and trying to use their own referral code,
          // or if they're already authenticated, redirect to home page
          if (userRecord && userRecord.referral_code === refCode) {
            console.log('User is trying to use their own referral code. Redirecting to home page.');
            router.push('/');
            return;
          }
          
          // Check if user already has a referral
          const alreadyReferred = await isUserAlreadyReferred(user.id);
          if (alreadyReferred) {
            console.log('User already has a referral. Redirecting to home page.');
            router.push('/');
            return;
          }
          
          // Additional check - get the existing referrer to be sure
          const existingReferrer = await getReferrerByUserId(user.id);
          if (existingReferrer) {
            console.log('User already has a referrer. Redirecting to home page.');
            router.push('/');
            return;
          }
          
          if (refCode) {
            let generatedCode = "";
            
            // Generate a username-based code
            let username = '';
            
            // Prefer Twitter username
            if (user.twitter?.username) {
              username = user.twitter.username;
            } 
            // Fall back to email prefix
            else if (user.email?.address) {
              username = user.email.address.split('@')[0];
            } 
            // Last resort, use a portion of their user ID
            else {
              username = `user_${user.id.substring(0, 6)}`;
            }
            
            // Clean username to be URL-friendly
            const usernameBased = username.replace(/[^a-zA-Z0-9_]/g, '');
            
            if (userRecord) {
              // Use existing referral code or update it
              if (userRecord.referral_code && userRecord.referral_code.startsWith('TF')) {
                generatedCode = usernameBased;
              } else if (userRecord.referral_code) {
                generatedCode = userRecord.referral_code;
              } else {
                generatedCode = usernameBased;
              }
            } else {
              generatedCode = usernameBased;
            }
            
            // Store user in database
            userRecord = await createOrUpdateUser(
              user.id,
              generatedCode,
              user.email?.address || undefined,
              user.twitter?.username || undefined,
              user.twitter?.profilePictureUrl || undefined
            );

            if (userRecord && refCode !== userRecord.referral_code) {
              // Track the referral if this user was referred
              await trackReferral(refCode, userRecord.id);
              
              // Redirect to home page after successful referral
              router.push('/');
            }
          } else {
            // No refCode but user is authenticated, redirect to home
            router.push('/');
          }
        } catch (error) {
          console.error('Error processing user after auth:', error);
        }
      }
      
      setProcessingAuth(false);
    };
    
    handleAuthentication();
  }, [authenticated, ready, user, refCode, router]);

  // Render the loading screen if not mounted or still waiting for auth status
  if (!mounted || !ready || processingAuth) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <div className="relative flex items-center justify-center z-10">
          <div className="absolute inset-0 rounded-full bg-[#8af337]/20 blur-xl animate-pulse"></div>
          <div className={`${klee.className} relative text-xl font-bold text-[#8af337] animate-pulse`}>Loading TokenFight...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <LandingHero referrerData={referrerData} />
    </main>
  );
} 