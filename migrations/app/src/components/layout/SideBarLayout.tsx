import { Box, Flex } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

const SideBarLayout = ({
  children,
  SideBar,
}: {
  children: ReactNode;
  SideBar: FC;
}) => {
  return (
    <Flex marginTop="48px" gap="60px">
      <Box
        position="sticky"
        overscrollBehavior="contain"
        width={"420px"}
        top="32px"
        height="100%"
      >
        <SideBar />
      </Box>
      <Box flex="1">{children}</Box>
    </Flex>
  );
};

export default SideBarLayout;
