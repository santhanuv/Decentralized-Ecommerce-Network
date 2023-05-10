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

// const fetchProduct = useCallback(
//     async (programs: AnchorPrograms, productID: PublicKey) => {
//       try {
//         const data = await programs?.productProgram?.account.product.fetch(
//           productID
//         );

//         if (data) {
//           const ardata = await getTransactionData(data.storageId as string);
//           const images = ardata.images as string[] | null;
//           console.log(ardata);
//           if (images?.length !== 0) setImages(images);
//           else setImages(null);
//         }

//         setData(data as ProductSchema);
//       } catch (err) {
//         console.error(err);
//       }
//     },
//     [getTransactionData]
//   );

export default useProduct;
