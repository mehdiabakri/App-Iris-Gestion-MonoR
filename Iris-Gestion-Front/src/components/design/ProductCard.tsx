import React from 'react';
import { Box, Heading, Text, VStack, Tag, Image, AspectRatio, Wrap, WrapItem } from '@chakra-ui/react';
import type { ProduitBase } from '../../types/Types'; // Importez votre type

type ProductCardProps = {
  produit: ProduitBase;
};

const ProductCard = ({ produit }: ProductCardProps) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="sm"
      bg="white"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
    >
      <AspectRatio ratio={16 / 9}>
        <Image
          src="https://i.ibb.co/S7XdDLpL/Logo-2-carr-basse-r-solution.jpg"
          alt={`Image pour ${produit.nom}`}
          objectFit="cover"
        />
      </AspectRatio>
      
      <Box p={5}>
        <VStack align="stretch" spacing={3}>
          <Tag size="sm" colorScheme="green" variant="subtle" alignSelf="flex-start">
            {produit.categorie?.nom || 'Sans catégorie'}
          </Tag>
          <Heading size="md" isTruncated>{produit.nom}</Heading>
          
          {produit.optionsDisponibles && (
            <Box>
              <Text fontSize="xs" color="gray.500" mb={2}>Options disponibles :</Text>
              <Wrap spacing={2}>
                {produit.optionsDisponibles.slice(0, 4).map(option => (
                  <WrapItem key={option.id}>
                    <Tag size="sm">{option.nom}</Tag>
                  </WrapItem>
                ))}
                {produit.optionsDisponibles.length > 4 && (
                  <WrapItem><Tag size="sm">...</Tag></WrapItem>
                )}
              </Wrap>
            </Box>
          )}

        </VStack>
      </Box>
    </Box>
  );
};

export default ProductCard;