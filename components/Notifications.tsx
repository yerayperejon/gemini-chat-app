import React from 'react';
import { InfoCircleIcon } from './Icons';

interface NotificationsProps {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const colorClasses = {
  info: 'bg-blue-100 border-blue-500 text-blue-700',
  success: 'bg-green-100 border-green-500 text-green-700',
  warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  error: 'bg-red-100 border-red-500 text-red-700',
};

const Notifications: React.FC<NotificationsProps> = ({ message, type }) => {
  return (
    <div className={`border-l-4 p-4 ${colorClasses[type]}`} role="alert">
      <div className="flex">
        <div className="py-1">
          <InfoCircleIcon className="w-6 h-6 mr-4" />
        </div>
        <div>
          <p className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
