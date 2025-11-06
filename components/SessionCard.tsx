import React, { useState, useEffect, useMemo } from 'react';
import { Session, User, Booking } from '../types';
import { ClockIcon, UsersIcon, PlusCircleIcon, MinusCircleIcon, TrashIcon, InfoCircleIcon } from './Icons';
import { getFocusTip } from '../services/geminiService';

interface SessionCardProps {
  session: Session;
  currentUser: User;
  userBookings: Booking[];
  bookingsForSession: Booking[];
  onBook: (sessionId: number, userId: number) => void;
  onCancel: (sessionId: number, userId: number) => void;
  getUserById: (userId: number) => User | undefined;
  users: User[]; // Full user list for admin modal
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  currentUser,
  userBookings,
  bookingsForSession,
  onBook,
  onCancel,
  getUserById,
  users
}) => {
  const [focusTip, setFocusTip] = useState<string>('');
  const [showBookedUsers, setShowBookedUsers] = useState(false);
  const [userToAdd, setUserToAdd] = useState('');

  const isBooked = useMemo(() => 
    userBookings.some(b => b.sessionId === session.id), 
    [userBookings, session.id]
  );

  const bookedCount = bookingsForSession.length;
  const isFull = bookedCount >= session.capacity;
  
  const canBookMore = useMemo(() => {
    if (currentUser.role === 'USER') {
      return userBookings.length < 2;
    }
    return true;
  }, [userBookings.length, currentUser.role]);
  
  const bookableUntil = useMemo(() => new Date(session.dateTime.getTime() - 48 * 60 * 60 * 1000), [session.dateTime]);
  const isTooEarlyToBook = new Date() < bookableUntil;

  useEffect(() => {
    if (isBooked) {
      getFocusTip(session.title).then(setFocusTip);
    } else {
      setFocusTip('');
    }
  }, [isBooked, session.title]);
  
  const handleBook = () => {
    onBook(session.id, currentUser.id);
  };
  
  const handleCancel = () => {
    onCancel(session.id, currentUser.id);
  };
  
  const handleAdminAddBooking = () => {
    if(userToAdd) {
        onBook(session.id, parseInt(userToAdd, 10));
        setUserToAdd('');
    }
  }

  const nonBookedUsers = users.filter(user => !bookingsForSession.some(b => b.userId === user.id) && user.role !== 'ADMIN');
  const isPastSession = session.dateTime < new Date();

  return (
    <div className={`bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between transition-all duration-300 ${isPastSession ? 'opacity-60 bg-gray-100' : ''} ${isBooked ? 'border-2 border-rose-900' : 'border-2 border-transparent'}`}>
      <div>
        <h3 className="text-xl font-bold text-gray-800">{session.title}</h3>
        <p className="text-sm text-gray-500 mb-2">con {session.instructor}</p>
        <div className="flex items-center text-gray-600 mb-2">
          <ClockIcon className="w-5 h-5 mr-2" />
          <span>{session.day}, {session.time}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <UsersIcon className="w-5 h-5 mr-2" />
          <span>{bookedCount} / {session.capacity}</span>
        </div>
        {focusTip && !isPastSession && (
          <div className="bg-rose-100 border-l-4 border-rose-500 text-rose-800 p-3 my-4 rounded-md flex items-start">
            <InfoCircleIcon className="w-5 h-5 mr-3 flex-shrink-0 mt-1" />
            <p className="text-sm">{focusTip}</p>
          </div>
        )}
      </div>

      <div className="mt-4">
        {currentUser.role === 'USER' && (
          <>
            {isBooked ? (
              <button
                onClick={handleCancel}
                disabled={isPastSession}
                className="w-full bg-rose-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-rose-800 disabled:bg-gray-400 transition-colors"
              >
                <MinusCircleIcon className="w-5 h-5 mr-2" />
                Liberar Plaza
              </button>
            ) : (
              <button
                onClick={handleBook}
                disabled={isPastSession || isFull || !canBookMore || isTooEarlyToBook}
                className="w-full bg-rose-900 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-rose-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Reservar Plaza
              </button>
            )}
            {!isBooked && isFull && <p className="text-sm text-center text-red-500 mt-2">Clase completa</p>}
            {!isBooked && !isFull && !canBookMore && <p className="text-sm text-center text-orange-500 mt-2">Límite semanal (2) alcanzado</p>}
            {!isBooked && !isFull && isTooEarlyToBook && <p className="text-sm text-center text-blue-500 mt-2">Disponible 48h antes</p>}
          </>
        )}
        {(currentUser.role === 'ADMIN' || currentUser.role === 'MONITOR') && (
          <>
             {isBooked ? (
              <button onClick={handleCancel} className="w-full bg-rose-700 text-white py-2 px-4 rounded flex items-center justify-center hover:bg-rose-800 transition-colors">
                <MinusCircleIcon className="w-5 h-5 mr-2" />
                Cancelar mi plaza
              </button>
            ) : (
              <button onClick={handleBook} disabled={isFull || isPastSession} className="w-full bg-rose-900 text-white py-2 px-4 rounded flex items-center justify-center hover:bg-rose-800 disabled:bg-gray-400 transition-colors">
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Reservar mi plaza
              </button>
            )}
            <button
              onClick={() => setShowBookedUsers(!showBookedUsers)}
              className="w-full mt-2 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
            >
              {showBookedUsers ? 'Ocultar' : 'Ver'} Inscritos ({bookedCount})
            </button>
            {showBookedUsers && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold mb-2">Inscritos:</h4>
                {bookingsForSession.length > 0 ? (
                  <ul className="space-y-2">
                    {bookingsForSession.map(booking => {
                      const user = getUserById(booking.userId);
                      return user ? (
                        <li key={user.id} className="text-sm flex justify-between items-center bg-gray-50 p-2 rounded text-gray-800">
                          <span>{user.alias} ({user.role})</span>
                           {currentUser.role === 'ADMIN' && user.id !== currentUser.id && (
                             <button onClick={() => onCancel(session.id, user.id)} className="text-red-500 hover:text-red-700" title={`Eliminar reserva de ${user.alias}`}>
                               <TrashIcon className="w-4 h-4" />
                             </button>
                           )}
                        </li>
                      ) : null
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Nadie inscrito todavía.</p>
                )}
                {currentUser.role === 'ADMIN' && !isFull && nonBookedUsers.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                      <h5 className="font-semibold text-sm mb-2">Añadir reserva:</h5>
                      <div className="flex gap-2">
                          <select value={userToAdd} onChange={(e) => setUserToAdd(e.target.value)} className="flex-grow block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm text-slate-900 bg-white">
                              <option value="">Seleccionar usuario...</option>
                              {nonBookedUsers.map(user => (
                                  <option key={user.id} value={user.id}>{user.alias}</option>
                              ))}
                          </select>
                          <button onClick={handleAdminAddBooking} disabled={!userToAdd} className="bg-rose-900 text-white px-3 py-1 rounded-md hover:bg-rose-800 disabled:bg-gray-400 transition-colors text-sm">Añadir</button>
                      </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SessionCard;