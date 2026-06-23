import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

interface HeaderProps {
  serviceName: string;
  navLinks: NavLink[];
  userName?: string;
  onLogout: () => void;
}

export function Header({ serviceName, navLinks, userName, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark'),
  );

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(href);
    setMenuOpen(false);
  };

  return (
    <header className="bg-brand-900 text-white sticky top-0 z-drawer border-b-[3px] border-transparent shrink-0"
      style={{
        backgroundImage: "linear-gradient(#002673,#002673), linear-gradient(to right,#0039A6 50%,#D52B1E 50%)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <div className="flex items-center h-16 px-xl">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
          className="flex items-center gap-s no-underline text-white flex-shrink-0">
          <div className="w-8 h-8 rounded-s overflow-hidden flex flex-col flex-shrink-0" aria-hidden="true">
            <div className="flex-1 bg-[#0039A6]" />
            <div className="flex-1 bg-[#D52B1E]" />
          </div>
          <span className="font-display font-bold text-[17px] tracking-tight">{serviceName}</span>
        </a>

        <nav className="hidden lg:flex items-center gap-xxs ml-auto">
          {navLinks.map(({ label, href, active }) => (
            <a key={href} href={href} onClick={handleNavClick(href)}
              className={`px-m py-xs rounded-s text-[13px] no-underline transition-colors ${active ? 'text-white font-medium bg-white/10' : 'text-white/75 hover:text-white hover:bg-white/10'}`}
              aria-current={active ? 'page' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-xs ml-m">
          <button onClick={toggleDark} aria-label={dark ? 'Modo claro' : 'Modo oscuro'}
            className="w-9 h-9 flex items-center justify-center rounded-s hover:bg-white/10 text-white/80 hover:text-white transition-colors">
            {dark ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
          </button>
          {userName && (
            <div className="flex items-center gap-xs pl-xs border-l border-white/20">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gob-primary to-accent flex items-center justify-center shrink-0">
                <span className="text-white text-[11px] font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-[12px] text-white/85 font-medium max-w-[140px] truncate">{userName}</span>
              <button onClick={onLogout}
                className="w-8 h-8 flex items-center justify-center rounded-s text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cerrar sesión" title="Cerrar sesión">
                <X size={15} strokeWidth={1.75} />
              </button>
            </div>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden ml-auto p-xs rounded-s hover:bg-white/10"
          aria-label="Menú" aria-expanded={menuOpen}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-white/20 bg-brand-900 animate-fade-in">
          <nav className="px-l py-m flex flex-col gap-xxs">
            {navLinks.map(({ label, href, active }) => (
              <a key={href} href={href} onClick={handleNavClick(href)}
                className={`px-s py-xs rounded-s text-sm no-underline ${active ? 'text-white font-medium bg-white/10' : 'text-white/80'}`}>
                {label}
              </a>
            ))}
            {userName && (
              <div className="flex items-center justify-between px-s py-xs mt-xs border-t border-white/15">
                <span className="text-[12px] text-white/85">{userName}</span>
                <button onClick={onLogout} className="text-white/70 text-sm">Cerrar sesión</button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
