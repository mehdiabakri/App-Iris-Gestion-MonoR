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
  useToast,
} from "@chakra-ui/react";

import type { Commande } from "../../types/Types";
import SaveTrackingUrlForm from "./SaveTrackingUrlForm";
import SuiviColis from "../emailSender/SuiviColis";
import { FiCamera, FiExternalLink, FiMail, FiSearch } from "react-icons/fi";
import EnvoiLienGalerie from "../emailSender/EnvoiLienGalerie";
import SaveGalleryUrlForm from "./SaveGalleryUrlForm";
import SaveCommandeYae from "./SaveCommandeYae";

interface OrderDetailProps {
  order: Commande | null;
  onUpdate: () => void;
}

const OrderDetail = ({ order, onUpdate }: OrderDetailProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  if (!order) {
    return (
      <Box p={6} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="sm">
        <Text fontStyle="italic" color="gray.500">
          Sélectionnez une commande pour voir les détails.
        </Text>
      </Box>
    );
  }

  const token = localStorage.getItem("jwt_token");

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
          Détails de la Commande
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

      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between" p={2} bg="brand.100" borderRadius="md">
          <Text>
            <strong>Mode de livraison :</strong> {order.livraison}
          </Text>
        </HStack>
          <SaveCommandeYae order={order} onSuccess={onUpdate} />

        {/* Le nouveau formulaire pour gérer l'URL */}
        <SaveTrackingUrlForm order={order} onSuccess={onUpdate} />

        {/* Le bouton d'envoi d'email, qui n'apparaît que si le lien existe */}
        {/* On peut utiliser l'ancien SuiviColis ici, car il fait bien le job d'envoi */}
        {order.lienSuiviColis && <SuiviColis order={order} />}
      </VStack>

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

      <Heading size="md" mt={6} mb={4} color="brand.700">
        Galerie Photo
      </Heading>

      {/* On affiche le formulaire qui gère lui-même son état */}
      <SaveGalleryUrlForm order={order} onSuccess={onUpdate} />

      {/* On affiche le bouton d'envoi d'email SEULEMENT si l'URL existe */}
      {order.piwigoAlbumUrl && (
        <Box mt={4}>
          <EnvoiLienGalerie order={order} />
        </Box>
      )}
    </Box>
  );
};

export default OrderDetail;
