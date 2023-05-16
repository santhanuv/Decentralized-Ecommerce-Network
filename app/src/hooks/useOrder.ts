import { useCallback } from "react";
import { GetProgramAccountsFilter, Keypair, PublicKey } from "@solana/web3.js";
import { OrderFetchSchema, OrderSchema } from "../schema/OrderSchema";
import { Idl, Program } from "@project-serum/anchor";
import useProduct from "./useProduct";
import * as bs58 from "bs58";
import { utils } from "@project-serum/anchor";
import { AddressInputSchema } from "../schema/UserSchema";
import useUser from "./useUser";
import { UserType } from "../pages/order/OrderList";

const useOrder = () => {
  const { fetchProduct } = useProduct();
  const { fetchAddressByID } = useUser();

  const fetchAllOrders = useCallback(
    async (
      orderProgram: Program<Idl>,
      productProgram: Program<Idl>,
      userProgram: Program<Idl>,
      getTransactionData: (txId: string) => Promise<any>,
      filters: Buffer | GetProgramAccountsFilter[] | undefined = []
    ) => {
      if (!orderProgram.account.order) throw new Error("Invalid order program");

      const orders = (await orderProgram.account.order.all(
        filters
      )) as OrderFetchSchema[];

      let data = await Promise.all(
        orders.map(async (order) => {
          const productKey = order.account.product;
          if (productProgram.account.product) {
            const product = await fetchProduct(
              productProgram,
              productKey,
              getTransactionData
            );

            return {
              ...order,
              account: {
                ...order.account,
                productData: {
                  title: product.data.title,
                  images: product.images,
                },
              },
            } as OrderFetchSchema;
          } else throw new Error("Invalid product Program");
        })
      );

      data = await Promise.all(
        data.map(async (order) => {
          const addressKey = order.account.address;

          const address = await fetchAddressByID(userProgram, addressKey);

          return {
            ...order,
            account: {
              ...order.account,
              addressData: {
                country: address.country,
                state: address.state,
                code: address.code,
                locale: address.locale,
              },
            },
          };
        })
      );

      return data;
    },
    []
  );

  const fetchPendingSellerOrders = useCallback(
    async (
      orderProgram: Program<Idl>,
      productProgram: Program<Idl>,
      userProgram: Program<Idl>,
      publicKey: PublicKey,
      userType: UserType,
      getTransactionData: (txId: string) => Promise<any>
    ) => {
      if (!orderProgram.account.order) throw new Error("Invalid order program");

      const data = await fetchAllOrders(
        orderProgram,
        productProgram,
        userProgram,
        getTransactionData,
        [
          userType === UserType.Buyer
            ? {
                memcmp: {
                  offset: 8 + 32, // product Key
                  bytes: publicKey.toBase58(),
                },
              }
            : {
                memcmp: {
                  offset:
                    8 + // Discriminator
                    32 + // Product key
                    32, // Buyer key
                  bytes: publicKey.toBase58(),
                },
              },
          {
            memcmp: {
              // Discriminator + product key + buyer key + seller key + address key
              offset: 8 + 32 + 32 + 32 + 32,
              bytes: bs58.encode([0]),
            },
          },
          {
            memcmp: {
              // Discriminator + product key + buyer key + seller key +
              //address key + is_accepted
              offset: 8 + 32 + 32 + 32 + 32 + 1,
              bytes: bs58.encode([0]),
            },
          },
        ]
      );

      return data;
    },
    []
  );

  const fetchAcceptedSellerOrders = useCallback(
    async (
      orderProgram: Program<Idl>,
      productProgram: Program<Idl>,
      userProgram: Program<Idl>,
      publicKey: PublicKey,
      userType: UserType,
      getTransactionData: (txId: string) => Promise<any>
    ) => {
      if (!orderProgram.account.order) throw new Error("Invalid order program");

      const data = await fetchAllOrders(
        orderProgram,
        productProgram,
        userProgram,
        getTransactionData,
        [
          userType === UserType.Buyer
            ? {
                memcmp: {
                  offset: 8 + 32, // product Key
                  bytes: publicKey.toBase58(),
                },
              }
            : {
                memcmp: {
                  offset:
                    8 + // Discriminator
                    32 + // Product key
                    32, // Buyer key
                  bytes: publicKey.toBase58(),
                },
              },
          {
            memcmp: {
              // Discriminator + product key + buyer key + seller key + address key
              offset: 8 + 32 + 32 + 32 + 32,
              bytes: bs58.encode([1]),
            },
          },
          {
            memcmp: {
              // Discriminator + product key + buyer key + seller key + address key
              // + is_accepted
              offset: 8 + 32 + 32 + 32 + 32 + 1,
              bytes: bs58.encode([0]),
            },
          },
        ]
      );

      return data;
    },
    []
  );

  const fetchConfirmedSellerOrders = useCallback(
    async (
      orderProgram: Program<Idl>,
      productProgram: Program<Idl>,
      userProgram: Program<Idl>,
      publicKey: PublicKey,
      userType: UserType,
      getTransactionData: (txId: string) => Promise<any>
    ) => {
      if (!orderProgram.account.order) throw new Error("Invalid order program");

      const data = await fetchAllOrders(
        orderProgram,
        productProgram,
        userProgram,
        getTransactionData,
        [
          userType === UserType.Buyer
            ? {
                memcmp: {
                  offset: 8 + 32, // product Key
                  bytes: publicKey.toBase58(),
                },
              }
            : {
                memcmp: {
                  offset:
                    8 + // Discriminator
                    32 + // Product key
                    32, // Buyer key
                  bytes: publicKey.toBase58(),
                },
              },
          {
            memcmp: {
              // Discriminator + product key + buyer key + seller key + address key
              // + is_accepted
              offset: 8 + 32 + 32 + 32 + 32 + 1,
              bytes: bs58.encode([1]),
            },
          },
          {
            memcmp: {
              // Discriminator + product key + buyer key + seller key + address key
              // + is_accepted
              offset: 8 + 32 + 32 + 32 + 32 + 1 + 1,
              bytes: bs58.encode([0]),
            },
          },
        ]
      );

      return data;
    },
    []
  );

  const fetchCompletedSellerOrders = useCallback(
    async (
      orderProgram: Program<Idl>,
      productProgram: Program<Idl>,
      userProgram: Program<Idl>,
      publicKey: PublicKey,
      userType: UserType,
      getTransactionData: (txId: string) => Promise<any>
    ) => {
      if (!orderProgram.account.order) throw new Error("Invalid order program");

      const data = await fetchAllOrders(
        orderProgram,
        productProgram,
        userProgram,
        getTransactionData,
        [
          userType === UserType.Buyer
            ? {
                memcmp: {
                  offset: 8 + 32, // product Key
                  bytes: publicKey.toBase58(),
                },
              }
            : {
                memcmp: {
                  offset:
                    8 + // Discriminator
                    32 + // Product key
                    32, // Buyer key
                  bytes: publicKey.toBase58(),
                },
              },
          {
            memcmp: {
              // Discriminator + product key + buyer key + seller key + address key + is_accepted + is_confirmed
              offset: 8 + 32 + 32 + 32 + 32 + 1 + 1,
              bytes: bs58.encode([1]),
            },
          },
        ]
      );

      return data;
    },
    []
  );

  const placeOrder = useCallback(
    async (
      program: Program<Idl>,
      product: PublicKey,
      buyer: PublicKey,
      address: PublicKey,
      quantity: string
    ) => {
      if (!program.methods.placeOrder) throw new Error("Invalid program!");

      const [orderPDA] = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("order"),
          product.toBuffer(),
          buyer.toBuffer(),
        ],
        program.programId
      );

      return await program.methods
        .placeOrder(quantity)
        .accounts({
          order: orderPDA,
          product,
          buyer,
          address,
        })
        .signers([])
        .rpc();
    },
    []
  );

  return {
    fetchAllOrders,
    fetchPendingSellerOrders,
    fetchAcceptedSellerOrders,
    fetchConfirmedSellerOrders,
    fetchCompletedSellerOrders,
    placeOrder,
  };
};

export default useOrder;
