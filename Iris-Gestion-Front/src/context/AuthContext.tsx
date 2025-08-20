import React, { useState, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// 1. On IMPORTE le contexte depuis le hook. On inverse la dépendance.
import { AuthContext } from "../hooks/useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

// Ce fichier n'exporte QUE le composant.
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("jwt_token")
  );
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Identifiants incorrects");
      }
      return response.json();
    },
    onSuccess: (data) => {
      const { token } = data;
      setToken(token);
      localStorage.setItem("jwt_token", token);
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      throw new Error("Identifiants incorrects ou erreur de connexion.");
    },
  });

  const login = async (credentials: { email: string; password: string }) => {
    await loginMutation.mutateAsync(credentials);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("jwt_token");
    navigate("/login");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, login, logout, isLoading: false }}
    >
      {children}
    </AuthContext.Provider>
  );
};
