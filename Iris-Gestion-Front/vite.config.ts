import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    host: true, 
    
    port: 5173,
    
    hmr: {
      clientPort: 5173,
    },
    
    // 4. On aide Vite à détecter les changements de fichiers dans Docker.
    watch: {
      usePolling: true,
    },
  }
})