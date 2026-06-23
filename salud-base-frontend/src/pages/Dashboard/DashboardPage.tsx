import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Map as MapIcon,
  ScrollText,
  Activity,
  UserCheck,
  Bell,
  ArrowUpRight,
} from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  accent: string;
}

const actions: QuickAction[] = [
  {
    title: 'Prestadores',
    description: 'Gestión de centros y prestadores de salud',
    icon: <Building2 size={20} strokeWidth={1.5} />,
    href: '/prestadores',
    accent: 'text-gob-primary',
  },
  {
    title: 'Usuarios',
    description: 'Administración de cuentas y accesos',
    icon: <Users size={20} strokeWidth={1.5} />,
    href: '/usuarios',
    accent: 'text-gob-success',
  },
  {
    title: 'Geografía',
    description: 'Regiones, provincias y comunas',
    icon: <MapIcon size={20} strokeWidth={1.5} />,
    href: '/regiones',
    accent: 'text-gob-info',
  },
  {
    title: 'Auditoría',
    description: 'Registros de accesos y cambios',
    icon: <ScrollText size={20} strokeWidth={1.5} />,
    href: '/auditoria',
    accent: 'text-gob-warning',
  },
];

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-xl animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink-800 tracking-tight">
          Panel de Control
        </h1>
        <p className="text-ink-500 mt-xxs text-[14px]">
          Sistema de gestión de salud de JUNAEB
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-m">
        {actions.map((action, i) => (
          <button
            key={action.title}
            onClick={() => navigate(action.href)}
            className={`group text-left bg-surface rounded-l border border-ink-200 p-l hover:border-ink-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200 animate-stagger-${i + 1}`}
          >
            <div className="flex items-start justify-between mb-s">
              <div className={`${action.accent}`}>
                {action.icon}
              </div>
              <ArrowUpRight
                size={16}
                className="text-ink-300 group-hover:text-ink-600 group-hover:translate-x-xxs group-hover:-translate-y-xxs transition-all duration-200"
                strokeWidth={1.75}
              />
            </div>
            <h3 className="font-display text-[16px] font-semibold text-ink-800 mb-xxs">
              {action.title}
            </h3>
            <p className="text-[12px] text-ink-500 leading-relaxed">
              {action.description}
            </p>
          </button>
        ))}
      </div>

      <div className="bg-surface rounded-l border border-ink-200 overflow-hidden">
        <div className="px-l py-m border-b border-ink-200">
          <div className="flex items-center gap-xs">
            <Activity size={16} className="text-gob-primary" strokeWidth={1.75} />
            <h2 className="font-display text-[16px] font-semibold text-ink-800">
              Estado del Sistema
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink-200">
          <div className="p-l flex items-center gap-m">
            <div className="w-10 h-10 rounded-l bg-gob-success-bg flex items-center justify-center shrink-0">
              <Activity size={18} className="text-gob-success" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-ink-800">Operacional</p>
              <p className="text-[12px] text-ink-500">Sistema activo</p>
            </div>
          </div>
          <div className="p-l flex items-center gap-m">
            <div className="w-10 h-10 rounded-l bg-gob-info-bg flex items-center justify-center shrink-0">
              <UserCheck size={18} className="text-gob-info" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-ink-800">1 Usuario</p>
              <p className="text-[12px] text-ink-500">Conectado</p>
            </div>
          </div>
          <div className="p-l flex items-center gap-m">
            <div className="w-10 h-10 rounded-l bg-gob-warning-bg flex items-center justify-center shrink-0">
              <Bell size={18} className="text-gob-warning" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-ink-800">0 Alertas</p>
              <p className="text-[12px] text-ink-500">Sin notificaciones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
