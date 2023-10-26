"use client";
import { useWalletInput } from "@/components/providers/wallet-input-provider";
import { WalletInput } from "@/components/wallet-input";
import { WalletInputTable } from "@/components/wallet-input-table";
import { DisplayOwned } from "@/components/display-owned";

export default function Home() {
  const { displayGrid } = useWalletInput();
  return (
    <main className="flex min-h-screen flex-col gap-8 items-center p-24 w-full ">
      <h1 className="text-7xl font-extrabold">Genuine Sorter</h1>
      {!displayGrid ? (
        <>
          <WalletInput />
          <WalletInputTable />
        </>
      ) : (
        <DisplayOwned />
      )}
    </main>
  );
}
