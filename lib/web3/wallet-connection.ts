import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

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
