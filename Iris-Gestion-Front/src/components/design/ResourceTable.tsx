import {
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Box, VStack, Text, Flex, useMediaQuery // <-- On ajoute useMediaQuery
} from "@chakra-ui/react";
import type { ColumnDefinition } from "../../config/columns";

type ResourceTableProps<T extends { id: string }> = {
  data: T[];
  columns: ColumnDefinition<T>[];
  onRowClick?: (item: T) => void;
};

const ResourceTable = <T extends { id: string }>({ data, columns, onRowClick }: ResourceTableProps<T>) => {
    const [isLargerThan1700] = useMediaQuery("(min-width: 1700px)");

  return (
    <>
      {/* 
          Si isLargerThan1700 est FAUX, on affiche les CARDS.
          Si c'est VRAI, on affiche le TABLEAU.
          Le "?" et le ":" garantissent qu'un SEUL des deux est rendu.
      */}
      {!isLargerThan1700 ? (
        /* --- VERSION CARDS --- */
        <VStack spacing={6} align="stretch">
          {data.map((item) => (
            <Box
              key={item.id}
              p={6}
              borderWidth="1px"
              borderColor="whiteAlpha.300"
              borderRadius="xl"
              bg="black"
              color="white"
              onClick={() => onRowClick?.(item)}
              _hover={{ color: "brand.700", bg: "brand.600", cursor: "pointer" }}
              transition="all 0.2s"
            >
              <Flex wrap="wrap" gap={8}>
                {columns.map((col) => (
                  <Box key={String(col.key)} minW={{ base: "100%", md: "300px" }} flex="1">
                    <Text 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="whiteAlpha.500" 
                      textTransform="uppercase" 
                      letterSpacing="widest" 
                      mb={1}
                    >
                      {col.label}
                    </Text>
                    <Box fontSize="md" fontWeight="medium">
                      {col.render(item)}
                    </Box>
                  </Box>
                ))}
              </Flex>
            </Box>
          ))}
        </VStack>
      ) : (
        /* --- VERSION TABLEAU --- */
        <TableContainer>
          <Table variant="simple" size="lg" color="white">
            <Thead>
              <Tr>
                {columns.map((col) => (
                  <Th color="white" key={String(col.key)} borderColor="whiteAlpha.300">
                    {col.label}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item) => (
                <Tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  _hover={{ color: "brand.700", bg: "brand.600", cursor: "pointer" }}
                >
                  {columns.map((col) => (
                    <Td key={String(col.key)} borderColor="whiteAlpha.200">
                      {col.render(item)}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default ResourceTable;