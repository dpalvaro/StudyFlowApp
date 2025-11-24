import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './features/auth/LoginPage.tsx'; // <--- IMPORT
import { AuthProvider, useAuth } from './context/AuthContext.tsx'; // <--- IMPORT
import './index.css';

// Componente de Protección
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* Envuelve todo con el proveedor */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);