import { PublicKey } from "@solana/web3.js";

export type ProductSchema = {
  price: number;
  rating: number;
  inventory: number;
  title: string;
  description: string;
  details: string;
  seller: PublicKey;
  timestamp: string;
};

export interface ProductInputSchema
  extends Omit<
    ProductSchema,
    "price" | "inventory" | "seller" | "timestamp" | "rating"
  > {
  price: string;
  inventory: string;
  image: FileList[] | null;
}
