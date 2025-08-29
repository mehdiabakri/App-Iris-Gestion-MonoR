import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import Layout from "./components/design/Layout";
import AllClients from "./pages/AllClients";
import ClientDetailPage from "./pages/ClientDetailPage";
import CreateClientPage from "./pages/CreateClientPage";
import EditClientPage from "./pages/EditClientPage";
import RetouchesPage from "./pages/RetouchesPage";
import AllCommandesPage from "./pages/AllCommandesPage";
import AllProduitsPage from "./pages/AllProduitsPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { Spinner } from "@chakra-ui/react/spinner";

const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Si on est en train de vérifier le token, on attend
  if (isLoading) {
    return <Spinner />; // Ou un écran de chargement
  }

  // Si on n'est pas authentifié, on redirige vers le login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si on est authentifié, on affiche la page demandée
  return <Outlet />;
};

export default function App() {
  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="clients/list" element={<AllClients />} />
          <Route path="clients/:clientId" element={<ClientDetailPage />} />
          <Route path="/clients/new" element={<CreateClientPage />} />
          <Route path="/clients/:clientId/edit" element={<EditClientPage />} />
          <Route path="/retouches" element={<RetouchesPage />} />
          <Route path="/commandes" element={<AllCommandesPage />} />
          <Route path="/produits" element={<AllProduitsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
