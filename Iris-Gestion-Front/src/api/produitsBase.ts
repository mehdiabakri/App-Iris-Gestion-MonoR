import { customFetch } from "./customFetch";
import type { ProduitBase } from "../types/Types";

// --- Fonction pour récupérer la liste de tous les produits de base ---
export const fetchProduitsBase = async (): Promise<ProduitBase[]> => {
  const data = await customFetch("/api/produit_bases");
  return data?.['hydra:member'] || data?.member || [];
};

// --- Fonction pour récupérer UN seul produit par son ID ---
export const fetchProduitById = async (
  produitId: string | number
): Promise<ProduitBase> => {
  return customFetch(`/api/produit_bases/${produitId}`);
};
