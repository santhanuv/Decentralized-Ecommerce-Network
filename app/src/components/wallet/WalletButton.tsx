import { useCallback } from "react";
import { FaWallet } from "react-icons/fa";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletConnectModal from "./WalletConnectModal";
import {
  Menu,
  useDisclosure,
  MenuButton,
  Icon,
  MenuList,
  Box,
  Portal,
} from "@chakra-ui/react";
import IconButton from "../IconButton";
import { IconButtonStyleProps } from "../IconButton";
import StyledMenuItem from "../StyledMenuItem";
import { VscCircleFilled } from "react-icons/vsc";

const WalletButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    disconnect,
    disconnecting,
    connect,
    connecting,
    connected,
    wallet,
    wallets,
    select,
  } = useWallet();

  const handleDisconnect = useCallback(async () => {
    if (connected && !disconnecting && !connecting) {
      console.log("Disconnecting wallet");
      try {
        disconnect();
        console.log("disconnected");
      } catch (err) {
        console.error("Unable to disconnect wallet!");
        console.error(err);
      }
    }
  }, [disconnect, connected, disconnecting, connecting]);

  return (
    <Box position="relative">
      <Icon
        pointerEvents="none"
        as={VscCircleFilled}
        boxSize={6}
        position="absolute"
        right="-10px"
        top="-1px"
        zIndex={10}
        color={connected ? "green.600" : "red.600"}
      />
      {!connected ? (
        <>
          <IconButton as={FaWallet} onClick={onOpen} isLoading={connecting} />
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
        </>
      ) : (
        <Menu isLazy>
          <MenuButton as={Box} {...IconButtonStyleProps} cursor="pointer">
            <IconButton as={FaWallet} isLoading={disconnecting} />
          </MenuButton>
          <Portal>
            <MenuList bg="black.200" color="white">
              <StyledMenuItem onClick={handleDisconnect}>
                Disconnect
              </StyledMenuItem>
              <StyledMenuItem addBorder={false}>Switch Wallet</StyledMenuItem>
            </MenuList>
          </Portal>
        </Menu>
      )}
    </Box>
  );
};

export default WalletButton;
