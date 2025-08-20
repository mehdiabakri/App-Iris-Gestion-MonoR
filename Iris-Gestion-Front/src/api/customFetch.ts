interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const customFetch = async (url: string, options: FetchOptions = {}) => {
  const token = localStorage.getItem("jwt_token");

  // On part des headers existants ou d'un objet vide
  const headers = { ...options.headers };

  // On s'assure que Content-Type est bien défini pour les requêtes avec un body
  if (options.body) {
    headers["Content-Type"] = "application/ld+json";
  }

  // On ajoute le token s'il existe
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // On appelle le vrai fetch
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error(
        "[customFetch] Erreur 401 - Token invalide ou expiré. Déconnexion."
      );
      localStorage.removeItem("jwt_token");
      window.location.replace("/login");
    }
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(
      errorData.detail || errorData.message || "Une erreur est survenue"
    );
  }

  try {
    return await response.json();
  } catch (error) {
    console.error("Erreur de parsing JSON pour l'URL :", url, error);
    return null; // Retourne null si le corps est vide ou non-JSON
  }
};
