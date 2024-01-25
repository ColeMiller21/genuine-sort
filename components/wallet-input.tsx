"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { isValidAddress } from "@/lib/validators";
import {
  useWalletInput,
  WalletAddressData,
} from "./providers/wallet-input-provider";

export function WalletInput() {
  const { addWalletAddress, getAddresses } = useWalletInput();
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const setInputError = (msg: string) => {
    console.error(msg);
    setError(msg);
    setTimeout(() => {
      setError(null);
    }, 2000);
  };

  const checkForDupe = () => {
    let addresses = getAddresses();
    let res = addresses.find(
      (add: WalletAddressData) =>
        add.address.toLowerCase() === address.toLowerCase()
    );
    return res ? true : false;
  };

  const handleAddressSubmit = async () => {
    if (checkForDupe()) {
      let msg = `Address has already been added. Input a different address.`;
      setInputError(msg);
      return;
    }
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
      <div className="flex w-full max-w-sm items-center space-x-2 space-y-6 flex-col">
        <input
          type="text"
          placeholder="Enter Wallet Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border-b border-primary bg-transparent w-full text-center py-2 focus:outline-none text-sm"
        />
        <Button
          onClick={handleAddressSubmit}
          disabled={!address}
          className="rounded-full border-primary w-full"
          variant={"outline"}
        >
          Add Address
        </Button>
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
