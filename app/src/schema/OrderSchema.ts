import { PublicKey } from "@solana/web3.js";
import { ProductSchema } from "./ProductSchema";

export type OrderSchema = {
  product: PublicKey;
  buyer: PublicKey;
  seller: PublicKey;
  address: PublicKey;
  addressData: {
    country: string;
    state: string;
    code: string;
    locale: string;
  };
  isAccepted: boolean;
  isCompleted: boolean;
  quantity: number;
  orderedAt: string;
  expectedAt: string;
  productCharge: number;
  deliveryCharge: number;
  productData?: {
    title: string;
    images: string[] | null;
  };
};

export type OrderFetchSchema = {
  account: OrderSchema;
  publicKey: PublicKey;
};

export type OrderAcceptInputSchema = {
  deliveryCharge: string;
  expectedDelivery: string;
};
