"use client";

import Link from "next/link";
import { AuthButton } from "./auth-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center font-bold">
          <span className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            TokenFight
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search could be added here if needed */}
          </div>
          <nav className="flex items-center">
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
} 