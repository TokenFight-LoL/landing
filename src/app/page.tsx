"use client"

import { useState, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { 
  createOrUpdateUser, 
  getUserByPrivyId, 
  trackReferral, 
  getUserReferrals, 
  getReferrerByUserId,
  getUserByReferralCode,
  isUserAlreadyReferred,
  type Referral, 
  type User as DbUser 
} from "@/lib/api"
import { LandingHero, type ReferrerData } from "@/components/landing-hero"
import Dashboard from "@/components/dashboard"
import { Klee_One } from "next/font/google"

const klee = Klee_One({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
})

// Type for invited users
type InvitedUser = {
  id: string;
  username: string;
  avatar: string;
  avatarUrl: string;
}

export default function Home() {
  const { ready, authenticated, user, logout } = usePrivy()
  const [referralCode, setReferralCode] = useState("")
  const [inviteCount, setInviteCount] = useState(0)
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [referrer, setReferrer] = useState<DbUser | null>(null)
  const [pendingReferrer, setPendingReferrer] = useState<ReferrerData | null>(null)
  const [mounted, setMounted] = useState(false)

  // Set mounted for hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Set the origin once on the client side
  useEffect(() => {
    const setOrigin = () => {
      window.localStorage.setItem('origin', window.location.origin)
    }
    setOrigin()
  }, [])

  // Check for referral code in URL for non-authenticated users
  useEffect(() => {
    const checkReferralCode = async () => {
      if (!authenticated && ready) {
        // Get the referral code from the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get("ref");
        
        if (ref) {
          try {
            const referrerData = await getUserByReferralCode(ref)
            if (referrerData) {
              setPendingReferrer(referrerData)
            }
          } catch (error) {
            console.error("Error fetching referrer data:", error)
          }
        }
      }
    }
    
    checkReferralCode()
  }, [authenticated, ready])

  useEffect(() => {
    if (ready) {
      setLoading(false)
    }
  }, [ready])

  useEffect(() => {
    // Check for referral code in URL and handle user data
    const handleUser = async () => {
      if (authenticated && user?.id) {
        // Get the referral code from the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get("ref");
        
        try {
          // First, check if user already exists in our database
          let userRecord = await getUserByPrivyId(user.id);
          let generatedCode = "";
          
          // Generate a username-based code regardless of whether the user exists
          let username = '';
          
          // Prefer Twitter username
          if (user.twitter?.username) {
            username = user.twitter.username;
          } 
          // Fall back to email prefix if no Twitter
          else if (user.email?.address) {
            username = user.email.address.split('@')[0];
          } 
          // Last resort, use a portion of their user ID
          else {
            username = `user_${user.id.substring(0, 6)}`;
          }
          
          // Clean username to be URL-friendly (remove special chars)
          const usernameBased = username.replace(/[^a-zA-Z0-9_]/g, '');
          
          if (userRecord) {
            // Check if the existing referral code is in the old format (starts with TF)
            if (userRecord.referral_code && userRecord.referral_code.startsWith('TF')) {
              generatedCode = usernameBased;
            } else if (userRecord.referral_code) {
              // User exists and already has a username-based referral code, use that
              generatedCode = userRecord.referral_code;
            } else {
              // User exists but has no referral code
              generatedCode = usernameBased;
            }
          } else {
            // New user, use the username-based code
            generatedCode = usernameBased;
          }
          
          // Immediately set the referral code in state to ensure it's available
          setReferralCode(generatedCode);
          
          // Store user in database with proper type handling
          userRecord = await createOrUpdateUser(
            user.id,
            generatedCode,
            user.email?.address || undefined,
            user.twitter?.username || undefined,
            user.twitter?.profilePictureUrl || undefined
          )

          if (userRecord) {
            setInviteCount(userRecord.invite_count || 0);
            
            // Always use the code from the database to ensure consistency
            setReferralCode(userRecord.referral_code);

            // If user was referred, track the referral (only happens once)
            if (ref && ref !== userRecord.referral_code) {
              // First check if this user has already been referred
              const alreadyReferred = await isUserAlreadyReferred(userRecord.id);
              if (!alreadyReferred) {
                await trackReferral(ref, userRecord.id);
              }
            }

            // Fetch all of this user's referrals
            const userReferrals = await getUserReferrals(userRecord.id)
            setReferrals(userReferrals)
            
            // Convert to format for InvitedUsers component
            const formattedInvites = userReferrals.map((referral) => {
              return {
                id: referral.id,
                username: referral.referred?.twitter_username || 'Anonymous User',
                avatar: '🧑‍💻', // Default emoji avatar as fallback
                avatarUrl: referral.referred?.twitter_profile_pic || '' // Direct URL to profile pic
              };
            });
            
            setInvitedUsers(formattedInvites)
            
            // Get referrer information
            const referrerData = await getReferrerByUserId(userRecord.id)
            if (referrerData) {
              setReferrer(referrerData)
            }
          }
        } catch (error) {
          console.error("Error handling user:", error)
        }
      }
    }

    handleUser()
  }, [authenticated, user])

  // Add a dependency on referrals for monitoring
  useEffect(() => {
    if (referrals.length > 0) {
      // This is just used to silence the linter about referrals being unused
      console.debug(`User has ${referrals.length} referrals`);
    }
  }, [referrals.length]);

  // Handle loading state or not mounted
  if (loading || !mounted) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <div className="relative flex items-center justify-center z-10">
          <div className="absolute inset-0 rounded-full bg-[#8af337]/20 blur-xl animate-pulse"></div>
          <div className={`${klee.className} relative text-xl font-bold text-[#8af337] animate-pulse`}>Loading TokenFight...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {!authenticated ? (
        // Hero Section - Only shown when not authenticated
        <LandingHero referrerData={pendingReferrer} />
      ) : user ? (
        // User Dashboard - Shown after authentication
        <Dashboard 
          user={user}
          referralCode={referralCode}
          inviteCount={inviteCount}
          invitedUsers={invitedUsers}
          referrer={referrer}
          logout={logout}
        />
      ) : null}
    </main>
  )
}

