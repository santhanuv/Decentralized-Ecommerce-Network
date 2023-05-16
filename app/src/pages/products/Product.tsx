import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import useAnchor from "../../hooks/useAnchor";
import { useParams } from "react-router-dom";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ProductSchema } from "../../schema/ProductSchema";
import useArweave from "../../hooks/useArweave";
import ImagePreview from "../../components/ImagePreview";
import { useWallet } from "@solana/wallet-adapter-react";
import useProduct from "../../hooks/useProduct";
import {
  AddressFetchSchema,
  AddressInputSchema,
  UserSchema,
} from "../../schema/UserSchema";
import { AddressCard } from "../../components/AddressCard";
import useOrder from "../../hooks/useOrder";
import useUser from "../../hooks/useUser";
import InfoCard from "../../components/InfoCard";

const Product = () => {
  const { programs } = useAnchor();
  const { publicKey } = useWallet();
  const { getTransactionData } = useArweave();
  const { fetchProduct } = useProduct();
  const { productID } = useParams();
  const toast = useToast();
  const [quantity, setQuantity] = useState<string>("1");
  const [inventory, setInventory] = useState(1);
  const [data, setData] = useState<ProductSchema | null>(null);
  const [sellerProfile, setSellerProfile] = useState<UserSchema | null>(null);
  const [sellerProfileImage, setSellerProfileImage] = useState<string>("");
  const [images, setImages] = useState<string[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressFetchSchema | null>(null);
  const [showSellerProfile, setShowSellerProfile] = useState<boolean>(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { placeOrder } = useOrder();
  const { fetchUser } = useUser();

  const fetch = useCallback(async () => {
    if (productID) {
      try {
        if (!programs.productProgram)
          throw new Error("No product program found");

        const { data, images } = await fetchProduct(
          programs?.productProgram,
          new PublicKey(productID),
          getTransactionData
        );

        try {
          const sellerPubKey = new PublicKey(data.seller);
          if (!programs.userProgram) throw new Error("Invalid user program!");
          const { user, profile_image } = await fetchUser(
            programs.userProgram,
            sellerPubKey,
            getTransactionData
          );
          setSellerProfile(user);
          if (profile_image) setSellerProfileImage(profile_image);
        } catch (error) {
          console.error(`Unable to fetch seller profile\n${error}`);
        }

        setData(data);
        setImages(images);
      } catch (err) {
        console.error(`Unable to fetch product\n${err}`);
      }
    } else console.error("Invalid product ID");
  }, [
    fetchProduct,
    productID,
    getTransactionData,
    setImages,
    setData,
    programs,
  ]);

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (data) setInventory(data.inventory);
  }, [data]);

  const changeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value: string = e.currentTarget.value;

      if (Number(value) > inventory) {
        alert(`Only ${inventory} in stock`);
        value = `${inventory}`;
      }

      setQuantity(value);
    },
    [inventory]
  );

  const changeQuantity = useCallback(
    (action: Action) => {
      let alertMe = false;
      let alertMsg = "";
      if (action == Action.ADD) {
        setQuantity((prev) => {
          const prevNum = Number(prev);
          if (prevNum < inventory) return `${prevNum + 1}`;
          else {
            alertMe = true;
            alertMsg = `Sorry!! Only ${inventory} in stock.`;
            return prev;
          }
        });
      } else {
        setQuantity((prev) => {
          const prevNum = Number(prev);
          if (prevNum > 1) return `${prevNum - 1}`;
          else {
            alertMe = true;
            alertMsg = `Quatity should be atleast 1 to order!`;
            return prev;
          }
        });
      }
      if (alertMe) alert(alertMsg);
    },
    [inventory]
  );

  const buyHandler = useCallback(async () => {
    try {
      if (programs?.orderProgram && productID) {
        if (!publicKey) throw new Error("Your wallet is not connected!");
        if (!selectedAddress) throw new Error("Address not selected");

        const productKey = new PublicKey(productID);

        onClose();

        await placeOrder(
          programs.orderProgram,
          productKey,
          publicKey,
          selectedAddress.publicKey,
          quantity
        );

        toast({
          title: "Order Placed",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
      }
    } catch (err) {
      console.error(`ERROR:Unable to place the order\n${err}`);
      toast({
        title: "Failed to place order!",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  }, [programs, productID, quantity, selectedAddress]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="gray.800"
          color="whiteAlpha.900"
          maxW="800px"
        >
          <ModalHeader textAlign="center">
            {showSellerProfile ? "Seller Info" : "Delivery Address"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} w="800px">
            {showSellerProfile && sellerProfile ? (
              <InfoCard
                profile={sellerProfile}
                profileImage={sellerProfileImage}
              />
            ) : (
              <AddressCard
                headText={null}
                addDelBtn={false}
                addEditBtn={false}
                onClick={(_, address) => {
                  setSelectedAddress(address);
                }}
              />
            )}
          </ModalBody>
          {!showSellerProfile ? (
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={buyHandler}>
                Buy
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          ) : null}
        </ModalContent>
      </Modal>
      <Flex alignItems="center" justifyContent="center" marginTop="48px">
        <Box>
          <Flex gap="200px">
            <Box width="50%">
              <ImagePreview
                images={images}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                height="340px"
                maxImageW="460px"
                maxImageH="320px"
              />
            </Box>
            <Box>
              <Heading size="xl">{data?.title}</Heading>
              <Text fontSize="lg" marginTop="16px">
                {data?.description}
              </Text>
              <Heading size="xl" marginTop="24px" color="blue.400">
                {data?.price ? data.price / LAMPORTS_PER_SOL : 0} SOL
              </Heading>
              <FormControl
                as={Flex}
                gap="32px"
                alignItems="center"
                marginTop="32px"
                maxWidth="300px"
              >
                <FormLabel fontSize="lg">Quantity</FormLabel>
                <NumberInput value={quantity} min={1} max={inventory}>
                  <NumberInputField onChange={(e) => changeInput(e)} />
                  <NumberInputStepper>
                    <NumberIncrementStepper
                      onClick={() => changeQuantity(Action.ADD)}
                      color="white"
                    />
                    <NumberDecrementStepper
                      onClick={() => changeQuantity(Action.SUB)}
                      color="white"
                    />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <Flex marginTop="24px" gap="32px" maxWidth="300px">
                {/* <Button
                  variant="outline"
                  leftIcon={<FaRegHeart />}
                  _hover={{ bg: "gray.700" }}
                >
                  Wishlist
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<FaShoppingCart />}
                  _hover={{ bg: "gray.700" }}
                >
                  Add to Cart
                </Button> */}
                <Button
                  onClick={() => {
                    setShowSellerProfile(true);
                    onOpen();
                  }}
                >
                  Seller
                </Button>
              </Flex>
              <Button
                colorScheme="facebook"
                maxWidth="300px"
                w="100%"
                marginTop="28px"
                onClick={() => {
                  setShowSellerProfile(false);
                  onOpen();
                }}
              >
                Buy Now
              </Button>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

enum Action {
  ADD,
  SUB,
}

export default Product;
