import { useState, useMemo } from 'react';
import { Flex } from '@chakra-ui/react';
import { useKanbanCommandes } from '../hooks/useCommandes'; 
import ListPageLayout from '../components/design/ListPageLayout';
import GlobalSearchBar from '../components/design/GlobalSearchBar';
import KanbanPage from '../components/Kanban/KanbanPage';

const Kanban = () => {
  // 1. On récupère les données de l'API
  const { data: commandes, isLoading, isError, error } = useKanbanCommandes();
  
  // 2. On crée l'état pour la barre de recherche
  const [searchQuery, setSearchQuery] = useState("");

  // 3. On filtre les commandes dynamiquement
  const filteredCommandes = useMemo(() => {
    if (!commandes) return[];
    if (!searchQuery) return commandes;

    const query = searchQuery.toLowerCase();
    
    return commandes.filter((c) => {
      const email = c.client?.email?.toLowerCase() || "";
      
      return email.includes(query);
    });
  },[commandes, searchQuery]);

  return (
    <ListPageLayout
      title="Suivi des commandes"
      isLoading={isLoading}
      isError={isError}
      error={error}
    >
      {/* On affiche la barre de recherche en haut à droite */}
      <Flex justify="flex-end" mb={4} px={2}>
        <GlobalSearchBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          placeholder="Recherchez par email" 
        />
      </Flex>
      <KanbanPage commandes={filteredCommandes} />
    </ListPageLayout>
  );
};

export default Kanban;