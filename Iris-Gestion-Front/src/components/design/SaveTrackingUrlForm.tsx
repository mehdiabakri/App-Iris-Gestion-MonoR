import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  useToast,
  Link,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FiEdit2, FiCheck, FiX, FiExternalLink } from "react-icons/fi";
import type { Commande } from "../../types/Types";
import { customFetch } from "../../api/customFetch";
import CopyButton from "./CopyButton";

interface SaveTrackingUrlFormProps {
  order: Commande;
  onSuccess: () => void;
}

const SaveTrackingUrlForm = ({
  order,
  onSuccess,
}: SaveTrackingUrlFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState(order.lienSuiviColis || "");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setUrl(order.lienSuiviColis || "");
  }, [order.lienSuiviColis]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await customFetch(`/api/commandes/${order.id}/save-tracking-url`, {
        method: "POST",
        body: JSON.stringify({ trackingUrl: url }), // On envoie la bonne variable
      });
      toast({
        title: "Succès !",
        description: "L'URL de suivi a été enregistrée.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSuccess();
      setIsEditing(false);
    } catch (err) {
      if (err instanceof Error) {
        toast({ title: "Erreur", description: err.message, status: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUrl(order.lienSuiviColis || "");
    setIsEditing(false);
  };

  if (isEditing || !order.lienSuiviColis) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="md" borderColor="gray.200">
        <FormControl>
          <FormLabel fontSize="sm">Lien de suivi du colis</FormLabel>
          <HStack>
            <Input
              placeholder="Collez le lien de suivi ici..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Tooltip label="Annuler" hasArrow>
              <IconButton
                aria-label="Annuler"
                icon={<FiX />}
                onClick={handleCancel}
                isDisabled={!order.lienSuiviColis}
              />
            </Tooltip>
            <Tooltip label="Enregistrer" hasArrow>
              <IconButton
                aria-label="Enregistrer"
                icon={<FiCheck />}
                colorScheme="green"
                onClick={handleSave}
                isLoading={isLoading}
                isDisabled={!url}
              />
            </Tooltip>
          </HStack>
        </FormControl>
      </Box>
    );
  }

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" borderColor="gray.200">
      <HStack justify="space-between" align="center">
        <Box>
          <FormLabel fontSize="sm" mb={0}>
            Lien de suivi enregistré
          </FormLabel>
          <Link
            href={url}
            isExternal
            color="blue.500"
            display="flex"
            alignItems="center"
          >
            Lien du transporteur{" "}
            <FiExternalLink style={{ marginLeft: "8px" }} />
          </Link>
        </Box>
        <Box>
          <Tooltip label="Modifier le lien" hasArrow>
            <IconButton
              aria-label="Modifier le lien"
              icon={<FiEdit2 />}
              onClick={() => setIsEditing(true)}
              variant="ghost"
            />
          </Tooltip>
          <Tooltip label="Copier le lien" hasArrow>
            <CopyButton textToCopy={order?.lienSuiviColis || ""} />
          </Tooltip>
        </Box>
      </HStack>
    </Box>
  );
};

export default SaveTrackingUrlForm;
