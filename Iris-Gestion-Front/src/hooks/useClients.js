import { useQuery } from '@tanstack/react-query';
import { fetchClients } from '../api/client'; // Adresse du fichier API
import { fetchClientById } from '../api/client';

// Hook personnalisé pour récupérer les clients
// Utilise React Query pour la gestion des requêtes asynchrones

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'], // La clé de cache pour les clients
    queryFn: fetchClients, // La fonction qui récupère les données
  });
};

// Le hook prend l'ID du client en argument pour afficher un client spécifique
export const useClient = (clientId) => {
  return useQuery({
    // La clé de query est maintenant un tableau qui inclut l'ID.
    // C'est crucial pour que TanStack Query mette en cache chaque client séparément.
    queryKey: ['client', clientId],
    queryFn: () => fetchClientById(clientId),
    
    // Optionnel mais recommandé : on désactive le hook s'il n'y a pas d'ID.
    enabled: !!clientId, 
  });
};