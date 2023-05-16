import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserSchema } from "../schema/UserSchema";
import useUser from "../hooks/useUser";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import useAnchor from "../hooks/useAnchor";
import useArweave from "../hooks/useArweave";
import { Idl, Program } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

const UserContext = createContext({});

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserSchema | null>(null);
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
  );
  const [balance, setBalance] = useState<number>();

  const { fetchUser } = useUser();
  const { publicKey } = useWallet();
  const { programs, provider } = useAnchor();
  const { getTransactionData } = useArweave();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    (async () => {
      if (publicKey && programs.userProgram?.programId) {
        try {
          const balanceStr = String(
            (await provider.connection.getBalance(publicKey)) / LAMPORTS_PER_SOL
          );
          const balanceParts = balanceStr.split(".");
          let balance = 0;
          if (balanceParts.length > 1)
            balance = parseFloat(
              balanceParts[0] + "." + balanceParts[1].substring(0, 2)
            );
          else balance = parseFloat(balanceParts[0]);
          setBalance(balance);
        } catch (err) {
          console.error(`ERROR: Unable to set balance\n${err}`);
        }

        try {
          const { user, profile_image } = await fetchUser(
            programs.userProgram,
            publicKey,
            getTransactionData
          );

          setUserData(user);
          setProfileImage(profile_image);
        } catch (err: Error | ProxyHandler<Error> | any) {
          if (err.message.includes("Account does not exist")) {
            toast({
              title: "Profile doesn't exist! Create your profile",
              status: "error",
              isClosable: true,
              duration: 3000,
            });
            navigate("/create-user");
          }
          console.error(`ERROR: Unable to fetch user data\n${err}`);
          setUserData(null);
          setProfileImage(undefined);
        }
      } else {
        console.error(`ERROR: No user program found!`);
      }
    })();
  }, []);

  const reload = useCallback(async () => {
    if (publicKey && programs.userProgram?.programId) {
      try {
        const { user, profile_image } = await fetchUser(
          programs.userProgram,
          publicKey,
          getTransactionData
        );

        setUserData(user);
        setProfileImage(profile_image);
      } catch (err) {
        console.error(`ERROR: Unable to fetch user data\n${err}`);
        setUserData(null);
        setProfileImage(undefined);
      }
    } else {
      console.error("Invalid public key or user program!");
    }
  }, [
    fetchUser,
    programs,
    publicKey,
    getTransactionData,
    setUserData,
    setProfileImage,
  ]);

  return (
    <UserContext.Provider value={{ userData, profileImage, balance, reload }}>
      {children}
    </UserContext.Provider>
  );
};

type ContextType = {
  userData: UserSchema | null;
  profileImage: string | undefined;
  balance: number | undefined;
  reload: () => Promise<void>;
};

const useUserContext = () => {
  const { userData, profileImage, balance, reload } = useContext(
    UserContext
  ) as ContextType;

  return { userData, profileImage, balance, reload };
};

export { UserContextProvider, UserContext, useUserContext };
