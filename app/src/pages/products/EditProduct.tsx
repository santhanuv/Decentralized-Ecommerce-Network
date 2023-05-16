import React, { useCallback, useState, useEffect } from "react";
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
import { ProductInputSchema, ProductSchema } from "../../schema/ProductSchema";
import useAnchor from "../../hooks/useAnchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import ImagePreview from "../../components/ImagePreview";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useArweave from "../../hooks/useArweave";
import ProgressBar from "../../components/ProgressBar";
import { useNavigate, useParams } from "react-router-dom";
import { AnchorPrograms } from "../../context/AnchorContextProvider";
import useProduct from "../../hooks/useProduct";

const initialData: ProductInputSchema = {
  price: "",
  inventory: "",
  title: "",
  description: "",
  details: "",
};

const EditProduct = () => {
  const [product, setProduct] = useState<ProductInputSchema>(initialData);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [productImages, setProductImages] = useState<string[] | null>(null);
  const { programs } = useAnchor();
  const navigate = useNavigate();
  const toast = useToast();
  const { fetchProduct } = useProduct();
  const { submitTransaction, getTransactionData } = useArweave();
  const { marketID, productID } = useParams();
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const { publicKey } = useWallet();

  const exfetchProduct = useCallback(
    async (programs: AnchorPrograms, productID: PublicKey) => {
      try {
        if (!productID) throw Error("Invalid product ID");
        const product = (await programs.productProgram?.account.product.fetch(
          productID
        )) as ProductSchema;

        const txData = await getTransactionData(product.storageId);

        const editProduct: ProductInputSchema = {
          price: product.price.toString(),
          inventory: product.inventory.toString(),
          title: product.title,
          description: product.description,
          details: txData.details,
        };
        setProductImages(txData.images);
        setProduct(editProduct);
      } catch (err) {
        console.error(`ERROR: Unable to update product\n${err}`);
      }
    },
    [programs]
  );

  const fetch = useCallback(async () => {
    if (programs.productProgram && productID) {
      const { data, images, details } = await fetchProduct(
        programs.productProgram,
        new PublicKey(productID),
        getTransactionData
      );

      const editProduct: ProductInputSchema = {
        price: (data.price / LAMPORTS_PER_SOL).toString(),
        inventory: data.inventory.toString(),
        title: data.title,
        description: data.description,
        details,
      };
      setProductImages(images);
      setProduct(editProduct);
    }
  }, [programs, productID, getTransactionData, setProduct, setProductImages]);

  useEffect(() => {
    fetch();
  }, []);

  const onDataChange = useCallback(
    (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const name = e.currentTarget.name;
      const value = e.currentTarget.value;

      if (name === "description" && product.description.length > 120) {
        console.log("Error characters should be less than 120");
      }

      setProduct((prev) => ({ ...prev, [name]: value }));
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
      const txid = await storeProductData(convertedData.details, productImages);
      setShowProgress(false);

      console.log(txid);
      try {
        if (!publicKey) throw Error("Wallet not connected!");
        if (!productID) throw Error("Invalid market ID");

        const productKey = new PublicKey(productID);

        const result = await programs?.productProgram?.methods
          .updateProduct(
            data.price,
            data.inventory,
            data.title,
            data.description,
            txid
          )
          .accounts({
            product: productKey,
            seller: publicKey,
          })
          .signers([])
          .rpc();
        console.log("result", result);
        toast({
          title: "Product Upated",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
      } catch (e) {
        console.log("Progress off");
        setShowProgress(false);
        setProgressPercent(0);
        console.error(e);
        toast({
          title: "Failed to update product!",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    },
    [storeProductData, productImages, setShowProgress, marketID]
  );

  const deleteProduct = useCallback(async () => {
    if (programs?.productProgram && productID && publicKey) {
      try {
        const productKey = new PublicKey(productID);
        await programs.productProgram.methods
          .deleteProduct()
          .accounts({
            product: productKey,
            seller: publicKey,
          })
          .rpc();

        toast({
          title: "Product Deleted",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
        navigate(`/market/${marketID}`);
      } catch (err) {
        console.error(`ERROR: Unable to delete product\n${err}`);
        toast({
          title: "Failed to delete product!",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    }
  }, [programs, productID, publicKey, marketID]);

  return (
    <>
      <ProgressBar
        showProgress={showProgress}
        progressPercent={progressPercent}
        setProgressPercent={setProgressPercent}
      />
      <Flex marginTop="32px" flexDirection="column" alignItems="center">
        <Heading size="lg">Edit Product</Heading>
        <Box width="60%" marginTop="32px">
          <form onSubmit={(e) => onSubmit(e, product)}>
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
                    value={product.title}
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
                    value={product.description}
                    name="description"
                    id="description"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Price</FormLabel>
                  <Input
                    onChange={(e) => onDataChange(e)}
                    placeholder="price"
                    value={product.price}
                    name="price"
                    id="price"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Inventory</FormLabel>
                  <Input
                    onChange={(e) => onDataChange(e)}
                    placeholder="inventory"
                    value={product.inventory}
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
                    value={product.details}
                    name="details"
                    id="details"
                  />
                </FormControl>
                <Flex w="100%" gap="24px">
                  <Button
                    type="submit"
                    colorScheme="green"
                    w="80%"
                    marginTop="32px"
                  >
                    Update
                  </Button>
                  <Button
                    colorScheme="red"
                    w="20%"
                    marginTop="32px"
                    fontSize="22px"
                    type="button"
                    onClick={deleteProduct}
                  >
                    <MdDelete />
                  </Button>
                </Flex>
              </VStack>
            </Flex>
          </form>
        </Box>
      </Flex>
    </>
  );
};

export default EditProduct;
