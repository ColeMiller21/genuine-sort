"use client";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSorter } from "./providers/sort-provider";
import { SortAttribute } from "@/lib/attributes";

export function SorterDropdown() {
  const { sortTypes, primarySort, setPrimarySort } = useSorter();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {primarySort
            ? sortTypes.find((sortType) => sortType.value === primarySort)
                ?.label
            : "Select Type..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search type..." />
          <CommandEmpty>No type found.</CommandEmpty>
          <CommandGroup>
            {sortTypes.map((sortType) => (
              <CommandItem
                key={sortType.value}
                value={sortType.value}
                onSelect={(currentValue) => {
                  setPrimarySort(currentValue as SortAttribute);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    primarySort === sortType.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {sortType.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
