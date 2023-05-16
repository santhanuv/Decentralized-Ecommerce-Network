import React, { useContext  } from "react";
import { SearchContext } from "../context/SearchContextProvider";

type ContextType = {
    searchWord: string;
    setSearchWord: React.Dispatch<React.SetStateAction<string>>;
}

const useSearch = () => {
    const { searchWord, setSearchWord } = useContext(SearchContext) as ContextType;

    return { searchWord, setSearchWord };
}

export default useSearch;