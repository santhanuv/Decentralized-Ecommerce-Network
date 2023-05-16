import { Input, InputGroup, InputLeftElement, Icon } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import useSearch from "../hooks/useSearch";
import { useCallback } from "react";

const SearchBar = () => {
  const { searchWord, setSearchWord } = useSearch();

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    setSearchWord(value);
  }, [])

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Icon as={FaSearch} color="grey" />
      </InputLeftElement>
      <Input 
        value={searchWord}
        onChange={onChange}
        type="search" 
        placeholder="Search" 
        {...inputStyleProps} 
      />
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
