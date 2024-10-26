'use client'
import React, { createContext, useContext, useState } from 'react';

interface UserData {
  userData: Record<string, any> | null;
  jsonMessage: Record<string, any> | null;
  setUserData: (data: Record<string, any> | null) => void;
  setJsonMessage: (data: Record<string, any> | null) => void;
}

const UserContext = createContext<UserData | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<Record<string, any> | null>(null);
  const [jsonMessage, setJsonMessage] = useState<Record<string, any> | null>(null);

  return (
    <UserContext.Provider value={{ userData, jsonMessage, setUserData, setJsonMessage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
