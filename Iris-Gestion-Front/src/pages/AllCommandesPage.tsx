import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Select, 
  HStack, 
  Button, 
  Box, 
  Flex, 
  Text 
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

import { useCommandes } from '../hooks/useCommandes';
import { allOrderColumns } from '../config/columns';
import ListPageLayout from '../components/design/ListPageLayout';
import ResourceTable from '../components/design/ResourceTable';

// Importez votre type Commande (adaptez le chemin selon votre projet)
import { Commande } from '../types/Types';

type CommandeFilters = {
  statut?: string;
};

const STATUTS = [
  "A retoucher", "A imprimer", "A envoyer client", "Attente retour client",
  "A commander", "Commande OK", "Terminé", "Livraison en cours"
];

const AllCommandesPage = () => {
  const navigate = useNavigate();
  
  // --- 1. Etats ---
  const [filters, setFilters] = useState<CommandeFilters>({});
  const [currentPage, setCurrentPage] = useState(1); // État pour la pagination
  const itemsPerPage = 20;

  const { data: commandes, isLoading, isError, error } = useCommandes(filters);

  // --- 2. Logique de Filtrage ---
  const handleStatutChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatut = event.target.value;
    
    // IMPORTANT UX : On revient page 1 quand on change le filtre
    setCurrentPage(1); 

    if (newStatut) {
      setFilters({ statut: newStatut });
    } else {
      setFilters({});
    }
  };
  
  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1); // Reset page aussi ici
  };

  // --- 3. Logique de Pagination ---
  const allCommandes: Commande[] = (commandes as Commande[]) || [];
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommandes = allCommandes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allCommandes.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ListPageLayout
      title="Toutes les Commandes"
      isLoading={isLoading}
      isError={isError}
      error={error}
    >
      <Box display="flex" flexDirection="column" gap={6}>
        
        {/* --- Section des Filtres (Stylisée pour fond sombre) --- */}
        <HStack spacing={4}>
          <Select 
            placeholder="Filtrer par statut..." 
            onChange={handleStatutChange}
            value={filters.statut || ''} 
            maxWidth="300px"
            
            // Styles pour le thème sombre/jaune
            bg="brand.700"          // Fond noir
            color="white"           // Texte blanc
            borderColor="whiteAlpha.400"
            _hover={{ borderColor: "brand.500" }}
            _focus={{ 
              borderColor: "brand.500", 
              boxShadow: "0 0 0 1px #F8DE29" // Glow jaune au focus
            }}
            iconColor="brand.500"   // La flèche du select en jaune
          >
            {STATUTS.map(statut => (
              <option key={statut} value={statut} style={{ backgroundColor: '#000' }}>
                {/* Note: le style inline bg: #000 est nécessaire pour les options sur certains navigateurs */}
                {statut}
              </option>
            ))}
          </Select>

          <Button 
            onClick={handleResetFilters} 
            variant="outline"
            borderColor="brand.500"
            color="brand.500"
            _hover={{ bg: "brand.500", color: "brand.700" }}
          >
            Réinitialiser
          </Button>
        </HStack>

        {/* --- Tableau --- */}
        <ResourceTable
          data={currentCommandes}
          columns={allOrderColumns}
          onRowClick={(commande) => {
            // TypeScript sait que 'commande' est de type Commande grâce au typage plus haut
            navigate(`/clients/${commande.client.id}`);
          }}
        />

        {/* --- Pagination Zone (Identique à Clients) --- */}
        {allCommandes.length > itemsPerPage && (
          <Flex
            justify="space-between"
            align="center"
            p={4}
            borderTop="1px solid"
            borderColor="whiteAlpha.200"
            mt={2}
          >
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

            <Text color="white" fontSize="sm" fontFamily="heading">
              Page{" "}
              <Text as="span" color="brand.500" fontWeight="bold" fontSize="md">
                {currentPage}
              </Text>{" "}
              / {totalPages}
            </Text>

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
              _active={{ bg: "brand.300" }}
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

export default AllCommandesPage;