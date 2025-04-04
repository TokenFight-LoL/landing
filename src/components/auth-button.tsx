"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export function AuthButton({ size = "sm" }: { size?: "sm" | "lg" }) {
  const { ready, authenticated, login } = usePrivy();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Reset login state when authentication changes
  useEffect(() => {
    if (authenticated) {
      setIsLoggingIn(false);
    }
  }, [authenticated]);

  // Safe login handler with error handling
  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      
      // Set a timeout to prevent hanging
      const loginTimeout = setTimeout(() => {
        // If login takes too long, reset state
        console.warn("Login operation timed out");
        setIsLoggingIn(false);
      }, 15000); // 15 seconds timeout
      
      await login();
      clearTimeout(loginTimeout);
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoggingIn(false);
    }
  };

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
      <Button 
        onClick={handleLogin} 
        variant="default" 
        size="lg" 
        className="group w-full sm:w-auto relative overflow-hidden"
        disabled={isLoggingIn}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-indigo-600"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-purple-600/80 to-indigo-600/80 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="relative flex items-center justify-center">
          {isLoggingIn ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </>
          ) : (
            <>
              Sign in with Twitter
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </span>
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleLogin} 
      variant="default" 
      size="sm"
      className="relative overflow-hidden group"
      disabled={isLoggingIn}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-purple-600/90 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <span className="relative">
        {isLoggingIn ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 inline-block h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting
          </>
        ) : (
          "Login"
        )}
      </span>
    </Button>
  );
} 