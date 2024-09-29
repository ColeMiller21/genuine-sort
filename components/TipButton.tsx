"use client";
import React, { useState, useEffect } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { TipDialog } from "./TipDialog";
import { RainbowButton } from "@/components/ui/rainbow-button";

export function TipButton() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [buttonText, setButtonText] = useState("Connect Wallet to Tip");

  useEffect(() => {
    setButtonText(isConnected ? "Send Tip" : "Connect Wallet to Tip");
  }, [isConnected]);

  const handleClick = () => {
    if (!isConnected) {
      if (openConnectModal) {
        openConnectModal();
      } else {
        console.error("Connect modal is not available");
        // You might want to add some fallback behavior here
      }
    } else {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <RainbowButton onClick={handleClick}>{buttonText}</RainbowButton>
      <TipDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}
