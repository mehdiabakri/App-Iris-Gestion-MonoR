import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// On importe toutes les fonctions nécessaires depuis votre fichier API
import {
  fetchCommandes,
  fetchCommandeById,
  updateCommande, // On utilise votre fonction existante
} from '../api/commandes';

// On définit un type pour les filtres pour plus de clarté
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
    // La mutationFn reçoit le contexte { id, statut } de notre composant...
    mutationFn: (context: UpdateStatutContext) =>
      // ...et l'adapte pour appeler votre fonction `updateCommande` avec le bon format.
      updateCommande({
        commandId: context.id,
        formData: { statut: context.statut }, // On passe le statut dans formData
      }),

    // Lorsque la mise à jour réussit...
    onSuccess: (updatedCommande) => {
      console.log('Mise à jour réussie !', updatedCommande);

      // 1. On invalide la liste des commandes pour forcer un rafraîchissement global.
      queryClient.invalidateQueries({ queryKey: ['commandes'] });

      // 2. (Optionnel mais recommandé) On met aussi à jour directement le cache pour
      // la query de cette commande spécifique, pour une mise à jour instantanée si
      // un autre composant l'affiche.
      queryClient.setQueryData(['commande', updatedCommande.id], updatedCommande);
    },

    // En cas d'échec
    onError: (error) => {
      console.error("Échec de la mise à jour de la commande", error);
      // Pensez à afficher un message d'erreur à l'utilisateur ici (avec un toast par exemple)
    },
  });
};