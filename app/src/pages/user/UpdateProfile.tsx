import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { UserSchema, UserInputSchema } from "../../schema/UserSchema";
import { utils as anchorUtils } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import useAnchor from "../../hooks/useAnchor";
import useArweave from "../../hooks/useArweave";
import ProgressBar from "../../components/ProgressBar";
import AlertQuery from "../../components/AlertQuery";

const UpdateProfile = ({
  definedData,
  setProfile,
  profileImage,
}: {
  definedData: UserSchema | null;
  setProfile: () => Promise<void>;
  profileImage: string | undefined;
}) => {
  const initUserData: UserInputSchema = useMemo(() => {
    const reqKeys = ["firstname", "lastname", "email"];
    if (definedData) {
      const partData = Object.fromEntries(
        Object.entries(definedData).filter(([key]) => reqKeys.includes(key))
      );

      partData.profile_image = definedData.profileImage;
      partData.contact_number = definedData.contactNumber;

      return partData as unknown as UserInputSchema;
    } else {
      return {
        firstname: "",
        lastname: "",
        profile_image: "",
        email: "",
        contact_number: "",
      };
    }
  }, [definedData]);

  const [userData, setUserData] = useState<UserInputSchema>(initUserData);
  const [updatedProfileImage, setUpdatedProfileImage] = useState<
    string | undefined
  >(undefined);
  const { publicKey } = useWallet();
  const { programs } = useAnchor();
  const { submitTransaction } = useArweave();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [showProgress] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>, data: UserInputSchema) => {
      e.preventDefault();

      if (publicKey && programs.userProgram?.programId) {
        try {
          const [userPDA] = PublicKey.findProgramAddressSync(
            [
              anchorUtils.bytes.utf8.encode("user-profile"),
              publicKey.toBuffer(),
            ],
            programs.userProgram?.programId
          );
          let txid = null;
          if (updatedProfileImage !== profileImage) {
            if (updatedProfileImage && updatedProfileImage.length > 0) {
              const ardata = { profile_image: updatedProfileImage };

              txid = await submitTransaction(
                JSON.stringify(ardata),
                setProgressPercent
              );
            }
          }

          await programs.userProgram.methods
            .updateUser(
              data.firstname,
              data.lastname,
              txid ? txid : data.profile_image,
              data.email,
              data.contact_number
            )
            .accounts({
              userAccount: userPDA,
              authAccount: publicKey,
            })
            .signers([])
            .rpc();

          toast({
            title: `Profile Updated`,
            status: "success",
            isClosable: true,
            duration: 3000,
          });
          await setProfile();
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
    [publicKey, programs, updatedProfileImage]
  );

  const onDataChange = useCallback(
    (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const name = e.currentTarget.name;
      const value = e.currentTarget.value;

      setUserData((prev) => ({ ...prev, [name]: value }));
    },
    [setUserData]
  );

  const onImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files: File[] | null = e.target.files ? [...e.target.files] : null;

      files?.map((file) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          if (reader.result) setUpdatedProfileImage(reader.result as string);
        };
      });
    },
    [setUpdatedProfileImage]
  );

  const removeImage = useCallback(
    (force: boolean = false) => {
      if (updatedProfileImage) {
        setUpdatedProfileImage(undefined);
      } else if (!force) {
        onOpen();
      } else if (force) {
        setUserData({ ...userData, profile_image: "" });
        setUpdatedProfileImage(undefined);
      }
    },
    [updatedProfileImage, setUserData, setUpdatedProfileImage]
  );

  return (
    <>
      <ProgressBar
        showProgress={showProgress}
        progressPercent={progressPercent}
        setProgressPercent={setProgressPercent}
      />
      <AlertQuery
        isOpen={isOpen}
        onClose={onClose}
        headerTxt={"Remove Profile Image"}
        prompt="Do you want to remove your profile image"
        yesHandler={() => removeImage(true)}
        noHandler={() => {}}
      />
      <Box>
        <Flex justifyContent="center">
          <Box w="70%">
            <form onSubmit={(e) => onSubmit(e, userData)}>
              <Flex alignItems="center">
                <FormControl
                  width="400px"
                  border="1px solid"
                  borderColor="gray.600"
                  borderRadius="2xl"
                  height="fit-content"
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <FormLabel
                      htmlFor="product-image"
                      margin="0"
                      py="16px"
                      px="16px"
                      w="fit-content"
                      cursor="pointer"
                      _hover={{ color: "green.400" }}
                    >
                      <FaPlus fontSize="18px" />
                    </FormLabel>
                    <Text fontWeight="bold">Upload Images</Text>
                    <Button
                      variant="unstyled"
                      display="flex"
                      py="16px"
                      px="16px"
                      w="fit-content"
                      cursor="pointer"
                      _hover={{ color: "red.400" }}
                      onClick={() => removeImage()}
                    >
                      <MdDelete fontSize="23px" />
                    </Button>
                  </Flex>
                  <Flex
                    w="400px"
                    h="400px"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {updatedProfileImage ||
                    (userData.profile_image && profileImage) ? (
                      <img
                        src={
                          updatedProfileImage
                            ? updatedProfileImage
                            : profileImage
                        }
                        alt={"profile-image"}
                      />
                    ) : (
                      <Text>Upload Your profile pic</Text>
                    )}
                  </Flex>
                  <Divider />
                  <Input
                    display="none"
                    marginTop="24px"
                    type="file"
                    accept="image/*"
                    name="image"
                    id="product-image"
                    value={""}
                    onChange={onImageUpload}
                  />
                </FormControl>
                <VStack
                  height="500px"
                  width="50%"
                  pl="64px"
                  justifyContent="space-evenly"
                >
                  <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      onChange={(e) => onDataChange(e)}
                      placeholder="firstname"
                      value={userData.firstname}
                      name="firstname"
                      id="firstname"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      onChange={(e) => onDataChange(e)}
                      placeholder="lastname"
                      value={userData.lastname}
                      name="lastname"
                      id="lastname"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      onChange={(e) => onDataChange(e)}
                      placeholder="email"
                      value={userData.email}
                      name="email"
                      id="email"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Contact Number</FormLabel>
                    <Input
                      onChange={(e) => onDataChange(e)}
                      placeholder="contact number"
                      value={userData.contact_number}
                      name="contact_number"
                      id="contact_number"
                    />
                  </FormControl>
                  <Box w="100%">
                    <Button
                      type="submit"
                      colorScheme="green"
                      w="100%"
                      marginTop="32px"
                    >
                      Update
                    </Button>
                  </Box>
                </VStack>
              </Flex>
            </form>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default UpdateProfile;
