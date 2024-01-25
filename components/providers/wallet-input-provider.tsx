import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { getOwned, getDataFromStorage } from "@/lib/utils";
import { OwnedNft } from "alchemy-sdk";
import { Wallet } from "ethers";

export interface WalletAddressData {
  address: string;
  owned: any[];
  ownedCount: number;
}

interface WalletInputContextType {
  addWalletAddress: (address: string) => Promise<WalletAddressData | null>;
  getAddresses: () => WalletAddressData[];
  resetAddresses: () => void;
  displayGrid: boolean;
  toggleGridDisplay: () => void;
  defaultOwnedData: OwnedNft[];
  ownedData: OwnedNft[];
  setOwnedData: Dispatch<SetStateAction<OwnedNft[]>>;
  getOwned: (data: any) => any;
}

const WalletInputContext = createContext<WalletInputContextType | undefined>(
  undefined
);

export function useWalletInput(): WalletInputContextType {
  const context = useContext(WalletInputContext);
  if (!context) {
    throw new Error("useWalletInput must be used within a WalletInputProvider");
  }
  return context;
}

interface WalletInputProviderProps {
  children: ReactNode;
}

export function WalletInputProvider({ children }: WalletInputProviderProps) {
  const [walletAddresses, setWalletAddresses] = useState<WalletAddressData[]>(
    []
  );
  const [displayGrid, setDisplayGrid] = useState<boolean>(false);
  const [ownedData, setOwnedData] = useState<OwnedNft[]>([]);
  const [defaultOwnedData, setDefaultOwnedData] = useState<OwnedNft[]>([]);

  const toggleGridDisplay = () => {
    setDisplayGrid(!displayGrid);
  };

  const addWalletAddress = async (address: string) => {
    try {
      const owned = await getOwned(address);
      const newData: WalletAddressData = {
        address,
        owned,
        ownedCount: owned.length,
      };
      let allAddresses = [...walletAddresses, newData];
      setWalletAddresses(allAddresses);
      setAllOwned(allAddresses);
      return newData;
    } catch (error) {
      console.error("Error adding wallet address:", error);
      return null;
    }
  };

  const resetAddresses = () => {
    setWalletAddresses([]);
    setOwnedData([]);
  };

  const getAddresses = () => {
    return walletAddresses;
  };

  const getOwnedData = (data: WalletAddressData[]) => {
    if (!data) {
      console.error(`No address data: ${data}`);
      return;
    }
    let owned = setAllOwned(data);
    return owned;
  };

  const setAllOwned = (data: WalletAddressData[]) => {
    const owned = combineOwned(data);
    setDefaultOwnedData(owned);
    setOwnedData(owned);
    console.log({ owned });
    return owned;
  };

  function combineOwned(allData: WalletAddressData[]) {
    return allData
      .map((obj) =>
        obj.owned.map((value) => ({ ownedAddress: obj.address, ...value }))
      )
      .reduce((acc, arr) => acc.concat(arr), []);
  }

  useEffect(() => {
    if (window) {
      let data = getDataFromStorage();
      setWalletAddresses(data);
      getOwnedData(data);
    }
  }, []);

  return (
    <WalletInputContext.Provider
      value={{
        addWalletAddress,
        getAddresses,
        displayGrid,
        toggleGridDisplay,
        resetAddresses,
        defaultOwnedData,
        ownedData,
        setOwnedData,
        getOwned,
      }}
    >
      {children}
    </WalletInputContext.Provider>
  );
}
