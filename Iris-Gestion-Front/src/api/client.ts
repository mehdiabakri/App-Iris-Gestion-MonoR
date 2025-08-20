// src/api/client.ts

import { customFetch } from './customFetch';
import type { Client, ClientFormData, CreateClientPayload } from '../types/Types';

// --- Fonction pour afficher tous les clients ---
export const fetchClients = async (): Promise<Client[]> => {
  const data = await customFetch('/api/clients');
  return data?.['hydra:member'] || data?.member || [];
};

// --- Fonction pour récupérer UN seul client par son ID ---
export const fetchClientById = async (clientId: string): Promise<Client> => {
  return customFetch(`/api/clients/${clientId}`);
};

// --- Fonction pour créer un nouveau client + la commande associée ---
export const createClientWithOrder = async (payload: CreateClientPayload): Promise<Client> => {
  return customFetch('/api/clients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

// --- Fonction pour modifier un client existant ---
type UpdateClientParams = {
  clientId: string;
  formData: Partial<ClientFormData>;
};

export const updateClient = async ({ clientId, formData }: UpdateClientParams): Promise<Client> => {
  return customFetch(`/api/clients/${clientId}`, {
    method: 'PATCH',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/merge-patch+json',
    },
  });
};

// --- Fonction pour supprimer un client ---
export const deleteClient = async (clientId: string): Promise<void> => {
  await customFetch(`/api/clients/${clientId}`, {
    method: 'DELETE',
  });
  return; 
};