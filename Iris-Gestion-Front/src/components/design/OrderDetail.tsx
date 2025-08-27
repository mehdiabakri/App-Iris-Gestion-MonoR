/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Divider,
  Tag,
  Link,
  IconButton,
  Tooltip,
  Button, 
  Spinner,
  Alert,
  AlertIcon,
  useToast
} from "@chakra-ui/react";

import type { Commande } from "../../types/Types";
import SuiviColis from "../emailSender/SuiviColis";
import { FiCamera, FiExternalLink, FiMail, FiSearch } from "react-icons/fi";

interface OrderDetailProps {
  order: Commande | null;
  onUpdate: () => void; 
}

const OrderDetail = ({ order, onUpdate  }: OrderDetailProps) => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast(); // Pour afficher de jolies notifications

  if (!order) {
    return (
      <Box p={6} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="sm">
        <Text fontStyle="italic" color="gray.500">
          Sélectionnez une commande pour voir les détails.
        </Text>
      </Box>
    );
  }

  const token = localStorage.getItem('jwt_token');

    const handleCreateGallery = async () => {
    if (!order) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/commandes/${order.id}/create-gallery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'La création de la galerie a échoué.');
      }
  
      const data = await response.json();
      
      toast({
        title: "Succès",
        description: data.message || "La galerie a été créée avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onUpdate();
      
    } catch (err) {
      let errorMessage = "Une erreur inattendue est survenue.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendGalleryLink = async () => {
    if (!order) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/commandes/${order.id}/send-gallery-link`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "L'envoi de l'email a échoué.");
      }

      const data = await response.json();

      toast({
        title: "Succès",
        description: data.message || "L'email a bien été envoyé au client.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

    } catch (err) {
      let errorMessage = "Une erreur inattendue est survenue.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      p={6}
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
      boxShadow="sm"
    >
      <HStack justify="space-between" mb={4}>
        <Heading size="md" color="brand.700">
          Détails de la Commande : {order.id.substring(0, 8)}
        </Heading>
        <Tag
          colorScheme={order.statut === "Terminé" ? "green" : "orange"}
          variant="solid"
        >
          {order.statut}
        </Tag>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mb={6}>
        <Text>
          <strong>N° Photo :</strong> {order.numPhoto}
        </Text>
        <Text>
          <strong>Effet :</strong> {order.effet}
        </Text>
        <Text>
          <strong>Nombre d'iris :</strong> {order.nbIris}
        </Text>
        <Text>
          <strong>Nombre d'iris d'animaux :</strong> {order.nbIrisAnimaux}
        </Text>
        <Text>
          <strong>Couleur des iris :</strong> {order.couleur}
        </Text>
        <Text>
          <strong>Photographe :</strong> {order.photographe}
        </Text>
        <Text>
          <strong>Sur RDV :</strong> {order.rdv}
        </Text>
        <Text>
          <strong>Carte cadeau :</strong> {order.carteCadeau}
        </Text>
        <Text>
          <strong>Code cadeau :</strong> {order.codeCarteCadeau || "N/C"}
        </Text>
      </SimpleGrid>

      <Divider />

      <Heading size="sm" mt={6} mb={4} color="brand.700">
        Informations de livraison :
      </Heading>
      <SimpleGrid columns={{ base: 1 }} spacing={2}>
        <HStack justify="space-between" p={2} bg="brand.100" borderRadius="md">
          <Text>
            <strong>Mode de livraison :</strong> {order.livraison}
          </Text>
          <Text>
            {order.lienSuiviColis ? (
              <Tooltip label="Suivre le colis" placement="top" hasArrow>
                <IconButton
                  as={Link}
                  href={order.lienSuiviColis}
                  fontSize="xl"
                  isExternal
                  aria-label="Suivre le colis"
                  icon={<FiSearch />}
                  colorScheme="black"
                  variant="ghost"
                />
              </Tooltip>
            ) : (
              ""
            )}
          </Text>
        </HStack>
        <SuiviColis order={order} />
      </SimpleGrid>

      <Divider />

      <Heading size="sm" mt={6} mb={4} color="brand.700">
        Produit & Options
      </Heading>
      <VStack align="stretch" spacing={3} mb={6}>
        {/* On affiche le produit de base */}
        <HStack justify="space-between" p={2} bg="brand.500" borderRadius="md">
          <Text fontWeight="bold">Catégorie :</Text>
          <Text>{order.produitBase?.categorie?.nom || "N/A"}</Text>
        </HStack>
        {/* On affiche le produit de base */}
        <HStack justify="space-between" p={2} bg="brand.600" borderRadius="md">
          <Text fontWeight="bold">Produit :</Text>
          <Text>{order.produitBase?.nom || "N/A"}</Text>
        </HStack>

        {/* On fait une boucle sur les options choisies */}
        {order.optionsChoisies && order.optionsChoisies.length > 0 ? (
          order.optionsChoisies.map((option) => (
            <HStack
              key={option.id}
              justify="space-between"
              p={2}
              bg="brand.600"
              borderRadius="md"
            >
              <Text color="gray.600">{option.type} :</Text>
              <Text fontWeight="bold">{option.nom}</Text>
            </HStack>
          ))
        ) : (
          <Text fontStyle="italic" fontSize="sm">
            Aucune option spécifique.
          </Text>
        )}
      </VStack>

      <Divider />

      {order.remarque && (
        <>
          <Heading size="sm" mt={6} mb={4} color="brand.700">
            Remarque :
          </Heading>
          <Box p={2} bg="yellow.50" borderRadius="md">
            <Text fontStyle="italic">{order.remarque}</Text>
          </Box>
        </>
      )}

            <Divider />
      
      <Heading size="sm" mt={6} mb={4} color="brand.700">
        Galerie Photo Piwigo
      </Heading>

      {/* On affiche un message d'erreur s'il y en a un */}
      {error && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <HStack spacing={4}>
        {/* CAS 1 : La galerie n'a pas encore été créée */}
        {!order.piwigoAlbumUrl && (
          <Button
            leftIcon={<FiCamera />}
            colorScheme="yellow"
            onClick={handleCreateGallery}
            isLoading={isLoading}
            loadingText="Création..."
          >
            Créer la galerie client
          </Button>
        )}

        {/* CAS 2 : La galerie existe */}
        {order.piwigoAlbumUrl && (
          <>
            <Tooltip label="Ouvrir la galerie dans un nouvel onglet" placement="top" hasArrow>
              <Button
                as={Link}
                href={order.piwigoAlbumUrl}
                isExternal
                leftIcon={<FiExternalLink />}
                variant="outline"
              >
                Voir la galerie
              </Button>
            </Tooltip>

            <Tooltip label="Envoyer le lien par email au client" placement="top" hasArrow>
              <Button
                leftIcon={<FiMail />}
                colorScheme="teal"
                onClick={handleSendGalleryLink}
                isLoading={isLoading}
                loadingText="Envoi..."
              >
                Envoyer le lien
              </Button>
            </Tooltip>
          </>
        )}
      </HStack>
      
      <Divider mt={6} />

    </Box>
  );
};

export default OrderDetail;
