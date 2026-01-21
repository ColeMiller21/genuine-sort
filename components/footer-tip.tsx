'use client'
import { useState } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { TipDialog } from './TipDialog'

export function FooterTip() {
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleClick = () => {
    if (!isConnected) {
      if (openConnectModal) {
        openConnectModal()
      }
    } else {
      setIsDialogOpen(true)
    }
  }

  return (
    <>
      <p className="text-center text-[10px] text-muted-foreground/40">
        enjoying this?{' '}
        <button
          onClick={handleClick}
          className="hover:text-muted-foreground/70 hover:underline transition-colors"
        >
          add to b0nez gu fund
        </button>
      </p>
      <TipDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}
