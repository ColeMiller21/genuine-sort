"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { generateTwitterShareUrl } from "@/lib/utils";
import { dataURLtoBlob } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export function ScreenshotDialog({
  open,
  screenshotUrl,
  toggleDialog,
}: {
  open: boolean;
  screenshotUrl: string | null;
  toggleDialog: () => void;
}) {
  const [uploading, setUploading] = useState<boolean>(false);
  const handleDownloadClick = () => {
    if (screenshotUrl) {
      const downloadLink = document.createElement("a");
      downloadLink.href = screenshotUrl;
      downloadLink.download = "screenshot.png";
      downloadLink.click();
    }
  };

  const handleUpload = async () => {
    if (!screenshotUrl) return;
    setUploading(true);
    const blob = dataURLtoBlob(screenshotUrl as string);
    const formData = new FormData();
    formData.append("file", blob, `screenshot-${uuidv4()}.png`);
    try {
      const response = await fetch("/upload", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Upload successful:", responseData);
        return responseData;
        // Handle success
      } else {
        console.error("Upload failed:", response.statusText);
        // Handle error
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle errors here.
    }
  };

  const handleTwitterShare = async () => {
    console.log({ screenshotUrl });
    if (!screenshotUrl) return;
    try {
      console.log("going to upload");
      // let res = await handleUpload();
      // if(!res) {
      //   console.error('No response from upload')
      //   return
      // }
      // let imageUrl = res.url;
      let imageUrl =
        "https://qcqcf8kfmdgzd7d4.public.blob.vercel-storage.com/screenshot-ecdee467-f2db-4082-96da-dde3034a3e34-X9QrDfaD7FXZ9ORyCfzrklg4jyJ4hb.png";
      console.log({ imageUrl });
      const twitterShareUrl = generateTwitterShareUrl(imageUrl);
      window.open(twitterShareUrl, "_blank");
    } catch (err) {
      console.error(err);
    }

    // window.open("www.google.com", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Screenshot Result</DialogTitle>
        </DialogHeader>
        {screenshotUrl && (
          <div className="flex flex-col items-center gap-5 w-full">
            <div className="max-h-[60vh] overflow-y-auto">
              <img src={screenshotUrl} alt="Captured Screenshot" />
            </div>
            <div className="flex flex-col lg:flex-row gap-4 w-full">
              <Button
                onClick={handleDownloadClick}
                className="w-full rounded-full border-primary flex gap-2 items-center"
                variant={"outline"}
              >
                <Icons.download className="h-4 w-4" />
                Download Screenshot
              </Button>
              {/* <Button
                onClick={handleTwitterShare}
                className="flex items-center gap-1"
              >
                <span>Share on</span> <Icons.x className="w-6 h-6" />
              </Button> */}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
