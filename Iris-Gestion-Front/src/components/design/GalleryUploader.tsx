import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Progress,
} from "@chakra-ui/react";
import type { Commande } from "../../types/Types";

// On définit les props
interface GalleryUploaderProps {
  order: Commande;
  onUpdate: () => void;
}

const GalleryUploader = ({ order, onUpdate }: GalleryUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const token = localStorage.getItem("jwt_token");

  // Remplacez ces valeurs par les vôtres !
  const CLOUDINARY_API_KEY = "353942736124422";
  const CLOUDINARY_CLOUD_NAME = "dyjhgjwir";
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsLoading(true);

    try {
      // 1. On demande une signature à notre backend
      const sigResponse = await fetch(
        `/api/commandes/${order.id}/upload-signature`,
        {
          // On passe l'ID de la commande
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!sigResponse.ok)
        throw new Error("Impossible d'obtenir la signature du serveur.");
      // On récupère TOUS les paramètres signés
      const { signature, timestamp, folder, tags } = await sigResponse.json();

      // 2. On upload chaque fichier
      const uploadPromises = Array.from(selectedFiles).map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", CLOUDINARY_API_KEY);
        // On utilise les paramètres fournis par le backend pour être sûr qu'ils sont identiques
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", folder);
        formData.append("tags", tags);

        return fetch(CLOUDINARY_UPLOAD_URL, {
          method: "POST",
          body: formData,
        });
      });

      // 3. On attend que tous les uploads soient terminés
      const results = await Promise.all(uploadPromises);

      // On vérifie si tout s'est bien passé
      const successfulUploads = results.filter((res) => res.ok);

      if (successfulUploads.length === 0) {
        throw new Error("L'upload des photos a échoué.");
      }

      toast({
        title: "Upload réussi !",
        description: `${successfulUploads.length} photo(s) ont été uploadées.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onUpdate(); // On rafraîchit l'interface
    } catch (err) {
      if (err instanceof Error) {
        toast({ title: "Erreur", description: err.message, status: "error" });
      }
    } finally {
      setIsLoading(false);
      setSelectedFiles(null);
    }
  };

  return (
    <Box
      mt={4}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.300"
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Étape 2 : Sélectionner des photos à uploader</FormLabel>
            <Input
              type="file"
              multiple
              onChange={(e) => setSelectedFiles(e.target.files)}
              p={1}
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="Upload..."
            isDisabled={!selectedFiles}
          >
            Uploader les photos
          </Button>
          {isLoading && <Progress size="xs" isIndeterminate w="100%" />}
        </VStack>
      </form>
    </Box>
  );
};

export default GalleryUploader;
