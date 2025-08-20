import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, VStack, FormControl, FormLabel, Input, useToast,
} from '@chakra-ui/react';
import { downloadFromApi } from '../../utils/download';

type ExportDateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FormData = {
  startDate: string;
  endDate: string;
};

const ExportDateModal = ({ isOpen, onClose }: ExportDateModalProps) => {
  const { register, handleSubmit } = useForm<FormData>();
  const toast = useToast();

  const onSubmit = (data: FormData) => {
    if (!data.startDate || !data.endDate) {
      toast({
        title: "Champs manquants",
        description: "Veuillez sélectionner une date de début et de fin.",
        status: "warning",
        isClosable: true,
      });
      return;
    }

    const params = new URLSearchParams({
      start: data.startDate,
      end: data.endDate,
    }).toString();

    const url = `/api/export/commandes-excel?${params}`;
    downloadFromApi(url, `export-commandes-${data.startDate}-au-${data.endDate}.xlsx`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choisir une période d'export</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Date de début</FormLabel>
                <Input type="date" {...register('startDate')} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Date de fin</FormLabel>
                <Input type="date" {...register('endDate')} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button colorScheme="green" type="submit">
              Télécharger
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ExportDateModal;