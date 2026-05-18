import { customFetch } from "./customFetch";
import type { ProduitBase, ProduitBaseFormData  } from "../types/Types";

// --- Fonction pour récupérer la liste de tous les produits de base ---
export const fetchProduitsBase = async (): Promise<ProduitBase[]> => {
  const data = await customFetch("/api/produit_bases");
  return data?.['hydra:member'] || data?.member || [];
};

// --- Fonction pour récupérer un seul produit par son ID ---
export const fetchProduitById = async (
  produitId: string | number
): Promise<ProduitBase> => {
  return customFetch(`/api/produit_bases/${produitId}`);
};

// --- Fonction pour supprimer un produit par son ID ---
export const deleteProduit = async (produitId: string | number): Promise<void> => {
  await customFetch(`/api/produit_bases/${produitId}`, {
    method: "DELETE",
  });
};

// --- Fonction pour créer un produit ---
export const createProduit = async (produitData: ProduitBaseFormData): Promise<ProduitBase> => {
  return customFetch("/api/produit_bases", {
    method: "POST",
    headers: { "Content-Type": "application/ld+json" },
    body: JSON.stringify(produitData),
  });
};

// --- Fonction pour mettre à jour un produit par son ID ---
export const updateProduit = async ({ id, data }: { id: string | number; data: ProduitBaseFormData }): Promise<ProduitBase> => {
  return customFetch(`/api/produit_bases/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/ld+json" },
    body: JSON.stringify(data),
  });
};