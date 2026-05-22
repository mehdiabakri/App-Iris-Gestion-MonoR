import { useState, useMemo } from 'react';
import { useKanbanCommandes } from '../hooks/useCommandes'; 
import ListPageLayout from '../components/design/ListPageLayout';
import GlobalSearchBar from '../components/design/GlobalSearchBar';
import KanbanPage from '../components/Kanban/KanbanPage';

const Kanban = () => {
  const { data: commandes, isLoading, isError, error } = useKanbanCommandes();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCommandes = useMemo(() => {
    if (!commandes) return [];
    if (!searchQuery) return commandes;

    const query = searchQuery.toLowerCase();
    
    return commandes.filter((c) => {
      const email = c.client?.email?.toLowerCase() || "";
      return email.includes(query);
    });
  }, [commandes, searchQuery]);

  return (
    <ListPageLayout
      title="Suivi des commandes"
      isLoading={isLoading}
      isError={isError}
      error={error}
      headerRight={
        <GlobalSearchBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          placeholder="Recherchez par email" 
        />
      }
    >
      <KanbanPage commandes={filteredCommandes} />
    </ListPageLayout>
  );
};

export default Kanban;