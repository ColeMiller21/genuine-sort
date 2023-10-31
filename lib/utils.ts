import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Alchemy, Network } from "alchemy-sdk";
import { toPng } from "html-to-image";
import { WalletAddressData } from "@/components/providers/wallet-input-provider";

const MAINNET_KEY = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const GU_ADDRESS = "0x209e639a0EC166Ac7a1A4bA41968fa967dB30221";
const STORAGE_KEY = "addressData";

const alchemy = new Alchemy({
  apiKey: MAINNET_KEY,
  network: Network.ETH_MAINNET,
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    const dataUrl = await toPng(divRef.current, { includeQueryParams: true });
    return dataUrl;
  } catch (error) {
    console.error("Error capturing screenshot:", error);
  }
};

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

export function generateTwitterShareUrl(dataUrl: string) {
  const websiteUrl = "https://genuine-sort.vercel.app/";
  const encodedImageUrl = encodeURIComponent(dataUrl);
  const encodedWebsiteUrl = encodeURIComponent(websiteUrl);
  let text = `Just sorted my Genuine Undead!`;
  let hashTags = "GenuineUndead,RiseAndShine";

  let twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodedImageUrl}&hashtags=${hashTags}`;

  // const twitterShareUrl = `https://twitter.com/intent/tweet?text=${text}&hashtags=${hashTags}`;
  console.log({ twitterShareUrl });
  return twitterShareUrl;
}

export function dataURLtoBlob(dataUrl: string) {
  const base64 = dataUrl.split(",")[1];
  const binaryString = atob(base64);
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return new Blob([uint8Array]);
}

export function formatTrait(trait: string) {
  let lowercase = trait.toLowerCase();
  return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
}

export function formatTraitType(trait_type: string) {
  let rv;
  switch (trait_type) {
    case "BACKGROUND":
      rv = "backgrounds";
      break;
    case "TYPES":
      rv = "types";
      break;
    default:
      rv = null;
  }
  return rv;
}

export function formatLookupToTraitType(lookup: string) {
  let rv;
  switch (lookup) {
    case "backgrounds":
      rv = "BACKGROUND";
      break;
    case "types":
      rv = "TYPES";
      break;
    default:
      rv = null;
  }
  return rv;
}
