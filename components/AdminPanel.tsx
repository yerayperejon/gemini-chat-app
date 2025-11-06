import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ShieldCheckIcon, TrashIcon } from './Icons';

interface AdminPanelProps {
  users: User[];
  updateUserRole: (userId: number, role: UserRole) => void;
  addMonitor: (username: string, password: string) => boolean;
  currentUser: User;
  removeUser: (userId: number) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, updateUserRole, addMonitor, currentUser, removeUser }) => {
    const [newMonitorUsername, setNewMonitorUsername] = useState('');
    const [newMonitorPassword, setNewMonitorPassword] = useState('');

    const handleAddMonitor = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMonitorUsername && newMonitorPassword) {
            const success = addMonitor(newMonitorUsername, newMonitorPassword);
            if (success) {
                setNewMonitorUsername('');
                setNewMonitorPassword('');
            }
        }
    }

    const handleDeleteUser = (user: User) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar a ${user.alias}? Esta acción no se puede deshacer.`)) {
            removeUser(user.id);
        }
    }

    return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex items-center mb-6">
        <ShieldCheckIcon className="w-8 h-8 mr-3 text-rose-900" />
        <h2 className="text-3xl font-bold text-gray-800">Panel de Administración</h2>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Añadir Nuevo Monitor</h3>
        <form onSubmit={handleAddMonitor} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
                <input
                    type="text"
                    value={newMonitorUsername}
                    onChange={(e) => setNewMonitorUsername(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm text-slate-900 bg-white"
                    required
                />
            </div>
             <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                    type="password"
                    value={newMonitorPassword}
                    onChange={(e) => setNewMonitorPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm text-slate-900 bg-white"
                    required
                />
            </div>
            <div className="md:col-span-1">
                <button type="submit" className="w-full bg-rose-900 text-white py-2 px-4 rounded-md hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors">
                    Añadir
                </button>
            </div>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h3 className="text-xl font-semibold p-6 text-gray-700">Gestionar Usuarios</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alias</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.filter(u => u.id !== currentUser.id).map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.alias}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name} {user.surname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm text-slate-900 bg-white"
                        disabled={user.role === 'ADMIN'}
                    >
                        <option value="USER">Usuario</option>
                        <option value="MONITOR">Monitor</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteUser(user)}
                        disabled={user.role === 'ADMIN'}
                        className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        title="Eliminar usuario"
                      >
                          <TrashIcon className="w-5 h-5" />
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;