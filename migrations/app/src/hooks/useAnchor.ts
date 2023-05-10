import { AnchorProvider, Program } from "@project-serum/anchor";
import { useContext } from "react";
import { AnchorContext } from "../context/AnchorContextProvider";

type ContextType = { program: Program; provider: AnchorProvider };

const useAnchor = () => {
  const context = useContext(AnchorContext) as ContextType;

  return context;
};

export default useAnchor;
