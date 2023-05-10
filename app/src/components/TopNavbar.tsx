import { Box, Flex, Text, Spacer } from "@chakra-ui/react";
import IconButton from "./IconButton";
import { FaShoppingCart } from "react-icons/fa";
import NavLink from "./NavLink";
import SearchBar from "./SearchBar";
import WalletButton from "./wallet/WalletButton";
import UserMenu from "./UserMenu";

const TopNavbar = () => {
  return (
    <Box>
      <Flex {...commonFlexStyles}>
        <Flex gap="4" {...commonFlexStyles}>
          <Text fontSize="xl">Logo</Text>
          <Spacer />
          <SearchBar />
        </Flex>
        <Spacer />
        <Flex gap="12" {...commonFlexStyles}>
          <Flex gap="4" {...commonFlexStyles}>
            <NavLink href="/buy">Shop</NavLink>
            <NavLink href="/create-user">Create-Profile</NavLink>
            <NavLink href="#">Contact</NavLink>
          </Flex>
          <Spacer />
          <Flex gap="5" {...commonFlexStyles}>
            <UserMenu />
            {/* <IconButton as={FaShoppingCart} /> */}
            <WalletButton />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

const commonFlexStyles = {
  alignItems: "center",
};

export default TopNavbar;
