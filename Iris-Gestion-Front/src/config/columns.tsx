/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@chakra-ui/react";
import type { Client, Commande } from "../types/Types";

// 1. On rend le type ColumnDefinition générique
export type ColumnDefinition<T> = {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
};

// ===================================================================
// CONFIGURATIONS POUR LES CLIENTS
// ===================================================================

// La vue détaillée pour la page de tous les clients
export const clientColumns: ColumnDefinition<Client>[] = [
  { key: "prenom", label: "Prénom", render: (client) => client.prenom || "-" },
  { key: "nom", label: "Nom", render: (client) => client.nom || "-" },
  { key: "email", label: "Email", render: (client) => client.email || "-" },
  {
    key: "telephone",
    label: "telephone",
    render: (client) => client.telephone || "-",
  },
];

// ===================================================================
// CONFIGURATIONS POUR LES COMANDES
// ===================================================================

export const retouchesColumns: ColumnDefinition<Commande>[] = [
  { key: "numPhoto", label: "N° Photo", render: (cmd) => cmd.numPhoto },
  {
    key: "client",
    label: "Client",
    render: (cmd) =>
      `${cmd.client?.prenom} ${cmd.client?.nom} ${
        cmd.client?.email ? `(${cmd.client.email})` : ""
      }`,
  },
  {
    key: "photographe",
    label: "Photographe",
    render: (cmd) => cmd.photographe,
  },
  { key: "statut", label: "Statut", render: (cmd) => cmd.photographe },
  {
    key: "createdAt",
    label: "Date Commande",
    render: (cmd) => new Date(cmd.createdAt).toLocaleDateString("fr-FR"),
  },
  {
    key: "actions",
    label: "Actions",
    render: (_cmd) => <Button size="xs">Voir</Button>,
  },
];

export const allOrderColumns: ColumnDefinition<Commande>[] = [
  {
    key: "clientName",
    label: "Client",
    render: (cmd) => `${cmd.client?.prenom} ${cmd.client?.nom}`,
  },
  {
    key: "clientAddress",
    label: "Adresse",
    render: (cmd) =>
      `${cmd.client?.adresse} ${cmd.client?.complementAdresse} - ${cmd.client?.codePostal} ${cmd.client?.ville} - ${cmd.client?.pays || ""}`,
  },
  {
    key: "clientMail",
    label: "Mail",
    render: (cmd) => `${cmd.client?.email}`,
  },
  {
    key: "clientPhone",
    label: "Téléphone",
    render: (cmd) => `${cmd.client?.telephone}`,
  },
  { key: "statut", label: "Statut", render: (cmd) => cmd.statut },
  {
    key: "createdAt",
    label: "Date Commande",
    render: (cmd) => new Date(cmd.createdAt).toLocaleDateString("fr-FR"),
  },
  {
    key: "actions",
    label: "Actions",
    render: (_cmd) => <Button size="xs">Voir</Button>,
  },
];

// ===================================================================
// CONFIGURATIONS POUR LES PRODUITS
// ===================================================================
