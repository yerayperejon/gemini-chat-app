import React, { useState } from 'react';
import { UserRole, LoginData } from '../types';
import Logo from './Logo';
import { InfoCircleIcon } from './Icons';

interface UserLoginProps {
  onLogin: (data: LoginData) => void;
  error: string | null;
}

const UserLogin: React.FC<UserLoginProps> = ({ onLogin, error }) => {
  const [formData, setFormData] = useState<LoginData>({
      role: 'USER',
      name: '',
      surname: '',
      alias: '',
      username: '',
      password: ''
  });

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData({ ...formData, role: e.target.value as UserRole });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData({ ...formData, [id]: value });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
            <Logo />
            <h1 className="text-2xl font-bold text-center text-rose-900 mt-4">Bienvenido a C.D. ESPARTALES</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Iniciar sesión como
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={handleRoleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              <option value="USER">Usuario</option>
              <option value="MONITOR">Monitor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          {formData.role === 'USER' ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombre</label>
                <input type="text" id="name" value={formData.name} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">Apellidos</label>
                <input type="text" id="surname" value={formData.surname} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="alias">Alias</label>
                <input type="text" id="alias" value={formData.alias} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white" />
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Usuario</label>
                <input type="text" id="username" value={formData.username} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white" />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Contraseña</label>
                <input type="password" id="password" value={formData.password} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white" />
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-rose-900 hover:bg-rose-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors">
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;