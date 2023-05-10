import { Link as ChakraLink } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

const NavLink = ({ children, href }: NavLinkPropsType) => {
  return (
    <ChakraLink as={Link} to={href} {...navLinkStyleProps}>
      {children}
    </ChakraLink>
  );
};

const navLinkStyleProps = {
  fontSize: "md",
  _hover: {
    textDecoration: "none",
    color: "blue.100",
  },
};

type NavLinkPropsType = {
  children: ReactNode;
  href: string;
};

export default NavLink;
