// src/pages/AllProduitsPage.tsx

import { useProduitsBase } from '../hooks/useProduitsBase'; // Notre nouveau hook
import ListPageLayout from '../components/design/ListPageLayout';
import ProductCard from '../components/design/ProductCard';
import { SimpleGrid, Flex, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const AllProduitsPage = () => {
  const { data: produits, isLoading, isError, error } = useProduitsBase();

  return (
    <ListPageLayout
      title="Liste des Produits"
      isLoading={isLoading}
      isError={isError}
      error={error}
    >
      <Flex justify="flex-end" mb={6}>
        <Button as={RouterLink} to="/admin/produits/new" colorScheme="purple">
          Ajouter un Produit (Admin)
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing={8}>
        {produits?.map(produit => (
          <ProductCard key={produit.id} produit={produit} />
        ))}
      </SimpleGrid>
    </ListPageLayout>
  );
};

export default AllProduitsPage;