import { EventRequest, User, UserRole, EventStatus } from '../types';

const USERS_KEY = 'eventflow_users';
const EVENTS_KEY = 'eventflow_events';

// Seed data
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@demo.com',
    password: '123',
    role: UserRole.ADMIN,
    active: true,
  },
  {
    id: '2',
    name: 'Usuário Comum',
    email: 'user@demo.com',
    password: '123',
    role: UserRole.COMMON,
    active: true,
  },
  {
    id: '3',
    name: 'Visualizador',
    email: 'viewer@demo.com',
    password: '123',
    role: UserRole.VIEWER,
    active: true,
  },
];

const initialEvents: EventRequest[] = [
  {
    id: '101',
    title: 'Reunião de Planejamento',
    description: 'Planejamento Q3',
    date: new Date().toISOString().split('T')[0],
    status: EventStatus.APPROVED,
    requesterId: '1',
    requesterName: 'Administrador'
  }
];

export const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
      localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error parsing stored users, resetting to default", error);
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }
};

export const saveStoredUsers = (users: User[]) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users", error);
  }
};

export const getStoredEvents = (): EventRequest[] => {
  try {
    const stored = localStorage.getItem(EVENTS_KEY);
    if (!stored) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(initialEvents));
      return initialEvents;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error parsing stored events, resetting to default", error);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(initialEvents));
    return initialEvents;
  }
};

export const saveStoredEvents = (events: EventRequest[]) => {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error("Error saving events", error);
  }
};