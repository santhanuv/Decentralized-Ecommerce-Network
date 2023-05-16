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
} from "@chakra-ui/react";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FaRegHeart, FaShoppingCart } from "react-icons/fa";
import IconButton from "../../components/IconButton";
import useAnchor from "../../hooks/useAnchor";
import { useParams } from "react-router-dom";
import { Program } from "@project-serum/anchor";
import { Idl } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { ProductSchema } from "../../schema/ProductSchema";

const Product = () => {
  const { program } = useAnchor();
  const [quantity, setQuantity] = useState<string>("1");
  const [inventory, setInventory] = useState(1);
  const [data, setData] = useState<ProductSchema | null>(null);
  const { productID } = useParams();

  const fetchProduct = useCallback(
    async (program: Program<Idl>, productID: PublicKey) => {
      const data = (await program?.account.product.fetch(
        productID
      )) as ProductSchema;

      setData(data);
    },
    []
  );

  useEffect(() => {
    if (data) setInventory(data.inventory);
  }, [data]);

  useEffect(() => {
    if (productID) fetchProduct(program, new PublicKey(productID));
    // --FIX--: Show error msg for invalid productID
    else console.error("Unable to fetch Data");
  }, [program, productID]);

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

  return (
    <Flex alignItems="center" justifyContent="center" marginTop="48px">
      <Box>
        <Flex gap="200px">
          <Box width="50%">Image</Box>
          <Box>
            <Heading size="xl">{data?.title}</Heading>
            <Text fontSize="lg" marginTop="16px">
              {data?.description}
            </Text>
            <Heading size="xl" marginTop="24px" color="blue.400">
              $ {data?.price}
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
              <Button
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
              </Button>
            </Flex>
            <Button
              colorScheme="facebook"
              maxWidth="300px"
              w="100%"
              marginTop="28px"
            >
              Buy Now
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

enum Action {
  ADD,
  SUB,
}

export default Product;
