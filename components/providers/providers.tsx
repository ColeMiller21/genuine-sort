"use client";
import { ThemeProvider } from "./theme-provider";
import { wagmiConfig, chains } from "@/lib/web3/wallet-connection";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider, midnightTheme } from "@rainbow-me/rainbowkit";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={midnightTheme()}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
