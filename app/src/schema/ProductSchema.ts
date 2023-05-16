import { PublicKey } from "@solana/web3.js";

export type ProductSchema = {
  market: PublicKey;
  seller: PublicKey;
  timestamp: string;
  price: number;
  rating: number;
  inventory: number;
  title: string;
  description: string;
  storageId: string;
};

export interface ProductInputSchema
  extends Omit<
    ProductSchema,
    | "price"
    | "inventory"
    | "seller"
    | "timestamp"
    | "rating"
    | "storageId"
    | "market"
  > {
  price: string;
  inventory: string;
  details: string;
}

export type ProductFetchSchema = [
  {
    publicKey: PublicKey;
    account: ProductSchema;
    images: string[];
    details: string;
  }
];
