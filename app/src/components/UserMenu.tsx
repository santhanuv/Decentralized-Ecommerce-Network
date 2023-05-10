import { Box, Menu, MenuButton, MenuList, Portal } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import IconButton from "./IconButton";
import { IconButtonStyleProps } from "./IconButton";
import StyledMenuItem from "./StyledMenuItem";

const UserMenu = () => {
  return (
    <Menu>
      <MenuButton as={Box} {...IconButtonStyleProps} cursor="pointer">
        <IconButton as={FaUser} />
      </MenuButton>
      <Portal>
        <MenuList bg="black.200" color="white">
          <StyledMenuItem as={Link} to="/myaccount">
            My Account
          </StyledMenuItem>
          <StyledMenuItem as={Link} to="/profile/buyer">
            Buyer Profile
          </StyledMenuItem>
          <StyledMenuItem as={Link} to="/profile/seller" addBorder={false}>
            Seller Profile
          </StyledMenuItem>
          {/* <StyledMenuItem addBorder={false}>Your Orders</StyledMenuItem> */}
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default UserMenu;
