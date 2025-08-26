import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  FormErrorMessage,
  Flex,
} from '@chakra-ui/react';

import type { LoginFormInputs } from '../types/Types';

const LoginPage = () => {
  const { login } = useAuth(); // On récupère la fonction de connexion du contexte
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();
  const toast = useToast();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login({ email: data.email, password: data.password });
    } catch (error) {
      toast({
        title: "Échec de la connexion",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Box
        p={8}
        maxWidth="400px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg="white"
      >
        <VStack as="form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
          <Heading>Connexion</Heading>
          
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Email"
              {...register('email', { required: 'L\'email est requis' })}
            />
            <FormErrorMessage>{errors.email?.message as string}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              type="password"
              placeholder="Super mot de passe"
              {...register('password', { required: 'Le mot de passe est requis' })}
            />
            <FormErrorMessage>{errors.password?.message as string}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="yellow"
            width="full"
            isLoading={isSubmitting}
          >
            Se connecter
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginPage;