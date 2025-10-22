
"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { User, UserRole } from '@/lib/types';
import { initialData } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  authenticate: (username: string, name?: string, role?: UserRole) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  
  useEffect(() => {
    // Mock auto-login with a default user
    const defaultUser = initialData.users.find(u => u.username === 'chairman');
    if (defaultUser) {
        setUser(defaultUser);
        setRole(defaultUser.role);
    }
  }, []);


  const authenticate = (username: string, name?: string, userRole: UserRole = 'customer') => {
    // Simplified authentication: find user by username
    const foundUser = initialData.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (foundUser) {
        setUser(foundUser);
        setRole(foundUser.role);
    } else {
        // If user not found for login, do nothing or show error
        // For registration, a new user would be created and added to the data source
        console.warn(`User "${username}" not found.`);
        // For demo purposes, let's create a temporary user on registration
        if(name) {
             const newUser: User = {
                id: `user-${Date.now()}`,
                name: name,
                username: username,
                role: userRole,
                avatar: `https://images.unsplash.com/photo-1527980965255-d3b416303d12`,
                location: 'Не указано',
                bio: 'Новый пользователь BizMart!',
                followers: 0,
            };
            // In a real app, you would add this user to your persistent data source.
            // For now, we just set them in the context.
            setUser(newUser);
            setRole(userRole);
        }
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
