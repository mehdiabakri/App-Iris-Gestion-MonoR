import { Box, Heading, Spinner, Alert, AlertIcon } from "@chakra-ui/react";

type ListPageLayoutProps = {
  title: string;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  children: React.ReactNode;
  maxW?: string;
};

const ListPageLayout = ({
  title,
  isLoading,
  isError,
  error,
  children,
}: ListPageLayoutProps) => {
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
      {!isLoading && !isError && children}
    </Box>
  );
};

export default ListPageLayout;
