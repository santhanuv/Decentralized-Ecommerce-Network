import { As, Button, Icon } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

const IconButton = ({ as, onClick, isLoading = false }: IconButtonProps) => {
  return (
    <Button {...IconButtonStyleProps} onClick={onClick} isLoading={isLoading}>
      <Icon w="22px" h="22px" as={as} />
    </Button>
  );
};

const IconButtonStyleProps = {
  variant: "unstyled",
  minWidth: "fit-content",
  minHeight: "fit-content",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  _hover: {
    color: "blue.100",
  },
};

type IconButtonProps = {
  as: As;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
};

export default IconButton;
export { IconButtonStyleProps };
