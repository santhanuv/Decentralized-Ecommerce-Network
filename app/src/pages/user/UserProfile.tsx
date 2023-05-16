// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { utils as anchorUtils } from "@coral-xyz/anchor";
// import {
//   Box,
//   Avatar,
//   Wrap,
//   WrapItem,
//   Flex,
//   Text,
//   Heading,
//   Tooltip,
//   Button,
//   Spacer,
//   Tabs,
//   TabList,
//   Tab,
//   TabPanels,
//   TabPanel,
// } from "@chakra-ui/react";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { UserInputSchema, UserSchema } from "../../schema/UserSchema";
// import useArweave from "../../hooks/useArweave";
// import useAnchor from "../../hooks/useAnchor";
// import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
// import UpdateProfile from "./UpdateProfile";
// import { AnchorPrograms } from "../../context/AnchorContextProvider";
// import Market from "../market/Market";
// import OrderList, { UserType } from "../order/OrderList";
// import BaseProfile from "../../hoc/BaseProfile";

import { useLocation } from "react-router-dom";
import BaseProfile from "../../hoc/BaseProfile";
import BuyerProfile from "./BuyerProfile";
import SellerProfile from "./SellerProfile";

// const UserProfile = () => {
//   // const { publicKey } = useWallet();
//   // const { connection } = useConnection();

//   // // const initUserData: Partial<UserSchema> = useMemo(() => {
//   // //   const data = {
//   // //     timestamp: "",
//   // //     firstname: "",
//   // //     lastname: "",
//   // //     profileImage: null,
//   // //     email: "",
//   // //     contactNumber: "",
//   // //   };
//   // //   if (publicKey) return { ...data, seller: publicKey };
//   // //   else return data;
//   // // }, [publicKey]);

//   // const [userData, setUserData] = useState<UserSchema | null>(null);
//   // const [profileImage, setProfileImage] = useState<string | undefined>(
//   //   undefined
//   // );
//   // const [balance, setBalance] = useState<number>();
//   // const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
//   // const [copied, setCopied] = useState(false);
//   // const { programs } = useAnchor();
//   // const { getTransactionData } = useArweave();

//   // const copyToClipboard = useCallback(async () => {
//   //   if (base58) {
//   //     await navigator.clipboard.writeText(base58);
//   //     setCopied(true);
//   //     setTimeout(() => setCopied(false), 400);
//   //   }
//   // }, [base58]);

//   // const fetchData = useCallback(
//   //   async (publicKey: PublicKey, programId: PublicKey) => {
//   //     try {
//   //       const [userPDA] = PublicKey.findProgramAddressSync(
//   //         [anchorUtils.bytes.utf8.encode("user-profile"), publicKey.toBuffer()],
//   //         programId
//   //       );

//   //       const user = (await programs?.userProgram?.account.userProfile.fetch(
//   //         userPDA
//   //       )) as UserSchema;

//   //       if (user) {
//   //         try {
//   //           if (user.profileImage) {
//   //             const { profile_image } = user.profileImage
//   //               ? await getTransactionData(user.profileImage)
//   //               : null;

//   //             setProfileImage(profile_image);
//   //           } else {
//   //             setProfileImage(undefined);
//   //           }
//   //           setUserData(user);
//   //         } catch (err) {
//   //           setUserData({ ...user, profileImage: null });
//   //           console.error(`ERROR: Unable to get profile image\n${err}`);
//   //         }
//   //       }
//   //     } catch (err) {
//   //       console.error(`ERROR: Unable to get user data\n${err}`);
//   //     }
//   //   },
//   //   [programs, getTransactionData, setUserData]
//   // );

//   // useEffect(() => {
//   //   (async () => {
//   //     if (publicKey && programs.userProgram?.programId) {
//   //       try {
//   //         const balanceStr = String(
//   //           (await connection.getBalance(publicKey)) / LAMPORTS_PER_SOL
//   //         );
//   //         const balanceParts = balanceStr.split(".");
//   //         let balance = 0;
//   //         if (balanceParts.length > 1)
//   //           balance = parseFloat(
//   //             balanceParts[0] + "." + balanceParts[1].substring(0, 2)
//   //           );
//   //         else balance = parseFloat(balanceParts[0]);
//   //         setBalance(balance);
//   //       } catch (err) {
//   //         console.error(`ERROR: Unable to set balance\n${err}`);
//   //       }

