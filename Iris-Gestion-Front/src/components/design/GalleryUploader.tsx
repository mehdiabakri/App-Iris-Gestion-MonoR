import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  List,
  ListItem,
  ListIcon,
  useToast,
  Progress,
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';
import type { Commande } from '../../types/Types';

interface PiwigoUploaderProps {
  order: Commande;
  onUpdate: () => void;
}

const GalleryUploader = ({ order, onUpdate }: PiwigoUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const token = localStorage.getItem('jwt_token');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: 'Aucun fichier sélectionné',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    // On ajoute chaque fichier au FormData.
    // Le nom 'photos[]' est crucial pour que Symfony le reçoive comme un tableau.
    Array.from(selectedFiles).forEach(file => {
      formData.append('photos[]', file);
    });

    try {
      const response = await fetch(`/api/commandes/${order.id}/upload-photos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'L\'upload a échoué.');
      }

      toast({
        title: 'Upload réussi !',
        description: data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setSelectedFiles(null);

      onUpdate();

    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: 'Erreur',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box mt={4} p={4} borderWidth="1px" borderRadius="md" borderColor="gray.300">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Sélectionner des photos à uploader</FormLabel>
            <Input
              type="file"
              multiple // Permet de sélectionner plusieurs fichiers
              onChange={handleFileChange}
              p={1}
            />
          </FormControl>

          {selectedFiles && selectedFiles.length > 0 && (
            <Box w="100%">
              <Text fontSize="sm" mb={2}>Fichiers sélectionnés :</Text>
              <List spacing={1}>
                {Array.from(selectedFiles).map((file, index) => (
                  <ListItem key={index} fontSize="sm">
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {file.name}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="Upload..."
            isDisabled={!selectedFiles || selectedFiles.length === 0}
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