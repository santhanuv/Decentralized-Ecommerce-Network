import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
} from "@chakra-ui/react";
import ProfileInput from "../../components/ProfileInput";
import useAnchor from "../../hooks/useAnchor";
import { useWallet } from "@solana/wallet-adapter-react";
import useUser from "../../hooks/useUser";
import useArweave from "../../hooks/useArweave";
import { UserInputSchema } from "../../schema/UserSchema";
import { useNavigate } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import { AddressCard } from "../../components/AddressCard";

const MyAccount = () => {
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [oldData, setOldData] = useState<UserInputSchema | undefined>();
  const [oldProfileImage, setOldProfileImage] = useState<string | undefined>();
  const { programs } = useAnchor();
  const { publicKey } = useWallet();
  const { fetchUser, updateProfile } = useUser();
  const { getTransactionData, submitTransaction } = useArweave();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = useCallback(async () => {
    try {
      if (!publicKey) throw new Error("Invalid public key!");
      if (programs.userProgram) {
        const { user, profile_image } = await fetchUser(
          programs.userProgram,
          publicKey,
          getTransactionData
        );

        const data = {
          firstname: user.firstname,
          lastname: user.lastname,
          contact_number: user.contactNumber,
          email: user.email,
          profile_image: user.profileImage,
        };

        setOldData(data);
        setOldProfileImage(profile_image);
      } else console.error("Unable to find user program!");
    } catch (err: Error | ProxyHandler<Error> | any) {
      if (err.message.includes("Account does not exist")) {
        console.warn(err);
        navigate("/create-user");
      } else console.error(err);
    }
  }, [publicKey, programs, getTransactionData]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>, data: UserInputSchema) => {
      e.preventDefault();

      if (publicKey && programs.userProgram?.programId) {
        try {
          let txid: string | undefined = "";

          if (oldProfileImage !== data.profile_image) {
            if (data.profile_image && data.profile_image.length > 0) {
              const ardata = { profile_image: data.profile_image };

              txid = await submitTransaction(
                JSON.stringify(ardata),
                setProgressPercent
              );
            }
          } else if (oldData?.profile_image) txid = oldData?.profile_image;

          await updateProfile(
            programs.userProgram,
            publicKey,
            txid ? txid : "",
            data
          );

          toast({
            title: `Profile Updated`,
            status: "success",
            isClosable: true,
            duration: 3000,
          });
          setOldProfileImage(
            data.profile_image ? data.profile_image : undefined
          );
          setOldData({ ...data, profile_image: txid ? txid : "" });
        } catch (err) {
          console.error(`ERROR: Unable to update user\n${err}`);
          toast({
            title: "Profile Update Failed",
            status: "error",
            isClosable: true,
            duration: 3000,
          });
        }
      }
    },
    [publicKey, programs, oldProfileImage, setOldProfileImage, setOldData]
  );

  return (
    <Tabs colorScheme={"cyan"} isLazy marginTop="32px">
      <TabList
        bg="gray.700"
        borderRadius="10px"
        px="8"
        py="4"
        color="white"
        borderBottom="0"
      >
        <Tab>My Profile</Tab>
        <Tab>My Address</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <ProfileInput
            onSubmit={onSubmit}
            submitBtnText="Save"
            addCancelBtn
            initData={
              oldData
                ? {
                    ...oldData,
                    profile_image: oldProfileImage ? oldProfileImage : "",
                  }
                : null
            }
          />
        </TabPanel>
        <TabPanel>
          <AddressCard headText="My Address" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default MyAccount;
