import { useCallback } from "react";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  AddressFetchSchema,
  AddressSchema,
  UserInputSchema,
  UserSchema,
} from "../schema/UserSchema";
import { Idl, Program } from "@project-serum/anchor";
import { utils } from "@coral-xyz/anchor";
import { AddressInputSchema } from "../schema/UserSchema";

const useUser = () => {
  const fetchUser = useCallback(
    async (
      program: Program<Idl>,
      userID: PublicKey,
      getTransactionData: (txId: string) => Promise<any>
    ) => {
      if (!program?.account?.userProfile) throw new Error("Invalid program");

      const programID = program.programId;

      const [userPDA] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("user-profile"), userID.toBuffer()],
        programID
      );

      const user = (await program.account.userProfile.fetch(
        userPDA
      )) as UserSchema;

      let profile_image: string | undefined = undefined;
      try {
        if (user.profileImage) {
          const profile_data = await getTransactionData(user.profileImage);
          profile_image = profile_data.profile_image;
        }
      } catch (err) {
        console.warn(`WARN: Unable to get profile image\n${err}`);
      }

      return { user, profile_image };
    },
    []
  );

  const createProfile = useCallback(
    async (
      program: Program<Idl>,
      userID: PublicKey,
      txid: string,
      data: UserInputSchema
    ) => {
      if (!program.programId) throw new Error("Invalid program!");

      const [userPDA] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("user-profile"), userID.toBuffer()],
        program.programId
      );

      return await program.methods
        .createUser(
          data.firstname,
          data.lastname,
          txid,
          data.email,
          data.contact_number
        )
        .accounts({
          userAccount: userPDA,
          authAccount: userID,
        })
        .signers([])
        .rpc();
    },
    []
  );

  const updateProfile = useCallback(
    async (
      program: Program<Idl>,
      userID: PublicKey,
      txid: string,
      data: UserInputSchema
    ) => {
      if (!program.programId) throw new Error("Invalid program!");

      const [userPDA] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("user-profile"), userID.toBuffer()],
        program.programId
      );

      await program.methods
        .updateUser(
          data.firstname,
          data.lastname,
          txid,
          data.email,
          data.contact_number
        )
        .accounts({
          userAccount: userPDA,
          authAccount: userID,
        })
        .signers([])
        .rpc();
    },
    []
  );

  const createAddress = useCallback(
    async (
      program: Program<Idl>,
      userID: PublicKey,
      data: AddressInputSchema
    ) => {
      if (!program.programId) throw new Error("Invalid program!");

      const [userProfilePDA] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("user-profile"), userID.toBuffer()],
        program.programId
      );

      const addressKeyPair = Keypair.generate();

      await program.methods
        .createAddress(data.country, data.state, data.code, data.locale)
        .accounts({
          addressAccount: addressKeyPair.publicKey,
          userAccount: userProfilePDA,
          authAccount: userID,
        })
        .signers([addressKeyPair])
        .rpc();
    },
    []
  );

  const fetchAddressByUserID = useCallback(
    async (program: Program<Idl>, userID: PublicKey) => {
      if (!program?.account?.userProfile) throw new Error("Invalid program");

      const addressList = await program.account.userAddress.all([
        {
          memcmp: {
            offset: 8, // Discriminator
            bytes: userID.toBase58(),
          },
        },
      ]);

      return addressList as unknown as AddressFetchSchema[];
    },
    []
  );

  const fetchAddressByID = useCallback(
    async (program: Program<Idl>, addressID: PublicKey) => {
      if (!program?.account?.userProfile) throw new Error("Invalid program");

      const address = await program.account.userAddress.fetch(addressID);

      return {
        country: address.country,
        state: address.state,
        code: address.code,
        locale: address.locale,
        user: address.user,
      } as AddressSchema;
    },
    []
  );

  return {
    fetchUser,
    createProfile,
    updateProfile,
    createAddress,
    fetchAddressByUserID,
    fetchAddressByID,
  };
};

export default useUser;
