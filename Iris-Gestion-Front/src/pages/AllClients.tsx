import { useClients } from "../hooks/useClients"; // Notre hook de données
import { clientColumns } from "../config/columns"; // Votre config de colonnes (renommée pour plus de clarté)
import ListPageLayout from "../components/design/ListPageLayout"; // Notre layout générique
import ResourceTable from "../components/design/ResourceTable"; // Notre tableau générique
import { useNavigate } from "react-router-dom";


// Importez aussi le modal si besoin

const AllClients = () => {
  // 1. On appelle le hook pour récupérer l'état du serveur
  const { data: clients, isLoading, isError, error } = useClients();
  const navigate = useNavigate();

  const handleClientClick = (client) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const targetUrl = `/clients/${client.id}`;
    // On navigue vers la page de détail correspondante
    navigate(`/clients/${client.id}`);
  };

  return (
    
    <ListPageLayout
      title="Liste des clients"
      isLoading={isLoading}
      isError={isError}
      error={error}
    >
      {/* Ce qui est ici ne s'affiche que si le chargement est OK */}
      
      <ResourceTable
        data={clients || []} // On s'assure que data n'est jamais undefined
        columns={clientColumns}
        onRowClick={handleClientClick}
      />
    </ListPageLayout>
  );
};

export default AllClients;
