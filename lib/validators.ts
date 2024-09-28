import { ethers } from "ethers";

export function isValidAddress(address: string) {
  try {
    // Attempt to create an Ethereum address from the input string
    const parsedAddress = ethers.getAddress(address);
    return true;
  } catch (error) {
    // If an exception is thrown, the input is not a valid address
    return false;
  }
}

export function isValidENS(name: string): boolean {
  return name.toLowerCase().endsWith(".eth");
}
