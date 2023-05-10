import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useCallback, useEffect, useState } from "react";
import { MdDelete, MdEdit, MdError } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import MarketCard from "../../components/MarketCard";
import ProductCard from "../../components/ProductCard";
import { AnchorPrograms } from "../../context/AnchorContextProvider";
import useAnchor from "../../hooks/useAnchor";
import useArweave from "../../hooks/useArweave";
import { MarketSchema } from "../../schema/MarketSchema";
import { ProductFetchSchema } from "../../schema/ProductSchema";
import timestampToDate from "../../utils/timestampToDate";

const MarketDetails = () => {
  const { marketID } = useParams();
  const { programs } = useAnchor();
  const { publicKey } = useWallet();
  const toast = useToast();
  const navigate = useNavigate();
  const { getTransactionData } = useArweave();
  const [cover, setCover] = useState<string>("");
  const [data, setData] = useState<MarketSchema | null>(null);
  const [products, setProducts] = useState<ProductFetchSchema | []>([]);

  const fetchMarketData = useCallback(
    async (programs: AnchorPrograms, marketID: PublicKey) => {
      try {
        const data = await programs?.marketProgram?.account.market.fetch(
          marketID
        );

        if (data?.coverImage) {
          const ardata = await getTransactionData(data.coverImage as string);
          const cover = ardata.cover_image as string;

          setCover(cover);
        }

        setData(data as MarketSchema);
      } catch (err) {
        console.error(err);
      }
    },
    [getTransactionData]
  );

  const fetchProduct = useCallback(
    async (programs: AnchorPrograms, marketID: PublicKey) => {
      const rawProducts = (await programs.productProgram?.account.product.all([
        {
          memcmp: {
            offset: 8,
            bytes: marketID.toBase58(),
          },
        },
      ])) as ProductFetchSchema;

      const products = (await Promise.all(
        rawProducts.map(async (product) => {
          const ardata = await getTransactionData(product.account.storageId);
          return {
            ...product,
            account: {
              ...product.account,
              timestamp: product.account.timestamp.toString(),
            },
            images: ardata.images,
            details: ardata.details,
          };
        })
      )) as ProductFetchSchema;

      setProducts(products);
    },
    [programs]
  );

  useEffect(() => {
    if (programs && marketID) {
      const marketKey = new PublicKey(marketID);
      fetchMarketData(programs, marketKey);
      fetchProduct(programs, marketKey);
    }
  }, []);

  const deleteMarket = useCallback(async () => {
    try {
      if (programs?.marketProgram && marketID && publicKey) {
        await programs.marketProgram.methods
          .deleteMarket()
          .accounts({
            marketAccount: new PublicKey(marketID),
            authAccount: publicKey,
          })
          .rpc();

        toast({
          title: "Market Deleted!",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
        navigate("/profile");
      } else throw Error("Invalid market id or public key of user");
    } catch (err) {
      console.error(`ERROR: Unable to delete market\n${err}`);
    }
  }, [programs, marketID, publicKey]);

  return (
    <Box marginTop="32px">
      <Box
        border="1px solid white"
        padding="16px 32px"
        borderRadius="8px"
        background="gray.800"
      >
        <Flex gap="24px">
          <Image src={cover} alt="cover-image" w="200px" />
          <Stack spacing="24px" paddingBottom="8px" w="70%">
            <Heading size="lg">{data?.name}</Heading>
            <Text w="50%">{data?.description}</Text>
            <Spacer />
            <Text size="md" color="gray.500">
              Created At:{" "}
              {timestampToDate(data?.createdAt)?.toLocaleDateString("en-GB")}
            </Text>
          </Stack>
          <Spacer />
          <VStack gap="16px">
            <Button
              as={Link}
              fontSize="28px"
              color="whiteAlpha.800"
              variant="solid"
              to={`/market/update/${marketID}`}
            >
              <MdEdit />
            </Button>
            <Button
              fontSize="28px"
              color="red.400"
              variant="solid"
              _hover={{ color: "red.500" }}
              onClick={deleteMarket}
            >
              <MdDelete />
            </Button>
          </VStack>
        </Flex>
      </Box>

      <Flex
        alignItems="center"
        position="sticky"
        top="0"
        padding="24px 0px"
        zIndex="10"
        background="black.200"
      >
        <Heading size="lg">Products</Heading>
        <Spacer />
        <Button
          as={Link}
          to={`/market/${marketID}/create-product`}
          colorScheme="green"
        >
          Create Product
        </Button>
      </Flex>
      {products.length ? (
        <SimpleGrid
          marginTop="24px"
          gridTemplateColumns="repeat(auto-fit,minmax(280px, 0fr))"
          spacingX="5"
          spacingY="10"
        >
          {products.map((product) => {
            return (
              <ProductCard
                key={product.publicKey.toString()}
                image={product?.images && product?.images[0]}
                title={product.account.title}
                description={product.account.description}
                price={product.account.price}
                rating={product.account.rating}
                pubKey={product.publicKey}
                toLink={`/market/${marketID}/product/${product.publicKey.toString()}`}
                removeAddToCart={true}
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
          <Text fontSize="lg">You don't have any Products!</Text>
        </Flex>
      )}
    </Box>
  );
};

export default MarketDetails;
