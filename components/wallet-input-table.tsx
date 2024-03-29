"use client";
import { useWalletInput } from "./providers/wallet-input-provider";
import { storeDataInStorage, clearStorage } from "@/lib/utils";
import { Button } from "./ui/button";
import { Icons } from "@/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function WalletInputTable() {
  const { getAddresses, toggleGridDisplay, resetAddresses, getOwned } =
    useWalletInput();
  let allAddresses = getAddresses();

  if (!allAddresses || allAddresses.length === 0) {
    return null;
  }

  function handleGoToDisplay() {
    storeDataInStorage(allAddresses);
    toggleGridDisplay();
  }

  function handleReset() {
    clearStorage();
    resetAddresses();
  }
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 w-full max-w-sm -mt-4">
        <Button
          onClick={handleReset}
          className="flex items-center gap-1 w-full rounded-full bg-muted-foreground"
        >
          <Icons.reset className="w-4 h-4" />
          <span>Reset</span>
        </Button>
        <Button
          onClick={handleGoToDisplay}
          className="w-full rounded-full bg-muted-foreground"
        >
          Go to Display
        </Button>
      </div>
      <Table className="w-full lg:w-[80%] mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Address</TableHead>
            <TableHead className="text-center w-[150px]">Owned Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAddresses.map((add, i) => {
            let { address, ownedCount } = add;
            return (
              <TableRow key={i}>
                <TableCell className="font-medium">{address}</TableCell>
                <TableCell className="text-center">{ownedCount}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
