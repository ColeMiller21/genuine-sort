import { OwnedNft } from "alchemy-sdk";
import { SortAttribute, AttributeType } from "./attributes";
import { formatLookupToTraitType } from "./utils";

export const createSortFunction =
  (attribute: SortAttribute, attributes: AttributeType) =>
  (a: OwnedNft, b: OwnedNft) => {
    let lookupAttribute = formatLookupToTraitType(attribute) as string;
    // console.log({ a, b, attribute, lookupAttribute });
    const aValue =
      (a.rawMetadata &&
        a.rawMetadata.attributes &&
        a.rawMetadata.attributes.find(
          (attr) => attr.trait_type === lookupAttribute
        )?.value) ||
      "";

    const bValue =
      (b.rawMetadata &&
        b.rawMetadata.attributes &&
        b.rawMetadata.attributes.find(
          (attr) => attr.trait_type === lookupAttribute
        )?.value) ||
      "";

    const attributeIndexA =
      attributes[attribute].find((attr) => {
        return attr.attr.toUpperCase() === aValue;
      })?.index || 0;

    const attributeIndexB =
      attributes[attribute].find((attr) => attr.attr.toUpperCase() === bValue)
        ?.index || 0;
    // console.log({ aValue, bValue, attributeIndexA, attributeIndexB });
    return attributeIndexA - attributeIndexB;
  };
