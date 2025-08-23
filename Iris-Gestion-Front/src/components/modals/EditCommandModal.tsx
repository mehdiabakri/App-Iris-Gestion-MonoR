import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { updateCommande } from "../../api/commandes";
import { useCommande } from "../../hooks/useCommandes";
import type { EditCommandFormData } from "../../types/Types"; // On utilise le type de formulaire unifié
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
  Spinner,
  Select,
  FormControl,
  FormLabel,
  Flex,
  Text,
  Input,
  Textarea,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";

type EditCommandModalProps = {
  isOpen: boolean;
  onClose: () => void;
  commandId: string | null;
  onSuccess: () => void; // Fonction pour rafraîchir le parent
};

const EditCommandModal = ({
  isOpen,
  onClose,
  commandId,
  onSuccess,
}: EditCommandModalProps) => {
  const toast = useToast();
  const { data: commandeData, isLoading, refetch } = useCommande(commandId);
  const methods = useForm<EditCommandFormData>();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (isOpen && commandId) {
      refetch();
    }
  }, [isOpen, commandId, refetch]);

  useEffect(() => {
    if (commandeData) {
      // On "aplatit" les données de l'API pour le formulaire
      const flatData: Partial<EditCommandFormData> = {
        statut: commandeData.statut,
        photographe: commandeData.photographe,
        rdv: commandeData.rdv,
        livraison: commandeData.livraison,
        numPhoto: commandeData.numPhoto,
        effet: commandeData.effet,
        couleur: commandeData.couleur,
        nbIris: commandeData.nbIris,
        nbIrisAnimaux: commandeData.nbIrisAnimaux,
        remarque: commandeData.remarque,
        provenance: commandeData.provenance,
        carteCadeau: commandeData.carteCadeau,
        codeCarteCadeau: commandeData.codeCarteCadeau,
        lienSuiviColis: commandeData.lienSuiviColis,
      };

      const commandeProductData: EditCommandFormData["commande"] = {
        categorie: commandeData.produitBase?.categorie?.["@id"],
        produitBase: commandeData.produitBase?.["@id"],
      };

      const extras: string[] = [];
      commandeData.optionsChoisies?.forEach((option) => {
        if (option.type === "Extra") {
          extras.push(option["@id"]);
        } else {
          commandeProductData[`options_${option.type.toLowerCase()}`] =
            option["@id"];
        }
      });
      commandeProductData.options_extra = extras;

      // On combine tout et on appelle reset
      reset({ ...flatData, commande: commandeProductData });
    }
  }, [commandeData, reset]);

  const mutation = useMutation({
    mutationFn: updateCommande,
    onSuccess: () => {
      toast({
        title: "Commande mise à jour.",
        status: "success",
        isClosable: true,
      });
      onSuccess();
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de mise à jour",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    },
  });

  const onSubmit = (data: EditCommandFormData) => {
    // 1. On récupère l'objet "commande" qui contient les données du produit.
    const commandeProductData = data.commande || {};

    // 2. On collecte TOUTES les options en une seule boucle propre.
    const optionsChoisiesIRIs: string[] = [];

    Object.keys(commandeProductData).forEach((key) => {
      // Si la clé commence par "options_"
      if (key.startsWith("options_")) {
        const value = commandeProductData[key];

        if (key === "options_extra" && Array.isArray(value)) {
          // Cas des checkboxes : on ajoute tous les éléments du tableau
          optionsChoisiesIRIs.push(...value);
        } else if (typeof value === "string" && value) {
          // Cas des selects : on ajoute la chaîne si elle n'est pas vide
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
      lienSuiviColis: data.lienSuiviColis,
      produitBase: commandeProductData.produitBase,
      optionsChoisies: optionsChoisiesIRIs.filter(Boolean),
    };
    if (commandId) {
      mutation.mutate({ commandId, formData: payload });
    }
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
        <ModalHeader color="brand.700">
          Modifier la Commande #{commandId?.substring(0, 8)}
        </ModalHeader>
        <ModalCloseButton />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody pb={6}>
              {isLoading && (
                <Flex justify="center" align="center" h="300px">
                  <Spinner size="xl" />
                </Flex>
              )}
              {!isLoading && !commandeData && (
                <Text>Impossible de charger les données de la commande.</Text>
              )}
              {!isLoading && commandeData && (
                <VStack spacing={8} align="stretch">
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
                    <option value="A envoyer client">A envoyer client</option>
                    <option value="Attente retour client">Attente retour client</option>
                    <option value="A commander">A commander</option>
                    <option value="Commande OK">Commande OK</option>
                    <option value="Livraison en cours">Livraison en cours</option>
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
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* --- Section 2: Détails de la Création --- */}
                  <Box>
                    <Heading size="md" mb={6}>
                      Détails de la Création
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <FormControl>
                        <FormLabel>Numéro de Photo</FormLabel>
                        <Input {...register("numPhoto")} />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Nombre d'iris</FormLabel>
                        <Select placeholder="Choisir" {...register("nbIris")}>
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
                          placeholder="Choisir"
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
                        <FormLabel>Effet</FormLabel>
                        <Select placeholder="Choisir" {...register("effet")}>
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
                        <FormLabel>Couleurs</FormLabel>
                        <Input {...register("couleur")} />
                      </FormControl>
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* --- Section 3: Produits --- */}

                  <ProductConfigurationField key={commandId} />

                  <Divider />

                  {/* --- Section 4: Logistique & Remarques --- */}
                  <Box>
                    <Heading size="md" mb={6}>
                      Logistique & Divers
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <FormControl>
                        <FormLabel>Mode de livraison</FormLabel>
                        <Select
                          placeholder="Choisir"
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
                          <option value="Envoi mail">Envoi mail</option>{" "}
                        </Select>
                      </FormControl>
                      <FormControl gridColumn="span 2">
                        <FormLabel>Lien de Suivi du Colis</FormLabel>
                        <Input
                          placeholder="https://..."
                          {...register("lienSuiviColis")}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Provenance</FormLabel>
                        <Select
                          placeholder="Choisir"
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
                        <FormLabel>Bon cadeau</FormLabel>
                        <Select
                          placeholder="Choisir"
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
                      <FormControl gridColumn="span 2">
                        <FormLabel>Remarque</FormLabel>
                        <Textarea placeholder="..." {...register("remarque")} />
                      </FormControl>
                    </SimpleGrid>
                  </Box>
                </VStack>
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Annuler
              </Button>
              <Button
                colorScheme="yellow"
                isLoading={mutation.isPending}
                type="submit"
              >
                Enregistrer
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
};

export default EditCommandModal;
