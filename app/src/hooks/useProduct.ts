import { useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { ProductSchema } from "../schema/ProductSchema";
import { Idl, Program } from "@project-serum/anchor";

const useProduct = () => {
  const fetchProduct = useCallback(
    async (
      program: Program<Idl>,
      productID: PublicKey,
      getTransactionData: (txId: string) => Promise<any>
    ) => {
      if (!program?.account?.product) throw new Error("Invalid program");

      const data = (await program.account.product.fetch(
        productID
      )) as ProductSchema;

      let images: string[] | null = null;
      let details: string = "";
      if (data) {
        const ardata = await getTransactionData(data.storageId as string);
        images = ardata.images;
        details = ardata.details;
      }

      return { data, images, details };
    },
    []
  );

  return { fetchProduct };
};

export default useProduct;
