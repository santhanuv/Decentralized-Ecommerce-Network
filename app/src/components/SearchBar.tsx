import { Input, InputGroup, InputLeftElement, Icon } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Icon as={FaSearch} color="grey" />
      </InputLeftElement>
      <Input type="search" placeholder="Search" {...inputStyleProps} />
    </InputGroup>
  );
};

const inputStyleProps = {
  variant: "filled",
  background: "black.200",
  borderColor: "gray.700",
  borderWidth: "1px",
  _hover: {
    borderColor: "blue.100",
  },
};

export default SearchBar;
