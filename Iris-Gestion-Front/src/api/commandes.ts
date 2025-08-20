import { customFetch } from "./customFetch";
import type { Commande, EditCommandFormData } from "../types/Types";

// --- Fonction pour récupérer toutes les commandes, avec des filtres optionnels ---
export const fetchCommandes = async (
  filters: Record<string, string> = {}
): Promise<Commande[]> => {
  const params = new URLSearchParams(filters);
  const url = `/api/commandes?${params.toString()}`;
  const data = await customFetch(url);
  return data?.['hydra:member'] || data?.member || [];
};

// --- Fonction pour récupérer UNE seule commande par son ID ---
export const fetchCommandeById = async (
  commandId: string
): Promise<Commande> => {
  return customFetch(`/api/commandes/${commandId}`);
};

// --- Fonction pour mettre à jour une commande existante ---
type UpdateCommandeParams = {
  commandId: string;
  formData: Partial<EditCommandFormData>;
};

export const updateCommande = async ({
  commandId,
  formData,
}: UpdateCommandeParams): Promise<Commande> => {
  return customFetch(`/api/commandes/${commandId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/merge-patch+json",
    },
    body: JSON.stringify(formData),
  });
};

// --- Fonction pour créer une nouvelle commande (liée à un client existant) ---
export const createCommande = async (
  formData: Partial<EditCommandFormData>
): Promise<Commande> => {
  return customFetch("/api/commandes", {
    method: "POST",
    body: JSON.stringify(formData),
  });
};
