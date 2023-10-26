import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Alchemy, Network } from "alchemy-sdk";
import { toPng } from "html-to-image";
import { WalletAddressData } from "@/components/providers/wallet-input-provider";

const MAINNET_KEY = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const GU_ADDRESS = "0x209e639a0EC166Ac7a1A4bA41968fa967dB30221";

const alchemy = new Alchemy({
  apiKey: MAINNET_KEY,
  network: Network.ETH_MAINNET,
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIPFS(uri: string) {
  const cid = uri.replace("ipfs://", "");
  const imageUrl = `https://ipfs.io/ipfs/${cid}`;
  return imageUrl;
}

export async function getOwned(address: string) {
  let res = await alchemy.nft.getNftsForOwner(address, {
    contractAddresses: [GU_ADDRESS],
  });
  if (res.ownedNfts) {
    return res.ownedNfts;
  }
  return [];
}

export const captureScreenshot = async (
  divRef: React.RefObject<HTMLDivElement>
) => {
  if (!divRef.current) {
    console.error("The target div element is not found.");
    return;
  }
  try {
    const dataUrl = await toPng(divRef.current);
    console.log("Got Screenshot");
    return dataUrl;
  } catch (error) {
    console.error("Error capturing screenshot:", error);
  }
};

const STORAGE_KEY = "addressData";

export const storeDataInStorage = (addressData: WalletAddressData[]) => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addressData));
  }
};

export const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getDataFromStorage = () => {
  let data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  return JSON.parse(data);
};
