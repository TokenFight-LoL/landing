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
        className={`${className || ""} cursor-pointer group w-[200px] sm:w-[220px] md:w-[240px] lg:w-[259px] h-[50px] sm:h-[58px] md:h-[65px] lg:h-[72px] px-4 sm:px-6 md:px-8 lg:px-9 py-2 sm:py-2.5 md:py-3 flex justify-center items-center gap-3 sm:gap-4 md:gap-5 flex-shrink-0 rounded-full border border-[#8af337] bg-transparent text-[#8af337] transition-all hover:bg-[#8af337]/10 focus:outline-none animate-glow-pulse hover:animate-none`}
        disabled={isModalOpen}
      >
        {isModalOpen ? (
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2">
            <svg className="animate-spin h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-[#8af337]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className={`${klee.className} text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-semibold not-italic leading-none uppercase green-stroke`}>
              CONNECTING...
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3">
            <p className={`${klee.className} text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-semibold not-italic leading-none uppercase green-stroke m-0 p-0 strong-bold`}>
              JOIN NOW
            </p>
            <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
          </div>
        )}
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleLogin} 
      className={`${className || ""} cursor-pointer relative overflow-hidden group border border-[#8af337]/50 bg-transparent text-[#8af337] hover:bg-[#8af337]/10 text-xs sm:text-sm md:text-base`}
      disabled={isModalOpen}
    >
      <span className={`${klee.className} relative flex items-center justify-center`}>
        {isModalOpen ? (
          <>
            <svg className="animate-spin -ml-1 mr-1 sm:mr-1.5 md:mr-2 inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#8af337]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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