"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import type { PrivyClientConfig } from "@privy-io/react-auth";
import { ReactNode } from "react";

// Configuration for Privy
const privyConfig: PrivyClientConfig = {
  appearance: {
    theme: "dark" as const,
    accentColor: "#8A63D2", // A nice purple
    logo: "/logo.png", // Using our logo.png file
    showWalletLoginFirst: true,
  },
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId="cm7kmecdp00cc4uwo996lt1th"
      config={privyConfig}
    >
      {children}
    </PrivyProvider>
  );
} 