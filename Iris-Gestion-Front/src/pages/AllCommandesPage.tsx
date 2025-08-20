import React, { useState } from 'react';
import { useCommandes } from '../hooks/useCommandes';
import { allOrderColumns } from '../config/columns';
import ListPageLayout from '../components/design/ListPageLayout';
import ResourceTable from '../components/design/ResourceTable';
import { useNavigate } from 'react-router-dom';

// On importe les composants Chakra pour le filtre
import { Select, HStack, Button } from '@chakra-ui/react';

type CommandeFilters = {
  statut?: string;
};

// La liste de tous les statuts possibles pour le menu déroulant
const STATUTS = [
  "A retoucher", "A imprimer", "A envoyer client", "Attente retour client",
  "A commander", "Commande OK", "Terminé", "Livraison en cours"
];

const AllCommandesPage = () => {
  const navigate = useNavigate();
  
  // 1. On crée un état local pour stocker le filtre sélectionné
  const [filters, setFilters] = useState<CommandeFilters>({});

  // 2. On passe cet état au hook `useCommandes`.
  //    Quand `filters` changera, TanStack Query refera automatiquement un fetch !
  const { data: commandes, isLoading, isError, error } = useCommandes(filters);

  // 3. Handler pour changer le filtre quand l'utilisateur choisit une option
  const handleStatutChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatut = event.target.value;

    if (newStatut) {
      // On met à jour l'état avec le nouveau statut
      setFilters({ statut: newStatut });
    } else {
      // Si l'utilisateur choisit "Tous les statuts", on remet les filtres à zéro
      setFilters({});
    }
  };
  
  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <ListPageLayout
      title="Toutes les Commandes"
      isLoading={isLoading}
      isError={isError}
      error={error}
    >
      {/* --- Section des Filtres --- */}
      <HStack mb={6} spacing={4}>
        <Select 
          placeholder="Filtrer par statut..." 
          onChange={handleStatutChange}
          value={filters.statut || ''} 
          maxWidth="300px"
        >
          {STATUTS.map(statut => (
            <option key={statut} value={statut}>{statut}</option>
          ))}
        </Select>
        <Button onClick={handleResetFilters}>Réinitialiser</Button>
      </HStack>

      {/* --- Affichage des résultats --- */}
      <ResourceTable
        data={commandes || []}
        columns={allOrderColumns}
        onRowClick={(commande) => {
          navigate(`/clients/${commande.client.id}`);
        }}
      />
    </ListPageLayout>
  );
};

export default AllCommandesPage;