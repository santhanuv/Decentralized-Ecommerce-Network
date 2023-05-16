import { AnchorProvider } from "@project-serum/anchor";
import { useContext } from "react";
import {
  AnchorContext,
  AnchorPrograms,
} from "../context/AnchorContextProvider";

type ContextType = { programs: AnchorPrograms; provider: AnchorProvider };

const useAnchor = () => {
  const context = useContext(AnchorContext) as ContextType;

  return context;
};

export default useAnchor;
