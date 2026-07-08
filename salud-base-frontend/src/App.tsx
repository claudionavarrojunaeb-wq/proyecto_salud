import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DarkModeProvider, SnackbarProvider } from 'junaeb-ds-kit';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { AppLayout } from './components/Layout/AppLayout';
import { LoginPage } from './pages/Login/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { UsuariosPage } from './pages/Usuarios/UsuariosPage';
import { RolesPage } from './pages/Roles/RolesPage';
import { PermisosPage } from './pages/Permisos/PermisosPage';
import { RegionesPage } from './pages/Regiones/RegionesPage';
import { ProvinciasPage } from './pages/Provincias/ProvinciasPage';
import { ComunasPage } from './pages/Comunas/ComunasPage';
import { PrestadoresPage } from './pages/Prestadores/PrestadoresPage';
import { NotificacionesPage } from './pages/Notificaciones/NotificacionesPage';
import { AuditoriaPage } from './pages/Auditoria/AuditoriaPage';

export default function App() {
  return (
    <DarkModeProvider>
      <SnackbarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/roles" element={<RolesPage />} />
              <Route path="/permisos" element={<PermisosPage />} />
              <Route path="/regiones" element={<RegionesPage />} />
              <Route path="/provincias" element={<ProvinciasPage />} />
              <Route path="/comunas" element={<ComunasPage />} />
              <Route path="/prestadores" element={<PrestadoresPage />} />
              <Route path="/notificaciones" element={<NotificacionesPage />} />
              <Route path="/auditoria" element={<AuditoriaPage />} />
            </Route>
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </DarkModeProvider>
  );
}
