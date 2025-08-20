import { createContext, useContext } from 'react';

// 1. On DÉFINIT le type du contexte ici
export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// 2. On CRÉE le contexte ici et on l'exporte pour le Provider
export const AuthContext = createContext<AuthContextType | undefined>(undefined);


// 3. On CRÉE et on exporte le hook pour les composants
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};