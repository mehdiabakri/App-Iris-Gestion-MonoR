import { useQuery } from "@tanstack/react-query";
import { customFetch } from "../api/customFetch";
import { fetchProduitsBase } from "../api/produitsBase";

export const useProduitsBase = () => {
  return useQuery({
    queryKey: ["produitsBase"], // Une clé unique pour ces données
    queryFn: fetchProduitsBase,
    staleTime: 1000 * 60 * 5,
  });
};
