import { Client, ProduitBase, Categorie, Option, Commande } from "../types/Types";

/**
 * Ce fichier contient des données fictives pour les catégories, options, produits de base, clients et commandes.
 * Ces données sont utilisées pour le développement et les tests de l'application.
 */

// ===================================================================
// 1. CATÉGORIES
// ===================================================================
export const categories: Categorie[] = [
  { "@id": "/api/categories/1", id: 1, nom: "Tableaux" },
  { "@id": "/api/categories/2", id: 2, nom: "Caissons Lumineux" },
  { "@id": "/api/categories/3", id: 3, nom: "Fichiers Digitaux" },
  { "@id": "/api/categories/4", id: 4, nom: "Blocs" },
  { "@id": "/api/categories/5", id: 5, nom: "Impressions" },
  { "@id": "/api/categories/6", id: 6, nom: "Ronds" },
];

const catTableaux = categories[0];
const catCaissons = categories[1];
const catFichiers = categories[2];
const catBlocs = categories[3];
const catImpressions = categories[4];
const catRonds = categories[5];

// ===================================================================
// 2. OPTIONS (Finition, Taille, Extra)
// ===================================================================
export const options: Option[] = [
  // Finitions (1-2)
  { "@id": "/api/options/1", id: 1, nom: "Acrylique", type: "Finition" },
  { "@id": "/api/options/2", id: 2, nom: "Alu-Dibond", type: "Finition" },
  // Tailles (3-16)
  { "@id": "/api/options/3", id: 3, nom: "10x10", type: "Taille" },
  { "@id": "/api/options/4", id: 4, nom: "15x15", type: "Taille" },
  { "@id": "/api/options/5", id: 5, nom: "20x20", type: "Taille" },
  { "@id": "/api/options/6", id: 6, nom: "25x25", type: "Taille" },
  { "@id": "/api/options/7", id: 7, nom: "30x30", type: "Taille" },
  { "@id": "/api/options/8", id: 8, nom: "40x40", type: "Taille" },
  { "@id": "/api/options/9", id: 9, nom: "50x50", type: "Taille" },
  { "@id": "/api/options/10", id: 10, nom: "60x60", type: "Taille" },
  { "@id": "/api/options/11", id: 11, nom: "80x80", type: "Taille" },
  { "@id": "/api/options/12", id: 12, nom: "100x100", type: "Taille" },
  { "@id": "/api/options/13", id: 13, nom: "2 iris : 30x60", type: "Taille" },
  { "@id": "/api/options/14", id: 14, nom: "3 iris : 30x90", type: "Taille" },
  { "@id": "/api/options/15", id: 15, nom: "4 iris : 30x120", type: "Taille" },
  { "@id": "/api/options/16", id: 16, nom: "5 iris : 30x150", type: "Taille" },
  // Extras (17-22)
  { "@id": "/api/options/17", id: 17, nom: "Caisse américaine", type: "Extra" },
  { "@id": "/api/options/18", id: 18, nom: "Relief", type: "Extra" },
  { "@id": "/api/options/19", id: 19, nom: "Supp. Lumineux", type: "Extra" },
  { "@id": "/api/options/20", id: 20, nom: "Chassis rentrant", type: "Extra" },
  { "@id": "/api/options/21", id: 21, nom: "Cadre 20x20", type: "Extra" },
  { "@id": "/api/options/22", id: 22, nom: "Cadre 30x30", type: "Extra" },
];

const getOpt = (id: number): Option => options.find(o => o.id === id)!;

