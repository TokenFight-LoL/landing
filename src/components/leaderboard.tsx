import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface LeaderboardProps {
  userRank: number
}

export default function Leaderboard({ userRank }: LeaderboardProps) {
  // Mock data for leaderboard
  const leaderboardData = [
    { rank: 1, username: "crypto_king", referrals: 42, isCurrentUser: userRank === 1 },
    { rank: 2, username: "eth_maxi", referrals: 38, isCurrentUser: userRank === 2 },
    { rank: 3, username: "token_warrior", referrals: 35, isCurrentUser: userRank === 3 },
    { rank: 4, username: "nft_collector", referrals: 29, isCurrentUser: userRank === 4 },
    { rank: 5, username: "defi_degen", referrals: 24, isCurrentUser: userRank === 5 },
    { rank: 6, username: "blockchain_bro", referrals: 21, isCurrentUser: userRank === 6 },
    { rank: 7, username: "satoshi_fan", referrals: 18, isCurrentUser: userRank === 7 },
    { rank: 8, username: "web3_wizard", referrals: 15, isCurrentUser: userRank === 8 },
    { rank: 9, username: "crypto_whale", referrals: 12, isCurrentUser: userRank === 9 },
    { rank: 10, username: "token_trader", referrals: 10, isCurrentUser: userRank === 10 },
  ]

  return (
    <section className="py-12">
      <Card>
        <CardHeader>
          <CardTitle>Referral Leaderboard</CardTitle>
          <CardDescription>Top community members helping TokenFight grow</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-right">Referrals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((user) => (
                <TableRow key={user.rank} className={user.isCurrentUser ? "bg-primary/10" : ""}>
                  <TableCell className="font-medium">
                    {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : user.rank}
                  </TableCell>
                  <TableCell>
                    @{user.username}
                    {user.isCurrentUser && <span className="ml-2 text-xs text-primary">(You)</span>}
                  </TableCell>
                  <TableCell className="text-right">{user.referrals}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}

