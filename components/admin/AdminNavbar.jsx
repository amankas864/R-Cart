'use client'
import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const AdminNavbar = () => {
    const router = useRouter();

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image
                        src={assets.logo}
                        alt="R-cart Admin"
                        className="w-8 h-8"
                    />
                    <h1 className="text-xl font-semibold text-gray-800">R-cart Admin</h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/')}
                        className="text-gray-600 hover:text-gray-800 transition"
                    >
                        View Store
                    </button>
                    <UserButton />
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
