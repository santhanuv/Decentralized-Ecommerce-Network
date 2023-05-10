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
} from "@chakra-ui/react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Link } from "react-router-dom";

const PRODUCT_DESCRIPTION_MAX_LEN = 60;

const ProductCard = ({
  image,
  title,
  description,
  price,
  rating,
  pubKey,
  toLink,
  removeAddToCart = false,
}: ProductCardPropsType) => {
  return (
    <Box as={Link} to={toLink ? toLink : `/buy/${pubKey}`}>
      <Card w="280px" bg="none" border="none" borderRadius="8px 8px 0 0">
        <CardBody
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
            <Heading size="sm">{title}</Heading>
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
            >
              Add To Cart
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </Box>
  );
};

type ProductCardPropsType = {
  image: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  pubKey: PublicKey;
  toLink?: string;
  removeAddToCart?: boolean;
};

export default ProductCard;
