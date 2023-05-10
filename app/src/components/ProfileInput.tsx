import React, { useCallback, useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { UserInputSchema } from "../schema/UserSchema";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const defaultInitialData: UserInputSchema = {
  firstname: "",
  lastname: "",
  profile_image: "",
  email: "",
  contact_number: "",
};

type ProfileInputProps = {
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    data: UserInputSchema
  ) => Promise<void>;
  initData?: UserInputSchema | null;
  submitBtnText?: string;
  addCancelBtn?: boolean;
};

const ProfileInput = ({
  onSubmit,
  initData,
  submitBtnText = "Create",
  addCancelBtn = false,
}: ProfileInputProps) => {
  const [userData, setUserData] = useState<UserInputSchema>(
    initData ? initData : defaultInitialData
  );

  useEffect(() => {
    setUserData(initData ? initData : defaultInitialData);
  }, [initData]);

  const onImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files: File[] | null = e.target.files ? [...e.target.files] : null;

      files?.map((file) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          setUserData((prev) => ({
            ...prev,
            profile_image: reader.result as string,
          }));
        };
      });
    },
    [setUserData]
  );

  const removeImage = useCallback(() => {
    if (userData?.profile_image) {
      setUserData((prev) => ({ ...prev, profile_image: null }));
    }
  }, [userData]);

  const onDataChange = useCallback(
    (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const name = e.currentTarget.name;
      const value = e.currentTarget.value;

      setUserData((prev) => ({ ...prev, [name]: value }));
    },
    [setUserData]
  );

  return (
    <Flex justifyContent="center">
      <Box w="70%">
        <form onSubmit={(e) => onSubmit(e, userData)}>
          <Flex alignItems="center">
            <FormControl
              width="400px"
              border="1px solid"
              borderColor="gray.600"
              borderRadius="15px"
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
                <Text fontWeight="bold">Upload Image</Text>
                <Button
                  variant="unstyled"
                  display="flex"
                  py="16px"
                  px="16px"
                  w="fit-content"
                  cursor="pointer"
                  _hover={{ color: "red.400" }}
                  onClick={removeImage}
                >
                  <MdDelete fontSize="23px" />
                </Button>
              </Flex>
              <Flex
                w="400px"
                h="400px"
                justifyContent="center"
                alignItems="center"
                p="5px"
              >
                {userData.profile_image ? (
                  <img
                    src={
                      userData.profile_image
                        ? userData.profile_image
                        : undefined
                    }
                    alt={"profile-image"}
                    style={{ borderRadius: "0px 0px 15px 15px" }}
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
              height="510px"
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
              <Flex w="100%" gap="16px" h="fit-content" marginTop="32px">
                {addCancelBtn ? (
                  <Button
                    type="button"
                    colorScheme="red"
                    w="100%"
                    onClick={() => {
                      setUserData(initData ? initData : defaultInitialData);
                    }}
                  >
                    Cancel
                  </Button>
                ) : null}
                <Button type="submit" colorScheme="green" w="100%">
                  {submitBtnText}
                </Button>
              </Flex>
            </VStack>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};

export default ProfileInput;
