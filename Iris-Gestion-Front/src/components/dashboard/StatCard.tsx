import React from "react";
import { Box, Flex, Stat, StatLabel, StatNumber, Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: IconType;
  color: string;
};

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <StatLabel color="brand.700" fontSize="sm" fontWeight="medium">
            {title}
          </StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold" color="brand.700">
            {value}
          </StatNumber>
        </Box>

        <Flex
          boxSize="56px"
          alignItems="center"
          justifyContent="center"
          borderRadius="full"
          color={`brand.300`}
        >
          <Icon as={icon} boxSize={8} />
        </Flex>
      </Flex>
    </Stat>
  );
};
export default StatCard;
