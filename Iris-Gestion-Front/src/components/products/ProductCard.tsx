import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Tag,
  Image,
  AspectRatio,
  Wrap,
  WrapItem,
  HStack,
  Button,
} from "@chakra-ui/react";
import type { ProduitBase } from "../../types/Types";

type ProductCardProps = {
  produit: ProduitBase;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
};

const img_categorie: Record<string, string> = {
  "Bijoux" : "/images/bijoux.jpeg",
  "Blocs" : "/images/bloc.jpg",
  "Bon cadeau" : "/images/bon.jpeg",
  "Caissons Lumineux" : "/images/caissons.jpeg",
  "Fichiers Digitaux" : "/images/fichier.jpeg",
  "Impressions" : "/images/impressions.jpg",
  "Ronds" : "/images/rond.jpg",
  "Tableaux" : "/images/tableaux.png",
}

const ProductCard = ({
  produit,
  onEdit,
  onDelete,
  isDeleting,
}: ProductCardProps) => {

  const IMAGE_PAR_DEFAUT = "https://via.placeholder.com/400";
  const nomCategorie = produit.categorie?.nom;

  const imageSource = nomCategorie && img_categorie[nomCategorie] 
  ? img_categorie[nomCategorie] 
  : IMAGE_PAR_DEFAUT;
  return (
    <Box
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      borderRadius="lg"
      bg="brand.200"
      color="brand.400"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{
        boxShadow: "lg",
        transform: "translateY(-4px)",
        bg: "whiteAlpha.100",
      }}
    >      
    <AspectRatio ratio={1 / 1} w="100%">
        <Image
          src={imageSource}
          alt={`Image pour ${produit.nom}`}
          objectFit="cover"
        />
      </AspectRatio>
      <Box p={5}>
        <VStack align="stretch" spacing={4}>
          <Box>
            <Tag size="sm" colorScheme="yellow" variant="subtle" mb={2}>
              {produit.categorie?.nom || "Sans catégorie"}
            </Tag>
            <Heading size="md" color="brand.500" isTruncated>
              {produit.nom}
            </Heading>
          </Box>

          {produit.optionsDisponibles &&
            produit.optionsDisponibles.length > 0 && (
              <Box>
                <Text fontSize="xs" color="gray.400" mb={2}>
                  Options disponibles :
                </Text>
                <Wrap spacing={2}>
                  {produit.optionsDisponibles.slice(0, 4).map((option) => (
                    <WrapItem key={option.id}>
                      <Tag size="sm" bg="whiteAlpha.200" color="white">
                        {option.nom}
                      </Tag>
                    </WrapItem>
                  ))}
                  {produit.optionsDisponibles.length > 4 && (
                    <WrapItem>
                      <Tag size="sm" bg="whiteAlpha.200" color="white">
                        ...
                      </Tag>
                    </WrapItem>
                  )}
                </Wrap>
              </Box>
            )}

          {/* --- BOUTONS D'ACTION --- */}
          <HStack pt={2} justifyContent="space-between" w="100%">
            <Button
              size="sm"
              variant="outline"
              colorScheme="yellow"
              onClick={onEdit}
            >
              ✏️ Modifier
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              isLoading={isDeleting}
              onClick={onDelete}
            >
              🗑️
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default ProductCard;
