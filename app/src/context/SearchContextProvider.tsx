import { createContext, ReactNode, useState } from "react";

const SearchContext = createContext({});

const SearchContextProvider = ({ children }: { children: ReactNode }) => {
    const [searchWord, setSearchWord] = useState<string>("");

    return <SearchContext.Provider value={{ searchWord, setSearchWord }}>
        {children}
    </SearchContext.Provider>
}

export { SearchContext, SearchContextProvider }