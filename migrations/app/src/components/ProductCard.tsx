import {
  Flex,
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  CardFooter,
  Button,
  VStack,
  Spacer,
  Box,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { Link } from "react-router-dom";

const PRODUCT_DESCRIPTION_MAX_LEN = 60;

const ProductCard = ({
  image,
  title,
  description,
  price,
  rating,
  pubKey,
}: ProductCardPropsType) => {
  return (
    <Box as={Link} to={`/buy/${pubKey}`}>
      <Card w="300px" bg="none" border="1px solid" borderRadius="8px 8px 0 0">
        <CardBody color="white" bg="#111317" borderRadius="8px 8px 0 0">
          <Image src={image} alt="Product image" height="160px" />
          <Flex flexDirection="column" gap="2" height="140px">
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
                {`$ ${price}`}
              </Heading>
            </Flex>
          </Flex>
        </CardBody>
        <CardFooter padding="0" marginBottom="16px" h="40px">
          <Button
            w="100%"
            p="0"
            fontSize="md"
            borderRadius="0 0 8px 8px"
            colorScheme="facebook"
          >
            Add To Cart
          </Button>
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
};

export default ProductCard;
