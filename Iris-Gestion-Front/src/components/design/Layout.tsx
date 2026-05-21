import { Flex, Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import DemoBanner from "../design/DemoBanner";

const Layout = () => {
  return (
    <Flex direction="column" minH="100vh" bg="black">
      
      <Box 
        as="header" 
        position="fixed" 
        top={0} 
        left={0} 
        right={0} 
        zIndex={2000} 
      >
        <DemoBanner />
        <Topbar />
      </Box>

      <Box 
        as="main" 
        pt="110px" 
        px={6} 
        flex="1"
      >
        <Outlet />
      </Box>
      
    </Flex>
  );
};

export default Layout;