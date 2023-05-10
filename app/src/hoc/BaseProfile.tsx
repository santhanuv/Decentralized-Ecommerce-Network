import {
  Box,
  Avatar,
  Wrap,
  WrapItem,
  Flex,
  Text,
  Heading,
  Tooltip,
  Button,
  Spacer,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import useAnchor from "../hooks/useAnchor";
import useArweave from "../hooks/useArweave";
import { UserSchema } from "../schema/UserSchema";
import { utils as anchorUtils } from "@coral-xyz/anchor";
import { UserContextProvider } from "../context/UserContextProvider";
import UserTab from "../components/layout/UserTab";

const BaseProfile = ({ children }: { children: ReactElement }) => {
  return (
    <UserContextProvider>
      <UserTab />
      {children}
    </UserContextProvider>
  );
};

export default BaseProfile;
