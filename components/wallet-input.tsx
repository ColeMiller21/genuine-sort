"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { isValidAddress } from "@/lib/validators";
import { useWalletInput } from "./providers/wallet-input-provider";

export function WalletInput() {
  const { addWalletAddress } = useWalletInput();
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const setInputError = (msg: string) => {
    console.error(msg);
    setError(msg);
    setTimeout(() => {
      setError(null);
    }, 2000);
  };

  const handleAddressSubmit = async () => {
    if (!isValidAddress(address)) {
      let msg = `${address} is not valid address`;
      setInputError(msg);
      return;
    }
    await addWalletAddress(address);
    setAddress("");
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button onClick={handleAddressSubmit} disabled={!address}>
          Add Address
        </Button>
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
