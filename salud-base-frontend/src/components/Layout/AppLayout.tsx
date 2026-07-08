import { useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'junaeb-ds-kit';
import { ChevronRight } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../../stores/auth-store';
import { authService } from '../../services/auth.service';

const labelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  usuarios: 'Usuarios',
  roles: 'Roles',
  permisos: 'Permisos',
  regiones: 'Regiones',
  provincias: 'Provincias',
  comunas: 'Comunas',
  prestadores: 'Prestadores',
  notificaciones: 'Notificaciones',
  auditoria: 'Auditoría',
};

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return [{ label: 'Inicio' }];
  const crumbs: { label: string; href?: string }[] = [{ label: 'Inicio', href: '/dashboard' }];
  let path = '';
  segments.forEach((seg, i) => {
    path += `/${seg}`;
    const isLast = i === segments.length - 1;
    crumbs.push({
      label: labelMap[seg] ?? seg,
      href: isLast ? undefined : path,
    });
  });
  return crumbs;
}

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { show } = useSnackbar();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        // ignore
      }
    }
    logout();
    show('Sesión cerrada', { type: 'info' });
    navigate('/login');
  };

  const userName = user ? `${user.nombres} ${user.primer_apellido}` : 'Usuario';
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <div className="h-screen flex flex-col bg-ink-50 overflow-hidden">
      <Header
        serviceName="Salud JUNAEB"
        navLinks={[
          { label: 'Dashboard', href: '/dashboard', active: location.pathname === '/dashboard' },
          { label: 'Usuarios', href: '/usuarios', active: location.pathname.startsWith('/usuarios') || location.pathname.startsWith('/roles') || location.pathname.startsWith('/permisos') },
          { label: 'Geografía', href: '/regiones', active: location.pathname.startsWith('/regiones') || location.pathname.startsWith('/provincias') || location.pathname.startsWith('/comunas') },
          { label: 'Prestadores', href: '/prestadores', active: location.pathname.startsWith('/prestadores') },
        ]}
        userName={userName}
        onLogout={handleLogout}
      />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          userName={userName}
          onLogout={handleLogout}
        />
        <main className="flex-1 min-w-0 flex flex-col min-h-0">
          <div className="shrink-0 bg-surface/90 backdrop-blur-md border-b border-ink-200">
            <div className="px-xl py-s">
              <nav className="flex items-center gap-xxs text-[12px]">
                {breadcrumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-xxs">
                    {i > 0 && (
                      <ChevronRight size={12} className="text-ink-300" strokeWidth={1.75} />
                    )}
                    {crumb.href ? (
                      <Link
                        to={crumb.href}
                        className="text-ink-500 hover:text-gob-primary transition-colors font-medium"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-ink-800 font-semibold">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin px-xl py-l">
            <Outlet />
          </div>

          <footer className="shrink-0 border-t border-ink-200 bg-surface">
            <div className="px-xl py-m">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-m">
                <div className="flex items-center gap-m">
                  <div className="w-8 h-8 rounded-m bg-gob-primary flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-[13px] font-display">S</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-ink-700 font-display">
                      Salud JUNAEB
                    </p>
                    <p className="text-[11px] text-ink-500">
                      Sistema de Gestión de Salud · Junta Nacional de Auxilio Escolar y Becas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-l text-[11px] text-ink-500">
                  <span>© 2026 JUNAEB</span>
                  <span className="w-px h-3 bg-ink-200" />
                  <span>Gobierno de Chile</span>
                </div>
              </div>
              <div className="mt-s flex gap-xxs">
                <span className="h-[2px] flex-1 bg-gob-primary rounded-full" />
                <span className="h-[2px] flex-1 bg-white border border-ink-200 rounded-full" />
                <span className="h-[2px] flex-1 bg-gob-error rounded-full" />
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
