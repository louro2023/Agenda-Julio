import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EventRequest, User, EventStatus } from '../types';
import { getStoredEvents, getStoredUsers, saveStoredEvents, saveStoredUsers } from '../services/storage';

interface DataContextType {
  events: EventRequest[];
  users: User[];
  loading: boolean;
  addEvent: (event: Omit<EventRequest, 'id' | 'status'>) => void;
  updateEventStatus: (id: string, status: EventStatus) => void;
  updateEventDetails: (id: string, title: string, description: string) => void;
  deleteEvent: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  toggleUserStatus: (id: string) => void;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state directly from localStorage using lazy initialization
  // This ensures data is available on the very first render and persists across reloads
  const [events, setEvents] = useState<EventRequest[]>(() => getStoredEvents());
  const [users, setUsers] = useState<User[]>(() => getStoredUsers());
  
  // Since we load synchronously from localStorage, we don't strictly need a loading state, 
  // but we keep it false for compatibility
  const [loading, setLoading] = useState(false);

  const refreshData = () => {
    setEvents(getStoredEvents());
    setUsers(getStoredUsers());
  };

  // Event Logic
  const addEvent = (newEventData: Omit<EventRequest, 'id' | 'status'>) => {
    const newEvent: EventRequest = {
      ...newEventData,
      id: crypto.randomUUID(),
      status: EventStatus.PENDING,
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveStoredEvents(updatedEvents);
  };

  const updateEventStatus = (id: string, status: EventStatus) => {
    const updatedEvents = events.map(e => e.id === id ? { ...e, status } : e);
    setEvents(updatedEvents);
    saveStoredEvents(updatedEvents);
  };

  const updateEventDetails = (id: string, title: string, description: string) => {
    const updatedEvents = events.map(e => e.id === id ? { ...e, title, description } : e);
    setEvents(updatedEvents);
    saveStoredEvents(updatedEvents);
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(e => e.id !== id);
    setEvents(updatedEvents);
    saveStoredEvents(updatedEvents);
  }

  // User Logic
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveStoredUsers(updatedUsers);
  };

  const updateUser = (userToUpdate: User) => {
    const updatedUsers = users.map(u => u.id === userToUpdate.id ? userToUpdate : u);
    setUsers(updatedUsers);
    saveStoredUsers(updatedUsers);
  };

  const toggleUserStatus = (id: string) => {
    const updatedUsers = users.map(u => u.id === id ? { ...u, active: !u.active } : u);
    setUsers(updatedUsers);
    saveStoredUsers(updatedUsers);
  };

  return (
    <DataContext.Provider value={{
      events,
      users,
      loading,
      addEvent,
      updateEventStatus,
      updateEventDetails,
      deleteEvent,
      addUser,
      updateUser,
      toggleUserStatus,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};