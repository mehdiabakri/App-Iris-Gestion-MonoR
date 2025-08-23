// src/pages/CreateClientPage.tsx

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createClientWithOrder } from "../api/client"; // Assurez-vous que le chemin est correct
import ProductConfigurationField from "../components/forms/ProductConfigurationField";

// On importe le type de formulaire depuis le fichier central de types
import type { ClientFormData, CreateClientPayload } from "../types/Types";

import {
  Box,
  Heading,
  Button,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  FormErrorMessage,
  VStack,
  useToast,
} from "@chakra-ui/react";

const CreateClientPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  const methods = useForm<ClientFormData>({
    defaultValues: {
      // On préfixe les champs de la commande
      commande: {
        statut: "A retoucher",
      },
    },
  });

  const {
    register, // On peut le déstructurer ici pour un accès plus simple dans ce fichier
    handleSubmit,
    formState: { errors },
  } = methods;

  const mutation = useMutation({
    mutationFn: createClientWithOrder,
    onSuccess: (newClient) => {
      toast({
        title: "Client créé.",
        description: "Le nouveau client et sa commande ont été ajoutés.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      navigate(`/clients/${newClient.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de création.",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (data) => {
    
    // 1. On valide que le produit de base a bien été sélectionné
    if (!data.commande?.produitBase) {
      toast({
        title: "Produit manquant",
        description: "Veuillez sélectionner un produit de base.",
        status: "warning",
        isClosable: true,
      });
      return; // On arrête la soumission
    }
    
    // 2. On collecte TOUTES les options choisies (Select + Checkbox) en une seule fois
    const optionsChoisiesIRIs: string[] = [];
    
    // On s'assure que `data.commande` existe avant de le parcourir
    if (data.commande) {
      Object.keys(data.commande).forEach((key) => {
        const value = data.commande[key];
        
        // Si la clé commence par "options_"
              // On collecte les Selects
      if (key.startsWith('options_') && typeof value === 'string' && value) {
        optionsChoisiesIRIs.push(value);
      }
      // On collecte les Checkboxes
      if (key === 'options_extra' && Array.isArray(value)) {
        optionsChoisiesIRIs.push(...value);
      }
      });
    }
    
    const payload: CreateClientPayload = {
      prenom: data.prenom,
      nom: data.nom,
      email: data.email,
      telephone: data.telephone,
      adresse: data.adresse,
      complementAdresse: data.complementAdresse,
      codePostal: data.codePostal,
      ville: data.ville,
      pays: data.pays,
      commandes: [
        {
          statut: data.commande.statut,
          nbIris: data.commande.nbIris,
          nbIrisAnimaux: data.commande.nbIrisAnimaux,
          photographe: data.commande.photographe,
          livraison: data.commande.livraison,
          provenance: data.commande.provenance,
          rdv: data.commande.rdv,
          carteCadeau: data.commande.carteCadeau,
          codeCarteCadeau: data.commande.codeCarteCadeau,
          effet: data.commande.effet,
          numPhoto: data.commande.numPhoto,
          couleur: data.commande.couleur,
          remarque: data.commande.remarque,

          produitBase: data.commande.produitBase,
          optionsChoisies: optionsChoisiesIRIs,
        },
      ],
    };
    mutation.mutate(payload);
  };

  return (
    <Box p={{ base: 4, md: 8 }}>
      <Heading mb={6} color="brand.600">
        Nouveau Client & Commande
      </Heading>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={8} align="stretch">
            {/* --- Section Informations Client --- */}
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
              boxShadow="sm"
            >
              <Heading size="md" mb={6} color="brand.700">
                Informations Personnelles
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isInvalid={!!errors.prenom}>
                  <FormLabel>Prénom</FormLabel>
                  <Input
                    {...register("prenom", {
                      required: "Le prénom est requis",
                    })}
                  />
                  <FormErrorMessage>{errors.prenom?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.nom}>
                  <FormLabel>Nom</FormLabel>
                  <Input
                    {...register("nom", { required: "Le nom est requis" })}
                  />
                  <FormErrorMessage>{errors.nom?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" {...register("email")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Téléphone</FormLabel>
                  <Input type="tel" {...register("telephone")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Adresse</FormLabel>
                  <Input {...register("adresse")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Complément d'adresse</FormLabel>
                  <Input {...register("complementAdresse")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Code Postal</FormLabel>
                  <Input {...register("codePostal")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Ville</FormLabel>
                  <Input {...register("ville")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Pays</FormLabel>
                  <Input {...register("pays")} />
                </FormControl>
              </SimpleGrid>
            </Box>

            {/* --- Section Informations Commande --- */}
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
              boxShadow="sm"
            >
              <Heading size="md" mb={6} color="brand.700">
                Détails de la Commande
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                <FormControl isInvalid={!!errors.commande?.statut}>
                  <FormLabel>Statut</FormLabel>
                  <Select
                    placeholder="Choisir un statut"
                    {...register("commande.statut", {
                      required: "Le statut est requis",
                    })}
                  >
                    <option value="A retoucher">A retoucher</option>
                    <option value="A imprimer">A imprimer</option>
                    <option value="A envoyer client">A envoyer client</option>
                    <option value="Attente retour client">Attente retour client</option>
                    <option value="A commander">A commander</option>
                    <option value="Commande OK">Commande OK</option>
                    <option value="Livraison en cours">Livraison en cours</option>
                    <option value="Terminé">Terminé</option>
                    
                  </Select>
                  <FormErrorMessage>
                    {errors.commande?.statut?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel>Nombre d'iris</FormLabel>
                  <Select
                    placeholder="Choisir un nombre"
                    {...register("commande.nbIris")}
                  >
                    {[...Array(9)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Nombre d'iris Animaux</FormLabel>
                  <Select
                    placeholder="Choisir un nombre"
                    {...register("commande.nbIrisAnimaux")}
                  >
                    {[...Array(9)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Photographe</FormLabel>
                  <Select
                    placeholder="Choisir un photographe"
                    {...register("commande.photographe")}
                  >
                    <option value="Manon">Manon</option>
                    <option value="Mehdi">Mehdi</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Mode de livraison</FormLabel>
                  <Select
                    placeholder="Choisir un mode de livraison"
                    {...register("commande.livraison")}
                  >
                    <option value="Livraison à domicile">
                      Livraison à domicile
                    </option>
                    <option value="Retrait en magasin">
                      Retrait en magasin
                    </option>
                    <option value="Retrait Boutique réseau">
                      Retrait Boutique réseau
                    </option>
                    <option value="Envoi mail">Envoi mail</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Provenance</FormLabel>
                  <Select
                    placeholder="Choisir une provenance"
                    {...register("commande.provenance")}
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Tiktok">Tiktok</option>
                    <option value="Internet">Internet</option>
                    <option value="Concurrence puis chez vous">
                      Concurrence puis chez vous
                    </option>
                    <option value="Ami / bouche à oreille">
                      Ami / bouche à oreille
                    </option>
                    <option value="Influenceur">Influenceur</option>
                    <option value="Carte cadeau">Carte cadeau</option>
                    <option value="En passant">En passant</option>
                    <option value="Déjà client">Déjà client</option>
                    <option value="TV- Reportage TV">TV- Reportage TV</option>
                    <option value="Evènement">Evènement</option>
                    <option value="Groupon">Groupon</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Sur RDV</FormLabel>
                  <Select placeholder="Rdv..." {...register("commande.rdv")}>
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Bon cadeau</FormLabel>
                  <Select
                    placeholder="Choisir une option"
                    {...register("commande.carteCadeau")}
                  >
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                    <option value="Groupon">Groupon</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Code bon cadeau</FormLabel>
                  <Input {...register("commande.codeCarteCadeau")} />
                </FormControl>
              </SimpleGrid>
            </Box>

            {/* --- Section Produits --- */}
            <ProductConfigurationField />

            {/* --- Section Informations Post-production --- */}
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
              boxShadow="sm"
            >
              <Heading size="md" mb={6} color="brand.700">
                Détails de la Post-production
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                <FormControl>
                  <FormLabel>Effet</FormLabel>
                  <Select
                    placeholder="Choisir un effet"
                    {...register("commande.effet")}
                  >
                    <option value="Naturel">Naturel</option>
                    <option value="Riviere">Rivière</option>
                    <option value="Explosion">Explosion</option>
                    <option value="New Explosion">New Explosion</option>
                    <option value="Planete">Planète</option>
                    <option value="Comete">Comète</option>
                    <option value="Duo">Duo / Sur le coté</option>
                    <option value="Fusion">Fusion</option>
                    <option value="Coeur">Coeur</option>
                    <option value="Poudre">Poudre</option>
                    <option value="Infini">Infini</option>
                    <option value="Reflet">Reflet</option>
                    <option value="Fleur">Fleur</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Photos numéros</FormLabel>
                  <Input {...register("commande.numPhoto")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Couleurs</FormLabel>
                  <Input {...register("commande.couleur")} />
                </FormControl>
                <FormControl gridColumn={{ md: "span 3" }}>
                  <FormLabel>Remarque</FormLabel>
                  <Textarea
                    placeholder="Indiquer si traitement particulier, date de livraison souhaitée etc..."
                    {...register("commande.remarque")}
                  />
                </FormControl>
              </SimpleGrid>
            </Box>

            {/* --- Bouton de Soumission --- */}
            <Button
              mt={8}
              colorScheme="yellow"
              isLoading={mutation.isPending}
              type="submit"
              size="lg"
              width="full"
            >
              Créer le Client et la Commande
            </Button>
          </VStack>
        </form>
      </FormProvider>
    </Box>
  );
};

export default CreateClientPage;
