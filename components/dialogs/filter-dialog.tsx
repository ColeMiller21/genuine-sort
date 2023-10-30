"use client";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useSorter } from "../providers/sort-provider";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { Icons } from "../icons";
import {
  Attribute,
  AttributeType,
  defaultAttributes,
  toggleAllTraits,
} from "@/lib/attributes";
import { Checkbox } from "@/components/ui/checkbox";
import { cloneDeep } from "lodash";

export function FilterDialog() {
  const { primarySort, attributes, setAttributes, resetSortAndFilters } =
    useSorter();
  const [open, setOpen] = useState<boolean>(false);
  const clonedAttributes = cloneDeep(attributes);

  const [filteredAttributes, setFilteredAttributes] =
    useState<AttributeType>(clonedAttributes);
  const firstAttributeKey = Object.keys(filteredAttributes)[0];
  const [activeView, setActiveView] = useState<string>(firstAttributeKey);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const toggleDialog = () => setOpen(!open);

  const handleSaveFilters = () => {
    const updatedAttributes = { ...attributes };
    Object.keys(filteredAttributes).forEach((key) => {
      updatedAttributes[key].forEach((attr) => {
        const filteredAttr = filteredAttributes[key].find(
          (filteredAttr) => filteredAttr.attr === attr.attr
        );
        if (filteredAttr) {
          attr.include = filteredAttr.include;
        }
      });
    });
    setAttributes(updatedAttributes);
    toggleDialog();
  };

  const handleViewChange = (attribute: string) => {
    setActiveView(attribute);
    setSelectAll(false);
  };

  const resetFilters = () => {
    let resetFilters = { ...filteredAttributes };
    console.log({ resetFilters });
    resetFilters = toggleAllTraits(resetFilters, true);
    setFilteredAttributes(resetFilters);

    setSelectAll(false);
  };

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>
        <Button
          onClick={toggleDialog}
          className="flex items-center gap-2 w-[200px]"
        >
          <Icons.filter className="h-4 w-4" />
          <span>Add Filters</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Filters</DialogTitle>
          <DialogDescription className="italic">
            All attributes selected will be <strong>INCLUDED</strong> all
            unselected will be <strong>EXCLUDED</strong> from the grid view.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex gap-6 w-full my-4">
          <Sidebar
            keys={Object.keys(filteredAttributes)}
            activeView={activeView}
            setActiveView={handleViewChange}
          />
          <div className="flex flex-col flex-grow overflow-auto divide-y-2">
            <div className="items-top flex space-x-2 pb-2">
              <Checkbox
                id="checkall"
                checked={selectAll}
                onCheckedChange={() => {
                  setSelectAll(!selectAll);
                  const updatedFilterAttributes = { ...filteredAttributes };
                  updatedFilterAttributes[activeView] = updatedFilterAttributes[
                    activeView
                  ].map((attr) => {
                    return { ...attr, include: !selectAll };
                  });
                  setFilteredAttributes(updatedFilterAttributes);
                }}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {selectAll ? "Deselect All" : "Select All"}
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {filteredAttributes[activeView].map((attr: Attribute) => {
                return (
                  <div className="items-top flex space-x-2" key={attr.attr}>
                    <Checkbox
                      id={attr.attr}
                      checked={attr.include}
                      onCheckedChange={() => {
                        attr.include = !attr.include;
                        setFilteredAttributes({ ...filteredAttributes });
                      }}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {attr.attr}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <div className="flex gap-4 items-center">
            <Button onClick={handleSaveFilters}>Save Filters</Button>
            <Button
              variant={"secondary"}
              className="flex gap-2"
              onClick={toggleDialog}
            >
              Close
            </Button>
            <Button
              variant={"destructive"}
              className="flex gap-2"
              onClick={resetFilters}
            >
              <Icons.reset className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  keys: string[];
  activeView: string;
  setActiveView: (attribute: string) => void;
}

export function Sidebar({
  className,
  keys,
  activeView,
  setActiveView,
  ...props
}: SidebarNavProps) {
  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {keys.map((item) => (
        <span
          key={item}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            activeView === item
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "cursor-pointer flex justify-start"
          )}
          onClick={() => setActiveView(item)}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </span>
      ))}
    </nav>
  );
}
