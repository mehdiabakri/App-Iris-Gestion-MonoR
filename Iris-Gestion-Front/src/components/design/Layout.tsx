import { Flex, Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";

const Layout = () => {
  return (
    <Flex direction="column" minH="100vh">
      <Topbar />
      <Box as="main" pt="60px" px={6} flex="1">
        <Outlet />
      </Box>
    </Flex>
  );
};

export default Layout;