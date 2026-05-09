import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "../api/customFetch";
import { fetchProduitsBase , deleteProduit } from "../api/produitsBase";

export const useProduitsBase = () => {
  return useQuery({
    queryKey: ["produitsBase"], // Une clé unique pour ces données
    queryFn: fetchProduitsBase,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDeleteProduit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduit,
    onSuccess: () => {
      // Invalide le cache pour forcer le rafraîchissement de la liste
      queryClient.invalidateQueries({ queryKey: ["produitsBase"] });
    },
  });
};