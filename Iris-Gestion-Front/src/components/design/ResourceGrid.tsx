import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import WorkflowCard from './WorkflowCard'; // On importe notre nouvelle carte
import type { Commande } from '../../types/Types';

type ResourceGridProps = {
  data: Commande[];
};

const ResourceGrid = ({ data }: ResourceGridProps) => {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={6}
    >
      {data.map(item => (
        <WorkflowCard key={item.id} commande={item} />
      ))}
    </SimpleGrid>
  );
};

export default ResourceGrid;