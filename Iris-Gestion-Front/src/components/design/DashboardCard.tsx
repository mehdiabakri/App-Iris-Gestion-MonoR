//Cards avec props pour générer indicateurs clés

import type { ReactElement } from "react";
import { Box, Flex, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import type { IconType } from "react-icons";

// Props
interface DashboardCardProps {
  title: string;
  value: number | string;
  icon?: IconType;
  colorScheme?: string;
}

const DashboardCard = ({
  title,
  value,
  icon,
  colorScheme = "blue",
}: DashboardCardProps): ReactElement => {
  const bg = useColorModeValue(`${colorScheme}.100`, `${colorScheme}.900`);
  const iconColor = useColorModeValue(
    `${colorScheme}.600`,
    `${colorScheme}.300`
  );
  const iconBg = useColorModeValue(`${colorScheme}.50`, `${colorScheme}.800`);
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Box
      bg={bg}
      p={5}
      borderRadius="2xl"
      shadow="md"
      minH="120px"
      display="flex"
      alignItems="center"
      flexGrow={1}
    >
      <Flex align="center" gap={4}>
        {icon && (
          <Box
            bg={iconBg}
            p={2}
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={icon} boxSize={8} color={iconColor} />
          </Box>
        )}
        <Box>
          <Text fontSize="sm" color={textColor}>
            {title}
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {value}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default DashboardCard;
