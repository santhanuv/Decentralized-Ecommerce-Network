import { ReactNode } from "react";
import { As, MenuItem } from "@chakra-ui/react";

const StyledMenuItem = ({
  children,
  addBorder = true,
  onClick,
  as,
  ...props
}: StyledMenuItemPropsType) => {
  const styles: { [index: string]: any } = {
    bg: "black.200",
    p: "3",
    _hover: {
      bg: "gray.700",
    },
  };

  addBorder ? (styles["borderBottom"] = "1px solid white") : null;

  return (
    <MenuItem {...styles} onClick={onClick} as={as} {...props}>
      {children}
    </MenuItem>
  );
};

type StyledMenuItemPropsType = {
  [index: string]: any;
  children: ReactNode;
  addBorder?: boolean;
  onClick?: () => void;
  as?: As;
};

export default StyledMenuItem;
