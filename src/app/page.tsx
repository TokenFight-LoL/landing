"use client"

import { useState, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Share2, User, Power } from "lucide-react"
import InvitedUsers from "@/components/invited-users"
import { AuthButton } from "@/components/auth-button"

// Mock data for invited users
const mockInvitedUsers = [
  { id: "1", username: "crypto_whale", avatar: "😎" },
  { id: "2", username: "nft_collector", avatar: "🤑" },
  { id: "3", username: "eth_trader", avatar: "🚀" },
  { id: "4", username: "defi_guru", avatar: "🧠" },
  { id: "5", username: "token_master", avatar: "👑" },
  { id: "6", username: "blockchain_dev", avatar: "👨‍💻" },
  { id: "7", username: "dao_voter", avatar: "🗳️" },
]

export default function Home() {
  const { ready, authenticated, user, logout } = usePrivy()
  const [referralCode, setReferralCode] = useState("")
  const [inviteCount, setInviteCount] = useState(0)
  const [invitedUsers, setInvitedUsers] = useState<typeof mockInvitedUsers>([])
  const [loading, setLoading] = useState(true)
  const [origin, setOrigin] = useState("")

  // Set the origin once on the client side
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  useEffect(() => {
    if (ready) {
      setLoading(false)
    }
  }, [ready])

  useEffect(() => {
    // Check for referral code in URL
    if (authenticated && user?.id) {
      const urlParams = new URLSearchParams(window.location.search)
      const ref = urlParams.get("ref")

      if (ref) {
        // In a real app, you would track this referral in your database
        console.log(`User ${user.id} was referred by code ${ref}`)
      }
    }
  }, [authenticated, user])

  useEffect(() => {
    // Generate a simple referral code if authenticated
    if (authenticated && user?.id) {
      // In a real app, you would get this from your database
      // For now, we'll generate one based on the user ID
      setReferralCode(`TF${btoa(user.id).substring(0, 8).toUpperCase()}`)

      // Use a consistent value for invites in development
      const count = 3 // Fixed value instead of Math.random()
      setInviteCount(count)

      // Get a consistent subset of the mock users
      setInvitedUsers(mockInvitedUsers.slice(0, count))
    }
  }, [authenticated, user])

  const copyReferralLink = () => {
    const link = `${origin || "https://tokenfight.lol"}?ref=${referralCode}`
    navigator.clipboard.writeText(link)
    alert("Referral link copied to clipboard")
  }

  // Handle loading state
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="animate-pulse">Loading...</div>
      </main>
    )
  }

  return (
    <main className="flex-1 py-12 p-4 sm:p-6 md:p-8">
      <div className="container max-w-md w-full mx-auto">
        {!authenticated ? (
          // Hero Section - Only shown when not authenticated
          <section className="space-y-6 sm:space-y-8 text-center">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Early Access</div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              TokenFight
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              A blockchain-powered strategy game where token communities battle on an infinite map. Capture territory,
              earn ETH, and increase your token&apos;s value through coordinated gameplay, strategic liquidity
              provision, and community-driven warfare.
            </p>

            <p className="text-base sm:text-lg font-semibold text-primary">
              Join early, invite friends, and secure exclusive launch rewards.
            </p>

            <div className="flex justify-center mt-6">
              <AuthButton size="lg" />
            </div>
          </section>
        ) : (
          // User Dashboard - Shown after authentication
          <section className="space-y-6">
            {/* User Profile Card */}
            <Card className="w-full overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {user?.twitter?.profilePictureUrl ? (
                      <img
                        src={user.twitter.profilePictureUrl || "/placeholder.svg"}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold">
                      {user?.twitter ? `@${user.twitter.username}` : (user?.email ? user.email.address.split("@")[0] : "User")}
                    </h2>
                    <p className="text-muted-foreground">
                      You've invited <span className="font-bold text-primary">{inviteCount}</span> people
                    </p>
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

            {/* Invited Users Card */}
            {invitedUsers.length > 0 && (
              <Card className="w-full">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h2 className="text-xl font-bold">Your Invites</h2>
                      <p className="text-muted-foreground mt-1">You will earn trading fees from these users</p>
                    </div>

                    <InvitedUsers users={invitedUsers} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Referral Card */}
            <Card className="w-full">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-xl font-bold">Invite Friends & Earn</h2>
                    <p className="text-muted-foreground mt-1">Invite friends to earn a portion of their trading fees</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={copyReferralLink} className="w-full">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Referral Link
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const text = encodeURIComponent(
                          `Join me in TokenFight - a blockchain strategy game where token communities battle for territory and ETH rewards! #TokenFight #GameFi`,
                        )
                        window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Share2 className="sm:mr-0 h-4 w-4" />
                      <span className="ml-2 sm:hidden">Share on Twitter</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </main>
  )
}

