'use client'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { captureScreenshot } from '@/lib/utils'
import { Button } from './ui/button'
import { Icons } from './icons'
import { ScreenshotDialog } from './dialogs/screenshot-dialog'
import { useWalletInput } from './providers/wallet-input-provider'
import { DisplayGridV2 } from './display-grid-v2'

export function DisplayOwnedV2() {
  const gridRef = useRef<HTMLDivElement | null>(null)
  const [capturing, setCapturing] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)

  const toggleDialog = () => setOpenDialog(!open)

  const handleCaptureClick = async () => {
    setCapturing(true)
    try {
      const screenshotDataUrl = await captureScreenshot(gridRef)
      if (screenshotDataUrl) {
        console.log('Screenshot captured:', screenshotDataUrl)
        setScreenshotUrl(screenshotDataUrl)
        setOpenDialog(true)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setCapturing(false)
    }
  }

  return (
    <>
      <CaptureBackBar
        handleCaptureClick={handleCaptureClick}
        capturing={capturing}
      />
      <div className="w-full flex flex-col items-center gap-4">
        <DisplayGridV2 gridRef={gridRef} />
      </div>
      <CaptureBackBar
        handleCaptureClick={handleCaptureClick}
        capturing={capturing}
      />
      <ScreenshotDialog
        open={openDialog}
        toggleDialog={toggleDialog}
        screenshotUrl={screenshotUrl}
      />
    </>
  )
}

const CaptureBackBar = ({ handleCaptureClick, capturing }: any) => {
  const { toggleGridDisplay, handleAddUndeadz, handleRemoveUndeadz, hasUndeadz } = useWalletInput()

  return (
    <div className="w-full lg:w-[90%] flex items-center gap-1 text-sm justify-between mb-4">
      <span
        onClick={toggleGridDisplay}
        className="cursor-pointer hover:scale-105 transition-all duration-150 flex items-center gap-1"
      >
        <Icons.arrowLeft className="h-4 w-4" />
        Back
      </span>
      <div className="flex flex-col-reverse md:flex-row gap-2 items-center">
        <Button
          onClick={hasUndeadz ? handleRemoveUndeadz : handleAddUndeadz}
          className={`flex items-center rounded-full border-primary transition-all ${
            hasUndeadz 
              ? 'bg-[#E8C00B] hover:bg-[#E8C00B]/80' 
              : 'bg-muted/50 hover:bg-muted grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
          }`}
          variant={'outline'}
        >
          <Image
            src="/UNDEADZ_LOGO.png"
            alt="Undeadz Logo"
            width={75}
            height={75 * (9 / 16)}
            className="aspect-video"
            priority
          />
        </Button>
        <Button
          onClick={handleCaptureClick}
          className="flex items-center rounded-full border-primary"
          variant={'outline'}
        >
          {capturing ? (
            <span className="flex items-center gap-1">
              <Icons.loader className="h-4 w-4 animate-spin" />
              Capturing
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Icons.camera className="h-4 w-4" />
              Capture
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
