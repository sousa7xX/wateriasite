import React from 'react';
import { Droplets, Code2, Save, LogIn, LogOut, Home } from 'lucide-react';
import { AppView, User } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, user, onLogout }) => {
  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => setView(view)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        currentView === view
          ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView(AppView.HOME)}
          >
            <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300">
              <Droplets className="text-white h-6 w-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
              Water IA
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <NavItem view={AppView.HOME} icon={Home} label="Início" />
            <NavItem view={AppView.GENERATOR} icon={Code2} label="Gerador" />
            {user && <NavItem view={AppView.LIBRARY} icon={Save} label="Biblioteca" />}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400 hidden sm:block">
                  Olá, <span className="text-cyan-400">{user.username}</span>
                </span>
                <button
                  onClick={onLogout}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setView(AppView.LOGIN)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition-all text-sm font-medium"
              >
                <LogIn size={16} />
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};