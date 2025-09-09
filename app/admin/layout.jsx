'use client'
import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-6 ml-64">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
