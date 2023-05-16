import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  VStack,
  Flex,
  Divider,
  Text,
  useToast,
} from "@chakra-ui/react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import React, { useCallback, useState } from "react";
import { ProductInputSchema } from "../../schema/ProductSchema";
import useAnchor from "../../hooks/useAnchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import ImagePreview from "../../components/ImagePreview";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useArweave from "../../hooks/useArweave";
import ProgressBar from "../../components/ProgressBar";
import { useNavigate, useParams } from "react-router-dom";

const initialData: ProductInputSchema = {
  price: "",
  inventory: "",
  title: "",
  description: "",
  details: "",
};

const CreateProduct = () => {
  const [newProduct, setNewProduct] = useState(initialData);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [productImages, setProductImages] = useState<string[] | null>(null);
  const { programs } = useAnchor();
  const toast = useToast();
  const navigate = useNavigate();
  const { submitTransaction } = useArweave();
  const { marketID } = useParams();
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const { publicKey } = useWallet();

  const onDataChange = useCallback(
    (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const name = e.currentTarget.name;
      const value = e.currentTarget.value;

      if (name === "description" && newProduct.description.length > 120) {
        console.log("Error characters should be less than 120");
      }

      setNewProduct((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const onImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files: File[] | null = e.target.files ? [...e.target.files] : null;

      files?.map((file) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          setProductImages((prev) => {
            if (prev) {
              return [...prev, reader.result as string];
            } else {
              return [reader.result as string];
            }
          });
        };
      });
    },
    []
  );

  const removeImage = useCallback(() => {
    if (productImages?.length && productImages.length > selectedIndex) {
      setProductImages((prev) => {
        if (prev) {
          prev.splice(selectedIndex, 1);
          if (prev.length === 0) {
            setSelectedIndex(0);
            return null;
          } else {
            setSelectedIndex((prev) => prev - 1);
            return prev;
          }
        } else {
          return null;
        }
      });
    }
  }, [productImages, selectedIndex]);

  type ArweaveProductStorage = {
    details: JSON | String;
    images?: string[];
  };
  const storeProductData = useCallback(
    async (productDetails: JSON | string, productImages: string[] | null) => {
      const data: ArweaveProductStorage = {
        details: productDetails,
      };

      if (productImages) {
        data["images"] = productImages;
      } else data["images"] = [];

      console.log("Sending data: ", data);
      return await submitTransaction(JSON.stringify(data), setProgressPercent);
    },
    [submitTransaction]
  );

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>, data: ProductInputSchema) => {
      // Validate Data;
      e.preventDefault();

      const convertedData = {
        ...data,
        price: Number.parseInt(data.price),
        inventory: Number.parseInt(data.inventory),
      };

      setShowProgress(true);
      const img_txid = await storeProductData(
        convertedData.details,
        productImages
      );
      setShowProgress(false);

      const productKeyPair = Keypair.generate();
      try {
        if (!publicKey) throw Error("Wallet not connected!");
        if (!marketID) throw Error("Invalid market ID");

        const marketData = (await programs?.marketProgram?.account.market.fetch(
          marketID
        )) as { [index: string]: any };

        if (marketData.owner.toString() != publicKey.toString()) {
          throw Error("Market is not owned by the user");
        }

        const priceInLamports = new BN(
          Math.round(Number.parseFloat(data.price) * LAMPORTS_PER_SOL)
        );

        console.log(priceInLamports);
        const result = await programs?.productProgram?.methods
          .createProduct(
            priceInLamports,
            0,
            data.inventory,
            data.title,
            data.description,
            img_txid
          )
          .accounts({
            product: productKeyPair.publicKey,
            seller: publicKey,
            market: new PublicKey(marketID),
          })
          .signers([productKeyPair])
          .rpc();
        console.log("result", result);
        toast({
          title: "Product Created!",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
        navigate(`/market/${marketID}`);
      } catch (e) {
        console.log("Progress off");
        setShowProgress(false);
        setProgressPercent(0);
        console.error(e);
        toast({
          title: "Failed to create product!",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    },
    [storeProductData, productImages, setShowProgress, initialData, marketID]
  );

  return (
    <>
      <ProgressBar
        showProgress={showProgress}
        progressPercent={progressPercent}
        setProgressPercent={setProgressPercent}
      />
      <Flex marginTop="32px" flexDirection="column" alignItems="center">
        <Heading size="lg">Create Product</Heading>
        <Box width="60%" marginTop="32px">
          <form onSubmit={(e) => onSubmit(e, newProduct)}>
            <Flex alignItems="center">
              <FormControl
                width="60%"
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
                  <Text fontWeight="bold">Upload Images</Text>
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
                <Divider />
                <ImagePreview
                  images={productImages}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={setSelectedIndex}
                  height="340px"
                  maxImageW="460px"
                  maxImageH="320px"
                />
                <Input
                  display="none"
                  marginTop="24px"
                  type="file"
                  accept="image/*"
                  name="image"
                  id="product-image"
                  value={""}
                  multiple
                  onChange={onImageUpload}
                />
              </FormControl>
              <VStack
                height="600px"
                width="50%"
                pl="64px"
                justifyContent="space-evenly"
              >
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    onChange={(e) => onDataChange(e)}
                    placeholder="title"
                    value={newProduct.title}
                    name="title"
                    id="title"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    onChange={(e) => onDataChange(e)}
                    resize="none"
                    placeholder="description in less than 120 words"
                    value={newProduct.description}
                    name="description"
                    id="description"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Price</FormLabel>
                  <Input
                    onChange={(e) => onDataChange(e)}
                    placeholder="price in sols"
                    value={newProduct.price}
                    name="price"
                    id="price"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Inventory</FormLabel>
                  <Input
                    onChange={(e) => onDataChange(e)}
                    placeholder="inventory"
                    value={newProduct.inventory}
                    name="inventory"
                    id="inventory"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Details</FormLabel>
                  <Textarea
                    onChange={(e) => onDataChange(e)}
                    resize="vertical"
                    placeholder="details"
                    value={newProduct.details}
                    name="details"
                    id="details"
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
    </>
  );
};

export default CreateProduct;
