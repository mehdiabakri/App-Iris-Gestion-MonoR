import { useQuery } from '@tanstack/react-query';
import { fetchClients } from '../api/client'; // Adresse du fichier API
import { fetchClientById } from '../api/client';

// Hook personnalisé pour récupérer les clients

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });
};

// Le hook prend l'ID du client en argument pour afficher un client spécifique
export const useClient = (clientId) => {
  return useQuery({
    // La clé de query est un tableau qui inclut l'ID.
    queryKey: ['client', clientId],
    queryFn: () => fetchClientById(clientId),
    
    // On désactive le hook s'il n'y a pas d'ID.
    enabled: !!clientId, 
  });
};