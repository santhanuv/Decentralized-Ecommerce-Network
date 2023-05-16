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
import { useCallback, useMemo, useState } from "react";
import { useUserContext } from "../../context/UserContextProvider";

const UserTab = () => {
  const { publicKey } = useWallet();
  const { userData, profileImage, balance } = useUserContext();

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async () => {
    if (base58) {
      await navigator.clipboard.writeText(base58);
      setCopied(true);
      setTimeout(() => setCopied(false), 400);
    }
  }, [base58]);

  return (
    <Box marginTop="24px">
      <Flex gap="32px" bg="gray.700" p="8" borderRadius="12px 12px 0 0">
        <Wrap>
          <WrapItem>
            <Avatar
              size="2xl"
              name={userData?.firstname ? userData.firstname : "Anonymous"}
              src={profileImage}
            />
          </WrapItem>
        </Wrap>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="start"
          gap="1"
        >
          <Flex>
            {userData?.firstname && userData?.lastname ? (
              <Text fontSize="xl">
                {userData?.firstname} {userData?.lastname}
              </Text>
            ) : (
              <Text>Anonymous</Text>
            )}
          </Flex>
          <Tooltip
            label={copied ? "copied" : "copy"}
            placement="bottom"
            fontSize="lg"
          >
            <Button
              variant="unstyled"
              textAlign="start"
              onClick={copyToClipboard}
            >
              {`${base58?.slice(0, 4)}..${base58?.slice(-4)}`}
            </Button>
          </Tooltip>
        </Flex>
        <Spacer />
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="end"
          gap="1"
        >
          <Heading fontSize="2xl">Balance</Heading>
          <Text fontSize="xl" color="blue.300">
            {balance ? `${balance} SOL` : 0}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default UserTab;
