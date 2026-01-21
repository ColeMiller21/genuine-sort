'use client'
import Link from 'next/link'
import { useWalletInput } from '@/components/providers/wallet-input-provider'
import { WalletInput } from '@/components/wallet-input'
import { WalletInputTable } from '@/components/wallet-input-table'
import { DisplayOwnedV2 } from '@/components/display-owned-v2'
import { SpinBox } from '@/components/animation/spin-box'

export default function SorterV2() {
  const { displayGrid } = useWalletInput()
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 w-full mx-auto max-w-8xl">
      {displayGrid && <GalleryHeader currentVersion="v2" />}
      {!displayGrid && <GalleryHeader currentVersion="v2" />}
      <SpinBox />
      {!displayGrid ? (
        <div className="flex flex-col w-full items-center gap-8 mt-8">
          <WalletInput />
          <WalletInputTable />
        </div>
      ) : (
        <DisplayOwnedV2 />
      )}
    </main>
  )
}

function GalleryHeader({ currentVersion }: { currentVersion: 'v1' | 'v2' }) {
  return (
    <div className="mb-6 flex items-center justify-center">
      <div className="flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border/30">
        <Link
          href="/"
          className={`relative px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${
            currentVersion === 'v1'
              ? 'bg-foreground text-background shadow-md'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          V1
        </Link>
        <Link
          href="/v2"
          className={`relative px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${
            currentVersion === 'v2'
              ? 'bg-[#ff5277] text-white shadow-md shadow-[#ff5277]/30'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          V2
        </Link>
      </div>
    </div>
  )
}