//   //       await fetchData(publicKey, programs.userProgram?.programId);
//   //     }
//   //   })();
//   // }, []);

//   // const reload = useCallback(async () => {
//   //   if (publicKey && programs.userProgram?.programId) {
//   //     await fetchData(publicKey, programs.userProgram.programId);
//   //   }
//   //   return null;
//   // }, [fetchData, programs, publicKey]);

//   return (
//     // <Box marginTop="32px">
//     //   <Flex gap="32px" bg="gray.700" p="8" borderRadius="12px 12px 0 0">
//     //     <Wrap>
//     //       <WrapItem>
//     //         <Avatar
//     //           size="2xl"
//     //           name={userData?.firstname ? userData.firstname : "Anonymous"}
//     //           src={profileImage}
//     //         />
//     //       </WrapItem>
//     //     </Wrap>
//     //     <Flex
//     //       flexDirection="column"
//     //       justifyContent="center"
//     //       alignItems="start"
//     //       gap="1"
//     //     >
//     //       <Flex>
//     //         {userData?.firstname && userData?.lastname ? (
//     //           <Text fontSize="xl">
//     //             {userData?.firstname} {userData?.lastname}
//     //           </Text>
//     //         ) : (
//     //           <Text>Anonymous</Text>
//     //         )}
//     //       </Flex>
//     //       <Tooltip
//     //         label={copied ? "copied" : "copy"}
//     //         placement="bottom"
//     //         fontSize="lg"
//     //       >
//     //         <Button
//     //           variant="unstyled"
//     //           textAlign="start"
//     //           onClick={copyToClipboard}
//     //         >
//     //           {`${base58?.slice(0, 4)}..${base58?.slice(-4)}`}
//     //         </Button>
//     //       </Tooltip>
//     //     </Flex>
//     //     <Spacer />
//     //     <Flex
//     //       flexDirection="column"
//     //       justifyContent="center"
//     //       alignItems="end"
//     //       gap="1"
//     //     >
//     //       <Heading fontSize="2xl">Balance</Heading>
//     //       <Text fontSize="xl" color="blue.300">
//     //         {balance ? `${balance} SOL` : 0}
//     //       </Text>
//     //     </Flex>
//     //   </Flex>

//     <BaseProfile>
//       <Tabs colorScheme={"cyan"} isLazy>
//         <TabList
//           bg="gray.900"
//           borderRadius="0 0 12px 12px"
//           px="8"
//           py="4"
//           color="white"
//           borderBottom="0"
//         >
//           <Tab>Orders</Tab>
//           <Tab>Market</Tab>
//           <Tab>Seller Orders</Tab>
//           <Tab>Order History</Tab>
//           <Tab>Wishlist</Tab>
//           <Tab marginLeft="auto">Edit Profile</Tab>
//         </TabList>
//         <TabPanels>
//           <TabPanel>
//             <OrderList type={UserType.Buyer} />
//           </TabPanel>
//           <TabPanel>
//             <Market />
//           </TabPanel>
//           <TabPanel>
//             <OrderList type={UserType.Seller} />
//           </TabPanel>
//           <TabPanel>
//             <p>Three</p>
//           </TabPanel>
//           <TabPanel>
//             <p>Four</p>
//           </TabPanel>
//           <TabPanel marginLeft="auto">
//             <UpdateProfile
//               definedData={userData}
//               setProfile={reload}
//               profileImage={profileImage}
//             />
//           </TabPanel>
//         </TabPanels>
//       </Tabs>
//     </BaseProfile>
//   );
// };

const UserProfile = () => {
  const location = useLocation();

  return (
    <BaseProfile>
      {location.pathname === "/profile/seller" ? (
        <SellerProfile />
      ) : location.pathname === "/profile/buyer" ? (
        <BuyerProfile />
      ) : (
        <div>Invalid user type</div>
      )}
    </BaseProfile>
  );
};

export default UserProfile;
