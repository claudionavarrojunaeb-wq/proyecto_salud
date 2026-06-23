import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  KeyRound,
  MapPin,
  Map,
  Pin,
  Building2,
  Bell,
  ScrollText,
  ChevronLeft,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: 'Principal',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} strokeWidth={1.75} /> },
    ],
  },
  {
    title: 'Administración',
    items: [
      { label: 'Usuarios', href: '/usuarios', icon: <Users size={18} strokeWidth={1.75} /> },
      { label: 'Roles', href: '/roles', icon: <ShieldCheck size={18} strokeWidth={1.75} /> },
      { label: 'Permisos', href: '/permisos', icon: <KeyRound size={18} strokeWidth={1.75} /> },
    ],
  },
  {
    title: 'Gestión Territorial',
    items: [
      { label: 'Regiones', href: '/regiones', icon: <Map size={18} strokeWidth={1.75} /> },
      { label: 'Provincias', href: '/provincias', icon: <MapPin size={18} strokeWidth={1.75} /> },
      { label: 'Comunas', href: '/comunas', icon: <Pin size={18} strokeWidth={1.75} /> },
    ],
  },
  {
    title: 'Salud',
    items: [
      { label: 'Prestadores', href: '/prestadores', icon: <Building2 size={18} strokeWidth={1.75} /> },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { label: 'Notificaciones', href: '/notificaciones', icon: <Bell size={18} strokeWidth={1.75} /> },
      { label: 'Auditoría', href: '/auditoria', icon: <ScrollText size={18} strokeWidth={1.75} /> },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  userName: string;
  onLogout: () => void;
}

export function Sidebar({ collapsed, onToggle, userName, onLogout }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-[68px]' : 'w-[256px]'
      } shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-sidebar border-r border-ink-200 flex flex-col h-full`}
    >
      <div className="h-14 flex items-center justify-between px-l border-b border-ink-200 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-xs animate-fade-in">
            <div className="w-7 h-7 rounded-m bg-gob-primary flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs font-display">S</span>
            </div>
            <div className="leading-tight">
              <p className="text-[13px] font-semibold text-ink-800 font-display">Salud JUNAEB</p>
              <p className="text-[10px] text-ink-500 tracking-wide uppercase">Panel Admin</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-m bg-gob-primary flex items-center justify-center mx-auto animate-fade-in">
            <span className="text-white font-bold text-xs font-display">S</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-s">
        {sections.map((section) => (
          <div key={section.title} className="mb-s">
            {!collapsed && (
              <p className="px-l pt-xs pb-xxs text-[10px] font-semibold text-ink-400 uppercase tracking-[0.12em]">
                {section.title}
              </p>
            )}
            {collapsed && (
              <div className="mx-m my-xs border-t border-ink-200" />
            )}
            <div className="px-xs">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const isHovered = hovered === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    onMouseEnter={() => setHovered(item.href)}
                    onMouseLeave={() => setHovered(null)}
                    className={`group relative w-full flex items-center gap-s rounded-m transition-all duration-150 ${
                      collapsed ? 'justify-center px-0 py-s' : 'px-s py-[7px]'
                    } ${
                      active
                        ? 'bg-sidebar-active text-gob-primary'
                        : isHovered
                        ? 'bg-sidebar-hover text-ink-700'
                        : 'text-ink-600'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gob-primary" />
                    )}
                    <span className={`shrink-0 transition-transform duration-150 ${isHovered && !active ? 'scale-110' : ''} ${active ? 'text-gob-primary' : 'text-ink-500 group-hover:text-ink-700'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className={`text-[13px] font-medium truncate ${active ? 'font-semibold' : ''}`}>
                        {item.label}
                      </span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="ml-auto text-[10px] font-semibold bg-gob-primary text-white rounded-full px-[6px] py-[1px]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-ink-200 p-xs shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-s px-s py-xs">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gob-primary to-accent flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-ink-700 truncate">{userName}</p>
              <p className="text-[10px] text-ink-500">JUNAEB</p>
            </div>
            <button
              onClick={onLogout}
              className="p-[6px] rounded-m text-ink-500 hover:text-gob-error hover:bg-gob-error-bg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={15} strokeWidth={1.75} />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="w-full flex justify-center p-s text-ink-500 hover:text-gob-error hover:bg-gob-error-bg rounded-m transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={16} strokeWidth={1.75} />
          </button>
        )}
        <button
          onClick={onToggle}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-end'} gap-xxs px-s pt-xs text-ink-400 hover:text-ink-600 transition-colors text-[11px]`}
        >
          <ChevronLeft
            size={14}
            strokeWidth={1.75}
            className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          />
          {!collapsed && <span>Contraer</span>}
        </button>
      </div>
    </aside>
  );
}
