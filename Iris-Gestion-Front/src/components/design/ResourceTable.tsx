import {
  Table, Thead, Tbody, Tr, Th, Td, TableContainer
} from "@chakra-ui/react";
import type { ColumnDefinition } from "../../config/columns"; // Indique la config de colonnes

// On utilise un type générique <T>
// On contraint T à avoir au moins une propriété `id` de type string
type ResourceTableProps<T extends { id: string }> = {
  data: T[]; // Le nom est maintenant générique : "data" au lieu de "clients"
  columns: ColumnDefinition<T>[]; // Les colonnes sont aussi génériques
  onRowClick?: (item: T) => void; // L'événement de clic aussi
};

const ResourceTable = <T extends { id: string }>({ data, columns, onRowClick }: ResourceTableProps<T>) => {
  return (
    <TableContainer>
      <Table variant="simple" size="lg">
        <Thead>
          <Tr>
            {columns.map((col) => <Th key={String(col.key)}>{col.label}</Th>)}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => (
            <Tr 
              key={item.id} 
              onClick={() => onRowClick?.(item)} // On rend la ligne cliquable
              _hover={{ bg: "gray.50", cursor: "pointer" }}
            >
              {columns.map((col) => (
                <Td key={String(col.key)}>
                  {col.render(item)}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ResourceTable;