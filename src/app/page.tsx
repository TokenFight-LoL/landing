"use client"

import { useState, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Share2, User as UserIcon, Power, Trophy, Users, ArrowUpRight } from "lucide-react"
import InvitedUsers from "@/components/invited-users"
import { AuthButton } from "@/components/auth-button"
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
  const [origin, setOrigin] = useState("")
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [referrer, setReferrer] = useState<DbUser | null>(null)
  const [pendingReferrer, setPendingReferrer] = useState<DbUser | null>(null)
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)

  // Set the origin once on the client side
  useEffect(() => {
    setOrigin(window.location.origin)
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

  const copyReferralLink = () => {
    // Use the new route format for better sharing and OpenGraph support
    const link = `${origin || "https://tokenfight.lol"}/ref/${referralCode}`
    navigator.clipboard.writeText(link)
    setShowCopiedMessage(true)
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowCopiedMessage(false)
    }, 3000)
  }

  // Add a dependency on referrals for monitoring
  useEffect(() => {
    if (referrals.length > 0) {
      // This is just used to silence the linter about referrals being unused
      console.debug(`User has ${referrals.length} referrals`);
    }
  }, [referrals.length]);

  // Handle loading state
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-black/40">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
          <div className="relative text-xl font-bold text-primary animate-pulse">Loading TokenFight...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full max-w-lg mx-auto p-4 sm:p-6 md:p-8">
      <div className="container w-full mx-auto">
        {!authenticated ? (
          // Hero Section - Only shown when not authenticated
          <section className="space-y-6 sm:space-y-8 text-center">
            {pendingReferrer && (
              <div className="relative overflow-hidden bg-gradient-to-r from-primary/30 to-purple-700/30 p-4 rounded-lg text-sm text-white font-medium animate-pulse">
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/30 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-purple-700/30 rounded-full blur-xl"></div>
                <Users className="h-5 w-5 mb-1 mx-auto" />
                <p>You are being invited by <span className="font-bold">{pendingReferrer.twitter_username || pendingReferrer.email || 'a TokenFight community member'}</span></p>
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
        ) : (
          // User Dashboard - Shown after authentication
          <section className="space-y-6">
            {/* Logo at top center when logged in */}
            <div className="w-full flex justify-center mb-6">
              <div className="w-20 h-20">
                <img src="/logo.png" alt="TokenFight Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            {referrer && (
              <div className="relative overflow-hidden text-center text-sm px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-primary/10 border border-primary/10">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                You were invited by <span className="font-medium">{referrer.twitter_username || referrer.email || 'a TokenFight community member'}</span>
              </div>
            )}
            
            {/* User Profile Card */}
            <Card className="w-full overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-indigo-500/5"></div>
              <div className="absolute top-0 right-0 h-20 w-20 bg-purple-500/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 h-16 w-16 bg-primary/10 rounded-full blur-xl"></div>
              <CardContent className="p-6 relative">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <div className="h-full w-full rounded-full overflow-hidden bg-background flex items-center justify-center">
                      {user?.twitter?.profilePictureUrl ? (
                        <img
                          src={user.twitter.profilePictureUrl || "/placeholder.svg"}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-8 w-8 text-primary" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                      {user?.twitter ? `@${user.twitter.username}` : (user?.email ? user.email.address.split("@")[0] : "User")}
                    </h2>
                    <div className="flex items-center justify-center sm:justify-start mt-1 gap-1.5">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <p className="text-base">
                        You&apos;ve invited <span className="font-bold text-primary">{inviteCount}</span> {inviteCount === 1 ? 'person' : 'people'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-destructive/10 hover:text-destructive flex-shrink-0" 
                    onClick={logout}
                    title="Logout"
                  >
                    <Power className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Referral Card - Moved to top priority */}
            <Card className="w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-400/5"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-xl opacity-50"></div>
              <CardContent className="p-6 relative">
                <div className="space-y-5">
                  <div className="text-center">
                    <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                      <Share2 className="h-5 w-5 text-primary" />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Invite Friends & Earn</span>
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">Earn 2% of trading fees from everyone you invite</p>
                  </div>

                  {/* Copy button now standalone */}
                  <Button onClick={copyReferralLink} className="w-full relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-indigo-600"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative flex items-center justify-center">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Personal Link
                    </span>
                  </Button>
                  
                  {/* Copied message */}
                  <div className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-primary text-white text-sm font-medium rounded-md transition-opacity duration-300 z-50 ${showCopiedMessage ? 'opacity-100' : 'opacity-0'}`}>
                    Copied!
                  </div>
                  
                  {/* Twitter share button moved below */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Use the new route format for better sharing and OpenGraph support
                      const referralLink = `${origin || "https://tokenfight.lol"}/ref/${referralCode}`;
                      const text = encodeURIComponent(
                        `Trade tokens that kill each other: ${referralLink}`
                      );
                      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
                    }}
                    className="w-full border-primary/30 hover:bg-primary/10 flex items-center justify-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share on Twitter</span>
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Invited Users Card */}
            <Card className="w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-primary/5 to-indigo-500/5"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-xl opacity-50"></div>
              <CardContent className="p-6 relative">
                <div className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Your Network</span>
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">People you&apos;ve invited - you earn 2% of their trading fees</p>
                  </div>

                  {invitedUsers.length > 0 ? (
                    <InvitedUsers users={invitedUsers} />
                  ) : (
                    <div className="text-center py-10 px-6 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg border border-primary/10">
                      <Users className="h-8 w-8 text-primary/40 mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2 font-medium">No invites yet</p>
                      <p className="text-sm max-w-xs mx-auto">Share your personal link to start earning 2% of your friends&apos; trading fees!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </main>
  )
}

