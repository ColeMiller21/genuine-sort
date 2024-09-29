"use client";
import { useWalletInput } from "@/components/providers/wallet-input-provider";
import { WalletInput } from "@/components/wallet-input";
import { WalletInputTable } from "@/components/wallet-input-table";
import { DisplayOwned } from "@/components/display-owned";
import { SpinBox } from "@/components/animation/spin-box";

export default function Home() {
  const { displayGrid } = useWalletInput();
  return (
    <main className="flex min-h-screen flex-col items-center p-12 w-full mx-auto max-w-8xl">
      <SpinBox />
      {!displayGrid ? (
        <div className="flex flex-col w-full items-center gap-8 mt-8">
          <WalletInput />
          <WalletInputTable />
        </div>
      ) : (
        <DisplayOwned />
      )}
    </main>
  );
}
