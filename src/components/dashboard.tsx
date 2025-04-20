"use client"

import { useState, useEffect } from "react"
import { Copy, User as UserIcon, Power, Users, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import InvitedUsers from "@/components/invited-users"
import Image from "next/image"
import { Klee_One } from "next/font/google"
import type { User as PrivyUser } from '@privy-io/react-auth';
import type { User as DbUser } from "@/lib/api"

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

interface DashboardProps {
  user: PrivyUser;
  referralCode: string;
  inviteCount: number;
  invitedUsers: InvitedUser[];
  referrer: DbUser | null;
  logout: () => void;
}

export default function Dashboard({ user, referralCode, inviteCount, invitedUsers, referrer, logout }: DashboardProps) {
  const [origin, setOrigin] = useState("")
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)

  // Set the origin once on the client side
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

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

  const shareOnTwitter = () => {
    const referralLink = `${origin || "https://tokenfight.lol"}/ref/${referralCode}`;
    const text = encodeURIComponent(
      `Trade tokens that kill each other: ${referralLink}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  }

  // Get display name for user
  const displayName = user?.twitter ? `@${user.twitter.username}` : (user?.email ? user.email.address.split("@")[0] : "User");
  // Get user ID for display
  const userId = `id: tokenfightid${user.id.substring(0, 3)}`;

  // Common card background styling
  const cardBgClass = "rounded-[30px] bg-gradient-to-t from-[rgba(162,162,162,0.16)] to-[rgba(206,206,206,0.05)] shadow-[0px_2.5px_157px_rgba(0,0,0,0.3)] backdrop-blur-[65px] border-[#2e3446]/10";

  return (
    <section className="z-10 w-full max-w-lg mx-auto flex flex-col h-screen">
      {/* Fixed header section */}
      <div className="flex flex-col items-center px-4 sm:px-6 md:px-8 pt-6 pb-4">
        {/* Logo at top */}
        
        {/* Main header */}
        <div className="text-center mb-3">
          <div className="w-full flex justify-center mb-4">
            <div className="w-10 h-10">
              <Image src="/logo.png" alt="TokenFight Logo" width={80} height={80} className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className={`${klee.className} text-[32px] font-semibold text-white leading-normal [text-shadow:_0_0_1px_#fff] [-webkit-text-stroke-width:_0.5px] [-webkit-text-stroke-color:_#fff]`}>Invite & Earn</h1>
          <p className={`${klee.className} text-[24px] font-semibold text-white leading-normal`}>
            Earn 2% of your friends&apos; trading fees on <span className="text-[#8af337]">🦎 Token Fight!</span> when we&apos;re live!
          </p>
        </div>

        {/* Referrer info (if present) */}
        {referrer && (
          <div className="relative w-full overflow-hidden text-center text-sm px-3 py-2 rounded-lg bg-[#1e2333]/70 border border-[#2e3446] mb-1">
            <p className={klee.className}>You were invited by <span className="font-medium text-[#8af337]">{referrer.twitter_username || referrer.email || 'a TokenFight community member'}</span></p>
          </div>
        )}
      </div>
      
      {/* Scrollable content container */}
      <div className="overflow-y-auto flex-1 pb-6 pl-4 pr-1 sm:pl-6 sm:pr-1 md:pl-8 md:pr-1 scrollbar-thin">
        <div className="space-y-5">          
          {/* User Profile Card */}
          <Card className={`w-full overflow-hidden relative ${cardBgClass}`}>
            <CardContent className="p-5 relative">
              <div className="flex items-center">
                <div className="h-14 w-14 mr-4 rounded-full bg-[#8af337]/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {user?.twitter?.profilePictureUrl ? (
                    <img
                      src={user.twitter.profilePictureUrl || "/placeholder.svg"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6 text-[#8af337]" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <h2 className={`${klee.className} text-xl font-semibold text-[#8af337]`}>
                      {displayName}
                    </h2>
                    <ExternalLink className="h-4 w-4 text-[#8af337]/70" />
                  </div>
                  <p className={`${klee.className} text-sm text-gray-400`}>{userId}</p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-[#ff5a5a]/10 hover:text-[#ff5a5a] flex-shrink-0" 
                  onClick={logout}
                  title="Logout"
                >
                  <Power className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Stats Cards - Moved inside the user profile card */}
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="rounded-[10px] bg-black/40 backdrop-blur-[10px] p-4 text-center">
                  <h3 className={`${klee.className} text-gray-400 text-sm mb-1`}>Referrals Invited</h3>
                  <p className={`${klee.className} text-2xl font-bold text-white`}>{inviteCount}</p>
                </div>
                
                <div className="rounded-[10px] bg-black/40 backdrop-blur-[10px] p-4 text-center">
                  <h3 className={`${klee.className} text-gray-400 text-sm mb-1`}>Rewards Earned 💎</h3>
                  <p className={`${klee.className} text-xl font-bold text-[#8af337]`}>coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Referral Link Card */}
          <Card className={`w-full ${cardBgClass}`}>
            <CardContent className="p-5">
              <h3 className={`${klee.className} text-lg font-semibold text-white mb-3`}>Your referral link</h3>
              
              <div className="flex gap-2 mb-2">
                <div className={`${klee.className} flex-1 bg-[#15192a] rounded-md p-2 text-sm text-gray-300 border border-[#2e3446]/50 overflow-hidden whitespace-nowrap overflow-ellipsis`}>
                  {`${origin}/ref/${referralCode}`}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={copyReferralLink}
                  className={`${klee.className} bg-[#15192a] border border-[#2e3446]/50 text-gray-300 hover:bg-[#15192a]/80`}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <p className={`${klee.className} text-sm text-gray-400`}>Share your link on twitter!</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareOnTwitter}
                  className={`${klee.className} bg-[#8af337] hover:bg-[#8af337]/80 text-black border-none`}
                >
                  Share
                </Button>
              </div>
              
              {/* Copied message */}
              <div className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-[#8af337] text-black text-sm font-medium rounded-md transition-opacity duration-300 z-50 ${showCopiedMessage ? 'opacity-100' : 'opacity-0'} ${klee.className}`}>
                Copied!
              </div>
            </CardContent>
          </Card>

          {/* My Referrals Card */}
          <Card className={`w-full ${cardBgClass}`}>
            <CardContent className="p-5">
              <h3 className={`${klee.className} text-lg font-semibold text-white mb-2`}>My Referrals</h3>
              <p className={`${klee.className} text-sm text-gray-400 mb-4`}>You earn 2% of the trading fees from every person you invite (when the game launches).</p>
              
              {invitedUsers.length > 0 ? (
                <InvitedUsers users={invitedUsers} />
              ) : (
                <div className="text-center py-8 px-6 bg-[#15192a] rounded-lg border border-[#2e3446]/50">
                  <div className="flex justify-center">
                    <Users className="h-8 w-8 text-[#8af337]/40 mx-auto mb-3" />
                  </div>
                  <p className={`${klee.className} text-gray-300 font-medium mb-2`}>No invites yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Footer note */}
          <div className="flex items-center justify-center mt-6 text-center">
            <Image 
              src="/moneybag.png" 
              alt="Money Bag" 
              width={30} 
              height={30}
              className="mr-2"
            />
            <p className={`${klee.className} text-sm text-[#8af337]`}>Share now and earn rewards when the game launches!</p>
          </div>
        </div>
      </div>
    </section>
  )
}

