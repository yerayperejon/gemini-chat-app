import React from 'react';
import { User } from '../types';
import { LogoutIcon, UserIcon, ShieldCheckIcon, BellIcon } from './Icons';
import Logo from './Logo';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  if (!currentUser) return null;

  const getRoleIcon = () => {
    switch (currentUser.role) {
      case 'ADMIN':
        return <ShieldCheckIcon className="w-5 h-5 mr-2 text-rose-900" />;
      case 'MONITOR':
        return <BellIcon className="w-5 h-5 mr-2 text-rose-900" />;
      default:
        return <UserIcon className="w-5 h-5 mr-2 text-rose-900" />;
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xl font-bold text-rose-900 hidden sm:inline">C.D. ESPARTALES</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            {getRoleIcon()}
            <span className="text-gray-700 font-medium">{currentUser.alias}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center text-gray-600 hover:text-rose-900 transition-colors"
            title="Cerrar sesión"
          >
            <LogoutIcon className="w-6 h-6 mr-1" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;