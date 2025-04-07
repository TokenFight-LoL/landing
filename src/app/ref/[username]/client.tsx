'use client';

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from 'react';
import { AuthButton } from "@/components/auth-button";
import { Trophy, Users } from "lucide-react";
import { createOrUpdateUser, getUserByPrivyId, trackReferral } from '@/lib/api';

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
  const refCode = username;
  
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

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-black/40">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
          <div className="relative text-xl font-bold text-primary animate-pulse">Loading TokenFight...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-lg mx-auto p-4 sm:p-6 md:p-8">
      <div className="container w-full mx-auto">
        <section className="space-y-6 sm:space-y-8 text-center">
          {referrerData && (
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/30 to-purple-700/30 p-4 rounded-lg text-sm text-white font-medium animate-pulse">
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-purple-700/30 rounded-full blur-xl"></div>
              <Users className="h-5 w-5 mb-1 mx-auto" />
              <p>You are being invited by <span className="font-bold">
                {referrerData.twitter_username || referrerData.email || 'a TokenFight community member'}
              </span></p>
            </div>
          )}
          
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Limited Access</div>

          {/* Logo Image */}
          <div className="mx-auto w-32 h-32 mb-4">
            <img src="/logo.png" alt="TokenFight Logo" className="w-full h-full object-contain" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-indigo-600">
            TokenFight
          </h1>

          <div className="mx-auto max-w-md">
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Trade tokens that kill each other
            </p>
          </div>

          <div className="py-3 px-4 border border-primary/20 rounded-lg bg-primary/5 flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <p className="text-base sm:text-lg font-semibold text-primary">
             Join early, invite friends, and earn <span className="underline decoration-dotted decoration-primary/60">trading fees</span>
            </p>
          </div>

          <div className="flex justify-center mt-8">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-lg blur-lg opacity-70"></div>
              <AuthButton size="lg" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 