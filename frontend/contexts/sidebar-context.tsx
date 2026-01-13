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
  const [isMounted, setIsMounted] = useState(false);
  
  // On desktop (md+), sidebar should be open by default
  // On mobile, sidebar should be closed by default
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      // Check if we're on desktop (window width >= 768px)
      const isDesktop = window.innerWidth >= 768;
      // Check localStorage for saved preference
      const savedState = localStorage.getItem('sidebar-open');
      if (savedState !== null) {
        return savedState === 'true';
      }
      // Default: open on desktop, closed on mobile
      return isDesktop;
    }
    return false; // SSR default
  });

  // Track when component has mounted to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    
    // Set initial state based on screen size
    const isDesktop = window.innerWidth >= 768;
    const savedState = localStorage.getItem('sidebar-open');
    
    if (savedState !== null) {
      setIsOpen(savedState === 'true');
    } else {
      // Default: open on desktop, closed on mobile
      setIsOpen(isDesktop);
    }
    
    // Handle window resize to adjust sidebar on mobile/desktop switch
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      const savedState = localStorage.getItem('sidebar-open');
      // Only auto-adjust if no explicit preference is saved
      if (savedState === null) {
        setIsOpen(isDesktop);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
