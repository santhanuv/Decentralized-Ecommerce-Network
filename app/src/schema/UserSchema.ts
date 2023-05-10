import { PublicKey } from "@solana/web3.js";

export type UserSchema = {
  seller: PublicKey;
  timestamp: string;
  firstname: string;
  lastname: string;
  profileImage: string | null;
  email: string;
  contactNumber: string;
};

export interface UserInputSchema
  extends Omit<
    UserSchema,
    "seller" | "timestamp" | "profileImage" | "contactNumber"
  > {
  profile_image: string | null;
  contact_number: string;
}

export interface AddressSchema {
  user: PublicKey;
  country: string;
  state: string;
  code: string;
  locale: string;
}

export type AddressInputSchema = Omit<AddressSchema, "user">;

export type AddressFetchSchema = {
  account: AddressSchema;
  publicKey: PublicKey;
};
