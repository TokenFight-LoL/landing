"use client"

import { useState, useEffect } from "react"
import { Copy, User as UserIcon, Power, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Klee_One } from "next/font/google"
import type { User as PrivyUser } from '@privy-io/react-auth';
import type { User as DbUser } from "@/lib/api"

// Font definitions
const klee = Klee_One({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
})

// Define SF Pro font (local)
/*
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
*/

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
  isGenesis: boolean;
  genesisCount: number;
  genesisSpotsTotal: number;
}

export default function Dashboard({ 
  user, 
  referralCode, 
  inviteCount, 
  invitedUsers, 
  referrer, 
  logout,
  isGenesis,
  genesisCount,
  genesisSpotsTotal
}: DashboardProps) {
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

  // Calculate Genesis spots remaining
  const genesisSpotsLeft = genesisSpotsTotal - genesisCount;

  return (
    <section className="z-10 w-full max-w-lg mx-auto flex flex-col h-screen">
      {/* Fixed header section */}
      <div className="flex flex-col items-center px-4 sm:px-6 md:px-8 pt-6 pb-4">        
        {/* Main header */}
        <div className="text-center mb-3">
          <h1 className={`${klee.className} text-[24px] sm:text-[28px] md:text-[32px] text-white leading-normal token-stroke`}>Invite & Earn</h1>
          <p className={`${klee.className} text-[18px] sm:text-[20px] md:text-[24px] text-white leading-normal`}>
            Earn 2% of your friends&apos; trading fees on <span className="text-[#8af337]"><img src="/logo.png" alt="Token Fight Logo" width={20} height={20} className="inline-block mr-1 w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" /> Token Fight!</span> when we&apos;re live!
          </p>
        </div>

        {/* Genesis users count display */}
        <div className="relative w-full overflow-hidden text-center text-sm px-3 py-2 rounded-lg bg-[#1e2333]/70 border border-[#2e3446] mb-1">
          <p className={klee.className}>
            ⚡ <span className="text-[#8af337]">{genesisSpotsLeft}</span>/{genesisSpotsTotal} Genesis spots left
          </p>
        </div>

        {/* Referrer info (if present) */}
        {referrer && (
          <div className="relative w-full overflow-hidden text-center text-sm px-3 py-2 rounded-lg bg-[#1e2333]/70 border border-[#2e3446] mb-1">
            <p className={klee.className}>You were invited by <span className="medium-bold text-[#8af337]">{referrer.twitter_username || referrer.email || 'a TokenFight community member'}</span></p>
          </div>
        )}
      </div>
      
      {/* Scrollable content container */}
      <div className="flex-1 pb-6 pl-4 pr-1 sm:pl-6 sm:pr-1 md:pl-8 md:pr-1">
        <div className="space-y-5">          
          {/* User Profile Card */}
          <div className={`w-full overflow-hidden relative ${cardBgClass}`}>
            <div className="px-4 sm:px-6 md:px-[36px] py-5 sm:py-6 md:py-[30px] relative">
              {isGenesis && (
                <div className="text-center mb-4">
                  <span className="text-sm md:text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x">
                    ⚡ You have claimed Genesis spot
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 mr-3 md:mr-4 rounded-full bg-[#8af337]/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {user?.twitter?.profilePictureUrl ? (
                    <img
                      src={user.twitter.profilePictureUrl || "/placeholder.svg"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5 md:h-6 md:w-6 text-[#8af337]" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <h2 className={`${klee.className} text-[18px] sm:text-[20px] md:text-[24px] text-[#00FDEC] leading-normal medium-bold`}>
                      @{displayName}
                    </h2>
                    <img 
                      src="/right-from-bracket.svg" 
                      alt="right from bracket" 
                      className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"
                    />
                  </div>
                  <p className={`${klee.className} text-xs sm:text-sm text-gray-400`}>{userId}</p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-[#ff5a5a]/10 hover:text-[#ff5a5a] flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10" 
                  onClick={logout}
                  title="Logout"
                >
                  <Power className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
                </Button>
              </div>
              
              {/* Stats Cards - Moved inside the user profile card */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mt-4 md:mt-5">
                <div className="rounded-[10px] bg-black/60 backdrop-blur-[10px] p-3 md:p-4 text-center">
                  <h3 className={`${klee.className} text-gray-400 text-xs md:text-sm mb-0.5 md:mb-1`}>Referrals Invited</h3>
                  <p className={`${klee.className} text-xl md:text-2xl text-white strong-bold`}>{inviteCount}</p>
                </div>
                
                <div className="rounded-[10px] bg-black/60 backdrop-blur-[10px] p-3 md:p-4 text-center">
                  <h3 className={`${klee.className} text-gray-400 text-xs md:text-sm mb-0.5 md:mb-1`}>Rewards Earned 💎</h3>
                  <p className={`${klee.className} text-lg md:text-xl text-[#8af337] strong-bold`}>coming soon</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Referral Link Card */}
          <div className={`w-full ${cardBgClass}`}>
            <div className="px-4 sm:px-6 md:px-[36px] py-5 sm:py-6 md:py-[30px]">
              <h3 className={`${klee.className} text-[18px] sm:text-[20px] md:text-[24px] text-white leading-normal mb-2 md:mb-3 medium-bold`}>Your referral link</h3>
              
              <div 
                className="flex h-[36px] md:h-[40px] px-3 sm:px-4 md:px-[24px] py-[6px] md:py-[8px] justify-between items-center flex-1 rounded-[10px] border border-[#8AF337] bg-[rgba(55,55,55,0.50)] backdrop-blur-[10px] mb-2 cursor-pointer"
                onClick={copyReferralLink}
              >
                <div className={`${klee.className} text-[14px] md:text-[16px] text-white font-normal leading-normal overflow-hidden whitespace-nowrap overflow-ellipsis`}>
                  {`${origin}/ref/${referralCode}`}
                </div>
                <div className="flex items-center">
                  <Copy className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#8AF337]" />
                  <span className={`${klee.className} text-[14px] md:text-[16px] text-[#8AF337] font-normal leading-normal ml-1`}>Copy</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <p className={`${klee.className} text-[14px] md:text-[16px] text-[#A2A2A2] font-normal leading-normal`}>Share your link on twitter!</p>
                <button
                  onClick={shareOnTwitter}
                  className="flex h-[36px] md:h-[40px] px-4 sm:px-5 md:px-[24px] py-[6px] md:py-[8px] items-center gap-[6px] md:gap-[10px] rounded-md border border-[#8AF337] bg-transparent hover:bg-[rgba(138,243,55,0.1)]"
                >
                  <span className={`${klee.className} text-[14px] md:text-[16px] text-[#8AF337] leading-normal medium-bold`}>Share</span>
                </button>
              </div>
              
              {/* Copied message */}
              <div className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 px-2 sm:px-3 py-0.5 sm:py-1 bg-[#8af337] text-black text-xs sm:text-sm medium-bold rounded-md transition-opacity duration-300 z-50 ${showCopiedMessage ? 'opacity-100' : 'opacity-0'} ${klee.className}`}>
                Copied!
              </div>
            </div>
          </div>

          {/* My Referrals Card */}
          <div className={`w-full ${cardBgClass}`}>
            <div className="px-4 sm:px-6 md:px-[36px] py-5 sm:py-6 md:py-[30px]">
              <h3 className={`${klee.className} text-[18px] sm:text-[20px] md:text-[24px] text-white leading-normal mb-2 medium-bold`}>Your Referrals</h3>
              <p className={`${klee.className} text-[14px] md:text-[16px] text-[#A2A2A2] font-normal leading-normal mb-3 md:mb-4`}>You earn 2% of the trading fees from every person you invite (when the game launches).</p>
              
              {invitedUsers.length > 0 ? (
                <div className="space-y-1.5 sm:space-y-2">
                  {invitedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 sm:p-3 md:p-4 rounded-[10px] bg-[rgba(0,0,0,0.20)]">
                      <div className="flex items-center">
                        <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full overflow-hidden mr-2 md:mr-3">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-[#8af337]/20 flex items-center justify-center">
                              <UserIcon className="h-4 w-4 md:h-5 md:w-5 text-[#8af337]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`${klee.className} text-[12px] sm:text-[13px] md:text-[14px] text-white font-normal leading-normal`}>{user.username}</p>
                        </div>
                      </div>
                      <p className={`${klee.className} text-[12px] sm:text-[13px] md:text-[14px] text-white font-normal leading-normal opacity-60`}>Joined recently</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 sm:py-6 md:py-8 px-4 sm:px-5 md:px-6 rounded-[10px] bg-[rgba(0,0,0,0.20)]">
                  <div className="flex justify-center">
                    <Users className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#8af337]/40 mx-auto mb-2 md:mb-3" />
                  </div>
                  <p className={`${klee.className} text-[12px] sm:text-[13px] md:text-[14px] text-white font-normal leading-normal mb-1 md:mb-2`}>No invites yet.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer note */}
          <div className="flex items-center justify-center mt-4 sm:mt-5 md:mt-6 text-center">
            <Image 
              src="/moneybag.png" 
              alt="Money Bag" 
              width={24}
              height={24}
              className="mr-1.5 sm:mr-2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
            />
            <p className={`${klee.className} text-xs sm:text-sm text-[#8af337]`}>Share now and earn rewards when the game launches!</p>
          </div>
        </div>
      </div>
    </section>
  )
}

