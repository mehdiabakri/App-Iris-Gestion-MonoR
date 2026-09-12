import React from "react";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { Box, Flex, Heading, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import StatCard from "../components/dashboard/StatCard";
import SalesChart from "../components/dashboard/SalesChart";

import {
  FiImage,
  FiPrinter,
  FiBox,
  FiFile,
  FiCodepen,
  FiClock,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import ListPageLayout from "../components/design/ListPageLayout";

const DashboardPage = () => {
  const { data: monthlySales, isLoading, isError, error } = useDashboardStats();

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  if (isError) {
    return <Text color="red.500">Erreur de chargement des données: {error.message}</Text>;
  }

  return (
    <ListPageLayout
      title="Statistiques du mois"
      isLoading={isLoading}
      isError={isError}
      error={error}
    >
      <Box p={{ base: 4, md: 8 }}>
        
        {/* Section 1 : Stats globales */}
        <Box mt={4} mb={10}>
          <Heading size="md" color="brand.700" mb={5}>
            Croissance portefeuille clients et commandes
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <StatCard
              title="Total clients"
              value={monthlySales?.totalClients ?? 0}
              icon={FiUsers}
              color="brand.700"
            />
            <StatCard
              title="Commandes"
              value={monthlySales?.totalCommandes ?? 0}
              icon={FiShoppingBag}
              color="brand.700"
            />
            <StatCard
              title="En cours"
              value={monthlySales?.inProgressCommandes ?? 0}
              icon={FiClock}
              color="brand.700"
            />
          </SimpleGrid>
        </Box>

        {/* Section 2 : Commandes par produit */}
        <Box mt={10} mb={10}>
          <Heading size="md" color="brand.700" mb={5}>
            Ventes par catégories
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing={6}>
            <StatCard title="Tableaux" value={monthlySales?.commandesTableaux ?? 0} icon={FiImage} color="brand.700" />
            <StatCard title="Impressions" value={monthlySales?.commandesImpressions ?? 0} icon={FiPrinter} color="brand.700" />
            <StatCard title="Caissons" value={monthlySales?.commandesCaisson ?? 0} icon={FiBox} color="brand.700" />
            <StatCard title="Fichiers" value={monthlySales?.commandesFichiers ?? 0} icon={FiFile} color="brand.700" />
            <StatCard title="Blocs" value={monthlySales?.commandesBlocs ?? 0} icon={FiCodepen} color="brand.700" />
          </SimpleGrid>
        </Box>

        {/* Section 3 : Graphique */}
        <Box>
          <Heading size="md" color="brand.700" mb={5}>
            Comparatif des ventes Vs N-1
          </Heading>
          <SalesChart />
        </Box>
        
      </Box>
    </ListPageLayout>
  );
};

export default DashboardPage;