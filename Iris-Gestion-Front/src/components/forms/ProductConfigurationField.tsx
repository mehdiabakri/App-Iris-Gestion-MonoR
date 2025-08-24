import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  Box, Heading, VStack, Select, FormControl, FormLabel,
  CheckboxGroup, Checkbox, Stack, SimpleGrid, Divider, Spinner,
} from "@chakra-ui/react";
import type { ProduitBase, Option, Categorie } from "../../types/Types";

import { fetchCategories, fetchProductsByCategory } from "../../api/categorie"; 

const ProductConfigurationField = () => {
  const { register, control, watch, setValue } = useFormContext();

  // Surveille les valeurs sélectionnées dans le formulaire
  const selectedCategoryIri = watch("commande.categorie");
  const selectedProduitBaseIri = watch("commande.produitBase");

  // --- GESTION DES DONNÉES ---

  // 1. On charge les catégories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // 2. On charge les produits SEULEMENT si une catégorie est sélectionnée
  const { data: produits, isLoading: isLoadingProduits } = useQuery({
    queryKey: ['products', selectedCategoryIri],
    queryFn: () => fetchProductsByCategory(selectedCategoryIri!),
    enabled: !!selectedCategoryIri,
  });

  // --- LOGIQUE D'AFFICHAGE ---

  // Trouve le produit sélectionné dans la liste des produits chargés
  const selectedProduit = useMemo(() => {
    if (!selectedProduitBaseIri || !produits) return null;
    return produits.find(p => p["@id"] === selectedProduitBaseIri);
  }, [selectedProduitBaseIri, produits]);

  // Prépare les options DU produit sélectionné pour l'affichage
  const optionsDisponiblesByType = useMemo(() => {
    if (!selectedProduit) return {};
    return selectedProduit.optionsDisponibles.reduce((acc, option) => {
      acc[option.type] = acc[option.type] || [];
      acc[option.type].push(option);
      return acc;
    }, {} as Record<string, Option[]>);
  }, [selectedProduit]);

  // --- HANDLERS ---

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("commande.categorie", e.target.value);
    setValue("commande.produitBase", "");
    setValue("commande.options_Finition", "");
    setValue("commande.options_Taille", "");
    setValue("commande.options_Extra", []);
  };

  const handleProduitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("commande.produitBase", e.target.value);
    setValue("commande.options_Finition", "");
    setValue("commande.options_Taille", "");
    setValue("commande.options_Extra", []);
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" bg="brand.600" boxShadow="sm">
      <Heading size="md" mb={6}>Configuration du Produit</Heading>
      <VStack spacing={6} align="stretch">
        <FormControl>
          <FormLabel>Catégorie</FormLabel>
          {isLoadingCategories ? <Spinner size="sm"/> : (
            <Select bg="white" placeholder="Choisir une catégorie" {...register("commande.categorie")} onChange={handleCategoryChange}>
              {categories?.map((cat: Categorie) => (
                <option key={cat["@id"]} value={cat["@id"]}>{cat.nom}</option>
              ))}
            </Select>
          )}
        </FormControl>

        {/* 1. Apparaît si une catégorie est choisie */}
        {selectedCategoryIri && (
            <FormControl>
              <FormLabel>Produit</FormLabel>
              {isLoadingProduits ? <Spinner size="sm"/> : (
                <Select bg="white" placeholder="Choisir un produit" {...register("commande.produitBase")} onChange={handleProduitChange}>
                    {produits?.map((p: ProduitBase) => (
                      <option key={p["@id"]} value={p["@id"]}>{p.nom}</option>
                    ))}
                </Select>
              )}
            </FormControl>
        )}
        
        {/* 2. Apparaît si un produit est choisi */}
        {selectedProduit && (
            <>
              <Divider />
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {optionsDisponiblesByType["Finition"] && (
                    <FormControl>
                      <FormLabel>Finition</FormLabel>
                      <Select bg="white" placeholder="Choisir une finition" {...register("commande.options_Finition")}>
                        {optionsDisponiblesByType["Finition"].map(opt => <option key={opt["@id"]} value={opt["@id"]}>{opt.nom}</option>)}
                      </Select>
                    </FormControl>
                  )}
                  {optionsDisponiblesByType["Taille"] && (
                    <FormControl>
                      <FormLabel>Taille</FormLabel>
                      <Select bg="white" placeholder="Choisir une taille" {...register("commande.options_Taille")}>
                        {optionsDisponiblesByType["Taille"].map(opt => <option key={opt["@id"]} value={opt["@id"]}>{opt.nom}</option>)}
                      </Select>
                    </FormControl>
                  )}
              </SimpleGrid>
              {optionsDisponiblesByType["Extra"] && (
                <FormControl bg="white" p={5} borderRadius={6}>
                  <FormLabel>Extras</FormLabel>
                  <Controller name="commande.options_Extra" control={control} defaultValue={[]} render={({ field }) => (
                    <CheckboxGroup  {...field}>
                      <Stack  direction={{ base: "column", md: "row" }} spacing={4}>
                        {optionsDisponiblesByType["Extra"].map(opt => <Checkbox key={opt['@id']} value={opt['@id']}>{opt.nom}</Checkbox>)}
                      </Stack>
                    </CheckboxGroup>
                  )} />
                </FormControl>
              )}
            </>
        )}
      </VStack>
    </Box>
  );
};

export default ProductConfigurationField;