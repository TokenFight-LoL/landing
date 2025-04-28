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
          
          // If this Privy user already has an account in our database, we do NOT allow them to attach a referral.
          if (userRecord) {
            console.log('Existing user detected – skipping referral application and redirecting to home.');
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
            
            // Since the user doesn't yet exist, we can safely use the username-based code.
            generatedCode = usernameBased;
            
            // Store user in database
            userRecord = await createOrUpdateUser(
              user.id,
              generatedCode,
              user.email?.address || undefined,
              user.twitter?.username || undefined,
              user.twitter?.profilePictureUrl || undefined
            );

            if (userRecord) {
              // Avoid self-referral when the generated code equals the referrer code
              if (refCode !== userRecord.referral_code) {
                await trackReferral(refCode, userRecord.id);
              } else {
                console.log('Generated referral code matches ref code; skipping self-referral.');
              }
              
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