import { useMemo, useCallback, useState, useEffect } from "react";
import { Wallet } from "@solana/wallet-adapter-react";
import { WalletReadyState, WalletName } from "@solana/wallet-adapter-base";
import WalletItem from "./WalletItem";
import {
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

const WalletConnectModal = ({
  isOpen,
  onClose,
  onOpen,
  wallet,
  wallets,
  connect,
  connected,
  select,
}: WalletConnectionModaltype) => {
  const [tryConnect, setTryConnect] = useState(false);

  const [listedWallets, collapsedWallets] = useMemo(() => {
    const installed: Wallet[] = [];
    const loadable: Wallet[] = [];
    const notDetected: Wallet[] = [];

    for (const wallet of wallets) {
      if (wallet.readyState === WalletReadyState.NotDetected) {
        notDetected.push(wallet);
      } else if (wallet.readyState === WalletReadyState.Loadable) {
        loadable.push(wallet);
      } else if (wallet.readyState === WalletReadyState.Installed) {
        installed.push(wallet);
      }
    }

    let listed: Wallet[] = [];
    let collapsed: Wallet[] = [];

    if (installed.length) {
      listed = installed;
      collapsed = [...loadable, ...notDetected];
    } else if (loadable.length) {
      listed = loadable;
      collapsed = notDetected;
    } else {
      collapsed = notDetected;
    }

    return [listed, collapsed];
  }, [wallets]);

  const handleWalletClick = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      walletName: WalletName
    ) => {
      e.preventDefault();

      if (!wallet && !connected) {
        console.log("Selecting Wallet...");
        select(walletName);
        setTryConnect(true);
      } else if (!connected) {
        setTryConnect(true);
      }

      onClose();
    },
    [select, onClose, wallet, connected, setTryConnect]
  );

  useEffect(() => {
    if (tryConnect) {
      if (connected) {
        console.log("Wallet already connected");
      } else if (wallet) {
        console.log("Connecting Wallet");
        connect().catch((e) => {
          console.error(e);
          console.error("Unable to connect to wallet.");
        });
      } else {
        alert("Select a wallet");
        onOpen();
      }

      setTryConnect(false);
    }
  }, [tryConnect, connected, wallet]);

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader>Connect Your Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {listedWallets.length ? (
            <List spacing="2">
              {[...listedWallets, ...collapsedWallets].map((wallet, idx) => (
                <ListItem key={idx}>
                  <WalletItem wallet={wallet} onClick={handleWalletClick} />
                </ListItem>
              ))}
            </List>
          ) : (
            !listedWallets.length &&
            !collapsedWallets.length && <h1>NO Wallets</h1>
          )}
        </ModalBody>
        <ModalFooter>More Options</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

type WalletConnectionModaltype = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  wallet: Wallet | null;
  wallets: Wallet[];
  connect: () => Promise<void>;
  connected: boolean;
  select: (walletName: WalletName<string> | null) => void;
  disconnecting: boolean;
};

export default WalletConnectModal;
