import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import {
  getOwned,
  getUndeadz,
  getDataFromStorage,
  storeDataInStorage,
} from "@/lib/utils";
import { OwnedNft } from "alchemy-sdk";

export type WalletAddressData = {
  address: string;
  originalInput: string;
  owned: any[];
  ownedCount: number;
};

interface WalletInputContextType {
  addWalletAddress: (
    address: string,
    originalInput: string
  ) => Promise<WalletAddressData | null>;
  getAddresses: () => WalletAddressData[];
  resetAddresses: () => void;
  displayGrid: boolean;
  toggleGridDisplay: () => void;
  defaultOwnedData: OwnedNft[];
  ownedData: OwnedNft[];
  setOwnedData: Dispatch<SetStateAction<OwnedNft[]>>;
  getOwned: (data: any) => any;
  handleAddUndeadz: () => void;
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

  const addWalletAddress = async (address: string, originalInput: string) => {
    try {
      const owned = await getOwned(address);
      const newData: WalletAddressData = {
        address,
        originalInput,
        owned,
        ownedCount: owned.length,
      };
      let allAddresses = [...walletAddresses, newData];
      storeDataInStorage(allAddresses);
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

  const handleAddUndeadz = async () => {
    try {
      const addresses = getAddresses();
      let allUndeadz: OwnedNft[] = [];

      for (const addressData of addresses) {
        const undeadzForAddress = await getUndeadz(addressData.address);
        allUndeadz = allUndeadz.concat(
          undeadzForAddress.map((nft) => ({
            ...nft,
            ownedAddress: addressData.address,
          }))
        );
      }

      setOwnedData((prevData) => {
        const newData = [...prevData];
        allUndeadz.forEach((undeadz) => {
          const matchingIndex = newData.findIndex(
            (nft: any) =>
              nft.tokenId === undeadz.tokenId &&
              nft?.collection.name !== "UNDEADZ"
          );

          if (matchingIndex !== -1) {
            // Insert the Undeadz next to the original
            newData.splice(matchingIndex + 1, 0, undeadz);
          } else {
            // If no match found, add to the end
            newData.push(undeadz);
          }
        });

        return newData;
      });

      console.log("Undeadz added successfully");
    } catch (error) {
      console.error("Error adding Undeadz:", error);
    }
  };

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
        handleAddUndeadz, // Add the new function to the context value
      }}
    >
      {children}
    </WalletInputContext.Provider>
  );
}
