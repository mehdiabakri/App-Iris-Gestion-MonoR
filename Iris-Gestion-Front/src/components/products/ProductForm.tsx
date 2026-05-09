import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  CheckboxGroup,
  Checkbox,
  Stack,
  useToast,
  Spinner,
  HStack,
  Text,
} from "@chakra-ui/react";

import type {
  ProduitBase,
  Categorie,
  Option,
  ProduitBaseFormData,
} from "../../types/Types";
import {
  fetchProduitById,
  createProduit,
  updateProduit,
} from "../../api/produitsBase";
import { fetchCategories } from "../../api/categorie";
import { fetchOptions } from "../../api/options";

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProduitBaseFormData>({
    defaultValues: { nom: "", categorie: "", optionsDisponibles: [] },
  });

  const { data: categories } = useQuery<Categorie[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: optionsData } = useQuery<Option[]>({
    queryKey: ["options"],
    queryFn: fetchOptions,
  });

  const { data: produitExistant, isLoading: isLoadingProduit } =
    useQuery<ProduitBase>({
      queryKey: ["produit", id],
      queryFn: () => fetchProduitById(id!),
      enabled: isEditMode,
    });

  useEffect(() => {
    if (produitExistant && isEditMode) {
      reset({
        nom: produitExistant.nom,
        categorie:
          typeof produitExistant.categorie === "object"
            ? produitExistant.categorie["@id"]
            : produitExistant.categorie,

        optionsDisponibles: produitExistant.optionsDisponibles.map(
          (opt: Option | string) => {
            if (typeof opt === "object" && "@id" in opt) {
              return opt["@id"];
            }
            return opt as string;
          },
        ),
      });
    }
  }, [produitExistant, isEditMode, reset]);

  const mutation = useMutation({
    mutationFn: (variables: {
      id?: string | number;
      data: ProduitBaseFormData;
    }) => {
      if (isEditMode && variables.id) {
        // Si on modifie, on appelle update
        return updateProduit({ id: variables.id, data: variables.data });
      }
      // Sinon, on appelle create
      return createProduit(variables.data);
    },
    onSuccess: () => {
      toast({
        title: isEditMode ? "Produit modifié" : "Produit créé",
        status: "success",
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ["produitsBase"] });
      navigate("/produits");
    },
    onError: (error: Error) => {
      toast({ title: "Erreur", description: error.message, status: "error" });
    },
  });

  const onSubmit = (data: ProduitBaseFormData) => {
    mutation.mutate({ id: id, data: data });
  };

  if (isEditMode && isLoadingProduit) return <Spinner />;

  const groupedOptions = optionsData?.reduce(
    (acc, opt) => {
      const type = opt.type || "Autre";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(opt);
      return acc;
    },
    {} as Record<string, Option[]>,
  );

  return (
    <Box p={6} bg="white" w="100%" borderRadius="lg" mx="auto" mt={8}>
      <Heading size="md" mb={6} color="brand.700">
        {isEditMode
          ? `Modifier : ${produitExistant?.nom}`
          : "Ajouter un Produit"}
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={6} align="stretch">
          <FormControl isInvalid={!!errors.nom} isRequired>
            <FormLabel>Nom du produit</FormLabel>
            <Input {...register("nom", { required: "Le nom est requis" })} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Catégorie</FormLabel>
            <Select
              placeholder="Choisir"
              {...register("categorie", { required: true })}
            >
              {categories?.map((cat: Categorie) => (
                <option key={cat["@id"]} value={cat["@id"]}>
                  {cat.nom}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Options disponibles</FormLabel>
            <Box p={4} borderWidth={1} borderRadius="md">
              <Controller
                name="optionsDisponibles"
                control={control}
                render={({ field }) => (
                  <CheckboxGroup value={field.value} onChange={field.onChange}>
                    <VStack spacing={6} align="stretch">
                      {groupedOptions &&
                        Object.entries(groupedOptions).map(
                          ([type, options]) => (
                            <Box key={type}>
                              {/* Titre du groupe (ex: Taille, Finition...) */}
                              <Text
                                fontWeight="bold"
                                fontSize="sm"
                                textTransform="uppercase"
                                color="brand.500"
                                mb={3}
                                borderBottom="1px solid"
                                borderColor="gray.100"
                                pb={1}
                              >
                                {type}
                              </Text>

                              {/* Liste des checkboxes pour ce type */}
                              <Stack spacing={2} pl={2}>
                                {options.map((opt: Option) => (
                                  <Checkbox key={opt["@id"]} value={opt["@id"]}>
                                    <Text fontSize="sm">{opt.nom}</Text>
                                  </Checkbox>
                                ))}
                              </Stack>
                            </Box>
                          ),
                        )}
                    </VStack>
                  </CheckboxGroup>
                )}
              />
            </Box>
          </FormControl>

          <HStack justifyContent="flex-end">
            <Button onClick={() => navigate("/produits")}>Annuler</Button>
            <Button
              colorScheme="yellow"
              type="submit"
              isLoading={mutation.isPending}
            >
              Enregistrer
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
}
