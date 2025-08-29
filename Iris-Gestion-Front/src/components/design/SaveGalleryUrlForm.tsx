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

interface SaveGalleryUrlFormProps {
  order: Commande;
  onSuccess: () => void;
}

const SaveGalleryUrlForm = ({ order, onSuccess }: SaveGalleryUrlFormProps) => {
  // On gère 2 états : l'URL actuelle, et si on est en mode édition
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState(order.piwigoAlbumUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Si l'objet `order` change (après un refetch), on met à jour notre état local
  useEffect(() => {
    setUrl(order.piwigoAlbumUrl || "");
  }, [order.piwigoAlbumUrl]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await customFetch(`/api/commandes/${order.id}/save-gallery-url`, {
        method: "POST",
        body: JSON.stringify({ galleryUrl: url }),
      });
      toast({
        title: "Succès !",
        description: "L'URL de la galerie a été mise à jour.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSuccess();
      setIsEditing(false); // On quitte le mode édition
    } catch (err) {
      if (err instanceof Error) {
        toast({ title: "Erreur", description: err.message, status: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // On restaure l'URL d'origine et on quitte le mode édition
    setUrl(order.piwigoAlbumUrl || "");
    setIsEditing(false);
  };

  // --- AFFICHAGE CONDITIONNEL ---

  // CAS 1 : On est en train d'éditer (ou il n'y a pas encore d'URL)
  if (isEditing || !order.piwigoAlbumUrl) {
    return (
      <Box
        mt={4}
        p={4}
        borderWidth="1px"
        borderRadius="md"
        borderColor="gray.200"
      >
        <FormControl>
          <FormLabel fontSize="sm">Lien de la galerie</FormLabel>
          <HStack>
            <Input
              placeholder="Collez l'URL de la galerie ici..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Tooltip label="Annuler" hasArrow>
              <IconButton
                aria-label="Annuler"
                icon={<FiX />}
                onClick={handleCancel}
                isDisabled={!order.piwigoAlbumUrl}
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

  // CAS 2 : Une URL est déjà enregistrée, on l'affiche
  return (
    <Box
      mt={4}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.200"
    >
      <HStack justify="space-between" align="center">
        <Box>
          <FormLabel fontSize="sm" mb={0}>
            Lien de la galerie enregistré
          </FormLabel>
          <Link
            href={url}
            isExternal
            color="blue.500"
            display="flex"
            alignItems="center"
          >
            {url} <FiExternalLink style={{ marginLeft: "8px" }} />
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
            <CopyButton textToCopy={order?.piwigoAlbumUrl || ""} />
          </Tooltip>
        </Box>
      </HStack>
    </Box>
  );
};

export default SaveGalleryUrlForm;
