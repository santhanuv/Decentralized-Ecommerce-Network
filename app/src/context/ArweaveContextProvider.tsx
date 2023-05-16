import { createContext, ReactNode, useEffect, useState } from "react";
import Arweave from "arweave";
import { JWKInterface } from "arweave/node/lib/wallet";

const ArweaveContext = createContext({});

const ArweaveContextProvider = ({ children }: { children: ReactNode }) => {
  const [arweave, setArweave] = useState<Arweave>();
  const [wallet, setWallet] = useState<JWKInterface>();
  const [walletAddr, setWalletAddr] = useState<string>();

  useEffect(() => {
    (async () => {
      const arweave = Arweave.init({
        host: "localhost", // Hostname or IP address for a Arweave host
        port: 1984, // Port
        protocol: "http", // Network protocol http or https
        timeout: 20000, // Network request timeouts in milliseconds
        logging: false, // Enable network request logging
      });

      setArweave(arweave);

      // Creating test wallet
      const wallet = await arweave.wallets.generate();
      setWallet(wallet);

      const walletAddr = await arweave.wallets.getAddress(wallet);
      setWalletAddr(walletAddr);

      // See arlocal github page
      // const WINSTON = 1000000000000;
      await arweave.api.get(`/mint/${walletAddr}/${100000 * 10000000000}`);

      const balance = await arweave.wallets.getBalance(walletAddr);
      console.log("balance: ", balance);
    })();
  }, []);

  return (
    <ArweaveContext.Provider value={{ arweave, wallet, walletAddr }}>
      {children}
    </ArweaveContext.Provider>
  );
};

export { ArweaveContextProvider, ArweaveContext };
