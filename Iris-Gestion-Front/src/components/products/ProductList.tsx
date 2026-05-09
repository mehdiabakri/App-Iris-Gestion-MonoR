import React, { useMemo } from "react";
import {
  Box,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useProduitsBase, useDeleteProduit } from "../../hooks/useProduitsBase";
import { ProduitBase } from "../../types/Types";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const { data: produits, isLoading, isError } = useProduitsBase();
  const deleteMutation = useDeleteProduit();
  const navigate = useNavigate();
  const toast = useToast();
  
  const handleDelete = (id: number, nom: string) => {
    if (window.confirm(`Es-tu sûr de vouloir supprimer "${nom}" ?`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast({
            title: "Produit supprimé.",
            description: `${nom} a été supprimé avec succès.`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        },
        onError: () => {
          toast({
            title: "Erreur",
            description: "Impossible de supprimer ce produit.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        },
      });
    }
  };
  
  
const produitsArray = useMemo(() => {
    if (!produits) return[];
        if (Array.isArray(produits)) return produits as ProduitBase[];
    
    type ApiResponse = {
      "hydra:member"?: ProduitBase[];
      data?: ProduitBase[];
    };

    const p = produits as unknown as ApiResponse;
    
    if (p["hydra:member"]) return p["hydra:member"];
    if (p.data) return p.data;
    
    return [];
  }, [produits]);

  // Groupement par catégories
  const produitsGroupes = useMemo(() => {
    if (produitsArray.length === 0) return {};

    const produitsTries = [...produitsArray].sort((a: ProduitBase, b: ProduitBase) =>
      a.nom.localeCompare(b.nom)
    );

    return produitsTries.reduce((acc, produit: ProduitBase) => {
      const categorieNom = produit.categorie?.nom || "Sans catégorie";
      if (!acc[categorieNom]) acc[categorieNom] = [];
      acc[categorieNom].push(produit);
      return acc;
    }, {} as Record<string, ProduitBase[]>);
  }, [produitsArray]);

  const categoriesTriees = Object.keys(produitsGroupes).sort();

  if (isLoading)
    return (
      <Box p={5} textAlign="center">
        <Spinner size="xl" color="brand.500" />
      </Box>
    );

  if (isError)
    return (
      <Alert status="error" m={5}>
        <AlertIcon />
        Erreur lors du chargement des produits.
      </Alert>
    );

  return (
    <Box p={5}>
²      <Button
        bg="brand.500"
        color="black"
        _hover={{ bg: "brand.300" }}
        mb={8}
        onClick={() => navigate("/produits/ajouter")}
      >
        + Ajouter un produit
      </Button>

      {/* Affichage des catégories */}
      {categoriesTriees.map((categorieNom) => (
        <Box key={categorieNom} mb={10}>
          <Heading size="md" color="white" textTransform="uppercase" letterSpacing="wider" mb={4}>
            📁 {categorieNom}
          </Heading>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 4 }} spacing={6}>
            {/* --- CORRECTION DE L'ERREUR "ANY" : On précise : ProduitBase --- */}
            {produitsGroupes[categorieNom].map((produit: ProduitBase) => (
              <ProductCard
                key={produit.id}
                produit={produit}
                onEdit={() => navigate(`/produits/modifier/${produit.id}`)}
                onDelete={() => handleDelete(produit.id, produit.nom)}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </SimpleGrid>
        </Box>
      ))}

      {/* Message si aucun produit */}
      {produitsArray.length === 0 && (
        <Box color="gray.400" textAlign="center" mt={10} p={5} border="1px dashed" borderColor="gray.600" borderRadius="md">
          Aucun produit trouvé.
        </Box>
      )}
    </Box>
  );
}