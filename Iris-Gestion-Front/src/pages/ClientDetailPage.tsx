import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { useClient } from "../hooks/useClients";
import EditCommandModal from "../components/modals/EditCommandModal";
import OrderDetail from "../components/design/OrderDetail";
import { deleteClient } from "../api/client";

import type { Commande } from "../types/Types";

import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Divider,
  Tag,
  Flex,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdAutoFixHigh,
  MdCreate,
  MdAddAPhoto,
} from "react-icons/md";
import CopyButton from "../components/design/CopyButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NewCommandeModal from "../components/modals/NewCommandeModal";
import { fetchCategories } from "../api/categorie";
import { fetchProduitsBase } from "../api/produitsBase";
import { fetchOptions } from "../api/options";

const InfoLine = ({ icon, label, value }: { icon: React.ElementType; label: string; value: string | null | undefined }) => (
  <HStack spacing={4} align="center">
    <Icon as={icon} color="brand.500" w={6} h={6} />
    <Box>
      <Text fontSize="sm" color="gray.600">
        {label}
      </Text>
      <Text fontWeight="medium" color="brand.700">
        {value || "Non renseigné"}
      </Text>
    </Box>
  </HStack>
);

const ClientDetailPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { data: client, isLoading, isError, error, refetch } = useClient(clientId);
  
  // Un gestionnaire d'état pour CHAQUE modale
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const { isOpen: isNewModalOpen, onOpen: onNewModalOpen, onClose: onNewModalClose } = useDisclosure();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [selectedOrder, setSelectedOrder] = useState<Commande | null>(null);
  const [commandeAModifier, setCommandeAModifier] = useState<Commande | null>(null);

  const handleEditClick = (commande: Commande) => {
    setCommandeAModifier(commande);
    onEditModalOpen();
  };

  const handleNewOrderClick = () => {
    onNewModalOpen();
  };

  const handleModalSuccess = () => {
    refetch();
  };

  const currentOrder = useMemo(() => {
    if (!client?.commandes) return null;
    return client.commandes.find((commande: Commande) => commande.statut !== "Terminé");
  }, [client?.commandes]);

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      toast({ title: "Client supprimé.", status: "success", isClosable: true });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      navigate("/clients/list");
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de suppression.",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    },
  });

  const handleDeleteClick = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client et toutes ses commandes ? Cette action est irréversible.")) {
      if (clientId) {
        deleteMutation.mutate(clientId);
      }
    }
  };

    useEffect(() => {
    queryClient.prefetchQuery({ queryKey: ['categories'], queryFn: fetchCategories });
    queryClient.prefetchQuery({ queryKey: ['produitsBase'], queryFn: fetchProduitsBase });
    queryClient.prefetchQuery({ queryKey: ['options'], queryFn: fetchOptions });
  }, [queryClient]);

  useEffect(() => {
    if (client) {
      setSelectedOrder(currentOrder || client.commandes[0] || null);
    }
  }, [client, currentOrder]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          {error instanceof Error ? error.message : "Une erreur est survenue"}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      {/* --- Section En-tête --- */}
      <Flex justify="space-between" alignItems="center" mb={6} flexWrap="wrap">
        <HStack>
          <Heading as="h1" size="lg" color="brand.600">
            {client?.prenom} {client?.nom}
          </Heading>
        </HStack>
        <HStack spacing={3} mt={{ base: 4, md: 0 }}>
          <Button as={RouterLink} to={`/clients/${client?.id}/edit`} colorScheme="yellow">
            Modifier Client
          </Button>
          <Button colorScheme="red" variant="solid" onClick={handleDeleteClick} isLoading={deleteMutation.isPending}>
            Supprimer Client
          </Button>
        </HStack>
      </Flex>
      <Divider mb={8} />

      {/* --- Grille Principale --- */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 6, lg: 8 }}>
        {/* Colonne de gauche: Détails du contact */}
        <Box p={6} borderWidth="1px" borderColor="gray.200" borderRadius="lg" bg="white" boxShadow="sm">
          <Heading size="md" mb={6} color="brand.700">Détails du Contact</Heading>
          <VStack spacing={5} align="stretch">
            <HStack>
              <InfoLine icon={MdEmail} label="Email" value={client?.email} />
              <CopyButton textToCopy={client?.email || ""} />
            </HStack>
            <InfoLine icon={MdPhone} label="Téléphone" value={client?.telephone} />
            <InfoLine icon={MdLocationOn} label="Adresse" value={`${client?.adresse || ''}, ${client?.codePostal || ''} ${client?.ville || ''}`} />
            {currentOrder && <InfoLine icon={MdAutoFixHigh} label="Provenance" value={currentOrder.provenance} />}
            {client?.remarque && (
              <>
                <Divider />
                <Box pt={2}>
                  <Text fontSize="sm" color="gray.600">Remarque</Text>
                  <Text fontStyle="italic" color="brand.700">"{client.remarque}"</Text>
                </Box>
              </>
            )}
          </VStack>
        </Box>

        {/* Colonne de droite: Historique des commandes */}
        <Box p={6} borderWidth="1px" borderColor="gray.200" borderRadius="lg" bg="white" boxShadow="sm">
          <HStack gap={10} mb={6}>
            <Heading size="md" color="brand.700">Historique des Commandes</Heading>
            <Box
              as="button"
              onClick={handleNewOrderClick}
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
              cursor="pointer"
              bg="brand.500"
              _hover={{ bg: "brand.300" }}
              p={2}
            >
              <Icon as={MdAddAPhoto} color="white" boxSize={6} />
            </Box>
          </HStack>
          <VStack spacing={4} align="stretch">
            {client?.commandes && client.commandes.length > 0 ? (
              client.commandes.map((commande: Commande) => (
                <Flex
                  key={commande.id}
                  justify="space-between"
                  align="center"
                  p={3}
                  borderRadius="md"
                  bg={selectedOrder?.id === commande.id ? "brand.600" : "brand.50"}
                  borderWidth="1px"
                  borderColor={selectedOrder?.id === commande.id ? "brand.500" : "gray.200"}
                  _hover={{ bg: "brand.600", borderColor: "brand.500" }}
                >
                  <Box flex="1" onClick={() => setSelectedOrder(commande)} cursor="pointer">
                    <Text fontWeight="bold" color="brand.700">#{commande.id.substring(0, 8)}</Text>
                    <Text fontSize="xs" color="gray.600">
                      Passée le {new Date(commande.createdAt).toLocaleDateString("fr-FR")}
                    </Text>
                  </Box>
                  <Tag colorScheme={commande.statut === "Terminé" ? "green" : "purple"} variant="subtle" alignSelf="center" mx={4}>
                    {commande.statut}
                  </Tag>
                  <HStack>
                    <Box
                      as="button"
                      onClick={() => handleEditClick(commande)}
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="md"
                      cursor="pointer"
                      bg="gray.200"
                      _hover={{ bg: "gray.300" }}
                      p={2}
                    >
                      <Icon as={MdCreate} boxSize={6} />
                    </Box>
                  </HStack>
                </Flex>
              ))
            ) : (
              <Text color="gray.500">Aucune commande pour ce client.</Text>
            )}
          </VStack>
        </Box>
      </SimpleGrid>

      {/* --- Section Détail de la Commande Sélectionnée --- */}
      <Box mt={10}>
        {selectedOrder ? (
          <OrderDetail order={selectedOrder} />
        ) : (
          <Text fontStyle="italic" textAlign="center" color="gray.500">
            Sélectionnez une commande dans l'historique pour voir les détails.
          </Text>
        )}
      </Box>

      {/* --- Modales --- */}
      {commandeAModifier && (
        <EditCommandModal
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
          commandId={commandeAModifier.id}
          onSuccess={handleModalSuccess}
        />
      )}

      {clientId && ( // On vérifie que clientId existe avant de rendre la modale
        <NewCommandeModal
          isOpen={isNewModalOpen}
          onClose={onNewModalClose}
          clientId={clientId}
          onSuccess={handleModalSuccess}
        />
      )}
    </Box>
  );
};

export default ClientDetailPage;