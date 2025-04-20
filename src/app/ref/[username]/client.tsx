'use client';

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from 'react';
import { LandingHero } from "@/components/landing-hero";
import { createOrUpdateUser, getUserByPrivyId, trackReferral } from '@/lib/api';
import { Klee_One } from "next/font/google";

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
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const refCode = username;
  
  // Set mounted for hydration
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Handle post-authentication
  useEffect(() => {
    const handleAuthentication = async () => {
      if (authenticated && user?.id && refCode) {
        try {
          // Check if user exists
          let userRecord = await getUserByPrivyId(user.id);
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
            window.location.href = '/';
          }
        } catch (error) {
          console.error('Error processing user after auth:', error);
        }
      }
    };
    
    if (ready) {
      handleAuthentication();
      setLoading(false);
    }
  }, [authenticated, ready, user, refCode]);

  // Handle loading state or not mounted
  if (loading || !mounted) {
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