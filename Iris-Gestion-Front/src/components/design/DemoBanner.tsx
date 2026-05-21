import { Box, Alert, AlertIcon, Text, Flex, Button } from "@chakra-ui/react";

const DemoBanner = () => {
  const isDemo = localStorage.getItem("isDemoMode") === "true";
  if (!isDemo) return null;

  return (
    <Box w="100%">
      <Alert status="warning" variant="solid" m={0} py={1} justifyContent="center">
        <Flex align="center">
          <AlertIcon />
          <Text fontSize="sm" fontWeight="bold" mr={4}>
            ENVIRONNEMENT DE DÉMO - Les données sont simulées et certaines fonctionnalités sont désactivées.
          </Text>
          <Button
            size="xs"
            colorScheme="blackAlpha"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Quitter la démo
          </Button>
        </Flex>
      </Alert>
    </Box>
  );
};

export default DemoBanner;
