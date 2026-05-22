import { Flex, Box } from "@chakra-ui/react";
import { Outlet,useLocation  } from "react-router-dom";
import Topbar from "./Topbar";
import DemoBanner from "../design/DemoBanner";

const Layout = () => {
  const location = useLocation();
  const isKanbanPage = location.pathname.includes("/kanban"); // Vérifie si l'URL contient "/kanban" pour ajuster la width
  return (
    <Flex direction="column" minH="100vh" bg="black">
      
      <Box 
        as="header" 
        position="fixed" 
        top={0} 
        left={0} 
        right={0} 
        zIndex={1000} 
      >
        <DemoBanner />
        <Topbar />
      </Box>

      <Box 
        as="main" 
        pt="110px" 
        px={isKanbanPage ? 2 : 6}  
        flex="1"
        w="100%"
        maxW={isKanbanPage ? "100%" : "1900px"}
        mx="auto"
      >
        <Outlet />
      </Box>
      
    </Flex>
  );
};

export default Layout;