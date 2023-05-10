import coverImg from "../../assets/cover-image-home.svg";
import {
  Box,
  Flex,
  Container,
  Image,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Flex justifyContent="center" marginTop="128px">
      <Box p="0 32px" width="80%">
        <Flex justifyContent="space-between" gap="8px">
          <Box w="100%">
            <Image src={coverImg} alt="cover" />
          </Box>
          <Box>
            <Heading fontSize="48px" lineHeight="1.15">
              Decentralized Ecommerce Network to buy and sell Products
            </Heading>
            <Text fontSize="20px" color="#f0f0f0" marginTop="16px">
              DEN is an ecommerce platform build on web3 using the solana
              blockchain technology to connect sellers and buyers without any
              centralized party in between.
            </Text>
            <Flex marginTop="40px" gap="32px" w="100%">
              <Button as={Link} to="#" colorScheme="blue" width="150px">
                Sell
              </Button>
              <Button as={Link} to="#" colorScheme="blue" width="150px">
                Buy
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Home;
