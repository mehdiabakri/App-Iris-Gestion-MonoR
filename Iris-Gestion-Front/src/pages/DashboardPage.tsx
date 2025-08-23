import React from "react";
import { useDashboardStats } from "../hooks/useDashboardStats";
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import StatCard from "../components/dashboard/StatCard";
import SalesChart from "../components/dashboard/SalesChart";

import { FiImage, FiPrinter, FiBox, FiFile, FiCodepen } from "react-icons/fi";
import ListPageLayout from "../components/design/ListPageLayout";

const DashboardPage = () => {
  const { data: stats, isLoading, isError, error } = useDashboardStats();

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isError) {
    return <Text>Erreur de chargement des données: {error.message}</Text>;
  }

  return (
    <ListPageLayout
      title="Tableau de bord"
      isLoading={isLoading}
      isError={isError}
      error={error}
    >
      <Box p={{ base: 4, md: 8 }}>
        <Box mt={50} mb={110}>
          <Heading color="white" mb={5}>Ventes du mois</Heading>
          {/* Section des KPIs */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            <StatCard
              title="Tableaux"
              value={stats?.commandesTableaux ?? 0}
              icon={FiImage}
              color="teal"
            />
            <StatCard
              title="Impressions"
              value={stats?.commandesImpressions ?? 0}
              icon={FiPrinter}
              color="teal"
            />
            <StatCard
              title="Caissons"
              value={stats?.commandesCaisson ?? 0}
              icon={FiBox}
              color="teal"
            />
            <StatCard
              title="Fichiers"
              value={stats?.commandesFichiers ?? 0}
              icon={FiFile}
              color="teal"
            />
            <StatCard
              title="Blocs"
              value={stats?.commandesBlocs ?? 0}
              icon={FiCodepen}
              color="teal"
            />
          </SimpleGrid>
        </Box>

        {/* Section du Graphique */}
        <Box>
          <Heading color="white" mb={5}>Ventes annuelles</Heading>
          <SalesChart />
        </Box>
      </Box>
    </ListPageLayout>
  );
};

export default DashboardPage;
