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
  IconButton,
  Divider,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useMemo, useState } from "react";
import { ProductInputSchema } from "../../schema/ProductSchema";
import useAnchor from "../../hooks/useAnchor";
import { Keypair } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import getStringSpace from "../../utils/getStringSpace";
import { BN } from "@project-serum/anchor";
import ImagePreview from "../../components/ImagePreview";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useArweave from "../../hooks/useArweave";

const initialData: ProductInputSchema = {
  price: "",
  inventory: "",
  title: "",
  description: "",
  details: "",
  image: null,
};

const DISCRIMINATOR = 8;
const PUBKEY = 32;
const PRICE = 8;
const RATING = 8;
const INVENTORY = 4;

const CreateProduct = () => {
  const FIXED_ACCOUNT_SPACE = useMemo(
    () => DISCRIMINATOR + PUBKEY + PRICE + RATING + INVENTORY,
    []
  );
  const [newProduct, setNewProduct] = useState(initialData);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [productImages, SetProductImages] = useState<FileList | null>(null);
  const { program } = useAnchor();
  const { publicKey } = useWallet();
  const { submitTransaction } = useArweave();

  const calculateSpace = useCallback((data: ProductInputSchema) => {
    return (
      FIXED_ACCOUNT_SPACE +
      getStringSpace(data.title) +
      getStringSpace(data.description) +
      getStringSpace(data.details)
    );
  }, []);

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
      const files = e.target.files;

      SetProductImages((prev) => {
        if (files) {
          const newFileList = (prev ? [...prev, ...files] : files) as FileList;
          return newFileList;
        } else return prev;
      });
    },
    []
  );

  const removeImage = useCallback(() => {
    if (productImages?.length && productImages.length > selectedIndex) {
      const newList = [...productImages];
      newList.splice(selectedIndex, 1);
      SetProductImages(newList as unknown as FileList);
    }
  }, [productImages, selectedIndex]);

  const imageToUint8 = async (image: File) => {
    const imageBuff = await image.arrayBuffer();
    return Promise.resolve(new Uint8Array(imageBuff));
  };

  type ArweaveProductStorage = {
    images: Uint8Array[];
    details: JSON | String;
  };
  const storeProductData = async (productDetails: JSON | string) => {
    if (productImages) {
      const imagesArr = await Promise.all(
        [...productImages].map(async (image) => imageToUint8(image))
      );

      const data: ArweaveProductStorage = {
        images: imagesArr,
        details: productDetails,
      };

      return await submitTransaction(JSON.stringify(data));
    }
  };

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>, data: ProductInputSchema) => {
      // Validate Data;
      e.preventDefault();

      const convertedData = {
        ...data,
        price: Number.parseInt(data.price),
        inventory: Number.parseInt(data.inventory),
      };

      console.log(convertedData);
      const img_txid = await storeProductData(convertedData.details);

      console.log(img_txid);
      console.log(img_txid?.length);
      return;
      const productKeyPair = Keypair.generate();

      try {
        const result = await program.methods
          .createProduct(
            data.price,
            0,
            data.inventory,
            data.title,
            data.description,
            data.details,
            new BN(calculateSpace(data))
          )
          .accounts({
            product: productKeyPair.publicKey,
          })
          .signers([productKeyPair])
          .rpc();
        console.log("result");
        alert("Product Created");
        setNewProduct(initialData);
      } catch (e) {
        console.error(e);
      }
    },
    []
  );

  return (
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
                  placeholder="price"
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
  );
};

export default CreateProduct;
