"use client";
import { useState, useRef } from "react";
import { captureScreenshot } from "@/lib/utils";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { ScreenshotDialog } from "./dialogs/screenshot-dialog";
import { useWalletInput } from "./providers/wallet-input-provider";
import { DisplayGrid } from "./display-grid";

export function DisplayOwned() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const { toggleGridDisplay } = useWalletInput();
  const [capturing, setCapturing] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  const toggleDialog = () => setOpenDialog(!open);

  const handleCaptureClick = async () => {
    setCapturing(true);
    try {
      const screenshotDataUrl = await captureScreenshot(gridRef);
      if (screenshotDataUrl) {
        console.log("Screenshot captured:", screenshotDataUrl);
        setScreenshotUrl(screenshotDataUrl);
        setOpenDialog(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <>
      <div className="w-full lg:w-[80%] flex items-center gap-1 text-sm justify-between">
        <span
          onClick={toggleGridDisplay}
          className="cursor-pointer hover:scale-105 transition-all duration-150 flex items-center gap-1"
        >
          <Icons.arrowLeft className="h-4 w-4 " />
          Back to add wallet
        </span>
        <div className="flex flex-col gap-2 items-center">
          <Button onClick={handleCaptureClick} className="flex items-center">
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
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex flex-col gap-4 items-center"></div>
        <DisplayGrid gridRef={gridRef} />
      </div>
      <ScreenshotDialog
        open={openDialog}
        toggleDialog={toggleDialog}
        screenshotUrl={screenshotUrl}
      />
    </>
  );
}
