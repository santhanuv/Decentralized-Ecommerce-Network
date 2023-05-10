import React from "react";
import { Wallet } from "@solana/wallet-adapter-react";
import { WalletName, WalletReadyState } from "@solana/wallet-adapter-base";
import { Badge, Button, Image, Spacer } from "@chakra-ui/react";

const WalletItem = ({ wallet, onClick }: WalletItemProps) => {
  return (
    <Button
      _hover={{ bg: "gray.700" }}
      onClick={(e) => onClick(e, wallet.adapter.name)}
      leftIcon={
        <Image
          boxSize="25px"
          src={wallet.adapter.icon}
          alt={wallet.adapter.name}
        />
      }
      w="100%"
      p="4"
      variant="ghost"
    >
      <span>{wallet.adapter.name}</span>
      <Spacer />

      {wallet.readyState === WalletReadyState.Installed && (
        <Badge colorScheme="green" variant="subtle">
          Installed
        </Badge>
      )}
    </Button>
  );
};

type WalletItemProps = {
  wallet: Wallet;
  onClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    walletName: WalletName
  ) => void;
};

export default WalletItem;
