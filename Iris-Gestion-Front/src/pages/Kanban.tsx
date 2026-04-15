import { useKanbanCommandes } from '../hooks/useCommandes'; // Utilise le hook spécial Kanban
import ListPageLayout from '../components/design/ListPageLayout';
import KanbanPage from '../components/Kanban/KanbanPage'; // Ton nouveau composant DND

const Kanban = () => {
  const { data: commandes, isLoading, isError, error } = useKanbanCommandes();

  return (
    <ListPageLayout
      title="Suivi des commandes"
      isLoading={isLoading}
      isError={isError}
      error={error}
    >
      <KanbanPage commandes={commandes || []} />
    </ListPageLayout>
  );
};

export default Kanban;