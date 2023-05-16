import { PublicKey } from "@solana/web3.js";
import { ProductSchema } from "./ProductSchema";

export type CancelOrderType = {
  buyer?: {},
  seller?: {},
  notCanceled?: {},
}
export enum CancelOrderEnum { NotCanceled, Buyer, Seller };

export class CancelOrder {
  cancelled: CancelOrderEnum | undefined;
  
  constructor(cancelled: CancelOrderType) {
    if(cancelled?.buyer) {
      this.cancelled = CancelOrderEnum.Buyer;
    } else if (cancelled?.seller) {
      this.cancelled = CancelOrderEnum.Seller;
    } else if (cancelled?.notCanceled) {
      this.cancelled = CancelOrderEnum.NotCanceled;
    }
  }
}

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
  isConfirmed: boolean;
  isCompleted: boolean;
  quantity: number;
  orderedAt: string;
  expectedAt: string;
  canceled: CancelOrderType;
  cancelReason: string;
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
