'use client'
import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const AdminDashboard = () => {
    // Mock data for dashboard
    const stats = [
        {
            title: 'Total Orders',
            value: '1,234',
            change: '+12%',
            changeType: 'positive',
            icon: assets.order_icon
        },
        {
            title: 'Total Revenue',
            value: '$45,678',
            change: '+8%',
            changeType: 'positive',
            icon: assets.box_icon
        },
        {
            title: 'Total Products',
            value: '89',
            change: '+3',
            changeType: 'positive',
            icon: assets.product_list_icon
        },
        {
            title: 'Total Customers',
            value: '2,456',
            change: '+15%',
            changeType: 'positive',
            icon: assets.user_icon
        }
    ];

    const recentOrders = [
        {
            id: 'RC-001',
            customer: 'John Doe',
            amount: '$299.99',
            status: 'Delivered',
            date: '2024-01-15'
        },
        {
            id: 'RC-002',
            customer: 'Jane Smith',
            amount: '$149.99',
            status: 'Processing',
            date: '2024-01-14'
        },
        {
            id: 'RC-003',
            customer: 'Bob Johnson',
            amount: '$89.99',
            status: 'Shipped',
            date: '2024-01-13'
        }
    ];

    const topProducts = [
        {
            name: 'Apple AirPods Pro',
            sales: 45,
            revenue: '$17,995'
        },
        {
            name: 'Bose QuietComfort 45',
            sales: 32,
            revenue: '$10,559'
        },
        {
            name: 'Samsung Galaxy S23',
            sales: 28,
            revenue: '$22,399'
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600">Welcome to your admin dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                <p className={`text-sm ${
                                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {stat.change} from last month
                                </p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <Image
                                    src={stat.icon}
                                    alt={stat.title}
                                    className="w-6 h-6 text-orange-600"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                    <div>
                                        <p className="font-medium text-gray-800">#{order.id}</p>
                                        <p className="text-sm text-gray-600">{order.customer}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-800">{order.amount}</p>
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                            order.status === 'Delivered' 
                                                ? 'bg-green-100 text-green-800'
                                                : order.status === 'Processing'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 text-orange-600 hover:text-orange-700 font-medium">
                            View All Orders
                        </button>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Top Products</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {topProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                    <div>
                                        <p className="font-medium text-gray-800">{product.name}</p>
                                        <p className="text-sm text-gray-600">{product.sales} sales</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-800">{product.revenue}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 text-orange-600 hover:text-orange-700 font-medium">
                            View All Products
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left">
                        <h3 className="font-medium text-gray-800">Add New Product</h3>
                        <p className="text-sm text-gray-600">Create a new product listing</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left">
                        <h3 className="font-medium text-gray-800">Manage Categories</h3>
                        <p className="text-sm text-gray-600">Organize your product categories</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left">
                        <h3 className="font-medium text-gray-800">View Analytics</h3>
                        <p className="text-sm text-gray-600">Check your store performance</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
