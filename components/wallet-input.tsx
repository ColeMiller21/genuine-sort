"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { isValidAddress } from "@/lib/validators";
import {
  useWalletInput,
  WalletAddressData,
} from "./providers/wallet-input-provider";
import { Icons } from "./icons";

export function WalletInput() {
  const { addWalletAddress, getAddresses } = useWalletInput();
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
    if (checkForDupe()) {
      let msg = `Address has already been added. Input a different address.`;
      setInputError(msg);
      setLoading(false);
      return;
    }
    if (!isValidAddress(address)) {
      let msg = `${address} is not valid address`;
      setInputError(msg);
      setLoading(false);
      return;
    }
    try {
      await addWalletAddress(address);
      setAddress("");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
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
          disabled={!address || loading}
          className="rounded-full border-primary w-full"
          variant={"outline"}
        >
          {loading ? (
            <span className="w-full flex gap-2 justify-center items-center h-full">
              <Icons.loader className="h-4 w-4 animate-spin" />
              <span>Adding</span>
            </span>
          ) : (
            <span>Add Address</span>
          )}
        </Button>
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
