// WalletInputContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getOwned, getDataFromStorage } from "@/lib/utils";

// Define the shape of the wallet address data
export interface WalletAddressData {
  address: string;
  owned: any[]; // Define the correct type for the 'owned' property
  ownedCount: number;
}

// Create a context for WalletInputProvider
interface WalletInputContextType {
  addWalletAddress: (address: string) => Promise<WalletAddressData | null>;
  getAddresses: () => WalletAddressData[];
  resetAddresses: () => void;
  displayGrid: boolean;
  toggleGridDisplay: () => void;
}

const WalletInputContext = createContext<WalletInputContextType | undefined>(
  undefined
);

// Custom hook to access the context
export function useWalletInput(): WalletInputContextType {
  const context = useContext(WalletInputContext);
  if (!context) {
    throw new Error("useWalletInput must be used within a WalletInputProvider");
  }
  return context;
}

// WalletInputProvider component
interface WalletInputProviderProps {
  children: ReactNode;
}

export function WalletInputProvider({ children }: WalletInputProviderProps) {
  const [walletAddresses, setWalletAddresses] = useState<WalletAddressData[]>(
    []
  );
  const [displayGrid, setDisplayGrid] = useState<boolean>(false);

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
      setWalletAddresses([...walletAddresses, newData]);
      return newData;
    } catch (error) {
      console.error("Error adding wallet address:", error);
      return null;
    }
  };

  const resetAddresses = () => {
    setWalletAddresses([]);
  };

  const getAddresses = () => {
    return walletAddresses;
  };

  useEffect(() => {
    if (window) {
      setWalletAddresses(getDataFromStorage());
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
      }}
    >
      {children}
    </WalletInputContext.Provider>
  );
}
