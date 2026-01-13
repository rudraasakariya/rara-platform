'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // Always default to closed (false) - sidebar should be closed by default
  const [isOpen, setIsOpen] = useState(false);
  
  const [isMounted, setIsMounted] = useState(false);

  // Track when component has mounted to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    // Only read from localStorage after mount, but default to closed
    // This ensures sidebar starts closed on every page load
    const savedState = localStorage.getItem('sidebar-open');
    // Only restore if explicitly saved as 'true', otherwise keep closed
    if (savedState === 'true') {
      setIsOpen(true);
    }
  }, []);

  // Save sidebar state to localStorage (only after mount and user interaction)
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('sidebar-open', String(isOpen));
    }
  }, [isOpen, isMounted]);

  const toggle = () => setIsOpen((prev) => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