// ===================================================================
// 3. PRODUITS DE BASE
// ===================================================================
export const fakeProduits: ProduitBase[] = [
  {
    "@id": "/api/produit_bases/1",
    id: 1,
    nom: "Tableau Carré",
    categorie: catTableaux,
    optionsDisponibles: [getOpt(1), getOpt(2), getOpt(5), getOpt(7), getOpt(8), getOpt(9), getOpt(10), getOpt(11), getOpt(12), getOpt(17), getOpt(18), getOpt(20)]
  },
  {
    "@id": "/api/produit_bases/2",
    id: 2,
    nom: "Tableau Rectangulaire",
    categorie: catTableaux,
    optionsDisponibles: [getOpt(1), getOpt(2), getOpt(13), getOpt(14), getOpt(15), getOpt(16), getOpt(17), getOpt(18), getOpt(20)]
  },
  {
    "@id": "/api/produit_bases/3",
    id: 3,
    nom: "Bloc Acrylique",
    categorie: catBlocs,
    optionsDisponibles: [getOpt(3), getOpt(5), getOpt(19)]
  },
  {
    "@id": "/api/produit_bases/4",
    id: 4,
    nom: "Caisson Lumineux",
    categorie: catCaissons,
    optionsDisponibles: [getOpt(4), getOpt(6)]
  },
  {
    "@id": "/api/produit_bases/5",
    id: 5,
    nom: "Impression",
    categorie: catImpressions,
    optionsDisponibles: [getOpt(5), getOpt(7), getOpt(21), getOpt(22)]
  },
  {
    "@id": "/api/produit_bases/6",
    id: 6,
    nom: "Fichier HD",
    categorie: catFichiers,
    optionsDisponibles: []
  },
  {
    "@id": "/api/produit_bases/7",
    id: 7,
    nom: "Fichier BD",
    categorie: catFichiers,
    optionsDisponibles: []
  },
  {
    "@id": "/api/produit_bases/8",
    id: 8,
    nom: "Rond",
    categorie: catRonds,
    optionsDisponibles: [getOpt(1), getOpt(2), getOpt(3), getOpt(5), getOpt(7), getOpt(8), getOpt(9), getOpt(10), getOpt(11)]
  }
];

// ===================================================================
// 4. LOGIQUE CLIENTS ET COMMANDES
// ===================================================================

const mapToCommandeClient = (client: Client): Commande['client'] => {
  return {
    "@id": `/api/clients/${client.id}`,
    id: client.id,
    prenom: client.prenom || "",
    nom: client.nom || "",
    telephone: client.telephone || "",
    email: client.email || "",
    adresse: client.adresse || "",
    complementAdresse: client.complementAdresse || "",
    codePostal: client.codePostal || "",
    ville: client.ville || "",
    pays: client.pays || "",
    rgpdConsent: client.rgpdConsent || false,
  };
};

// 1. Initialisation des Clients (sans les commandes pour l'instant)
export const fakeClients: Client[] = [
  {
    id: "1", createdAt: "2024-01-10T08:00:00Z", prenom: "Thomas", nom: "Muller",
    email: "t.test-m2@gmail.com", telephone: "0612345678", adresse: "12 Rue de la République",
    complementAdresse: "Appartement 4B", codePostal: "75001", ville: "Paris", pays: "France",
    rgpdConsent: true, remarque: "Client VIP", commandes: []
  },
  {
    id: "2", createdAt: "2024-01-15T12:00:00Z", prenom: "Sarah", nom: "Lavoine",
    email: "t.test-m2.l@hotmail.fr", telephone: "0612345678", adresse: "45 Boulevard Haussmann",
    complementAdresse: "", codePostal: "75009", ville: "Paris", pays: "France",
    rgpdConsent: true, remarque: "Architecte d'intérieur", commandes: []
  },
  {
    id: "3", createdAt: "2024-02-01T09:00:00Z", prenom: "Kevin", nom: "Durant",
    email: "k.t.test-m2@yahoo.com", telephone: "0612345678", adresse: "8 Impasse des Lilas",
    complementAdresse: "Bâtiment C", codePostal: "69002", ville: "Lyon", pays: "France",
    rgpdConsent: true, remarque: "", commandes: []
  },
  {
    id: "4", createdAt: "2024-02-10T15:00:00Z", prenom: "Elena", nom: "Rossi",
    email: "t.test-m2.rossi@outlook.it", telephone: "0612345678", adresse: "22 Rue des Alpes",
    complementAdresse: "", codePostal: "74000", ville: "Annecy", pays: "France",
    rgpdConsent: true, remarque: "Parle italien", commandes: []
  },
  {
    id: "5", createdAt: "2024-02-20T10:00:00Z", prenom: "Marc", nom: "Lefebvre",
    email: "t.test-m2.lefebvre@orange.fr", telephone: "0612345678", adresse: "50 Avenue de la Mer",
    complementAdresse: "Résidence le Phare", codePostal: "13008", ville: "Marseille", pays: "France",
    rgpdConsent: true, remarque: "Demande souvent des news", commandes: []
  },
  {
    id: "6", createdAt: "2024-02-25T11:00:00Z", prenom: "Sophie", nom: "Morel",
    email: "t.test-m2.morel@gmail.com", telephone: "0612345678", adresse: "103 Rue du Faubourg",
    complementAdresse: "", codePostal: "33000", ville: "Bordeaux", pays: "France",
    rgpdConsent: true, remarque: "Nouveau client", commandes: []
  }
];

