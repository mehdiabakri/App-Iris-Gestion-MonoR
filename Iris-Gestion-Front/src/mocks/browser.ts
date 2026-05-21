/**
 * Description : Configure le service worker pour MSW (Mock Service Worker) dans un environnement de développement.
 * Note : Ce fichier est utilisé pour initialiser le worker avec les handlers définis dans handlers.ts, permettant de simuler les réponses d'API pendant le développement ou environnement démo.
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// On crée l'instance du worker avec nos règles
export const worker = setupWorker(...handlers);