"use client";
import AdminNavbar from '@/components/Layout/Admin/AdminNavbar'
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext'
import React from 'react'

const AdminContent = ({ children }: any) => {
    const { desktopSidebarOpen } = useSidebar();
    
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />
            <main 
                className={`transition-all duration-300 ${
                    desktopSidebarOpen ? 'lg:ml-72' : 'lg:ml-16'
                }`}
            >
                {children}
            </main>
        </div>
    )
}

const AdminLayout = ({ children }: any) => {
    return (
        <SidebarProvider>
            <AdminContent>{children}</AdminContent>
        </SidebarProvider>
    )
}

export default AdminLayout
