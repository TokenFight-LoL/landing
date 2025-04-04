"use client"

import { useState, useEffect } from "react"
import { Copy, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface DashboardProps {
  referralCode: string
  referralCount: number
  userRank: number
  totalUsers: number
  nextUser: {
    username: string
    count: number
  }
}

export default function Dashboard({ referralCode, referralCount, userRank, totalUsers, nextUser }: DashboardProps) {
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState("")

  // Set the origin once on the client side
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const referralLink = `${origin || "https://tokenfight.lol"}/invite?ref=${referralCode}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    alert("Referral link copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `Trade tokens that kill each other: ${referralLink}`,
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
  }

  return (
    <section className="py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Referral Dashboard</CardTitle>
          <CardDescription>Share your link to climb the leaderboard and earn exclusive rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Your Referral Link</h3>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="flex-1" />
              <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copy referral link">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Referrals</p>
                  <p className="text-3xl font-bold">{referralCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Your Rank</p>
                  <p className="text-3xl font-bold">
                    {userRank} <span className="text-sm text-muted-foreground">/ {totalUsers}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">To Next Rank</p>
                  <p className="text-3xl font-bold">{nextUser.count}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-center">
              Invite <span className="font-bold text-primary">{nextUser.count} more friends</span> to pass{" "}
              <span className="font-bold">@{nextUser.username}</span> on the leaderboard!
            </p>
          </div>

          <Button onClick={shareOnTwitter} className="w-full" variant="outline">
            <Twitter className="mr-2 h-4 w-4" />
            Share on Twitter
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

