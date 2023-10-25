export const attributes = {
  background: [
    { attr: "Crimson", index: 1 },
    { attr: "Dawn", index: 2 },
    { attr: "Midnight", index: 3 },
    { attr: "Myth", index: 4 },
    { attr: "Purple", index: 5 },
    { attr: "Ocean", index: 6 },
    { attr: "Bloodymary", index: 7 },
    { attr: "Mustard", index: 8 },
    { attr: "Mist", index: 9 },
    { attr: "Swamp", index: 10 },
    { attr: "Sky", index: 11 },
  ],
  eyewear: [],
  face: [],
  headwear: [],
  tops: [],
  types: [],
  traitCount: [],
};

export type AttributeType = typeof attributes;
export type SortAttribute = keyof typeof attributes;
