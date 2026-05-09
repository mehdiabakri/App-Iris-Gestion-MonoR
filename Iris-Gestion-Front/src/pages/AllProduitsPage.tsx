import { useProduitsBase } from '../hooks/useProduitsBase'; // Notre nouveau hook
import ListPageLayout from '../components/design/ListPageLayout';
import ProductList from '../components/products/ProductList';

const AllProduitsPage = () => {
  const { isLoading, isError, error } = useProduitsBase();

  return (
    <ListPageLayout
      title="Liste des Produits"
      isLoading={isLoading}
      isError={isError}
      error={error}
    >
      <ProductList />

    </ListPageLayout>
  );
};

export default AllProduitsPage;