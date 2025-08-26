export async function sendTrackingEmail(orderId: string) {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    throw new Error("Utilisateur non authentifié.");
  }

  // 2. Créer les en-têtes (headers) avec le token
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 3. Ajouter les en-têtes à la requête fetch
  const response = await fetch(`/api/commandes/${orderId}/send-tracking`, {
    method: 'POST',
    headers: headers
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
        throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
    }
    throw new Error(data.error || 'Une erreur est survenue.');
  }

  return data;
}