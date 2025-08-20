import { useCommandes } from '../hooks/useCommandes';
import ListPageLayout from '../components/design/ListPageLayout';
import ResourceGrid from '../components/design/ResourceGrid';

const RetouchesPage = () => {
  const { data: commandes, isLoading, isError, error } = useCommandes({ statut: 'A retoucher' });

  return (
    <ListPageLayout
      title="Commandes à Retoucher"
      isLoading={isLoading}
      isError={isError}
      error={error}
    >
      <ResourceGrid data={commandes || []} />
    </ListPageLayout>
  );
};

export default RetouchesPage;