// 2. Initialisation des Commandes
export const fakeCommandes: Commande[] = [
  {
    id: "101", createdAt: "2024-03-01T10:00:00Z", statut: "A retoucher",
    nbIris: "2", nbIrisAnimaux: "0", photographe: "Manon", provenance: "Instagram",
    numPhoto: "IMG_8821", effet: ["Explosion"], couleur: ["Bleu"], livraison: "Livraison à domicile",
    rdv: "Oui", carteCadeau: "Non", codeCarteCadeau: "", remarque: "Retouche minutieuse",
    produitBase: fakeProduits[0], optionsChoisies: [getOpt(1)], 
    client: mapToCommandeClient(fakeClients[0])
  },
  {
    id: "102", createdAt: "2024-03-02T14:30:00Z", statut: "A imprimer",
    nbIris: "1", nbIrisAnimaux: "1", photographe: "Mehdi", provenance: "Tiktok",
    numPhoto: "IMG_9012", effet: ["Naturel"], couleur: ["Marron"], livraison: "Retrait en magasin",
    rdv: "Non", carteCadeau: "Oui", codeCarteCadeau: "KDO-55", remarque: "",
    produitBase: fakeProduits[2], optionsChoisies: [getOpt(3)], 
    client: mapToCommandeClient(fakeClients[1])
  },
  {
    id: "103", createdAt: "2024-03-03T09:15:00Z", statut: "A envoyer client",
    nbIris: "3", nbIrisAnimaux: "0", photographe: "Manon", provenance: "Internet",
    numPhoto: "IMG_7744", effet: ["Fusion"], couleur: ["Vert"], livraison: "Livraison à domicile",
    rdv: "Oui", carteCadeau: "Non", codeCarteCadeau: "", remarque: "",
    produitBase: fakeProduits[1], optionsChoisies: [getOpt(2)], 
    client: mapToCommandeClient(fakeClients[2])
  },
  {
    id: "104", createdAt: "2024-03-04T11:00:00Z", statut: "Terminé",
    nbIris: "1", nbIrisAnimaux: "0", photographe: "Mehdi", provenance: "Ami",
    numPhoto: "IMG_1234", effet: ["Planète"], couleur: ["Gris"], livraison: "Envoi mail",
    rdv: "Non", carteCadeau: "Non", codeCarteCadeau: "", remarque: "",
    produitBase: fakeProduits[5], optionsChoisies: [], 
    client: mapToCommandeClient(fakeClients[3])
  },
  {
    id: "105", createdAt: "2024-03-05T16:45:00Z", statut: "Attente retour client",
    nbIris: "2", nbIrisAnimaux: "2", photographe: "Manon", provenance: "Influenceur",
    numPhoto: "IMG_4567", effet: ["Duo"], couleur: ["Bleu"], livraison: "Retrait Boutique",
    rdv: "Oui", carteCadeau: "Non", codeCarteCadeau: "", remarque: "",
    produitBase: fakeProduits[7], optionsChoisies: [getOpt(1)], 
    client: mapToCommandeClient(fakeClients[4])
  },
  {
    id: "106", createdAt: "2024-03-06T10:20:00Z", statut: "A commander",
    nbIris: "1", nbIrisAnimaux: "0", photographe: "Mehdi", provenance: "Evènement",
    numPhoto: "IMG_6677", effet: ["Explosion"], couleur: ["Orange"], livraison: "Livraison à domicile",
    rdv: "Non", carteCadeau: "Oui", codeCarteCadeau: "GRO-99", remarque: "",
    produitBase: fakeProduits[4], optionsChoisies: [getOpt(5)], 
    client: mapToCommandeClient(fakeClients[5])
  }
];

// 3. Liaison finale des commandes aux clients (Correction de la référence circulaire)
fakeClients[0].commandes = [fakeCommandes[0]];
fakeClients[1].commandes = [fakeCommandes[1]];
fakeClients[2].commandes = [fakeCommandes[2]];
fakeClients[3].commandes = [fakeCommandes[3]];
fakeClients[4].commandes = [fakeCommandes[4]];
fakeClients[5].commandes = [fakeCommandes[5]];