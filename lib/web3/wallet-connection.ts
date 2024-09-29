import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { Alchemy, Network } from "alchemy-sdk";
import { parseEther } from "viem";

const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;
const PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

export const { chains, publicClient } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Genuine Sort",
  projectId: PROJECT_ID,
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const alchemy = new Alchemy({
  apiKey: ALCHEMY_ID,
  network: Network.ETH_MAINNET,
});

export async function resolveENS(address: string): Promise<string> {
  // Function to validate Ethereum address
  function isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Check if the address is an ENS name
  if (address.endsWith(".eth")) {
    try {
      const resolved = await alchemy.core.resolveName(address);
      if (resolved) {
        return resolved;
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

  return address;
}

// Update this function to send a tip
export async function sendTip(amount: string): Promise<`0x${string}`> {
  const hardcodedAddress = "0x5Cde4143037FC3Ee8a1F86944389711652d69b04";

  const config = {
    to: hardcodedAddress,
    value: parseEther(amount),
  };

  try {
    const { sendTransaction } = await import("@wagmi/core");
    const { hash } = await sendTransaction(config);
    return hash;
  } catch (error) {
    console.error("Error sending tip:", error);
    throw error;
  }
}
