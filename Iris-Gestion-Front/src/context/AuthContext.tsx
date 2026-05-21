import React, { useState, ReactNode, useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("jwt_token"),
  );
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error("Identifiants incorrects");
      return response.json();
    },
    onSuccess: (data) => {
      const { token } = data;
      localStorage.setItem("jwt_token", token);
      setToken(token);

      // Si on est en démo, on force un reload vers la home
      if (localStorage.getItem("isDemoMode") === "true") {
        window.location.href = "/";
      } else {
        navigate("/");
      }
    },
  });

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      return await loginMutation.mutateAsync(credentials);
    },
    [loginMutation],
  );

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("jwt_token");
    navigate("/login");
  }, [navigate]);

  const contextValue = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      login,
      logout,
      isLoading: loginMutation.isPending,
    }),
    [token, login, logout, loginMutation.isPending],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
