import { useState, useMemo, useCallback, useEffect } from 'react';
import { User, Session, Booking, UserRole, LoginData } from '../types';

// --- INITIAL DUMMY DATA ---

const createInitialSessions = (): Session[] => {
  const sessionTemplates: Omit<Session, 'id' | 'dateTime' | 'day'>[] = [
    { time: '11:30', title: 'Pilates', instructor: 'Melisa', capacity: 10 },
    { time: '17:00', title: 'Pilates', instructor: 'Melisa', capacity: 10 },
    { time: '11:30', title: 'Pilates', instructor: 'Melisa', capacity: 10 },
    { time: '17:00', title: 'Pilates', instructor: 'Melisa', capacity: 10 },
    { time: '20:00', title: 'Pilates', instructor: 'Isabel', capacity: 10 },
    { time: '20:00', title: 'Pilates', instructor: 'Isabel', capacity: 10 },
  ];
  
  const schedulePlan = {
      'Lunes': [sessionTemplates[0], sessionTemplates[1]],
      'Martes': [sessionTemplates[4]],
      'Miércoles': [sessionTemplates[2], sessionTemplates[3]],
      'Jueves': [sessionTemplates[5]],
      'Viernes': [],
  };

  const dayMap: { [key: string]: number } = { 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6, 'Domingo': 0 };
  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  let sessionIdCounter = 1;

  const finalSessions: Session[] = [];

  weekDays.forEach(day => {
      const daySessions = schedulePlan[day as keyof typeof schedulePlan];
      daySessions.forEach(template => {
            const now = new Date();
            const dayOfWeek = now.getDay();
            const dayDifference = dayMap[day] - (dayOfWeek === 0 ? 7 : dayOfWeek);
            const sessionDate = new Date(now);
            sessionDate.setDate(now.getDate() + dayDifference);
            const [hours, minutes] = template.time.split(':').map(Number);
            sessionDate.setHours(hours, minutes, 0, 0);

            if (sessionDate < now) {
                sessionDate.setDate(sessionDate.getDate() + 7);
            }
            finalSessions.push({ ...template, id: sessionIdCounter++, day, dateTime: sessionDate });
      });
  });

  return finalSessions.sort((a,b) => a.dateTime.getTime() - b.dateTime.getTime());
};


const initialUsers: User[] = [
  { id: 1, name: 'Admin', surname: 'User', alias: 'Admin', role: 'ADMIN', username: 'admin', password: '5566442' },
  { id: 2, name: 'Monitor', surname: 'User', alias: 'Monitor', role: 'MONITOR', username: 'monitor', password: 'monitorpass' },
];

const usePilatesData = () => {
  const USERS_STORAGE_KEY = 'pilatesApp_users';
  const BOOKINGS_STORAGE_KEY = 'pilatesApp_bookings';
  const NEXT_USER_ID_STORAGE_KEY = 'pilatesApp_nextUserId';

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      return storedUsers ? JSON.parse(storedUsers) : initialUsers;
    } catch (error) {
      console.error("Error loading users from localStorage:", error);
      return initialUsers;
    }
  });

  const [sessions] = useState<Session[]>(createInitialSessions());
  
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const storedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      return storedBookings ? JSON.parse(storedBookings) : [];
    } catch (error) {
      console.error("Error loading bookings from localStorage:", error);
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [nextUserId, setNextUserId] = useState<number>(() => {
    try {
      const storedId = localStorage.getItem(NEXT_USER_ID_STORAGE_KEY);
      return storedId ? parseInt(storedId, 10) : 3;
    } catch (error) {
      console.error("Error loading next user ID from localStorage:", error);
      return 3;
    }
  });
  
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users to localStorage:", error);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (error) {
      console.error("Error saving bookings to localStorage:", error);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(NEXT_USER_ID_STORAGE_KEY, nextUserId.toString());
    } catch (error) {
      console.error("Error saving next user ID to localStorage:", error);
    }
  }, [nextUserId]);

  const login = useCallback((loginData: LoginData) => {
    setLoginError(null);
    if (loginData.role === 'USER') {
      const newUser: User = {
        id: nextUserId,
        role: 'USER',
        name: loginData.name,
        surname: loginData.surname,
        alias: loginData.alias,
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setNextUserId(prev => prev + 1);
    } else {
      const user = users.find(u => u.role === loginData.role && u.username === loginData.username && u.password === loginData.password);
      if (user) {
        setCurrentUser(user);
      } else {
        setLoginError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
      }
    }
  }, [nextUserId, users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addBooking = useCallback((sessionId: number, userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    
    // Admin bypasses rules
    if (currentUser?.role !== 'ADMIN') {
        const sessionBookings = bookings.filter(b => b.sessionId === sessionId);
        if (sessionBookings.length >= session.capacity) {
            console.error("Session is full");
            return;
        }

        if (bookings.some(b => b.sessionId === sessionId && b.userId === userId)) {
            console.error("User already booked this session");
            return;
        }
        
        if (user.role === 'USER') {
            const userBookingsThisWeek = bookings.filter(b => b.userId === userId).length;
            if (userBookingsThisWeek >= 2) {
                 console.error("User has reached weekly booking limit");
                 return;
            }
        }
    }

    setBookings(prev => [...prev, { sessionId, userId }]);
  }, [bookings, currentUser, sessions, users]);

  const removeBooking = useCallback((sessionId: number, userId: number) => {
    setBookings(prevBookings => prevBookings.filter(b => !(b.sessionId === sessionId && b.userId === userId)));
  }, []);
  
  const removeUser = useCallback((userId: number) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    setBookings(prevBookings => prevBookings.filter(booking => booking.userId !== userId));
  }, []);

  const updateUserRole = useCallback((userId: number, role: UserRole) => {
    setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, role } : user));
  }, []);

  const addMonitor = useCallback((username: string, password: string): boolean => {
      if (users.some(u => u.username === username)) {
          alert('El nombre de usuario ya existe.');
          return false;
      }
      const newMonitor: User = {
          id: nextUserId,
          name: 'Nuevo',
          surname: 'Monitor',
          alias: username,
          role: 'MONITOR',
          username,
          password
      };
      setUsers(prev => [...prev, newMonitor]);
      setNextUserId(prev => prev + 1);
      return true;
  }, [users, nextUserId]);

  const userBookings = useMemo(() =>
    currentUser ? bookings.filter(b => b.userId === currentUser.id) : [],
    [currentUser, bookings]
  );
  
  const getBookingsForSession = useCallback((sessionId: number) => {
    return bookings.filter(b => b.sessionId === sessionId);
  }, [bookings]);

  const getUserById = useCallback((userId: number) => {
      return users.find(u => u.id === userId);
  }, [users]);

  return {
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
  };
};

export default usePilatesData;