"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { sendTip } from "../lib/web3/wallet-connection";
import {
  useDisconnect,
  useAccount,
  useBalance,
  useWaitForTransaction,
  useNetwork,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

interface TipDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TipDialog({ isOpen, onClose }: TipDialogProps) {
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [usdValue, setUsdValue] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [transactionHash, setTransactionHash] = useState<
    `0x${string}` | undefined
  >(undefined);
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const {
    isLoading: isTransactionLoading,
    isSuccess: isTransactionSuccessful,
  } = useWaitForTransaction({
    hash: transactionHash,
  });
  const { chain } = useNetwork(); // Add this hook

  useEffect(() => {
    // Fetch the current ETH to USD exchange rate
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        setExchangeRate(data.ethereum.usd);
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, []);

  useEffect(() => {
    if (exchangeRate && amount) {
      const ethAmount = parseFloat(amount);
      if (!isNaN(ethAmount)) {
        setUsdValue(ethAmount * exchangeRate);
      } else {
        setUsdValue(null);
      }
    } else {
      setUsdValue(null);
    }
  }, [amount, exchangeRate]);

  useEffect(() => {
    if (isTransactionSuccessful) {
      toast.success("Tip sent successfully!");
      setIsSending(false);
      onClose();
    }
  }, [isTransactionSuccessful, onClose]);

  const handleSendTip = async () => {
    if (!amount) return;

    setIsSending(true);
    toast.promise(sendTip(amount), {
      loading: "Sending tip...",
      success: (hash: `0x${string}`) => {
        setTransactionHash(hash);
        const explorerUrl =
          chain?.blockExplorers?.default.url || "https://etherscan.io";
        const transactionUrl = `${explorerUrl}/tx/${hash}`;
        return (
          <div>
            Tip sent! Waiting for confirmation...
            <a
              href={transactionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white hover:text-blue-600"
            >
              View transaction
            </a>
          </div>
        );
      },
      error: "Failed to send tip. Please try again.",
    });
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send a Tip</DialogTitle>
          <DialogDescription>
            Enter the amount of ETH you'd like to send as a tip.
          </DialogDescription>
        </DialogHeader>
        {isConnected && address && balanceData ? (
          <div className="bg-secondary p-4 rounded-lg mb-4 relative">
            <button
              onClick={handleDisconnect}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              title="Disconnect wallet"
            >
              <LogOut size={20} />
            </button>
            <p className="text-sm font-medium mb-2">Connected Wallet</p>
            <p className="text-xs mb-2 truncate">{address}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Balance:</span>
              <span className="text-sm">
                {parseFloat(formatEther(balanceData.value)).toFixed(4)} ETH
              </span>
            </div>
          </div>
        ) : (
          <ConnectButton />
        )}
        {isConnected && (
          <>
            <Input
              type="number"
              placeholder="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
            />
            {usdValue !== null && (
              <p className="text-sm text-muted-foreground mt-1">
                ≈ ${usdValue.toFixed(2)} USD
              </p>
            )}
          </>
        )}
        <DialogFooter className="flex flex-col items-stretch gap-4">
          <div className="flex justify-between gap-4 w-full">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            {isConnected && (
              <Button
                onClick={handleSendTip}
                disabled={isSending || isTransactionLoading}
              >
                {isSending || isTransactionLoading ? "Sending..." : "Send Tip"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
