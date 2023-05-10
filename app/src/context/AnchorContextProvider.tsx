import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { Wallet as AnchorWallet } from "@project-serum/anchor/dist/cjs/provider";
import productIdl from "../../../target/idl/product.json";
import userIdl from "../../../target/idl/user.json";
import marketIdl from "../../../target/idl/market.json";
import orderIdl from "../../../target/idl/order.json";
import { PublicKey } from "@solana/web3.js";
import { Idl } from "@coral-xyz/anchor";

const AnchorContext = createContext({});

export type AnchorPrograms = {
  productProgram: Program<Idl> | null;
  userProgram: Program<Idl> | null;
  marketProgram: Program<Idl> | null;
  orderProgram: Program<Idl> | null;
};

const initialPrograms = {
  productProgram: null,
  userProgram: null,
  marketProgram: null,
  orderProgram: null,
};

const AnchorContextProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<AnchorProvider | null>(null);
  const [programs, setPrograms] = useState<AnchorPrograms>(initialPrograms);

  const { signAllTransactions, signTransaction, publicKey } =
    useWallet() as AnchorWallet;

  const anchorWallet: AnchorWallet = useMemo(
    () => ({
      signAllTransactions,
      signTransaction,
      publicKey,
    }),
    [signAllTransactions, signTransaction, publicKey]
  );

  const { connection } = useConnection();

  useEffect(() => {
    // Get program ID of programs
    const productProgramId = new PublicKey(productIdl.metadata.address);
    const userProgramId = new PublicKey(userIdl.metadata.address);
    const marketProgramId = new PublicKey(marketIdl.metadata.address);
    const orderProgramId = new PublicKey(orderIdl.metadata.address);

    // --FIX--: Inorder to fetch data without a wallet a random wallet is generated every time as i have not found a way to create a provider without wallet. Trying to do this will give an error that says "local provider is not supported in Browser". This needs to be fixed.
    const wallet = anchorWallet;
    if (wallet) {
      const anchorProvider = new AnchorProvider(connection, wallet, {});
      //  Handle no provider error here, if it happens!!
      setProvider(anchorProvider);
      // If idl doesn't contain metadata -> run anchor build and anchor deploy to get that!
      // client side checking can also be added here to handle the error.

      // Create Program object
      const productProgram = new Program(
        productIdl as Idl,
        productProgramId,
        anchorProvider
      );
      const userProgram = new Program(
        userIdl as Idl,
        userProgramId,
        anchorProvider
      );
      const marketProgram = new Program(
        marketIdl as Idl,
        marketProgramId,
        anchorProvider
      );
      const orderProgram = new Program(
        orderIdl as Idl,
        orderProgramId,
        anchorProvider
      );

      setPrograms((prev) => ({
        ...prev,
        productProgram,
        userProgram,
        marketProgram,
        orderProgram,
      }));
    } else {
      console.error("No Wallet");
    }
  }, [anchorWallet, connection]);

  return (
    <AnchorContext.Provider value={{ provider, programs }}>
      {children}
    </AnchorContext.Provider>
  );
};

export { AnchorContextProvider, AnchorContext };
