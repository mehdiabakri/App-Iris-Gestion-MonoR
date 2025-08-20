// ===================================================================
// TYPE POUR LE FORMULAIRE DE LOGIN
// ===================================================================
export type LoginFormInputs = {
  email: string;
  password: string;
};

// ===================================================================
// TYPES DES ENTITÉS
// ===================================================================

export type Categorie = {
  "@id": string;
  id: number;
  nom: string;
};

export type Option = {
  "@id": string;
  id: number;
  nom: string;
  type: string;
};

export type ProduitBase = {
  "@id": string;
  id: number;
  nom: string;
  categorie: Categorie;
  optionsDisponibles: Option[];
};

export type CommandeClientInfo = {
  "@id": string;
  "@type": string;
  id: string;
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  complementAdresse?: string;
  codePostal?: string;
  ville?: string;
  pays?: string;
  statut?: string;
};

export type Commande = {
  id: string;
  createdAt: string;
  statut?: string;
  nbIris?: string;
  nbIrisAnimaux?: string;
  photographe?: string;
  provenance?: string;
  numPhoto?: string;
  effet?: string[];
  couleur?: string[];
  livraison?: string;
  rdv?: string;
  carteCadeau?: string;
  codeCarteCadeau?: string;
  remarque?: string;
  lienSuiviColis?: string;
  produitBase: ProduitBase;
  optionsChoisies: Option[];
  client: {
    "@id": string;
    id: string;
    prenom: string;
    nom: string;
    telephone: string;
    email: string;
    adresse: string;
    complementAdresse: string;
    codePostal: string;
    ville: string;
    pays: string;
  };
};

export type Client = {
  id: string;
  createdAt: string;
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  complementAdresse?: string;
  codePostal?: string;
  ville?: string;
  pays?: string;
  remarque?: string;
  commandes: Commande[];
};

// ===================================================================
// TYPES POUR LES FORMULAIRES
// ===================================================================

// --- Type pour le formulaire de CRÉATION de Client + Commande ---
export type ClientFormData = {
  // Champs du client
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  complementAdresse?: string;
  codePostal?: string;
  ville?: string;
  pays?: string;

  // Champs de la commande
  commande: {
    statut?: string;
    nbIris?: string;
    nbIrisAnimaux?: string;
    photographe?: string;
    provenance?: string;
    numPhoto?: string;
    effet?: string;
    couleur?: string;
    livraison?: string;
    rdv?: string;
    carteCadeau?: string;
    codeCarteCadeau?: string;
    remarque?: string;
    lienSuiviColis?: string;
    support?: string;
    taille?: string;
    finition?: string;
    prix?: string;
    
    categorie?: string;
    produitBase?: string;
    [key: `options_${string}`]: string | boolean | string[] | undefined;
  };
};

    // --- Type pour le payload de CRÉATION de Client ---
    export type CreateClientPayload = {
      prenom?: string;
      nom?: string;
      email?: string;
      telephone?: string;
      adresse?: string;
      complementAdresse?: string;
      codePostal?: string;
      ville?: string;
      pays?: string;
      commandes: Array<{
        statut?: string;
        nbIris?: string;
        nbIrisAnimaux?: string;
        photographe?: string;
        provenance?: string;
        numPhoto?: string;
        effet?: string;
        couleur?: string;
        livraison?: string;
        rdv?: string;
        carteCadeau?: string;
        codeCarteCadeau?: string;
        remarque?: string;
        produitBase?: string;
        optionsChoisies: string[];
      }>;
    };

// --- Type pour le formulaire de MODIFICATION de Commande ---
export type EditCommandFormData = {
  statut?: string;
  nbIris?: string;
  nbIrisAnimaux?: string;
  photographe?: string;
  provenance?: string;
  numPhoto?: string;
  effet?: string[];
  couleur?: string[];
  livraison?: string;
  rdv?: string;
  carteCadeau?: string;
  codeCarteCadeau?: string;
  remarque?: string;
  support?: string;
  taille?: string;
  finition?: string;
  prix?: string;
  lienSuiviColis?: string;
  commande?: {
    categorie?: string;
    produitBase?: string;
    [key: `options_${string}`]: string | boolean | string[] | undefined;
  };
};

export type FormProduit = {
  id?: number;
  produitId: string;
  quantite: number;
  produitBase?: string;
};

// ===================================================================
// TYPES POUR LES STATS
// ===================================================================

export type DashboardStats = {
  totalClients: number;
  totalCommandes: number;
  inProgressCommandes: number;
  commandesTableaux: number;
  commandesCaisson: number;
  commandesImpressions: number;
  commandesFichiers: number;
  commandesBlocs: number;
};