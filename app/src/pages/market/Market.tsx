import { Box, Button, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import useAnchor from "../../hooks/useAnchor";
import useArweave from "../../hooks/useArweave";
import { MarketFetchSchema, MarketSchema } from "../../schema/MarketSchema";
import MarketCard from "../../components/MarketCard";
import { useWallet } from "@solana/wallet-adapter-react";
import { MdError } from "react-icons/md";

const Market = () => {
  const [markets, setMarkets] = useState<MarketFetchSchema | []>([]);
  const { programs } = useAnchor();
  const { publicKey } = useWallet();
  const { getTransactionData } = useArweave();

  const getMarket = useCallback(async () => {
    try {
      if (programs?.marketProgram && publicKey) {
        const markets = (await programs.marketProgram.account.market.all([
          {
            memcmp: {
              offset: 8,
              bytes: publicKey.toBase58(),
            },
          },
        ])) as unknown as Omit<MarketFetchSchema, "cover_image">;

        // Convert the unixtimestamp to string for easy conversion of timestamp to date
        const data = (await Promise.all(
          markets.map(async (market) => {
            const ardata = await getTransactionData(market.account.coverImage);
            return {
              ...market,
              account: {
                ...market.account,
                createdAt: market.account.createdAt.toString(),
              },
              cover_image: ardata.cover_image,
            };
          })
        )) as MarketFetchSchema;

        setMarkets(data);
      }
    } catch (err) {
      console.error(`ERROR: Unable to get market information\n${err}`);
    }
  }, [programs, publicKey, getTransactionData, setMarkets]);

  useEffect(() => {
    getMarket();
  }, []);

  return (
    <Box marginTop="16px">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg">Your Markets</Heading>
        <Button as={Link} colorScheme="green" to="/create-market">
          Create Market
        </Button>
      </Flex>

      {markets.length ? (
        <SimpleGrid
          marginTop="24px"
          spacingX="5"
          spacingY="10"
          gridTemplateColumns="repeat(auto-fit,minmax(240px, 0fr))"
        >
          {markets.map((market) => {
            return (
              <MarketCard
                key={market.publicKey.toBase58()}
                name={market.account.name}
                coverImage={market.cover_image}
                marketID={market.publicKey.toString()}
              />
            );
          })}
        </SimpleGrid>
      ) : (
        <Flex
          alignItems="center"
          marginTop="24px"
          gap="16px"
          justifyContent="center"
        >
          <Box>
            <MdError fontSize="32px" />
          </Box>
          <Text fontSize="lg">You don't have any markets!</Text>
        </Flex>
      )}
    </Box>
  );
};

export default Market;
