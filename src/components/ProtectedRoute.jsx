import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingPage from '../pages/Search/LoadingPage';

export function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    // Verificación rápida contra un endpoint ligero de autenticación o perfil
    fetch(`${apiUrl}/auth/status`, { credentials: 'include' })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, [apiUrl]);

  if (isAuthenticated === null) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
