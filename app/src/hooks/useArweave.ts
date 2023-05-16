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
  const { arweave, wallet } = useContext(
    ArweaveContext
  ) as ContextType;

  const getTransactionData = useCallback(async (txId: string) => {
    try {
      const txdata = await arweave.transactions.getData(txId, {
        decode: true,
        string: true,
      });
      const ardata = JSON.parse(txdata as string);

      return ardata;
    } catch (err) {
      console.error("arweave is not connected!");
    }
  }, []);

  const submitTransaction = useCallback(
    async (
      data: string | ArrayBuffer | Uint8Array,
      setProgress: React.Dispatch<React.SetStateAction<number>>
    ) => {
      try {
        const tx = await arweave.createTransaction({
          data: data,
        });

        await arweave.transactions.sign(tx, wallet);
        let uploader = await arweave.transactions.getUploader(tx);

        while (!uploader.isComplete) {
          await uploader.uploadChunk();
          setProgress(uploader.pctComplete);
        }

        return tx.id;
      } catch (err) {
        console.error(err);
      }
    },
    [arweave, wallet]
  );

  return { arweave, submitTransaction, getTransactionData };
};

export default useArweave;
