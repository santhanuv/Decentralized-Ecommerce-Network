import { Box, Flex, Heading, useToast } from "@chakra-ui/react";
import React, { useCallback, useState, useEffect } from "react";
import { AddressInputSchema, UserInputSchema } from "../../schema/UserSchema";
import ProgressBar from "../../components/ProgressBar";
import useArweave from "../../hooks/useArweave";
import useAnchor from "../../hooks/useAnchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import CreateAddress from "./CreateAddress";
import useUser from "../../hooks/useUser";
import ProfileInput from "../../components/ProfileInput";

const CreateUser = () => {
  const [initializeAddress, setInitializeAddress] = useState<boolean>(false);
  const [showProgress] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const { programs } = useAnchor();
  const { publicKey } = useWallet();
  const toast = useToast();
  const navigate = useNavigate();
  const { fetchUser, createProfile, createAddress } = useUser();
  const { getTransactionData, submitTransaction } = useArweave();

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = useCallback(async () => {
    try {
      if (!publicKey) throw new Error("Invalid public key!");
      if (programs.userProgram) {
        const { user } = await fetchUser(
          programs.userProgram,
          publicKey,
          getTransactionData
        );

        if (user && !initializeAddress) {
          toast({
            title: "Your profile already exist!",
            status: "success",
            isClosable: true,
            duration: 3000,
          });
          setInitializeAddress(true);
        }
      } else console.error("Unable to find user program!");
    } catch (err: Error | ProxyHandler<Error> | any) {
      if (!err.message.includes("Account does not exist")) console.warn(err);
    }
  }, [publicKey, programs, setInitializeAddress, getTransactionData]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>, data: UserInputSchema) => {
      e.preventDefault();

      try {
        let txid: string | undefined = undefined;

        if (data.profile_image && data.profile_image.length > 0) {
          const ardata = { profile_image: data.profile_image };

          txid = await submitTransaction(
            JSON.stringify(ardata),
            setProgressPercent
          );
        }

        if (publicKey && programs.userProgram?.programId) {
          await createProfile(
            programs.userProgram,
            publicKey,
            txid ? txid : "",
            data
          );

          toast({
            title: "User Created",
            status: "success",
            isClosable: true,
            duration: 3000,
          });
          // navigate("/profile/buyer");
          setInitializeAddress(true);
        }
      } catch (err: Error | ProxyHandler<Error> | any) {
        // If fails check if the user account exists
        if (
          err.message.includes(
            "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x0"
          )
        ) {
          alert("Profile for the user already exists.");
        }
        console.error(err);
        toast({
          title: "Failed to create user!",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    },
    [submitTransaction, programs, publicKey]
  );

  const onCreateAddress = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement>,
      address: AddressInputSchema
    ) => {
      e.preventDefault();

      try {
        if (!publicKey) throw new Error("Invalid public key");
        if (!programs.userProgram?.programId)
          throw new Error("Invalid user program");

        await createAddress(programs.userProgram, publicKey, address);

        toast({
          title: "Address added",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
        navigate("/profile/buyer");
      } catch (err) {
        console.error(`ERROR: Unable to add address error\n${err}`);
        toast({
          title: "Failed to add address!",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    },
    [publicKey, programs]
  );

  return (
    <>
      <ProgressBar
        showProgress={showProgress}
        progressPercent={progressPercent}
        setProgressPercent={setProgressPercent}
      />
      {initializeAddress ? (
        <Flex justifyContent="center" alignItems="center">
          <Box w="50%">
            <CreateAddress onSubmit={onCreateAddress} />
          </Box>
        </Flex>
      ) : (
        <Box w="100%">
          <Heading size="lg" textAlign="center" marginY="30px">
            Create User
          </Heading>
          <ProfileInput onSubmit={onSubmit} />
        </Box>
      )}
    </>
  );
};

export default CreateUser;
