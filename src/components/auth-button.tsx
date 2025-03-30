"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

export function AuthButton({ size = "sm" }: { size?: "sm" | "lg" }) {
  const { ready, authenticated, user, login } = usePrivy();

  // Log authentication state for debugging
  useEffect(() => {
    if (ready) {
      console.log("Privy ready, authenticated:", authenticated);
      if (authenticated && user) {
        console.log("User:", user);
      }
    }
  }, [ready, authenticated, user]);

  if (!ready) {
    return (
      <Button variant="outline" size={size} disabled>
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
      <Button onClick={login} variant="default" size="lg" className="group w-full sm:w-auto">
        Sign in with Twitter
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    );
  }

  return (
    <Button onClick={login} variant="default" size="sm">
      Login
    </Button>
  );
} 