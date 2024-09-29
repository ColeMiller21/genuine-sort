"use client";
import { useState } from "react";
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
import { Reorder, motion } from "framer-motion";
import { Attribute } from "@/lib/attributes";
import { OwnedNft } from "alchemy-sdk";

interface ReorderDialogProps {
  filteredOwnedData: OwnedNft[];
}

export function ReorderDialog({ filteredOwnedData }: ReorderDialogProps) {
  const { primarySort, attributes, setAttributes } = useSorter();
  const attributesToSort = attributes[primarySort].filter(
    (item: Attribute) => item.include
  );
  const [open, setOpen] = useState<boolean>(false);

  const handleReorderSubmit = (newStringOrderArr: string[]) => {
    let newAttrArray = newStringOrderArr.map((attribute: string, i: number) => {
      let foundIncludeFilter = attributesToSort.find(
        (attr: Attribute) => attr.attr === attribute
      )?.include;
      return {
        attr: attribute,
        index: i + 1,
        include: foundIncludeFilter || true,
      };
    });
    let attrCopy = { ...attributes };
    attrCopy[primarySort] = newAttrArray;
    setAttributes(attrCopy);
    toggleDialog();
  };

  const toggleDialog = () => setOpen(!open);

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>
        <Button
          onClick={toggleDialog}
          className="w-full bg-muted-foreground rounded-full"
        >
          Customize Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Sort Order</DialogTitle>
          <DialogDescription className="italic">
            Drag to reorder attributes - scroll to see all
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex justify-center w-full">
          <AttributeOrderGroup
            sortItems={attributesToSort}
            handleReorderSubmit={handleReorderSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

type OrderGroupProps = {
  sortItems: Attribute[];
  handleReorderSubmit: (newStringOrderArr: string[]) => void;
};

const AttributeOrderGroup = ({
  sortItems,
  handleReorderSubmit,
}: OrderGroupProps) => {
  let itemsStringArray: string[] = sortItems.map((item: any) => item.attr);
  const [items, setItems] = useState<string[]>(itemsStringArray);

  return (
    <motion.div className="flex flex-col gap-4 w-full max-h-[400px]">
      <Reorder.Group
        axis="y"
        values={items}
        className="mx-auto"
        layoutScroll
        style={{ overflowY: "scroll" }}
        onReorder={setItems}
      >
        {items.map((item: string, i: number) => (
          <Reorder.Item key={item} value={item}>
            <Button
              variant={"outline"}
              className="mb-2 w-[200px] flex justify-between px-4 cursor-grab"
            >
              <span>
                {i + 1}. {item}
              </span>
            </Button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <Button onClick={() => handleReorderSubmit(items)}>Submit Reorder</Button>
    </motion.div>
  );
};
