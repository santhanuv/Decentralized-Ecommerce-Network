import { Outlet } from "react-router-dom";
import TopNavbar from "../TopNavbar";
import { Box } from "@chakra-ui/react";

const TopBarLayout = ({}) => {
  return (
    <Box bg="black.200" color="white" px="8" py="4">
      <TopNavbar />
      <Box className="main-content">
        <Outlet />
      </Box>
    </Box>
  );
};

export default TopBarLayout;
