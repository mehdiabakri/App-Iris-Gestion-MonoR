export const downloadFromApi = (apiUrl: string, filename: string) => {
  const token = localStorage.getItem('jwt_token');
  
  // On utilise fetch pour récupérer le fichier
  fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur réseau lors du téléchargement');
    }
    return response.blob(); // blob = Binary Large Object, la représentation brute du fichier
  })
  .then(blob => {
    // On crée une URL temporaire pour ce blob
    const url = window.URL.createObjectURL(blob);
    
    // On crée un lien invisible
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename; // Le nom du fichier proposé à l'utilisateur
    
    // On l'ajoute au corps de la page
    document.body.appendChild(a);
    // On simule un clic dessus
    a.click();
    
    // On nettoie l'URL et supp le lien
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  })
  .catch(error => console.error('Erreur lors du téléchargement:', error));
};