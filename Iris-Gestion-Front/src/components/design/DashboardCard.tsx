import type { ReactElement } from "react";
import { Box, Flex, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import type { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: IconType;
  color?: string;
}

const DashboardCard = ({
 title,
  value,
  icon,
}: StatCardProps): ReactElement => {
  const bg = useColorModeValue("white", "gray.800"); 
  const iconBg = useColorModeValue("brand.50", "gray.700"); 
  const textColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const valueColor = useColorModeValue("gray.800", "white");

  return (
    <Box
      bg={bg}
      p={5}
      borderRadius="2xl"
      shadow="sm"
      minH="120px"
      display="flex"
      alignItems="center"
      flexGrow={1}
      border="1px solid"
      borderColor={borderColor}
    >
      <Flex align="center" gap={4}>
        {icon && (
          <Box
            bg={iconBg}
            p={3}
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={icon} boxSize={7} color="brand.700" />
          </Box>
        )}
        <Box>
          <Text fontSize="sm" color={textColor} fontWeight="medium" mb={1}>
            {title}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color={valueColor}>
            {value}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default DashboardCard;