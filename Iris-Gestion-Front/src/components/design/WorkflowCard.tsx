import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Flex,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import type { Commande } from "../../types/Types";
import CopyButton from "../design/CopyButton";
import { MdOutlineSearch } from "react-icons/md";

type WorkflowCardProps = {
  commande: Commande;
};

const WorkflowCard = ({ commande }: WorkflowCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (commande.client?.id) {
      navigate(`/clients/${commande.client.id}`);
    }
  };

  return (
    // 1. On transforme le Box en Flex et on le met en colonne.
    //    On supprime la hauteur fixe `h={425}`.
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      transition="all 0.2s"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "xl",
      }}
      w="100%"
      h="100%" // Important: dire à la carte de prendre toute la hauteur de sa cellule de grille
    >
      {/* 2. On garde un VStack pour tout le contenu SAUF le bouton final */}
      <VStack spacing={3} align="stretch" w="100%">
        <Flex justify="space-between" gap={6} align="center">
          <Tooltip label={commande.client?.email || ""} placement="top">
            <Heading size="md" color="brand.700" isTruncated>
              {commande.client?.email || "N/A"}
            </Heading>
          </Tooltip>
          {commande.client?.email && (
            <CopyButton textToCopy={commande.client.email} />
          )}
        </Flex>

        <Divider />

        {/* Corps de la carte (inchangé) */}
        <VStack spacing={2} align="stretch" py={2}>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">
              Client :
            </Text>
            <Text fontWeight="bold" isTruncated>
              {commande.client?.prenom} {commande.client?.nom}
            </Text>
          </HStack>
          {/* ... autres HStack ... */}
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">
              Date :
            </Text>
            <Text>
              {new Date(commande.createdAt).toLocaleDateString("fr-FR")}
            </Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">
              Effet :
            </Text>
            <Text>{commande.effet}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">
              Photo N° :
            </Text>
            <Text>{commande.numPhoto}</Text>
          </HStack>
        </VStack>

        <Divider />

        {/* Section Livrable (inchangée) */}
        <Box>
          <VStack spacing={2} align="stretch">
            {commande.produitBase ? (
              <>
                <HStack justify="space-between" fontSize="sm">
                  <Text color="gray.600">Catégorie :</Text>
                  <Text fontWeight="bold">
                    {commande.produitBase.categorie?.nom || "N/A"}
                  </Text>
                </HStack>
                <HStack justify="space-between" fontSize="sm">
                  <Text color="gray.600">Produit :</Text>
                  <Text fontWeight="bold">{commande.produitBase.nom}</Text>
                </HStack>
                {commande.optionsChoisies &&
                  commande.optionsChoisies.length > 0 &&
                  commande.optionsChoisies.map((option) => (
                    <HStack
                      key={option.id}
                      justify="space-between"
                      fontSize="xs"
                      pl={4}
                    >
                      <Text color="gray.500" isTruncated>
                        - {option.nom} ({option.type})
                      </Text>
                    </HStack>
                  ))}
              </>
            ) : (
              <Text fontSize="sm" fontStyle="italic" color="gray.400">
                Aucun livrable associé
              </Text>
            )}
          </VStack>
        </Box>
      </VStack>
      <Divider my={5} />
      <Box
        as="button"
        onClick={handleCardClick}
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
        cursor="pointer"
        bg="brand.500"
        _hover={{ bg: "brand.400" }}
        p={2}
      >
        <Icon as={MdOutlineSearch} boxSize={6} />{" "}
      </Box>
    </Flex>
  );
};

export default WorkflowCard;
