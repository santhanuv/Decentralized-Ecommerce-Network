import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { UserSchema } from "../schema/UserSchema";

const InfoCard = ({
  profile,
  profileImage,
}: {
  profile: UserSchema;
  profileImage: string;
}) => {
  return (
    <Flex flexDirection="column" alignItems="center">
      <Avatar
        size="2xl"
        name={profile?.firstname ? profile.firstname : "Anonymous"}
        src={profileImage}
      />
      <Box marginTop="24px">
        <Flex gap="64px" justifyContent="space-between">
          <Text>Name:</Text>
          <Text>
            {profile.firstname} {profile.lastname}
          </Text>
        </Flex>
        <Flex gap="64px" justifyContent="space-between">
          <Text>Email:</Text>
          <Text>{profile.email}</Text>
        </Flex>
        <Flex gap="64px" justifyContent="space-between">
          <Text>Contact:</Text>
          <Text>{profile.contactNumber}</Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default InfoCard;
