import React from "react";
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
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useMonthlySales } from "../../hooks/useDashboardStats"; // Vérifie ton chemin d'import

const SalesChart = () => {
  const { data: salesData, isLoading, isError } = useMonthlySales();

  // On récupère les années pour nommer les éléments de la légende
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

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

      
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={salesData}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#718096', fontSize: 14 }} 
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#718096' }} 
          />
          
          <Tooltip 
            cursor={{ fill: 'transparent' }} // Enlève le fond gris moche au survol
            formatter={(value: number) => [`${value} commande${value > 1 ? 's' : ''}`]} 
          />
          
          <Legend verticalAlign="bottom" height={36} iconType="circle" />

          {/* BARRE 1 : L'année précédente */}
          <Bar
            dataKey="anneePrecedente"
            name={previousYear.toString()}
            fill="#E2E8F0"
            radius={[4, 4, 0, 0]}
          />

          {/* BARRE 2 : L'année en cours */}
          <Bar
            dataKey="anneeEnCours"
            name={currentYear.toString()}
            fill="#f8de29"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SalesChart;