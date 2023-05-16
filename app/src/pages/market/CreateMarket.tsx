import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { MarketInputSchema } from "../../schema/MarketSchema";
import ProgressBar from "../../components/ProgressBar";
import ImagePreview from "../../components/ImagePreview";
import useArweave from "../../hooks/useArweave";
import { useWallet } from "@solana/wallet-adapter-react";
import useAnchor from "../../hooks/useAnchor";
import { Keypair } from "@solana/web3.js";

const initMarketData: MarketInputSchema = {
  name: "",
  description: "",
  cover_image: "",
};

const CreateMarket = () => {
  const [marketData, setMarketData] =
    useState<MarketInputSchema>(initMarketData);

  const [showProgress] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const { programs } = useAnchor();
  const { publicKey } = useWallet();
  const toast = useToast();
  const navigate = useNavigate();

  const { submitTransaction } = useArweave();

  const onDataChange = useCallback(
    (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const name = e.currentTarget.name;
      const value = e.currentTarget.value;

      if (name === "description" && marketData.description.length > 280) {
        console.log("Error characters should be less than 280");
      }

      setMarketData((prev) => ({ ...prev, [name]: value }));
    },
    [setMarketData, marketData]
  );

  const onImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files: File[] | null = e.target.files ? [...e.target.files] : null;

      files?.map((file) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          setMarketData((prev) => ({
            ...prev,
            cover_image: reader.result as string,
          }));
        };
      });
    },
    [setMarketData]
  );

  const removeImage = useCallback(() => {
    if (marketData?.cover_image) {
      setMarketData((prev) => ({ ...prev, cover_image: "" }));
    }
  }, [marketData]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>, data: any) => {
      e.preventDefault();

      let txid = null;
      try {
        if (data.cover_image && data.cover_image.length > 0) {
          const ardata = { cover_image: data.cover_image };

          txid = await submitTransaction(
            JSON.stringify(ardata),
            setProgressPercent
          );
        }

        const marketKeyPair = Keypair.generate();

        if (!publicKey) throw Error("Invalid Public Key for signer");
        await programs?.marketProgram?.methods
          .createMarket(data.name, data.description, `${txid}`)
          .accounts({
            marketAccount: marketKeyPair.publicKey,
            authAccount: publicKey,
          })
          .signers([marketKeyPair])
          .rpc();
        toast({
          title: "Market Created",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
        navigate(`/market/${marketKeyPair.publicKey}`);
      } catch (err) {
        console.error(`ERROR: Unable to create market\n${err}`);
        toast({
          title: "Failed to create market!",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    },
    [programs, publicKey, submitTransaction]
  );

  return (
    <>
      <ProgressBar
        showProgress={showProgress}
        progressPercent={progressPercent}
        setProgressPercent={setProgressPercent}
      />
      <Box w="100%">
        <Heading size="lg" textAlign="center" marginY="30px">
          Create Market
        </Heading>
        <Flex justifyContent="center">
          <Box w="70%">
            <form onSubmit={(e) => onSubmit(e, marketData)}>
              <Flex alignItems="center">
                <FormControl
                  width="400px"
                  border="1px solid"
                  borderColor="gray.600"
                  borderRadius="2xl"
                  height="fit-content"
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <FormLabel
                      htmlFor="product-image"
                      margin="0"
                      py="16px"
                      px="16px"
                      w="fit-content"
                      cursor="pointer"
                      _hover={{ color: "green.400" }}
                    >
                      <FaPlus fontSize="18px" />
                    </FormLabel>
                    <Text fontWeight="bold">Upload Image</Text>
                    <Button
                      variant="unstyled"
                      display="flex"
                      py="16px"
                      px="16px"
                      w="fit-content"
                      cursor="pointer"
                      _hover={{ color: "red.400" }}
                      onClick={removeImage}
                    >
                      <MdDelete fontSize="23px" />
                    </Button>
                  </Flex>
                  <Flex
                    w="400px"
                    h="400px"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {marketData.cover_image ? (
                      <img
                        src={
                          marketData.cover_image
                            ? marketData.cover_image
                            : undefined
                        }
                        alt={"cover-image"}
                      />
                    ) : (
                      <Text>Upload Your Cover Image</Text>
                    )}
                  </Flex>
                  <Divider />
                  <Input
                    display="none"
                    marginTop="24px"
                    type="file"
                    accept="image/*"
                    name="image"
                    id="product-image"
                    value={""}
                    onChange={onImageUpload}
                  />
                </FormControl>
                <VStack
                  height="500px"
                  width="50%"
                  pl="64px"
                  justifyContent="center"
                  gap="24px"
                >
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      onChange={(e) => onDataChange(e)}
                      placeholder="name"
                      value={marketData.name}
                      name="name"
                      id="name"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      onChange={(e) => onDataChange(e)}
                      resize="none"
                      placeholder="description in less than 280 words"
                      value={marketData.description}
                      name="description"
                      id="description"
                    />
                  </FormControl>
                  <Box w="100%">
                    <Button
                      type="submit"
                      colorScheme="green"
                      w="100%"
                      marginTop="32px"
                    >
                      Create
                    </Button>
                  </Box>
                </VStack>
              </Flex>
            </form>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default CreateMarket;
