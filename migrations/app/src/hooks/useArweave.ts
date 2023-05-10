import { useCallback, useContext } from "react";
import Arweave from "arweave";
import { ArweaveContext } from "../context/ArweaveContextProvider";
import { JWKInterface } from "arweave/node/lib/wallet";

type ContextType = {
  arweave: Arweave;
  wallet: JWKInterface;
  walletAddr: string;
};

const useArweave = () => {
  const { arweave, wallet, walletAddr } = useContext(
    ArweaveContext
  ) as ContextType;

  const submitTransaction = useCallback(
    async (data: string | ArrayBuffer | Uint8Array) => {
      try {
        const tx = await arweave.createTransaction({
          data: data,
        });

        await arweave.transactions.sign(tx, wallet);
        const res = await arweave.transactions.post(tx);

        if (res.status === 200) {
          return tx.id;
        } else {
          throw Error("Unable to submit transaction");
        }
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  return { arweave, submitTransaction };
};

export default useArweave;
