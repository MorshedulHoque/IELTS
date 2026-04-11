"use client";
import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  desktopSidebarOpen: boolean;
  setDesktopSidebarOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ desktopSidebarOpen, setDesktopSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
