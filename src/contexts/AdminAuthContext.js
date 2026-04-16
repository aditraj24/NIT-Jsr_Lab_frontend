'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('adminToken');
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listen for storage changes (works across tabs and programmatic changes)
    const handleStorageChange = (e) => {
      if (e.key === 'adminToken') {
        setIsAdminLoggedIn(!!e.newValue);
      }
    };

    // Listen for custom event (for same-tab updates)
    const handleAdminAuthChange = (e) => {
      setIsAdminLoggedIn(e.detail.isLoggedIn);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('adminAuthChange', handleAdminAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('adminAuthChange', handleAdminAuthChange);
    };
  }, []);

  const login = (token, adminId) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminId', adminId);
    setIsAdminLoggedIn(true);
    // Dispatch custom event for immediate update
    window.dispatchEvent(
      new CustomEvent('adminAuthChange', { detail: { isLoggedIn: true } })
    );
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminId');
    setIsAdminLoggedIn(false);
    // Dispatch custom event for immediate update
    window.dispatchEvent(
      new CustomEvent('adminAuthChange', { detail: { isLoggedIn: false } })
    );
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
