'use client'
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { assets } from "@/assets/assets";
import Image from "next/image";

const AdminSidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        {
            name: 'Dashboard',
            href: '/admin',
            icon: assets.box_icon
        },
        {
            name: 'Products',
            href: '/admin/products',
            icon: assets.product_list_icon
        },
        {
            name: 'Categories',
            href: '/admin/categories',
            icon: assets.box_icon
        },
        {
            name: 'Orders',
            href: '/admin/orders',
            icon: assets.order_icon
        },
        {
            name: 'Users',
            href: '/admin/users',
            icon: assets.user_icon
        },
        {
            name: 'Analytics',
            href: '/admin/analytics',
            icon: assets.search_icon
        }
    ];

    return (
        <aside className="fixed left-0 top-16 h-full w-64 bg-white shadow-sm border-r border-gray-200">
            <nav className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                    pathname === item.href
                                        ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-600'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                }`}
                            >
                                <Image
                                    src={item.icon}
                                    alt={item.name}
                                    className="w-5 h-5"
                                />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
