import { PublicKey } from "@solana/web3.js";

export type MarketSchema = {
  owner: PublicKey;
  name: string;
  // rating: number;
  description: string;
  coverImage: string;
  createdAt: string;
};

export type MarketFetchSchema = [
  {
    publicKey: PublicKey;
    account: MarketSchema;
    cover_image: string; // Original image data taken from arweave
  }
];

export interface MarketInputSchema
  extends Omit<MarketSchema, "owner" | "createdAt" | "coverImage"> {
  cover_image: string;
}
