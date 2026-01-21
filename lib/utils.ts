import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Alchemy, Network, OwnedNft, Utils } from "alchemy-sdk";
import { toPng } from "html-to-image";
import { WalletAddressData } from "@/components/providers/wallet-input-provider";

const MAINNET_KEY = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const GU_ADDRESS = "0x209e639a0EC166Ac7a1A4bA41968fa967dB30221";
const GU_V2_ADDRESS = "0x39509d8E1dD96CC8BAD301EA65c75c7deB52374c";
const UNDEADZ_ADDRESS = "0x4928510C6bF092De114534Eb6301fAF9Af1EC42F";
const STORAGE_KEY = "addressData";

const alchemy = new Alchemy({
  apiKey: MAINNET_KEY,
  network: Network.ETH_MAINNET,
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getOwned(address: string): Promise<any[]> {
  async function fetchAllNfts(
    address: string,
    contractAddresses: string[],
    pageKey: string | null = null,
    allNfts: any[] = []
  ): Promise<any[]> {
    const options: any = { contractAddresses };
    if (pageKey) {
      options.pageKey = pageKey;
    }

    const res = await alchemy.nft.getNftsForOwner(address, options);

    if (res.ownedNfts) {
      allNfts.push(...res.ownedNfts);
    }

    if (res.pageKey) {
      return await fetchAllNfts(
        address,
        contractAddresses,
        res.pageKey,
        allNfts
      );
    } else {
      return allNfts;
    }
  }

  let resolvedAddress = address;

  // Function to validate Ethereum address
  function isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Check if the address is an ENS name
  if (address.endsWith(".eth")) {
    try {
      const resolved = await alchemy.core.resolveName(address);
      if (resolved) {
        resolvedAddress = resolved;
      } else {
        throw new Error("Unable to resolve ENS name");
      }
    } catch (error) {
      console.error("Error resolving ENS name:", error);
      throw error;
    }
  } else if (!isValidEthereumAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }

  const contractAddresses = [GU_ADDRESS, GU_V2_ADDRESS];
  return await fetchAllNfts(resolvedAddress, contractAddresses);
}

export async function getUndeadz(address: string): Promise<any[]> {
  async function fetchAllNfts(
    address: string,
    contractAddresses: string[],
    pageKey: string | null = null,
    allNfts: any[] = []
  ): Promise<any[]> {
    const options: any = { contractAddresses };
    if (pageKey) {
      options.pageKey = pageKey;
    }

    const res = await alchemy.nft.getNftsForOwner(address, options);

    if (res.ownedNfts) {
      allNfts.push(...res.ownedNfts);
    }

    if (res.pageKey) {
      return await fetchAllNfts(
        address,
        contractAddresses,
        res.pageKey,
        allNfts
      );
    } else {
      return allNfts;
    }
  }

  let resolvedAddress = address;

  // Function to validate Ethereum address
  function isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Check if the address is an ENS name
  if (address.endsWith(".eth")) {
    try {
      const resolved = await alchemy.core.resolveName(address);
      if (resolved) {
        resolvedAddress = resolved;
      } else {
        throw new Error("Unable to resolve ENS name");
      }
    } catch (error) {
      console.error("Error resolving ENS name:", error);
      throw error;
    }
  } else if (!isValidEthereumAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }

  const contractAddresses = [UNDEADZ_ADDRESS];
  return await fetchAllNfts(resolvedAddress, contractAddresses);
}

export const captureScreenshot = async (
  divRef: React.RefObject<HTMLDivElement>
) => {
  if (!divRef.current) {
    console.error("The target div element is not found.");
    return;
  }
  
  try {
    // Wait for all images to be fully loaded
    const images = divRef.current.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    // Small delay to ensure rendering is complete
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Get the actual dimensions of the element
    const rect = divRef.current.getBoundingClientRect();
    const width = divRef.current.scrollWidth;
    const height = divRef.current.scrollHeight;

    // Calculate optimal pixel ratio (2x for quality, but cap for very large grids)
    const totalPixels = width * height;
    const maxPixels = 16000 * 16000; // Max canvas size
    let pixelRatio = 2;
    
    if (totalPixels * pixelRatio * pixelRatio > maxPixels) {
      pixelRatio = Math.sqrt(maxPixels / totalPixels);
      pixelRatio = Math.max(1, Math.floor(pixelRatio * 10) / 10);
    }

    const dataUrl = await toPng(divRef.current, {
      quality: 0.95,
      pixelRatio: pixelRatio,
      width: width,
      height: height,
      cacheBust: true,
      includeQueryParams: true,
      skipAutoScale: true,
      filter: (node) => {
        // Skip any hidden elements or loading placeholders
        if (node instanceof HTMLElement) {
          const style = window.getComputedStyle(node);
          if (style.display === 'none' || style.visibility === 'hidden') {
            return false;
          }
        }
        return true;
      },
    });
    
    return dataUrl;
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    throw error;
  }
};

export const storeDataInStorage = (addressData: WalletAddressData[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addressData));
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

export const BASE_UNDEADZ_URL =
  "https://gufiles.art/images/un/un_download_png/";
