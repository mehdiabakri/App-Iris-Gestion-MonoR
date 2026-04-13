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

import {
  FiImage,
  FiPrinter,
  FiBox,
  FiFile,
  FiCodepen,
  FiLoader,
  FiCircle,
  FiClock,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import ListPageLayout from "../components/design/ListPageLayout";

const DashboardPage = () => {
  const { data: monthlySales,isLoading, isError, error } = useDashboardStats();

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
      title="Stats du mois"
      isLoading={isLoading}
      isError={isError}
      error={error}
    >
        {/* Section des stats globales */}
      <Box p={{ base: 4, md: 8 }}>
        <Box mt={50} mb={10}>
          <Heading color="white" mb={5}>
            Croissance portefeuille clients et commandes
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <StatCard
              title="Total clients"
              value={monthlySales?.totalClients ?? 0}
              icon={FiUsers}
              color="purple"
            />
            <StatCard
              title="Commandes"
              value={monthlySales?.totalCommandes ?? 0}
              icon={FiShoppingBag}
              color="blue"
            />
            <StatCard
              title="En cours"
              value={monthlySales?.inProgressCommandes ?? 0}
              icon={FiClock}
              color="orange"
            />
          </SimpleGrid>
        </Box>

        {/* Section des commandes par produit */}
        <Box mt={50} mb={110}>
          <Heading color="white" mb={5}>
            Ventes par catégories
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing={6} mb={8}>
            <StatCard
              title="Tableaux"
              value={monthlySales?.commandesTableaux ?? 0}
              icon={FiImage}
              color="teal"
            />
            <StatCard
              title="Impressions"
              value={monthlySales?.commandesImpressions ?? 0}
              icon={FiPrinter}
              color="teal"
            />
            <StatCard
              title="Caissons"
              value={monthlySales?.commandesCaisson ?? 0}
              icon={FiBox}
              color="teal"
            />
            <StatCard
              title="Fichiers"
              value={monthlySales?.commandesFichiers ?? 0}
              icon={FiFile}
              color="teal"
            />
            <StatCard
              title="Blocs"
              value={monthlySales?.commandesBlocs ?? 0}
              icon={FiCodepen}
              color="teal"
            />
            <StatCard
              title="Ronds"
              value={monthlySales?.commandesRonds ?? 0}
              icon={FiCircle}
              color="teal"
            />
            <StatCard
              title="Bijoux"
              value={monthlySales?.commandesBijoux ?? 0}
              icon={FiLoader}
              color="teal"
            />
          </SimpleGrid>
        </Box>

        {/* Section du Graphique */}
        <Box>
          <Heading color="white" mb={5}>
            Comparatif des ventes Vs N-1
          </Heading>
          <SalesChart />
        </Box>
      </Box>
    </ListPageLayout>
  );
};

export default DashboardPage;
