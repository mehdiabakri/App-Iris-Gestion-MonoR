import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// On importe toutes les fonctions nécessaires depuis votre fichier API
import {
  fetchCommandes,
  fetchCommandeById,
  updateCommande,
  fetchKanbanCommandes,
  transitionCommande
} from '../api/commandes';

// On définit un type pour les filtres
type CommandeFilters = Record<string, string>;



// Hook pour la LISTE des commandes (avec filtres)
export const useCommandes = (filters?: CommandeFilters) => {
  return useQuery({
    queryKey: ['commandes', filters || {}],
    queryFn: () => fetchCommandes(filters),
    select: (data) => (Array.isArray(data) ? data : []),
  });
};

// Hook pour récupérer UNE commande
export const useCommande = (commandId?: string) => {
  return useQuery({
    queryKey: ['commande', commandId],
    queryFn: () => fetchCommandeById(commandId!),
    enabled: !!commandId,
  });
};

// Le type des données que le composant enverra à la fonction de mutation
type UpdateStatutContext = {
  id: string;
  statut: string;
};

export const useUpdateCommande = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (context: UpdateStatutContext) =>
      updateCommande({
        commandId: context.id,
        formData: { statut: context.statut }, 
      }),

    // Lorsque la mise à jour réussit
    onSuccess: (updatedCommande) => {
      // 1. On invalide la liste des commandes pour forcer un rafraîchissement global.
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
      queryClient.invalidateQueries({ queryKey: ['commandes-kanban'] });

      // 2. On met à jour directement le cache pour
      // la query de cette commande spécifique, pour une mise à jour instantanée si
      // un autre composant l'affiche.
      queryClient.setQueryData(['commande', updatedCommande.id], updatedCommande);
    },

    // En cas d'échec
    onError: (error) => {
      console.error("Échec de la mise à jour de la commande", error);
    },
  });
};

// ===================================================================
//   HOOKS SPÉCIFIQUES POUR LE KANBAN
// ===================================================================

// Hook pour charger les données du Kanban
export const useKanbanCommandes = (filters?: Record<string, string>) => {
  return useQuery({
    queryKey: ['commandes-kanban', filters || {}],
    queryFn: () => fetchKanbanCommandes(filters),
    select: (data) => (Array.isArray(data) ? data :[]),
  });
};

// Hook pour le Drag & Drop (déclenche la transition Symfony)
export const useTransitionCommande = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transitionCommande,
    
    onSuccess: () => {
      console.log('Transition réussie !');
      // Rafraîchit les listes pour être sûr que tout est synchro
      queryClient.invalidateQueries({ queryKey: ['commandes-kanban'] });
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
    },
    
    onError: (error) => {
      console.error("Échec de la transition de la commande", error);
    },
  });
};