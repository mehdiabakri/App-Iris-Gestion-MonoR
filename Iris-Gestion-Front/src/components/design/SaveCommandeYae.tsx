import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  useToast,
  IconButton,
  Tooltip,
  Text
} from "@chakra-ui/react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import type { Commande } from "../../types/Types";
import { customFetch } from "../../api/customFetch";
import CopyButton from "./CopyButton";

interface SaveCommandeYaeProps {
  order: Commande;
  onSuccess: () => void;
}

const SaveCommandeYae = ({ order, onSuccess }: SaveCommandeYaeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [commandeYae, setCommandeYae] = useState(order.commandeYae || "");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setCommandeYae(order.commandeYae || "");
  }, [order.commandeYae]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await customFetch(`/api/commandes/${order.id}/save-commande-yae`, {
        method: "POST",
        body: JSON.stringify({ commandeYae }),
      });
      toast({
        title: "Succès !",
        description: "Le numéro de commande a été enregistré.",
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
    setCommandeYae(order.commandeYae || "");
    setIsEditing(false);
  };

  if (isEditing || !order.commandeYae) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="md" borderColor="gray.200">
        <FormControl>
          <FormLabel fontSize="sm">Numéro de la commande</FormLabel>
          <HStack>
            <Input
              placeholder="Saisir le numéro de commande ici..."
              value={commandeYae}
              onChange={(e) => setCommandeYae(e.target.value)}
            />
            <Tooltip label="Annuler" hasArrow>
              <IconButton
                aria-label="Annuler"
                icon={<FiX />}
                onClick={handleCancel}
                isDisabled={!order.commandeYae}
              />
            </Tooltip>
            <Tooltip label="Enregistrer" hasArrow>
              <IconButton
                aria-label="Enregistrer"
                icon={<FiCheck />}
                colorScheme="green"
                onClick={handleSave}
                isLoading={isLoading}
                isDisabled={!commandeYae}
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
        <HStack>
          <Text fontWeight="bold">N° de commande YAE :</Text>
          <Text>{order.commandeYae}</Text>
          <CopyButton textToCopy={order.commandeYae || ""} />
        </HStack>
        <Tooltip label="Modifier le numéro" hasArrow>
          <IconButton
            aria-label="Modifier le numéro"
            icon={<FiEdit2 />}
            onClick={() => setIsEditing(true)}
            variant="ghost"
          />
        </Tooltip>
      </HStack>
    </Box>
  );
};

export default SaveCommandeYae;