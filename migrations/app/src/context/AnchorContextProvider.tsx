import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { Wallet as AnchorWallet } from "@project-serum/anchor/dist/cjs/provider";
import { Keypair } from "@solana/web3.js";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import idl from "../../../target/idl/den.json";
import { PublicKey } from "@solana/web3.js";
import { getProvider, Idl } from "@coral-xyz/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const AnchorContext = createContext({});

const AnchorContextProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<AnchorProvider | null>(null);
  const [program, setProgram] = useState<Program<Idl> | null>(null);

  const { signAllTransactions, signTransaction, publicKey } =
    useWallet() as AnchorWallet;
  const { connected } = useWallet();

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
    const programID = new PublicKey(idl.metadata.address);
    // --FIX--: Inorder to fetch data without a wallet a random wallet is generated every time as i have not found a way to create a provider without wallet. Trying to do this will give an error that says "local provider is not supported in Browser". This needs to be fixed.
    const wallet = connected
      ? anchorWallet
      : new NodeWallet(Keypair.generate());
    if (wallet) {
      const anchorProvider = new AnchorProvider(connection, wallet, {});
      //  Handle no provider error here, if it happens!!
      setProvider(anchorProvider);
      // If idl doesn't contain metadata -> run anchor build and anchor deploy to get that!
      // client side checking can also be added here to handle the error.
      const anchorProgram = new Program(idl as Idl, programID, anchorProvider);
      setProgram(anchorProgram);
    }
  }, [anchorWallet, connection]);

  return (
    <AnchorContext.Provider value={{ provider, program }}>
      {children}
    </AnchorContext.Provider>
  );
};

export { AnchorContextProvider, AnchorContext };
