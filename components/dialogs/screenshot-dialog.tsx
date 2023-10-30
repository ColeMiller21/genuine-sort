import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { generateTwitterShareUrl } from "@/lib/utils";

export function ScreenshotDialog({
  open,
  screenshotUrl,
  toggleDialog,
}: {
  open: boolean;
  screenshotUrl: string | null;
  toggleDialog: () => void;
}) {
  const handleDownloadClick = () => {
    if (screenshotUrl) {
      const downloadLink = document.createElement("a");
      downloadLink.href = screenshotUrl;
      downloadLink.download = "screenshot.png";
      downloadLink.click();
    }
  };

  const handleTwitterShare = () => {
    if (!screenshotUrl) return;
    const twitterShareUrl = generateTwitterShareUrl(screenshotUrl);
    console.log(twitterShareUrl);
    window.open(twitterShareUrl, "_blank");
    // window.open("www.google.com", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Screenshot Result</DialogTitle>
        </DialogHeader>
        {screenshotUrl && (
          <div className="flex flex-col items-center gap-5">
            <div className="max-h-[60vh] overflow-y-auto">
              <img src={screenshotUrl} alt="Captured Screenshot" />
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
              <Button onClick={handleDownloadClick}>Download Screenshot</Button>
              <Button
                onClick={handleTwitterShare}
                className="flex items-center gap-1"
              >
                {/* <a
                  href={generateTwitterShareUrl(screenshotUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                > */}
                <span>Share on</span> <Icons.x className="w-6 h-6" />
                {/* </a> */}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
