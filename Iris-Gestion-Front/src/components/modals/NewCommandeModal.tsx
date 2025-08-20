import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommande } from "../../api/commandes";
import type { EditCommandFormData } from "../../types/Types"; // On peut réutiliser ce type, il est adapté
import ProductConfigurationField from "../forms/ProductConfigurationField";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Heading,
  Button,
  VStack,
  useToast,
  Select,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";

type NewCommandModalProps = {
  isOpen: boolean;
  onClose: () => void;
  clientId: string; // L'ID du client est requis pour lier la commande
  onSuccess: () => void; // Fonction pour rafraîchir la page de détail du client
};

const NewCommandeModal = ({
  isOpen,
  onClose,
  clientId,
  onSuccess,
}: NewCommandModalProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  // On initialise le formulaire avec des valeurs par défaut pour une nouvelle commande
  const methods = useForm<EditCommandFormData>({
    defaultValues: {
      statut: "A retoucher", // Statut par défaut
      commande: {
        categorie: "",
        produitBase: "",
      },
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const mutation = useMutation({
    mutationFn: createCommande,
    onSuccess: () => {
      toast({
        title: "Commande créée.",
        description: "La nouvelle commande a été ajoutée à ce client.",
        status: "success",
        isClosable: true,
      });
      // Invalider les requêtes liées aux clients pour que la page se mette à jour
      queryClient.invalidateQueries({ queryKey: ["clients", clientId] });
      onSuccess(); // Appelle la fonction de rafraîchissement passée en prop
      onClose(); // Ferme la modale
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de création",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    },
  });

  const onSubmit = (data: EditCommandFormData) => {
    const commandeProductData = data.commande || {};

    const optionsChoisiesIRIs: string[] = [];
    Object.keys(commandeProductData).forEach((key) => {
      if (key.startsWith("options_")) {
        const value = commandeProductData[key];
        if (key === "options_extra" && Array.isArray(value)) {
          optionsChoisiesIRIs.push(...value);
        } else if (typeof value === "string" && value) {
          optionsChoisiesIRIs.push(value);
        }
      }
    });

    const payload = {
      statut: data.statut,
      photographe: data.photographe,
      rdv: data.rdv,
      livraison: data.livraison,
      numPhoto: data.numPhoto,
      effet: data.effet,
      couleur: data.couleur,
      nbIris: data.nbIris,
      nbIrisAnimaux: data.nbIrisAnimaux,
      remarque: data.remarque,
      provenance: data.provenance,
      carteCadeau: data.carteCadeau,
      codeCarteCadeau: data.codeCarteCadeau,

      // Champs du produit qui viennent de 'commandeProductData'
      produitBase: commandeProductData.produitBase,
      optionsChoisies: optionsChoisiesIRIs.filter(Boolean),

      // LA LIGNE LA PLUS IMPORTANTE : On lie la commande au client existant
      client: `/api/clients/${clientId}`,
    };

    mutation.mutate(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "full", md: "4xl", xl: "6xl" }}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent maxH="90vh" overflowY="auto">
        <ModalHeader color="brand.600">
          Ajouter une nouvelle commande
        </ModalHeader>
        <ModalCloseButton />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody pb={6}>
              <VStack spacing={8} align="stretch">
                {/* --- Section Informations Générales --- */}
                <Box>
                  <Heading size="md" mb={6}>
                    Informations Générales
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <FormControl isInvalid={!!errors.statut}>
                      <FormLabel>Statut</FormLabel>
                      <Select {...register("statut")}>
                        <option value="A retoucher">A retoucher</option>
                        <option value="A imprimer">A imprimer</option>
                        <option value="A envoyer client">
                          A envoyer client
                        </option>
                        <option value="Terminé">Terminé</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Photographe</FormLabel>
                      <Select
                        placeholder="Choisir"
                        {...register("photographe")}
                      >
                        <option value="Manon">Manon</option>
                        <option value="Mehdi">Mehdi</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Sur RDV</FormLabel>
                      <Select placeholder="Choisir" {...register("rdv")}>
                        <option value="Oui">Oui</option>
                        <option value="Non">Non</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Nombre d'iris</FormLabel>
                      <Select
                        placeholder="Choisir un nombre"
                        {...register("nbIris")}
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
                        {...register("nbIrisAnimaux")}
                      >
                        {[...Array(9)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Mode de livraison</FormLabel>
                      <Select
                        placeholder="Choisir un mode de livraison"
                        {...register("livraison")}
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
                        {...register("provenance")}
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
                        <option value="TV- Reportage TV">
                          TV- Reportage TV
                        </option>
                        <option value="Evènement">Evènement</option>
                        <option value="Groupon">Groupon</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Sur RDV</FormLabel>
                      <Select placeholder="Rdv..." {...register("rdv")}>
                        <option value="Oui">Oui</option>
                        <option value="Non">Non</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Bon cadeau</FormLabel>
                      <Select
                        placeholder="Choisir une option"
                        {...register("carteCadeau")}
                      >
                        <option value="Oui">Oui</option>
                        <option value="Non">Non</option>
                        <option value="Groupon">Groupon</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Code bon cadeau</FormLabel>
                      <Input {...register("codeCarteCadeau")} />
                    </FormControl>
                  </SimpleGrid>
                </Box>
                <Divider />

                {/* --- Section Produits --- */}
                <ProductConfigurationField />

                <Divider />

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
                        {...register("effet")}
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
                      <Input {...register("numPhoto")} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Couleurs</FormLabel>
                      <Input {...register("couleur")} />
                    </FormControl>
                    <FormControl gridColumn={{ md: "span 3" }}>
                      <FormLabel>Remarque</FormLabel>
                      <Textarea
                        placeholder="Indiquer si traitement particulier, date de livraison souhaitée etc..."
                        {...register("remarque")}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Annuler
              </Button>
              <Button
                colorScheme="purple"
                isLoading={mutation.isPending}
                type="submit"
              >
                Créer la commande
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
};

export default NewCommandeModal;
