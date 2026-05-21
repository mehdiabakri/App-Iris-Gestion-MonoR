import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
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
} from "@chakra-ui/react";

import type { LoginFormInputs } from "../types/Types";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const hasAttempted = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();
  const toast = useToast();

useEffect(() => {
  /**
   * Auto-login démo :
   * On utilise un flag "shouldRunDemoLogin" pour s'assurer que le login automatique ne se déclenche qu'une seule fois,
   * même si le composant se remonte plusieurs fois.
   * Le flag est consommé uniquement après un login réussi, pour éviter les boucles infinies en cas de problème.
   * Le petit délai de 200ms est là pour s'assurer que le Service Worker de MSW a bien pris le contrôle du réseau avant que la requête de login ne parte, sinon elle risquerait de ne pas être interceptée et de causer un échec.
   */
    const isDemo = localStorage.getItem("isDemoMode") === "true";
    const shouldLogin = localStorage.getItem("shouldRunDemoLogin") === "true";
    
    if (isDemo && shouldLogin && !isAuthenticated && !hasAttempted.current) {
      hasAttempted.current = true;
      const timer = setTimeout(() => {
        console.log("🚀 MSW : Auto-login démo en cours...");
        login({ email: "demo@example.com", password: "demo" })
          .then(() => {
            localStorage.removeItem("shouldRunDemoLogin");
          })
          .catch(() => {
            hasAttempted.current = false;
          });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, login]);

  const handleDemo = () => {
    localStorage.setItem("isDemoMode", "true");
    localStorage.setItem("shouldRunDemoLogin", "true");
    // On vérifie si MSW est déjà actif. Si non, on reload UNE SEULE FOIS.
    if (!window.navigator.serviceWorker.controller) {
      window.location.reload();
    } else {
      // Si MSW est déjà là, on déclenche juste le login sans recharger
      login({ email: "demo@example.com", password: "demo" });
    }
  };

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login({ email: data.email, password: data.password });
    } catch (unknown) {
      toast({
        title: "Échec de la connexion",
        description: (unknown as Error).message || "Erreur inconnue",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="blackAlpha.50">
      <Box
        p={8}
        maxWidth="400px"
        width="full"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg="white"
      >
        <VStack as="form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
          <Heading size="lg" mb={2}>
            Connexion
          </Heading>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Email"
              {...register("email", { required: "L'email est requis" })}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              type="password"
              placeholder="Mot de passe"
              {...register("password", {
                required: "Le mot de passe est requis",
              })}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="yellow"
            width="full"
            isLoading={isSubmitting}
          >
            Se connecter
          </Button>

          <Button
            type="button"
            colorScheme="red"
            variant="outline"
            width="full"
            onClick={handleDemo}
          >
            Tester la démo (Accès Rapide)
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginPage;
