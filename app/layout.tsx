import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Inter as FontSans } from "next/font/google";
import { Providers } from "@/components/providers/providers";
import { ThemeToggle } from "@/components/theme-toggle";
import { Icons } from "@/components/icons";
import { TipButton } from "@/components/TipButton";
import { Toaster } from "@/components/ui/sonner";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Genuine Sorter",
  description:
    "For fun project allowing you to combine wallets and sort to take screenshots of all your Genuine Undead NFTs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen min-w-screen bg-background font-sans antialiased flex justify-center",
          fontSans.variable
        )}
      >
        <Providers>
          <div className="w-screen flex flex-col max-w-[1400px] items-center">
            <nav className="w-full flex items-center justify-between py-3 px-4">
              <Link href="https://www.genuineundead.io/">
                <div className={`z-101 flex items-center w-[35px] h-[35px] `}>
                  <img
                    src="/GUIcon.svg"
                    alt="Genuine Undead Icon"
                    className="cursor-pointer"
                  />
                </div>
              </Link>
              <div className="flex flex-col-reverse items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">Created by b0nes</span>
                  <a
                    href="https://twitter.com/b0nesFAFZ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icons.x className="w-5 h-5 cursor-pointer hover:scale-110 transition-all duration-150" />
                  </a>
                </div>
                <TipButton />
              </div>
              <ThemeToggle />
            </nav>
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
