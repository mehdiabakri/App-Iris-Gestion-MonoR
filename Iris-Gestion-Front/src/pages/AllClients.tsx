import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Button, Text, Box } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

// Hooks et Composants
import { useClients } from "../hooks/useClients";
import { clientColumns } from "../config/columns";
import ListPageLayout from "../components/design/ListPageLayout";
import ResourceTable from "../components/design/ResourceTable";

// Type
import { Client } from "../types/Types";

const AllClients = () => {
  const { data: clients, isLoading, isError, error } = useClients();
  const navigate = useNavigate();

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleClientClick = (client: Client) => {
    navigate(`/clients/${client.id}`);
  };

  // --- Logic ---
  const allClients: Client[] = (clients as Client[]) || [];
  const totalPages = Math.ceil(allClients.length / itemsPerPage);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = allClients.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // remonter en haut de page lors du changement
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ListPageLayout
      title="Liste des clients"
      isLoading={isLoading}
      isError={isError}
      error={error}
    >
      <Box display="flex" flexDirection="column" gap={6}>
        {/* TABLEAU */}
        <ResourceTable
          data={currentClients}
          columns={clientColumns}
          onRowClick={handleClientClick}
        />

        {/* PAGINATION ZONE */}
        {allClients.length > itemsPerPage && (
          <Flex
            justify="space-between"
            align="center"
            p={4}
            borderTop="1px solid"
            borderColor="whiteAlpha.200"
            mt={4}
          >
            {/* BOUTON PRÉCÉDENT */}
            <Button
              onClick={() => paginate(currentPage - 1)}
              isDisabled={currentPage === 1}
              variant="outline"
              borderColor="brand.500"
              color="brand.500"
              leftIcon={<ChevronLeftIcon boxSize={6} />}
              _hover={{
                bg: "brand.500",
                color: "brand.700",
              }}
              _disabled={{
                opacity: 0.3,
                cursor: "not-allowed",
                borderColor: "gray.600",
                color: "gray.600"
              }}
              size="sm"
            >
              Précédent
            </Button>

            {/* INDICATEUR DE PAGE */}
            <Text color="white" fontSize="sm" fontFamily="heading">
              Page{" "}
              <Text as="span" color="brand.500" fontWeight="bold" fontSize="md">
                {currentPage}
              </Text>{" "}
              / {totalPages}
            </Text>

            {/* BOUTON SUIVANT */}
            <Button
              onClick={() => paginate(currentPage + 1)}
              isDisabled={currentPage === totalPages}
              bg="brand.500"
              color="brand.700"
              rightIcon={<ChevronRightIcon boxSize={6} />}
              _hover={{
                bg: "brand.400",
                transform: "translateY(-1px)",
                shadow: "lg"
              }}
              _active={{
                bg: "brand.300",
              }}
              _disabled={{
                bg: "whiteAlpha.200",
                color: "whiteAlpha.500",
                cursor: "not-allowed",
                boxShadow: "none",
                transform: "none"
              }}
              size="sm"
            >
              Suivant
            </Button>
          </Flex>
        )}
      </Box>
    </ListPageLayout>
  );
};

export default AllClients;