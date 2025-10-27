import React, { useState } from "react";
import { Button, useToast, Box, Text } from "@chakra-ui/react";
import { FiStar } from "react-icons/fi";
import type { Commande } from "../../types/Types";

interface EnvoiAvisClientProps {
  order: Commande;
  onUpdate: () => void; // Pour rafraîchir les données après l'envoi
}

const EnvoiAvisClient = ({ order, onUpdate }: EnvoiAvisClientProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSendReviewRequest = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("jwt_token");

    try {
      const response = await fetch(
        `/api/commandes/${order.id}/send-review-request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Gérer les erreurs spécifiques du backend (ex: email déjà envoyé)
        throw new Error(data.error || "Une erreur est survenue.");
      }

      toast({
        title: "Succès",
        description: "L'e-mail de demande d'avis a été envoyé avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // On appelle onUpdate pour rafraîchir les détails de la commande
      // et mettre à jour l'état du bouton
      onUpdate();

    } catch (error) {
      let errorMessage = "Une erreur inattendue est survenue.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

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
  // On vérifie si la date d'envoi existe pour désactiver le bouton
  const isAlreadySent = !!order.reviewEmailSentAt;

  return (
    <Box>
      <Button
        leftIcon={<FiStar />}
        colorScheme="teal"
        onClick={handleSendReviewRequest}
        isLoading={isLoading}
        isDisabled={isAlreadySent}
        w="100%"
      >
        {isAlreadySent
          ? "Demande d'avis déjà envoyée"
          : "Envoyer la demande d'avis"}
      </Button>
 {order.reviewEmailSentAt && (
        <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
          Envoyé le: {new Date(order.reviewEmailSentAt).toLocaleDateString("fr-FR")}
        </Text>
      )}
    </Box>
  );
};

export default EnvoiAvisClient;