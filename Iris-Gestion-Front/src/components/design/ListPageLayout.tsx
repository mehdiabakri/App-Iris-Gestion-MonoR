import { Box, Heading, Spinner, Alert, AlertIcon } from "@chakra-ui/react";

type ListPageLayoutProps = {
  title: string;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null; // TanStack Query fournit un objet error avec une propriété message ou peut être null
  children: React.ReactNode; // "children" est ce qu'on affichera si tout va bien
};

const ListPageLayout = ({ title, isLoading, isError, error, children }: ListPageLayoutProps) => {
  return (
    <Box p={8}>
      <Heading mb={6} fontSize="4xl" color="brand.500">
        {title}
      </Heading>

      {isLoading && <Spinner size="xl" color="brand.400" />}
      {isError && (
        <Alert status="error">
          <AlertIcon />
          Erreur : {error?.message || "Une erreur inconnue est survenue"}
        </Alert>
      )}
      
      {/* On affiche les enfants uniquement si le chargement est terminé et qu'il n'y a pas d'erreur */}
      {!isLoading && !isError && children}
    </Box>
  );
};

export default ListPageLayout;