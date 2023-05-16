import {
  Flex,
  Card,
  CardBody,
  Image,
  Heading,
  Text,
  CardFooter,
  Button,
  Spacer,
  Box,
  useToast,
  ModalFooter,
  ModalContent,
  ModalBody,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  NumberInputField,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputStepper,
  useDisclosure,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import useAnchor from "../hooks/useAnchor";
import useCart from "../hooks/useCart";

const PRODUCT_DESCRIPTION_MAX_LEN = 60;

const ProductCard = ({
  id,
  image,
  title,
  description,
  inventory,
  price,
  rating,
  pubKey,
  toLink,
  removeAddToCart = false,
}: ProductCardPropsType) => {
  const { publicKey } = useWallet();
  const { programs } = useAnchor();
  const { addToCart } = useCart();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [quantity, setQuantity] = useState<number>(1);

  const addToCartHandle = useCallback(async () => {
    try {
     if(!publicKey) throw new Error("Wallet not connected!");
     if(!programs.userProgram) throw new Error("Invalid user program!"); 

     await addToCart(programs.userProgram, id, publicKey, quantity);

    toast({
      title: "Product added to cart",
      status: "success",
      isClosable: true,
      duration: 3000,
    });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to add product to cart!",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    } 

    onClose();
  }, [publicKey, programs, toast, addToCart, quantity])

  const changeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value: string = e.currentTarget.value;

      if (Number(value) > inventory) {
        alert(`Only ${inventory} in stock`);
        value = `${inventory}`;
      }

      setQuantity(Number.parseInt(value));
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
          if (prevNum < inventory) return prevNum + 1;
          else {
            alertMe = true;
            alertMsg = `Sorry!! Only ${inventory} in stock.`;
            return prev;
          }
        });
      } else {
        setQuantity((prev) => {
          const prevNum = Number(prev);
          if (prevNum > 1) return prevNum - 1;
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


  return (
    <>
    
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="gray.800"
          color="whiteAlpha.900"
          maxW="800px"
        >
          <ModalHeader>Accept Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} w="800px">
            <form>
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
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={addToCartHandle}
            >
              Add
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    <Box>
      <Card w="280px" bg="none" border="none" borderRadius="8px 8px 0 0">
        <CardBody
          as={Link} to={toLink ? toLink : `/buy/${pubKey}`}
          color="white"
          bg="#111317"
          borderRadius="8px 8px 0 0"
          border="1px solid gray"
        >
          <Flex w="240px" h="240px" justifyContent="center" alignItems="center">
            <Image src={image} alt="Product image" maxHeight="200px" />
          </Flex>
          <Flex flexDirection="column" gap="2" height="150px" marginTop="8px">
            <Text fontSize="sm">{rating ? rating : "Rating"}</Text>
            <Heading size="sm" textTransform="capitalize">{title}</Heading>
            <Text fontSize="sm">
              {description.length > PRODUCT_DESCRIPTION_MAX_LEN
                ? `${description.slice(0, PRODUCT_DESCRIPTION_MAX_LEN)}...`
                : description}
            </Text>
            <Spacer />
            <Flex justifyContent="space-between" marginTop="auto">
              <Text fontSize="xs">In Stock</Text>
              <Heading color="blue.200" fontSize="18px">
                {`${(price / LAMPORTS_PER_SOL).toFixed(3)} SOL`}
              </Heading>
            </Flex>
          </Flex>
        </CardBody>
        <CardFooter padding="0" h="40px">
          {!removeAddToCart ? (
            <Button
              w="100%"
              p="0"
              fontSize="md"
              borderRadius="0 0 8px 8px"
              colorScheme="facebook"
              onClick={onOpen}
            >
              Add To Cart
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </Box>

    </>
  );
};

type ProductCardPropsType = {
  id: PublicKey;
  image: string;
  title: string;
  description: string;
  price: number;
  inventory: number;
  rating: number;
  pubKey: PublicKey;
  toLink?: string;
  removeAddToCart?: boolean;
};

enum Action {
  ADD,
  SUB,
}

export default ProductCard;
