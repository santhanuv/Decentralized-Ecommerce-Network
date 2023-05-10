import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const UserMarket = () => {
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg">Products</Heading>
        <Button as={Link} to="/create-product" colorScheme="green">
          Create Product
        </Button>
      </Flex>
      <Box marginTop="30px">Fetch All Products</Box>
    </Box>
  );
};

export default UserMarket;
