import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

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
      // Create a temporary anchor element for downloading
      const downloadLink = document.createElement("a");
      downloadLink.href = screenshotUrl;
      downloadLink.download = "screenshot.png"; // Specify the file name
      downloadLink.click();
    }
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
            <Button onClick={handleDownloadClick}>Download Screenshot</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
