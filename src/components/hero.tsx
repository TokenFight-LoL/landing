"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroProps {
  onLogin: () => void
  isAuthenticated: boolean
}

export default function Hero({ onLogin, isAuthenticated }: HeroProps) {
  return (
    <section className="py-12 md:py-24 lg:py-32 space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">Early Access</div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
          TokenFight
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          A blockchain-powered strategy game where token communities battle on an infinite map. Capture territory, earn
          ETH, and increase your token&apos;s value through coordinated gameplay, strategic liquidity provision, and
          community-driven warfare.
        </p>
        <p className="text-lg font-semibold text-primary">
          Join early, invite friends, and secure exclusive launch rewards.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="flex justify-center mt-8">
          <Button size="lg" onClick={onLogin} className="group">
            Sign in with Twitter
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      )}
    </section>
  )
}

