import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../api/categorie'; // Adresse du fichier API

// Hook personnalisé pour récupérer les catégories
// Utilise React Query pour la gestion des requêtes asynchrones

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'], // La clé de cache
    queryFn: fetchCategories, // La fonction qui récupère les données
  });
};