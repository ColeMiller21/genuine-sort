"use client";
import { useEffect, useState, useRef } from "react";
import { OwnedNft } from "alchemy-sdk";
import { getOwned, captureScreenshot, cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import Image from "next/image";
import { Button } from "./ui/button";
import { Slider } from "@/components/ui/slider";
import { Icons } from "./icons";
import { createSortFunction } from "@/lib/sort-factory";
import { SortAttribute, attributes } from "@/lib/attributes";
import { ScreenshotDialog } from "./screenshot-dialog";

export function DisplayOwned() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const { address } = useAccount();

  const [capturing, setCapturing] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [owned, setOwned] = useState<OwnedNft[]>([]);
  const [sortType, setSortType] = useState<SortAttribute>("background");
  const [numColumns, setNumColumns] = useState<number>(5);
  const [gridSpacing, setGridSpacing] = useState<number>(1);
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
    gap: `${gridSpacing}rem`,
    width: "80%",
    height: "auto",
    padding: "1rem",
  };

  const toggleDialog = () => setOpenDialog(!open);

  const handleCaptureClick = async () => {
    console.log("here");
    setCapturing(true);
    try {
      const screenshotDataUrl = await captureScreenshot(gridRef);
      if (screenshotDataUrl) {
        // Display or use the screenshot data URL as needed
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

  const handleColumnChange = (val: any) => {
    console.log({ val });
    if (!val || val.length === 0) return;
    setNumColumns(val[0]);
  };

  useEffect(() => {
    if (!address) {
      setOwned([]);
      return;
    }
    (async () => {
      setLoading(true);
      let data = await getOwned(address);
      setOwned(data);
      setLoading(false);
      console.log({ data });
    })();
  }, [address]);

  const sortFunction = createSortFunction(sortType, attributes);
  const sortedOwned = [...owned].sort(sortFunction);

  if (!address) {
    return null;
  }

  return (
    <>
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-4 items-center">
            <span className="font-bold">
              <span>Owned Amount: {owned?.length || 0}</span>
            </span>
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
          <div className="flex flex-col items-center gap-2">
            <span>Column Count = {numColumns}</span>
            <Slider
              defaultValue={[numColumns]}
              min={1}
              max={10}
              step={1}
              onValueChange={handleColumnChange}
            />
          </div>
        </div>
        {sortedOwned.length > 0 ? (
          <div
            style={gridStyle}
            id="display-grid"
            ref={gridRef}
            className="bg-background"
          >
            {sortedOwned.map((nft: OwnedNft, i: number) => {
              return (
                <Image
                  key={i}
                  className="w-full aspect-square"
                  src={nft.media[0]?.gateway}
                  alt={nft.title}
                  width={100}
                  height={100}
                  quality={100}
                />
              );
            })}
          </div>
        ) : (
          <div>You have no GUs</div>
        )}
      </div>

      <ScreenshotDialog
        open={openDialog}
        toggleDialog={toggleDialog}
        screenshotUrl={screenshotUrl}
      />
    </>
  );
}
