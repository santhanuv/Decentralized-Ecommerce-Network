import { Outlet, useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { Box, Spinner, useDisclosure } from "@chakra-ui/react";
import WalletConnectModal from "../components/wallet/WalletConnectModal";

const PrivateRoutes = () => {
  // This component will try to connect wallet forever until it successfully connects to a wallet. This bug should be fixed!!.

  const { connected, wallet, wallets, select, connect, disconnecting } =
    useWallet();

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (wallet) {
      connect().catch((e) => {
        console.error("Unable to connect to wallet", e);
        navigate("/");
      });
    } else {
      onOpen();
    }
  }, []);

  return !connected ? (
    <Box position="absolute" h="100vh" w="100vw" color="white">
      <Spinner position="absolute" left="50%" top="50%" size="lg" />

      <WalletConnectModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        wallet={wallet}
        wallets={wallets}
        select={select}
        connect={connect}
        connected={connected}
        disconnecting={disconnecting}
      />
    </Box>
  ) : (
    <Outlet />
  );
};

export default PrivateRoutes;
