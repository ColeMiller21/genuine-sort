"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { SortAttribute } from "@/lib/attributes";
import { useWalletInput } from "./providers/wallet-input-provider";
import { OwnedNft } from "alchemy-sdk";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Icons } from "./icons";
import { SorterDropdown } from "./sorter-dropdown";
import { FilterDialog } from "./dialogs/filter-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ReorderDialog } from "./dialogs/reorder-dialog";
import { useSorter } from "./providers/sort-provider";
import { cloneDeep } from "lodash";
import { AttributeType } from "@/lib/attributes";
import { toggleAllTraits } from "@/lib/attributes";

type customizeDefaultsType = {
  sortType: SortAttribute;
  numColumns: number;
  gridSpacing: number;
  borderColor: string | undefined;
  bgColor: string;
};

export function DisplayGrid({ gridRef }: { gridRef: React.RefObject<any> }) {
  const { theme, systemTheme } = useTheme();
  const { resetSortAndFilters, attributes } = useSorter();
  const customizeDefaults: customizeDefaultsType = {
    sortType: "backgrounds",
    numColumns: 5,
    gridSpacing: 1,
    borderColor: undefined,
    bgColor: setDefaultBG(theme),
  };
  const [sortType, setSortType] = useState<SortAttribute>(
    customizeDefaults.sortType
  );
  const [numColumns, setNumColumns] = useState<number>(
    customizeDefaults.numColumns
  );
  const [gridSpacing, setGridSpacing] = useState<number>(
    customizeDefaults.gridSpacing
  );
  const [selectedBGColor, setSelectedBGColor] = useState(
    customizeDefaults.bgColor
  );
  const [selectedBorderColor, setSelectedBorderColor] = useState<
    string | undefined
  >(customizeDefaults.borderColor);
  const clonedAttributes = cloneDeep(attributes);
  const [filteredAttributes, setFilteredAttributes] =
    useState<AttributeType>(clonedAttributes);

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
    gap: `${gridSpacing}rem`,
    width: "100%",
    height: "auto",
    padding: "1rem",
    backgroundColor: selectedBGColor,
  };

  const { ownedData } = useWalletInput();

  function setDefaultBG(theme: string | undefined) {
    if (theme === "system") theme = systemTheme;
    return theme === "dark" ? "#191917" : "#f8f8f4";
  }

  const handleColumnChange = (val: number[]) => {
    if (!val || val.length === 0) return;
    setNumColumns(val[0]);
  };

  const handleSpacingChange = (val: number[]) => {
    if (!val || val.length === 0) return;
    setGridSpacing(val[0]);
  };

  const resetCustomOptions = () => {
    setSortType(customizeDefaults.sortType);
    setNumColumns(customizeDefaults.numColumns);
    setGridSpacing(customizeDefaults.gridSpacing);
    setSelectedBorderColor(customizeDefaults.bgColor);
    setSelectedBGColor(customizeDefaults.bgColor);
  };

  const handleReset = () => {
    resetFilters();
    resetSortAndFilters();
  };

  const resetFilters = () => {
    let resetFilters = { ...filteredAttributes };
    resetFilters = toggleAllTraits(resetFilters, true);
    setFilteredAttributes(resetFilters);
  };

  useEffect(() => {
    setSelectedBGColor(setDefaultBG(theme));
  }, [theme]);

  return (
    <div className="w-full lg:w-[80%] flex flex-col gap-2">
      <Accordion type="multiple">
        <AccordionItem value="item-1" className="border-primary">
          <AccordionTrigger>Customize Grid</AccordionTrigger>
          <AccordionContent>
            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-col md:flex-row gap-8 items-start w-full">
                <div className="flex justify-between w-full gap-8">
                  <div className="flex flex-col justify-between flex-grow">
                    <span className="mb-5 font-bold">
                      Column Count - {numColumns}
                    </span>
                    <div>
                      <Slider
                        defaultValue={[numColumns]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={handleColumnChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between flex-grow">
                    <span className="mb-5 font-bold">
                      Grid Space - {gridSpacing}rem
                    </span>
                    <div>
                      <Slider
                        defaultValue={[gridSpacing]}
                        min={0.5}
                        max={4}
                        step={0.5}
                        onValueChange={handleSpacingChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between w-full gap-8">
                  {" "}
                  <div className="flex flex-col items-center flex-grow">
                    <span className="mb-3 font-bold">Background Color</span>
                    <input
                      type="color"
                      value={selectedBGColor}
                      onChange={(e) => setSelectedBGColor(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col items-center flex-grow">
                    <span className="mb-3 font-bold">Border Color</span>
                    <input
                      type="color"
                      value={selectedBorderColor}
                      onChange={(e) => setSelectedBorderColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full flex">
                <Button
                  className="flex items-center gap-2 w-full rounded-full bg-muted-foreground"
                  onClick={resetCustomOptions}
                >
                  <Icons.reset className="w-4 h-4" />
                  <span>Reset Customization</span>
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border-primary">
          <AccordionTrigger>Customize Sorter</AccordionTrigger>
          <AccordionContent>
            <div className="w-full flex items-start justify-between">
              <div className="w-full flex flex-col gap-3">
                <div className="flex gap-4 items-center justify-between">
                  <SorterDropdown />
                  <FilterDialog
                    filteredAttributes={filteredAttributes}
                    resetFilters={resetFilters}
                    setFilteredAttributes={setFilteredAttributes}
                  />
                </div>
                <div className="flex gap-2 w-full">
                  {" "}
                  <ReorderDialog />
                  <Button
                    className="flex items-center gap-2 w-full rounded-full bg-muted-foreground"
                    onClick={handleReset}
                  >
                    <Icons.reset className="h-4 w-4" />
                    Reset Grid
                  </Button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="w-full flex justify-between items-center py-2 font-bold">
        <span>Total Amount:</span>
        <span> {ownedData?.length || 0}</span>
      </div>
      {ownedData.length > 0 ? (
        <div style={gridStyle} id="display-grid" ref={gridRef}>
          {ownedData.map((nft: OwnedNft, i: number) => {
            return (
              <RetryableImage
                key={i}
                src={nft.image.cachedUrl || (nft.image.pngUrl as string)}
                alt={nft?.name || "test"}
                borderColor={selectedBorderColor}
              />
            );
          })}
        </div>
      ) : (
        <div>You have no GUs</div>
      )}
    </div>
  );
}

interface RetryableImageProps {
  src: string;
  alt: string;
  borderColor: string | undefined;
}

const RetryableImage = ({ src, alt, borderColor }: RetryableImageProps) => {
  const [retryKey, setRetryKey] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const maxRetries = 3;

  const handleImageError = () => {
    if (errorCount < maxRetries) {
      setErrorCount((prev) => prev + 1);
      setRetryKey((prev) => prev + 1);
    }
  };

  return (
    <div className="relative w-full h-0 pb-[100%]">
      <Image
        key={retryKey}
        src={`${src}?retry=${retryKey}`}
        alt={alt}
        fill
        quality={100}
        style={{ borderWidth: "2px", borderColor, objectFit: "cover" }}
        onError={handleImageError}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};
