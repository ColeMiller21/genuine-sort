"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
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

type customizeDefaultsType = {
  sortType: SortAttribute;
  numColumns: number;
  gridSpacing: number;
  borderColor: string | undefined;
  bgColor: string;
};

export function DisplayGrid({ gridRef }: { gridRef: React.RefObject<any> }) {
  const { theme, systemTheme } = useTheme();
  const { resetSortAndFilters } = useSorter();
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
    return theme === "dark" ? "#090909" : "#ffffff";
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

  useEffect(() => {
    setSelectedBGColor(setDefaultBG(theme));
  }, [theme]);

  return (
    <div className="w-full lg:w-[80%] flex flex-col gap-2">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Customize Grid</AccordionTrigger>
          <AccordionContent>
            <div className="w-full flex flex-col gap-3">
              <div className="w-full flex justify-end">
                <Button
                  className="w-[200px] flex items-center gap-2"
                  onClick={resetCustomOptions}
                >
                  <Icons.reset className="w-4 h-4" />
                  <span>Reset Customization</span>
                </Button>
              </div>
              <div className="flex gap-8 items-start">
                <div className="flex flex-col justify-between">
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
                <div className="flex flex-col justify-between">
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
                <div className="flex flex-col items-center">
                  <span className="mb-3 font-bold">Background Color</span>
                  <input
                    type="color"
                    value={selectedBGColor}
                    onChange={(e) => setSelectedBGColor(e.target.value)}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="mb-3 font-bold">Border Color</span>
                  <input
                    type="color"
                    value={selectedBorderColor}
                    onChange={(e) => setSelectedBorderColor(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Customize Sorter</AccordionTrigger>
          <AccordionContent>
            <div className="w-full flex items-start justify-between">
              <div className="w-full flex flex-col gap-3">
                <div className="flex gap-4">
                  <SorterDropdown />
                  <ReorderDialog />
                </div>
                <FilterDialog />
              </div>
              <Button
                className="flex items-center gap-2"
                onClick={resetSortAndFilters}
              >
                <Icons.reset className="h-4 w-4" />
                Reset Grid
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="w-full  px-4 flex justify-end items-center py-2">
        {" "}
        <span className="font-bold">
          <span>Total Amount: {ownedData?.length || 0}</span>
        </span>
      </div>
      {ownedData.length > 0 ? (
        <div style={gridStyle} id="display-grid" ref={gridRef}>
          {ownedData.map((nft: OwnedNft, i: number) => {
            return (
              <Image
                key={i}
                className="w-full aspect-square"
                src={nft.media[0]?.gateway}
                alt={nft.title}
                width={100}
                height={100}
                quality={100}
                style={{ borderWidth: "2px", borderColor: selectedBorderColor }}
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
