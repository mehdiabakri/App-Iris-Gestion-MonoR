import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { updateClient } from "../api/client";
import { useClient } from "../hooks/useClients";

import type { ClientFormData } from "../types/Types";

import {
  Box,
  Heading,
  Button,
  VStack,
  useToast,
  Spinner,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  Flex,
  Text,
} from "@chakra-ui/react";

const EditClientPage = () => {
  const { clientId } = useParams<{ clientId: string }>(); 
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: clientData, isLoading: isLoadingClient } = useClient(clientId);

  const methods = useForm<ClientFormData>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (clientData) {
      const commandeData = clientData.commandes?.[0] || {};
      const formData = { ...clientData, ...commandeData };
      reset(formData);
    }
  }, [clientData, reset]);

  const mutation = useMutation({
    mutationFn: updateClient,
    onSuccess: (updatedClient) => {
      toast({
        title: "Client mis à jour.",
        status: "success",
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", updatedClient.id] });
      navigate(`/clients/${updatedClient.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de mise à jour.",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    },
  });

  const onSubmit = (data: ClientFormData) => {
    const payload = {
      prenom: data.prenom,
      nom: data.nom,
      email: data.email,
      telephone: data.telephone,
      adresse: data.adresse,
      complementAdresse: data.complementAdresse,
      codePostal: data.codePostal,
      ville: data.ville,
      pays: data.pays,
    };
    if (clientId) {
      mutation.mutate({ clientId, formData: payload });
    }
  };

  if (isLoadingClient) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!clientData) {
    return <Text>Client non trouvé.</Text>;
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      <Heading color="brand.500" mb={6}>
        Modifier : {clientData.prenom} {clientData.nom}
      </Heading>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={8} align="stretch">
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
              boxShadow="sm"
            >
              <Heading size="md" mb={6} color="brand.700">
                Informations Personnelles
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isInvalid={!!errors.prenom}>
                  <FormLabel>Prénom</FormLabel>
                  <Input
                    {...register("prenom", {
                      required: "Le prénom est requis",
                    })}
                  />
                  <FormErrorMessage>{errors.prenom?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.nom}>
                  <FormLabel>Nom</FormLabel>
                  <Input
                    {...register("nom", { required: "Le nom est requis" })}
                  />
                  <FormErrorMessage>{errors.nom?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" {...register("email")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Téléphone</FormLabel>
                  <Input type="tel" {...register("telephone")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Adresse</FormLabel>
                  <Input {...register("adresse")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Complément d'adresse</FormLabel>
                  <Input {...register("complementAdresse")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Code Postal</FormLabel>
                  <Input {...register("codePostal")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Ville</FormLabel>
                  <Input {...register("ville")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Pays</FormLabel>
                  <Input {...register("pays")} />
                </FormControl>
              </SimpleGrid>
            </Box>

            <Button
              mt={4}
              colorScheme="yellow"
              isLoading={mutation.isPending}
              type="submit"
              size="lg"
            >
              Enregistrer les modifications
            </Button>
          </VStack>
        </form>
      </FormProvider>
    </Box>
  );
};

export default EditClientPage;
