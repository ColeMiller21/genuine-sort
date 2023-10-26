"use client";
import { useWalletInput } from "./providers/wallet-input-provider";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function WalletInputTable() {
  const { getAddresses, toggleGridDisplay } = useWalletInput();
  let allAddresses = getAddresses();

  if (!allAddresses || allAddresses.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <Button onClick={toggleGridDisplay}>Go to Display</Button>
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
