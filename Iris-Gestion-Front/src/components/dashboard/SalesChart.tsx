import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useMonthlySales } from "../../hooks/useDashboardStats";

const SalesChart = () => {
  const { data: salesData, isLoading, isError } = useMonthlySales();

const formattedData = useMemo(() => {
    if (!Array.isArray(salesData)) return [];

    return salesData.map((item) => {
      // 1. On sépare l'année et le mois à partir de la chaîne "YYYY-MM"
      const [year, month] = item.month.split('-').map(Number);

      // ATTENTION : les mois en JS sont indexés à partir de 0 (0=Janvier, 11=Décembre)
      // C'est pourquoi je fais "month - 1".
      const date = new Date(year, month - 1, 2); 

      // On formate la date en "Mois Année"
      const monthName = new Intl.DateTimeFormat("fr-FR", {
        month: "long",
      }).format(date);

      return {
        ...item,
        monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      };
    });
  }, [salesData]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="400px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isError || !Array.isArray(salesData)) {
    return <Text>Impossible de charger les données du graphique.</Text>;
  }

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      h="400px"
    >
      <Heading color="brand.200" size="md" mb={4}>
        Ventes Mensuelles
      </Heading>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthName" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value.toFixed(0)}`} />
          <Legend />
          <Bar
            dataKey="totalCommandes"
            name="Nombre de commandes"
            fill="#f8de29"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SalesChart;
