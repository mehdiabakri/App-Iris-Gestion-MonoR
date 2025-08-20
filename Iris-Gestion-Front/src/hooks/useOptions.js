import { useQuery } from '@tanstack/react-query';
import { customFetch } from '../api/customFetch';

// La fonction qui fait l'appel API
const fetchOptions = async () => {
  const response = await customFetch('/api/options');
  if (!response.ok) {
    throw new Error('Erreur réseau lors de la récupération des options');
  }
  const data = await response.json();

  const optionsArray = data['hydra:member'] || data.member || data;

  if (!Array.isArray(optionsArray)) {
      console.error("La réponse de /api/options n'est pas un tableau valide:", data);
      return []; // Retourne un tableau vide en cas de format inconnu
  }
  
  return optionsArray;
};

export const useOptions = () => {
  return useQuery({
    queryKey: ['options'], // Clé de cache pour toutes les options
    queryFn: fetchOptions,
    // Durée de vie dans le cache
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};