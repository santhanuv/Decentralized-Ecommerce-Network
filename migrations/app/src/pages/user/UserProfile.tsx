import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  Avatar,
  Wrap,
  WrapItem,
  Flex,
  VStack,
  Text,
  Heading,
  Container,
  Tooltip,
  Button,
  Spacer,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import UserMarket from "./UserMarket";

const UserProfile = () => {
  const { publicKey } = useWallet();

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
    <Box marginTop="32px">
      <Flex gap="32px" bg="gray.700" p="8" borderRadius="12px 12px 0 0">
        <Wrap>
          <WrapItem>
            <Avatar size="2xl" name="Santhanu" />
          </WrapItem>
        </Wrap>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="start"
          gap="1"
        >
          <Flex>
            <Text fontSize="xl">Fristname Lastname</Text>
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
            Balance
          </Text>
        </Flex>
      </Flex>

      <Tabs colorScheme={"cyan"}>
        <TabList
          bg="gray.900"
          borderRadius="0 0 12px 12px"
          px="8"
          py="4"
          color="white"
          borderBottom="0"
        >
          <Tab>Orders</Tab>
          <Tab>Market</Tab>
          <Tab>Order History</Tab>
          <Tab>Wishlist</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>One</p>
          </TabPanel>
          <TabPanel>
            <UserMarket />
          </TabPanel>
          <TabPanel>
            <p>Three</p>
          </TabPanel>
          <TabPanel>
            <p>Four</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default UserProfile;
