import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import {
  getSortTypes,
  AttributeType,
  defaultAttributes,
  clonedDefaults,
  SortAttribute,
  filterTraitsWithIncludeTrue,
  Attribute,
  toggleAllTraits,
} from "@/lib/attributes";
import { OwnedNft } from "alchemy-sdk";
import { createSortFunction } from "@/lib/sort-factory";
import { useWalletInput } from "./wallet-input-provider";
import { formatTrait, formatTraitType } from "@/lib/utils";
import { cloneDeep } from "lodash";
export interface SortType {
  value: string;
  label: string;
}

interface SorterContextType {
  sortTypes: SortType[];
  primarySort: string;
  setPrimarySort: Dispatch<SetStateAction<SortAttribute>>;
  attributes: AttributeType;
  setAttributes: Dispatch<SetStateAction<AttributeType>>;
  resetSortAndFilters: () => void;
}

const SorterContext = createContext<SorterContextType | undefined>(undefined);

export function useSorter(): SorterContextType {
  const context = useContext(SorterContext);
  if (!context) {
    throw new Error("useSorter must be used within a SorterProvider");
  }
  return context;
}

export function SorterProvider({ children }: { children: React.ReactNode }) {
  const { ownedData, setOwnedData, defaultOwnedData } = useWalletInput();
  const sortTypes = getSortTypes();
  const [attributes, setAttributes] = useState<AttributeType>(clonedDefaults);
  const [primarySort, setPrimarySort] = useState<SortAttribute>(
    sortTypes[0].value as SortAttribute
  );

  function filterOwnedItems(sortedOwned: any, attributes: any): any[] {
    return sortedOwned.filter((item: any) => {
      const shouldInclude = item.rawMetadata.attributes.every((attr: any) => {
        let lookupTrait = formatTraitType(attr.trait_type) as string;
        if (!lookupTrait) return true;
        let attributesToCheck = attributes[lookupTrait];
        let lookupValue = formatTrait(attr.value);
        let found = attributesToCheck.find(
          (item: Attribute) => item.attr === lookupValue
        );
        return found?.include || false;
      });
      return shouldInclude;
    });
  }

  const sortData = (attr?: AttributeType) => {
    let filtered = filterOwnedItems(defaultOwnedData, attr || attributes);
    const sortFunction = createSortFunction(primarySort, attr || attributes);
    const sortedOwned = [...filtered].sort(sortFunction);
    setOwnedData(sortedOwned);
  };

  const resetSortAndFilters = () => {
    let a = toggleAllTraits(defaultAttributes, true);
    setAttributes(a);
    setOwnedData([...defaultOwnedData]);
    sortData(a);
  };

  useEffect(() => {
    if (ownedData.length > 0) {
      sortData();
    }
  }, [attributes]);

  return (
    <SorterContext.Provider
      value={{
        sortTypes,
        primarySort,
        setPrimarySort,
        attributes,
        setAttributes,
        resetSortAndFilters,
      }}
    >
      {children}
    </SorterContext.Provider>
  );
}
