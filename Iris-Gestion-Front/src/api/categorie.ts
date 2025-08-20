import { customFetch } from './customFetch'; 

import type { ProduitBase } from "../types/Types";


export const fetchCategories = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const url = `/api/categories?${params.toString()}`;
  const data = await customFetch(url);

  return data?.['hydra:member'] || data?.member || [];
};

// Fonction pour récupérer les produits filtrés par catégorie
export const fetchProductsByCategory = async (categoryIri: string): Promise<ProduitBase[]> => {
  // Construit une URL comme /api/produit_bases?categorie=/api/categories/1
  const url = `/api/produit_bases?categorie=${encodeURIComponent(categoryIri)}`;
  const data = await customFetch(url);
  return data?.['hydra:member'] || data?.member || [];
};