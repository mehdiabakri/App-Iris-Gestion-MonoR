# --- Etape 1: Builder le front-end React ---
FROM node:18 as build-stage

WORKDIR /app
COPY Iris-Gestion-Front/package*.json ./
RUN npm install
COPY Iris-Gestion-Front/ .
# La commande magique qui compile votre application React en fichiers statiques
RUN npm run build

# --- Etape 2: Configurer le serveur Nginx ---
FROM nginx:stable-alpine

# Copier les fichiers buildés de React de l'étape précédente vers le dossier que Nginx sert par défaut
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copier notre fichier de configuration personnalisé pour Nginx
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80 pour le trafic web
EXPOSE 80

# La commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]