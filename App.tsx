import React from 'react';
import usePilatesData from './hooks/usePilatesData';
import UserLogin from './components/UserLogin';
import Header from './components/Header';
import CalendarView from './components/CalendarView';
import AdminPanel from './components/AdminPanel';

function App() {
  const {
    users,
    sessions,
    currentUser,
    loginError,
    userBookings,
    login,
    logout,
    addBooking,
    removeBooking,
    getBookingsForSession,
    getUserById,
    updateUserRole,
    addMonitor,
    removeUser,
  } = usePilatesData();

  if (!currentUser) {
    return <UserLogin onLogin={login} error={loginError} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header currentUser={currentUser} onLogout={logout} />
      <main>
        {currentUser.role === 'ADMIN' && (
          <AdminPanel 
            users={users} 
            updateUserRole={updateUserRole} 
            addMonitor={addMonitor}
            currentUser={currentUser}
            removeUser={removeUser}
          />
        )}
        
        <CalendarView
          sessions={sessions}
          currentUser={currentUser}
          userBookings={userBookings}
          addBooking={addBooking}
          removeBooking={removeBooking}
          getBookingsForSession={getBookingsForSession}
          getUserById={getUserById}
          users={users}
        />

      </main>
    </div>
  );
}

export default App;