import React from 'react';
import { Session, User, Booking } from '../types';
import SessionCard from './SessionCard';
import { CalendarIcon } from './Icons';

interface CalendarViewProps {
  sessions: Session[];
  currentUser: User;
  userBookings: Booking[];
  addBooking: (sessionId: number, userId: number) => void;
  removeBooking: (sessionId: number, userId: number) => void;
  getBookingsForSession: (sessionId: number) => Booking[];
  getUserById: (userId: number) => User | undefined;
  users: User[]; // Pass full user list
}

const CalendarView: React.FC<CalendarViewProps> = ({
  sessions,
  currentUser,
  userBookings,
  addBooking,
  removeBooking,
  getBookingsForSession,
  getUserById,
  users,
}) => {
  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const sessionsByDay = weekDays.reduce((acc, day) => {
    acc[day] = sessions.filter(s => s.day === day);
    return acc;
  }, {} as Record<string, Session[]>);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex items-center mb-6">
        <CalendarIcon className="w-8 h-8 mr-3 text-rose-900" />
        <h2 className="text-3xl font-bold text-gray-800">Horario de Clases</h2>
      </div>
      <div className="space-y-8">
        {weekDays.map(day => (
          sessionsByDay[day].length > 0 && (
            <div key={day}>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-rose-900">{day}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sessionsByDay[day].map(session => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    currentUser={currentUser}
                    userBookings={userBookings}
                    bookingsForSession={getBookingsForSession(session.id)}
                    onBook={addBooking}
                    onCancel={removeBooking}
                    getUserById={getUserById}
                    users={users}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default CalendarView;