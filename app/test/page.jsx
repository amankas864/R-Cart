'use client'
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

const TestPage = () => {
    const { products, addToCart, addToWishlist, isInWishlist, cartItems, getCartCount } = useAppContext();
    const [testMessage, setTestMessage] = useState("Testing functionality...");

    const handleTestCart = () => {
        if (products.length > 0) {
            addToCart(products[0]._id);
            setTestMessage("Cart test successful!");
        } else {
            setTestMessage("No products available for testing");
        }
    };

    const handleTestWishlist = () => {
        if (products.length > 0) {
            addToWishlist(products[0]._id);
            setTestMessage("Wishlist test successful!");
        } else {
            setTestMessage("No products available for testing");
        }
    };

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 pt-14 pb-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">R-cart Functionality Test</h1>
                    
                    {/* Test Status */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-blue-800 mb-4">Test Status</h2>
                        <p className="text-blue-700 mb-4">{testMessage}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-white p-3 rounded border">
                                <strong>Products Loaded:</strong> {products.length}
                            </div>
                            <div className="bg-white p-3 rounded border">
                                <strong>Cart Items:</strong> {getCartCount()}
                            </div>
                            <div className="bg-white p-3 rounded border">
                                <strong>Wishlist Items:</strong> {Object.keys(cartItems).length}
                            </div>
                        </div>
                    </div>

                    {/* Test Buttons */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Functions</h2>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleTestCart}
                                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
                            >
                                Test Add to Cart
                            </button>
                            <button
                                onClick={handleTestWishlist}
                                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                            >
                                Test Add to Wishlist
                            </button>
                            <button
                                onClick={() => setTestMessage("All tests completed!")}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                            >
                                Test Complete
                            </button>
                        </div>
                    </div>

                    {/* Products Display */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Products</h2>
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.slice(0, 6).map((product) => (
                                    <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                                        <ProductCard product={product} />
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => addToCart(product._id)}
                                                className="flex-1 bg-orange-600 text-white py-2 px-4 rounded text-sm hover:bg-orange-700 transition"
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={() => addToWishlist(product._id)}
                                                className={`px-4 py-2 rounded text-sm transition ${
                                                    isInWishlist(product._id)
                                                        ? 'bg-red-100 text-red-600 border border-red-300'
                                                        : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                                                }`}
                                            >
                                                {isInWishlist(product._id) ? '❤️' : '🤍'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No products available. Check your data source.</p>
                        )}
                    </div>

                    {/* Debug Information */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Debug Information</h2>
                        <div className="space-y-2 text-sm">
                            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
                            <p><strong>Products Count:</strong> {products.length}</p>
                            <p><strong>Cart Items:</strong> {JSON.stringify(cartItems)}</p>
                            <p><strong>User:</strong> {typeof window !== 'undefined' ? 'Browser' : 'Server'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TestPage;
