import { OwnedNft } from "alchemy-sdk";
import { SortAttribute, AttributeType } from "./attributes";

export const createSortFunction =
  (attribute: SortAttribute, attributes: AttributeType) =>
  (a: OwnedNft, b: OwnedNft) => {
    // Get A attribute value
    const aValue =
      (a.rawMetadata &&
        a.rawMetadata.attributes &&
        a.rawMetadata.attributes.find(
          (attr) => attr.trait_type === attribute.toUpperCase()
        )?.value) ||
      "";
    // Get B attribute value
    const bValue =
      (b.rawMetadata &&
        b.rawMetadata.attributes &&
        b.rawMetadata.attributes.find(
          (attr) => attr.trait_type === attribute.toUpperCase()
        )?.value) ||
      "";

    // Get the index of the selected attribute
    const attributeIndex =
      attributes[attribute].find((attr) => attr.attr === attribute)?.index || 0;

    // Compare based on the index
    return attributeIndex - aValue.localeCompare(bValue);
  };
