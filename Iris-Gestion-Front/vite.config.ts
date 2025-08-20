import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    proxy: {
      // On intercepte toutes les requêtes qui commencent par '/api'
      '/api': {
        // On redirige vers votre serveur Symfony
        // Assurez-vous que l'adresse et le port sont les bons
        target: 'http://127.0.0.1:8000', 
        
        // Indispensable pour que le serveur Symfony accepte la requête
        changeOrigin: true,
        
        secure: false,      
      }
    }
  }
})