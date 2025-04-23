"use client"

import { useState, useEffect } from "react"
import { Copy, User as UserIcon, Power, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Klee_One } from "next/font/google"
import localFont from 'next/font/local'
import type { User as PrivyUser } from '@privy-io/react-auth';
import type { User as DbUser } from "@/lib/api"

// Font definitions
const klee = Klee_One({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
})

// Define SF Pro font (local)
const sfPro = localFont({
  src: [
    {
      path: './sf-pro-regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './sf-pro-medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './sf-pro-bold.otf',
      weight: '700',
      style: 'normal',
    }
  ],
  display: 'swap'
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
  const displayName = user?.twitter ? `${user.twitter.name}` : (user?.email ? user.email.address.split("@")[0] : "User");
  // Get user ID for display
  const userId = `@${user?.twitter?.username}`;

  // Common card background styling
  const cardBgClass = "rounded-[30px] bg-gradient-to-t from-[rgba(162,162,162,0.16)] to-[rgba(206,206,206,0.05)] shadow-[0px_2.5px_157px_rgba(0,0,0,0.3)] backdrop-blur-[65px] border-[#2e3446]/10";

  return (
    <section className="z-10 w-full max-w-lg mx-auto flex flex-col h-screen">
      {/* Fixed header section */}
      <div className="flex flex-col items-center px-4 sm:px-6 md:px-8 pt-6 pb-4">        
        {/* Main header */}
        <div className="text-center mb-3">
          <h1 className={`${klee.className} text-[32px] font-semibold text-white leading-normal [text-shadow:_0_0_1px_#fff] [-webkit-text-stroke-width:_0.5px] [-webkit-text-stroke-color:_#fff]`}>Invite & Earn</h1>
          <p className={`${klee.className} text-[24px] font-semibold text-white leading-normal`}>
            Earn 2% of your friends&apos; trading fees on <span className="text-[#8af337]"><img src="/logo.png" alt="Token Fight Logo" width={20} height={20} className="inline-block mr-1" /> Token Fight!</span> when we&apos;re live!
          </p>
        </div>

        {/* Referrer info (if present) */}
        {referrer && (
          <div className="relative w-full overflow-hidden text-center text-sm px-3 py-2 rounded-lg bg-[#1e2333]/70 border border-[#2e3446] mb-1">
            <p className={sfPro.className}>You were invited by <span className="font-medium text-[#8af337]">{referrer.twitter_username || referrer.email || 'a TokenFight community member'}</span></p>
          </div>
        )}
      </div>
      
      {/* Scrollable content container */}
      <div className="flex-1 pb-6 pl-4 pr-1 sm:pl-6 sm:pr-1 md:pl-8 md:pr-1">
        <div className="space-y-5">          
          {/* User Profile Card */}
          <div className={`w-full overflow-hidden relative ${cardBgClass}`}>
            <div className="px-[36px] py-[30px] relative">
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
                    <h2 className={`${sfPro.className} text-[24px] text-[#00FDEC] leading-normal font-semibold`} style={{ fontWeight: 590 }}>
                      @{displayName}
                    </h2>
                    <img 
                      src="/right-from-bracket.svg" 
                      alt="right from bracket" 
                      className="h-4 w-4"
                    />
                  </div>
                  <p className={`${sfPro.className} text-sm text-gray-400`}>{userId}</p>
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
                <div className="rounded-[10px] bg-black/60 backdrop-blur-[10px] p-4 text-center">
                  <h3 className={`${sfPro.className} text-gray-400 text-sm mb-1`}>Referrals Invited</h3>
                  <p className={`${sfPro.className} text-2xl font-bold text-white`}>{inviteCount}</p>
                </div>
                
                <div className="rounded-[10px] bg-black/60 backdrop-blur-[10px] p-4 text-center">
                  <h3 className={`${sfPro.className} text-gray-400 text-sm mb-1`}>Rewards Earned 💎</h3>
                  <p className={`${sfPro.className} text-xl font-bold text-[#8af337]`}>coming soon</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Referral Link Card */}
          <div className={`w-full ${cardBgClass}`}>
            <div className="px-[36px] py-[30px]">
              <h3 className={`${sfPro.className} text-[24px] text-white leading-normal mb-3`} style={{ fontWeight: 590 }}>Your referral link</h3>
              
              <div 
                className="flex h-[40px] px-[24px] py-[8px] justify-between items-center flex-1 rounded-[10px] border border-[#8AF337] bg-[rgba(55,55,55,0.50)] backdrop-blur-[10px] mb-2 cursor-pointer"
                onClick={copyReferralLink}
              >
                <div className={`${sfPro.className} text-[16px] text-white font-normal leading-normal overflow-hidden whitespace-nowrap overflow-ellipsis`}>
                  {`${origin}/ref/${referralCode}`}
                </div>
                <div className="flex items-center">
                  <Copy className="h-4 w-4 text-[#8AF337]" />
                  <span className={`${sfPro.className} text-[16px] text-[#8AF337] font-normal leading-normal ml-1`}>Copy</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <p className={`${sfPro.className} text-[16px] text-[#A2A2A2] font-normal leading-normal`}>Share your link on twitter!</p>
                <button
                  onClick={shareOnTwitter}
                  className="flex h-[40px] px-[24px] py-[8px] items-center gap-[10px] rounded-md border border-[#8AF337] bg-transparent hover:bg-[rgba(138,243,55,0.1)]"
                >
                  <span className={`${sfPro.className} text-[16px] text-[#8AF337] leading-normal`} style={{ fontWeight: 590 }}>Share</span>
                </button>
              </div>
              
              {/* Copied message */}
              <div className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-[#8af337] text-black text-sm font-medium rounded-md transition-opacity duration-300 z-50 ${showCopiedMessage ? 'opacity-100' : 'opacity-0'} ${sfPro.className}`}>
                Copied!
              </div>
            </div>
          </div>

          {/* My Referrals Card */}
          <div className={`w-full ${cardBgClass}`}>
            <div className="px-[36px] py-[30px]">
              <h3 className={`${sfPro.className} text-[24px] text-white leading-normal mb-2`} style={{ fontWeight: 590 }}>My Referrals</h3>
              <p className={`${sfPro.className} text-[16px] text-[#A2A2A2] font-normal leading-normal mb-4`}>You earn 2% of the trading fees from every person you invite (when the game launches).</p>
              
              {invitedUsers.length > 0 ? (
                <div className="space-y-2">
                  {invitedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-[10px] bg-[rgba(0,0,0,0.20)]">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-[#8af337]/20 flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-[#8af337]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`${sfPro.className} text-[14px] text-white font-normal leading-normal`}>{user.username}</p>
                        </div>
                      </div>
                      <p className={`${sfPro.className} text-[14px] text-white font-normal leading-normal opacity-60`}>Joined recently</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-6 rounded-[10px] bg-[rgba(0,0,0,0.20)]">
                  <div className="flex justify-center">
                    <Users className="h-8 w-8 text-[#8af337]/40 mx-auto mb-3" />
                  </div>
                  <p className={`${sfPro.className} text-[14px] text-white font-normal leading-normal mb-2`}>No invites yet.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer note */}
          <div className="flex items-center justify-center mt-6 text-center">
            <Image 
              src="/moneybag.png" 
              alt="Money Bag" 
              width={30} 
              height={30}
              className="mr-2"
            />
            <p className={`${sfPro.className} text-sm text-[#8af337]`}>Share now and earn rewards when the game launches!</p>
          </div>
        </div>
      </div>
    </section>
  )
}

