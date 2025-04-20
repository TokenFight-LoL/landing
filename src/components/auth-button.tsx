"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Klee_One } from "next/font/google";

const klee = Klee_One({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

interface AuthButtonProps {
  size?: "sm" | "lg";
  className?: string;
}

export function AuthButton({ size = "sm", className }: AuthButtonProps) {
  const { ready, authenticated, login, isModalOpen } = usePrivy();
  
  // Handle login with modal tracking
  const handleLogin = () => {
    login();
  };

  if (!ready) {
    return (
      <Button 
        variant="outline" 
        size={size} 
        disabled
        className={`${klee.className} ${className || ""}`}
      >
        Loading...
      </Button>
    );
  }

  // Don't render anything if the user is authenticated
  if (authenticated) {
    return null;
  }

  if (size === "lg") {
    return (
      <Button 
        onClick={handleLogin} 
        size="lg" 
        className={`${className || ""} group relative inline-flex items-center justify-center px-10 py-3.5 overflow-hidden rounded-full border border-[#8af337]/50 bg-transparent text-[#8af337] transition-all hover:bg-[#8af337]/10 focus:outline-none animate-glow-pulse hover:animate-none`}
        disabled={isModalOpen}
      >
        <span className={`${klee.className} relative flex items-center gap-2 text-base font-normal uppercase tracking-wide`}>
          {isModalOpen ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#8af337]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              CONNECTING...
            </>
          ) : (
            <>
              JOIN NOW
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </span>
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleLogin} 
      className={`${className || ""} relative overflow-hidden group border border-[#8af337]/50 bg-transparent text-[#8af337] hover:bg-[#8af337]/10`}
      disabled={isModalOpen}
    >
      <span className={`${klee.className} relative flex items-center justify-center`}>
        {isModalOpen ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 inline-block h-3 w-3 text-[#8af337]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting
          </>
        ) : (
          "Join Now"
        )}
      </span>
    </Button>
  );
} 