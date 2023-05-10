import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  useToast,
  useDisclosure,
  ModalBody,
  ModalCloseButton,
  VStack,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useCallback, useEffect, useState } from "react";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import useAnchor from "../hooks/useAnchor";
import useUser from "../hooks/useUser";
import CreateAddress from "../pages/user/CreateAddress";
import { AddressFetchSchema, AddressInputSchema } from "../schema/UserSchema";

type AddressCardProps = {
  headText: string | null;
  addDelBtn?: boolean;
  addEditBtn?: boolean;
  onClick?: (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    address: AddressFetchSchema | null
  ) => void;
};

export const AddressCard = ({
  headText = null,
  onClick,
  addDelBtn = true,
  addEditBtn = true,
}: AddressCardProps) => {
  const [addressList, setAddressList] = useState<AddressFetchSchema[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(-1);
  const { publicKey } = useWallet();
  const { programs } = useAnchor();
  const { fetchAddressByUserID } = useUser();
  const { createAddress } = useUser();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  const fetch = useCallback(async () => {
    try {
      if (!programs.userProgram?.account) throw new Error("Invalid program");
      if (!publicKey)
        throw new Error("Wallet not connected! Invalid public key");
      const addressList = await fetchAddressByUserID(
        programs.userProgram,
        publicKey
      );

      setAddressList(addressList);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, []);

  const onSubmit = useCallback(
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
        fetch();
        onClose();
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

  const onClickHandler = useCallback(
    (
      e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
      idx: number,
      address: AddressFetchSchema
    ) => {
      if (idx === selectedAddressIndex) {
        setSelectedAddressIndex(-1);
        onClick && onClick(e, null);
      } else {
        setSelectedAddressIndex(idx);
        onClick && onClick(e, address);
      }
    },
    [selectedAddressIndex]
  );

  return (
    <Flex marginTop="32px" justifyContent="center">
      <Card w="640px" paddingX="12px">
        {headText ? (
          <CardHeader>
            <Heading textAlign="center" size="lg">
              My Address
            </Heading>
          </CardHeader>
        ) : null}

        <CardBody
          borderTop={headText ? "1px solid gray" : ""}
          justifyContent="space-between"
          display="flex"
          flexDirection="column"
          gap="16px"
        >
          <Stack
            spacing="4"
            divider={<StackDivider />}
            overflow="scroll"
            maxHeight="546px"
          >
            {addressList.map(
              ({ account, publicKey }: AddressFetchSchema, idx) => (
                <Box key={publicKey.toString()}>
                  <Flex
                    gap="32px"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    {addDelBtn ? (
                      <Button
                        variant="unstyled"
                        _hover={{ background: "red.700" }}
                      >
                        <Flex justifyContent="center" alignItems="center">
                          <MdDelete fontSize="20px" />
                        </Flex>
                      </Button>
                    ) : null}
                    <Text
                      boxSizing="content-box"
                      borderLeft={
                        idx === selectedAddressIndex ? "5px solid" : "none"
                      }
                      borderColor="green.300"
                      paddingX={"12px"}
                      w="80%"
                      id={`${idx}`}
                      onClick={(e) =>
                        onClickHandler(e, idx, { account, publicKey })
                      }
                      cursor={onClick ? "pointer" : "auto"}
                    >
                      {account.locale}, {account.code},<br />
                      {account.state},{account.country}
                    </Text>
                    {addEditBtn ? (
                      <Button
                        variant="unstyled"
                        _hover={{ background: "green.700" }}
                      >
                        <Flex justifyContent="center" alignItems="center">
                          <MdEdit fontSize="20px" />
                        </Flex>
                      </Button>
                    ) : null}
                  </Flex>
                </Box>
              )
            )}
          </Stack>
          <Button
            w="100%"
            marginTop="auto"
            colorScheme="green"
            onClick={onOpen}
          >
            <MdAdd />
          </Button>
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width="fit-content" maxW="800px" w="800px">
          <ModalCloseButton />
          <ModalBody pb="2" marginBottom="32px">
            <Box>
              <CreateAddress onSubmit={onSubmit} />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
