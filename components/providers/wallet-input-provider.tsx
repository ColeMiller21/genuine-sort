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
import { BASE_UNDEADZ_URL } from "@/lib/utils";

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
  handleRemoveUndeadz: () => void;
  hasUndeadz: boolean;
  setHasUndeadz: Dispatch<SetStateAction<boolean>>;
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
  const [hasUndeadz, setHasUndeadz] = useState<boolean>(false);

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
        const existingNames = new Set(newData.map((item) => item.name));

        // Process existing ownedData for UNDEADZ trait
        newData.forEach((item) => {
          const undeadzTrait = item.raw.metadata?.attributes?.find(
            (attr: any) => attr.trait_type === "UNDEADZ"
          );

          if (undeadzTrait && undeadzTrait.value === "TRUE") {
            const undeadzName = `UNDEADZ #${item.tokenId}`;
            if (!existingNames.has(undeadzName)) {
              const undeadzCopy = JSON.parse(JSON.stringify(item)); // Deep copy
              undeadzCopy.image.cachedUrl = `${BASE_UNDEADZ_URL}${item.raw.metadata.edition}.png`;
              undeadzCopy.name = undeadzName;

              // Remove the UNDEADZ trait from the copied object
              if (
                undeadzCopy.raw.metadata &&
                undeadzCopy.raw.metadata.attributes
              ) {
                undeadzCopy.raw.metadata.attributes =
                  undeadzCopy.raw.metadata.attributes.filter(
                    (attr: any) => attr.trait_type !== "UNDEADZ"
                  );
              }

              newData.push(undeadzCopy);
              existingNames.add(undeadzName);
            }
          }
        });

        // Add new Undeadz
        allUndeadz.forEach((undeadz) => {
          const undeadzName = `UNDEADZ #${undeadz.tokenId}`;
          if (!existingNames.has(undeadzName)) {
            const matchingIndex = newData.findIndex(
              (nft: any) =>
                nft.tokenId === undeadz.tokenId &&
                nft?.collection.name !== "UNDEADZ"
            );

            undeadz.name = undeadzName;

            if (matchingIndex !== -1) {
              // Insert the Undeadz next to the original
              newData.splice(matchingIndex + 1, 0, undeadz);
            } else {
              // If no match found, add to the end
              newData.push(undeadz);
            }
            existingNames.add(undeadzName);
          }
        });

        return newData;
      });

      setHasUndeadz(true);
      console.log("Undeadz added successfully");
    } catch (error) {
      console.error("Error adding Undeadz:", error);
    }
  };

  const handleRemoveUndeadz = () => {
    setOwnedData((prevData) => 
      prevData.filter((nft) => !nft?.name?.includes('UNDEADZ'))
    );
    setHasUndeadz(false);
    console.log("Undeadz removed");
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
        handleAddUndeadz,
        handleRemoveUndeadz,
        hasUndeadz,
        setHasUndeadz,
      }}
    >
      {children}
    </WalletInputContext.Provider>
  );
}
