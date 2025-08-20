import { useQuery } from '@tanstack/react-query';
import { fetchCommandes, fetchCommandeById } from '../api/commandes';

// Hook pour la LISTE des commandes (avec filtres)
export const useCommandes = (filters) => {
  return useQuery({
    queryKey: ['commandes', filters || {}],
    queryFn: () => fetchCommandes(filters),
    select: (data) => Array.isArray(data) ? data : [],
  });
};

// Hook pour récupérer UNE commande
export const useCommande = (commandId) => {
  return useQuery({
    queryKey: ['commande', commandId],
    queryFn: () => fetchCommandeById(commandId),
    enabled: !!commandId,
  });
};