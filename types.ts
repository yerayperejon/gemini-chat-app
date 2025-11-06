export type UserRole = 'USER' | 'MONITOR' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  surname: string;
  alias: string;
  role: UserRole;
  username?: string;
  password?: string;
}

export interface Session {
  id: number;
  day: string;
  time: string;
  title: string;
  instructor: string;
  capacity: number;
  dateTime: Date;
}

export interface Booking {
  sessionId: number;
  userId: number;
}

export interface LoginData {
  role: UserRole;
  name: string;
  surname: string;
  alias: string;
  username?: string;
  password?: string;
}
