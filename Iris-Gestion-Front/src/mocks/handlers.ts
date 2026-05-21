/**
 * HANDLERS MSW - CONFIGURATION FINALE
 * Simule l'intégralité du backend Symfony / API Platform
 */
import { http, HttpResponse, delay } from 'msw';
import { fakeClients, fakeCommandes, fakeProduits, options, categories } from './dummyData';
import { 
  Commande, 
  DashboardStats,
  LoginFormInputs 
} from '../types/Types';

// --- Interface pour le PATCH (Modification de statut) ---
interface PatchOrderPayload {
  statut: string;
}

export const handlers = [

  // ==========================================
  // 1. AUTHENTIFICATION
  // ==========================================
  http.post('*/api/login', async ({ request }) => {
    await delay(500);
    // On type le retour de request.json()
    const body = (await request.json()) as LoginFormInputs;
    
    return HttpResponse.json({ 
        token: "fake_jwt_token", 
        user: { email: body.email, roles: ["ROLE_ADMIN"] } 
    });
  }),

  http.get('*/api/me', async () => {
    return HttpResponse.json({ 
        id: 999, 
        email: "demo@example.com", 
        prenom: "Admin", 
        nom: "Démo", 
        roles: ["ROLE_ADMIN"] 
    });
  }),

  // ==========================================
  // 2. STATISTIQUES (Dashboard)
  // ==========================================
  http.get('*/api/stats', async () => {
    const stats: DashboardStats = {
      totalClients: fakeClients.length,
      totalCommandes: fakeCommandes.length,
      inProgressCommandes: fakeCommandes.filter((c: Commande) => c.statut !== 'Terminé').length,
      commandesTableaux: 5,
      commandesCaisson: 2,
      commandesImpressions: 4,
      commandesFichiers: 3,
      commandesBlocs: 1,
      commandesRonds: 2,
      commandesBijoux: 0,
    };
    return HttpResponse.json(stats);
  }),

  http.get('*/api/stats/sales-by-month', async () => {
    return HttpResponse.json([
      { month: "Jan", total: 4000 }, { month: "Feb", total: 3000 }, { month: "Mar", total: 5000 }
    ]);
  }),

  // ==========================================
  // 3. CLIENTS
  // ==========================================
  http.get('*/api/clients', async () => {
    return HttpResponse.json({
      'hydra:member': fakeClients,
      'hydra:totalItems': fakeClients.length
    });
  }),

  http.get('*/api/clients/:id', async ({ params }) => {
    const client = fakeClients.find((c) => c.id === String(params.id));
    return client ? HttpResponse.json(client) : new HttpResponse(null, { status: 404 });
  }),

  // ==========================================
  // 4. COMMANDES & KANBAN
  // ==========================================
  http.get('*/api/commandes/kanban', async () => {
    return HttpResponse.json({
      'hydra:member': fakeCommandes,
      'hydra:totalItems': fakeCommandes.length
    });
  }),

  http.get('*/api/commandes*', async () => {
    return HttpResponse.json({
      'hydra:member': fakeCommandes,
      'hydra:totalItems': fakeCommandes.length
    });
  }),

  // PATCH pour le changement de statut (Kanban)
  http.patch('*/api/commandes/:id', async ({ params, request }) => {
    const payload = (await request.json()) as PatchOrderPayload;
    const cmdIndex = fakeCommandes.findIndex((c) => c.id === String(params.id));
    
    if (cmdIndex !== -1) {
      fakeCommandes[cmdIndex] = { ...fakeCommandes[cmdIndex], ...payload };
      return HttpResponse.json(fakeCommandes[cmdIndex], { status: 200 });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Actions métier (Tracking, Emails)
  http.post('*/api/commandes/*/send-*', async () => {
    await delay(1000);
    return HttpResponse.json({ message: "Succès démo" });
  }),

  // ==========================================
  // 5. CONFIGURATION
  // ==========================================
  http.get('*/api/produit_bases*', async () => {
    return HttpResponse.json({ 'hydra:member': fakeProduits });
  }),

  http.get('*/api/options*', async () => {
    return HttpResponse.json({ 'hydra:member': options });
  }),

  http.get('*/api/categories*', async () => {
    return HttpResponse.json({ 'hydra:member': categories });
  }),

  // ==========================================
  // 6. LE FILET DE SÉCURITÉ
  // ==========================================
  http.get('*/api/*', async ({ request }) => {
    console.warn("🛡️ MSW Catch-all :", request.url);
    return HttpResponse.json({}, { status: 200 });
  }),
];