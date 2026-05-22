import {
  Box,
  Flex,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import React from "react";

type ListPageLayoutProps = {
  title: string;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  children: React.ReactNode;
  maxW?: string;
  headerRight?: React.ReactNode;
};

const ListPageLayout = ({
  title,
  isLoading,
  isError,
  error,
  children,
  headerRight,
}: ListPageLayoutProps) => {
  return (
    <Box pb={8} px={4} pt={4}>
      {/* --- EN-TÊTE (Titre + Recherche) --- */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        mb={8}
        gap={4}
      >
        <Heading fontSize="3xl" color="brand.500">
          {title}
        </Heading>

        {headerRight && (
          <Box w={{ base: "100%", md: "350px" }}>{headerRight}</Box>
        )}
      </Flex>

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
