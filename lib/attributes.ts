export const defaultAttributes = {
  backgrounds: [
    { attr: "Crimson", index: 1, include: true },
    { attr: "Dawn", index: 2, include: true },
    { attr: "Midnight", index: 3, include: true },
    { attr: "Myth", index: 4, include: true },
    { attr: "Purple", index: 5, include: true },
    { attr: "Ocean", index: 6, include: true },
    { attr: "Bloodymary", index: 7, include: true },
    { attr: "Mustard", index: 8, include: true },
    { attr: "Mist", index: 9, include: true },
    { attr: "Swamp", index: 10, include: true },
    { attr: "Sky", index: 11, include: true },
  ],
  // eyewear: [
  //   { attr: "Blue Shades", index: 1 },
  //   { attr: "Damaged Face", index: 2 },
  //   { attr: "Optical", index: 3 },
  //   { attr: "Nano Eye Mod", index: 4 },
  //   { attr: "Damaged Eye", index: 5 },
  //   { attr: "Neon Shades", index: 6 },
  //   { attr: "Aviator Shades", index: 7 },
  //   { attr: "Green Shades", index: 8 },
  //   { attr: "Night Vision", index: 9 },
  //   { attr: "Hologram Shades", index: 10 },
  //   { attr: "Laser Shades", index: 11 },
  //   { attr: "Clear Shades", index: 12 },
  //   { attr: "Lawman Goggles", index: 13 },
  //   { attr: "Compound Eye", index: 14 },
  //   { attr: "Sun Shades", index: 15 },
  //   { attr: "Alloy Eye Mod", index: 16 },
  //   { attr: "Titanium Eye Mod", index: 17 },
  //   { attr: "Zigzag Paint", index: 18 },
  //   { attr: "Power Shades", index: 19 },
  //   { attr: "Offworld Goggles", index: 20 },
  //   { attr: "Yellow Shades", index: 21 },
  //   { attr: "Pink Shades", index: 22 },
  //   { attr: "Rider Goggles", index: 23 },
  //   { attr: "Communicator Goggles", index: 24 },
  //   { attr: "Eyepatch", index: 25 },
  //   { attr: "Simple Shades", index: 26 },
  //   { attr: "Toughguy Shades", index: 27 },
  //   { attr: "Eyeshadow", index: 28 },
  //   { attr: "Facecrack", index: 29 },
  //   { attr: "Jungle Paint", index: 30 },
  // ],
  // face: [
  //   { attr: "Test Model", index: 1 },
  //   { attr: "Titanium Jaw", index: 2 },
  //   { attr: "Version 1", index: 3 },
  //   { attr: "Lit Cigarette", index: 4 },
  //   { attr: "Cigarette", index: 5 },
  //   { attr: "Technician Mask", index: 6 },
  //   { attr: "Cigar", index: 7 },
  //   { attr: "Outlaw Mask", index: 8 },
  //   { attr: "Oni Mask", index: 9 },
  //   { attr: "Tiger Mask", index: 10 },
  //   { attr: "Panel Pipe", index: 11 },
  //   { attr: "Safty Glasses", index: 12 },
  //   { attr: "Red Bandana", index: 13 },
  //   { attr: "Green Bandana", index: 14 },
  //   { attr: "Rose", index: 15 },
  //   { attr: "Fox Mask", index: 16 },
  //   { attr: "Miner Mask", index: 17 },
  //   { attr: "Nihon Paint", index: 18 },
  //   { attr: "Blue Bandana", index: 19 },
  //   { attr: "Full Bent Pipe", index: 20 },
  //   { attr: "Halfface Cyberware", index: 21 },
  //   { attr: "Bandage", index: 22 },
  // ],
  // headwear: [],
  // tops: [],
  types: [
    { attr: "Flesh", index: 1, include: true },
    { attr: "Bone", index: 2, include: true },
    { attr: "Golem", index: 3, include: true },
    { attr: "Illusion", index: 4, include: true },
    { attr: "Chrome", index: 5, include: true },
    { attr: "Brass", index: 6, include: true },
    { attr: "Zombie", index: 7, include: true },
    { attr: "Shiny", index: 8, include: true },
    { attr: "Faceless", index: 9, include: true },
    { attr: "Roy", index: 10, include: true },
    { attr: "Lou", index: 11, include: true },
    { attr: "Jaw", index: 12, include: true },
    { attr: "Hologram", index: 13, include: true },
  ],
  // traitCount: [],
};

export type AttributeType = typeof defaultAttributes & {
  [key: string]: { attr: string; index: number; include: boolean }[];
};
export type SortAttribute = keyof typeof defaultAttributes;
export type Attribute = {
  attr: string;
  index: number;
  include: boolean;
};

export const getSortTypes = () => {
  return Object.keys(defaultAttributes).map((att: string, i: number) => {
    return {
      value: att,
      label: att.charAt(0).toUpperCase() + att.slice(1),
    };
  });
};

export const toggleAllTraits = (data: AttributeType, includeValue: boolean) => {
  for (const key of Object.keys(data)) {
    const traitArray = data[key];
    for (const trait of traitArray) {
      trait.include = includeValue;
    }
  }
  return data;
};

export const filterTraitsWithIncludeTrue = (data: AttributeType) => {
  const filteredData: any = {};
  for (const key of Object.keys(data)) {
    const traitArray = data[key];
    filteredData[key] = traitArray.filter((trait) => trait.include === true);
  }
  return filteredData;
};
