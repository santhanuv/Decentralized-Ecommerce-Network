import { Keypair, PublicKey } from "@solana/web3.js";
import React, { useCallback, useState } from "react";
import { AddressInputSchema } from "../../schema/UserSchema";
import { utils as anchorUtils } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import useAnchor from "../../hooks/useAnchor";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";

const initialAddress: AddressInputSchema = {
  country: "",
  state: "",
  code: "",
  locale: "",
};

type CreateAddressProps = {
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    address: AddressInputSchema
  ) => Promise<void>;
  btnText?: string;
  headText?: string;
  addCancelBtn?: boolean;
};

const CreateAddress = ({
  onSubmit,
  btnText,
  headText,
  addCancelBtn = false,
}: CreateAddressProps) => {
  const [address, setAddress] = useState<AddressInputSchema>(initialAddress);

  const onAddressChange = useCallback(
    (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const name = e.currentTarget.name;
      const value = e.currentTarget.value;

      // verify input

      setAddress((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  return (
    <Box>
      <Heading size="lg" marginY="30px" textAlign="center">
        {headText ? headText : "Add Address"}
      </Heading>
      <Flex w="100%" justifyContent="center">
        <form onSubmit={(e) => onSubmit(e, address)} style={{ width: "50%" }}>
          <VStack justifyContent="space-evenly" height="480px">
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Textarea
                placeholder="House Name, locale, city,..."
                value={address.locale}
                name="locale"
                onChange={onAddressChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Pin Code</FormLabel>
              <Input
                placeholder="Pin code"
                value={address.code}
                name="code"
                onChange={onAddressChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>State</FormLabel>
              <Input
                placeholder="State"
                value={address.state}
                name="state"
                onChange={onAddressChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Country</FormLabel>
              <Input
                placeholder="Country"
                value={address.country}
                name="country"
                onChange={onAddressChange}
              />
            </FormControl>
          </VStack>
          <Flex gap="16px" marginTop="32px">
            {addCancelBtn ? (
              <Button type="button" colorScheme="red" w="100%">
                Cancel
              </Button>
            ) : null}
            <Button type="submit" colorScheme="green" w="100%">
              {btnText ? btnText : "Save"}
            </Button>
          </Flex>
        </form>
      </Flex>
    </Box>
  );
};

export default CreateAddress;
