'use client'
import React from "react";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Wishlist = () => {
  const { products, wishlist, removeFromWishlist, addToCart } = useAppContext();

  const wishlistProducts = products.filter(product => wishlist.includes(product._id));

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 pb-20">
        <div className="flex items-center justify-between mb-8 border-b border-gray-300 pb-6">
          <h1 className="text-2xl md:text-3xl text-gray-700">
            My <span className="font-medium text-orange-600">Wishlist</span>
          </h1>
          <p className="text-lg text-gray-500">{wishlistProducts.length} Items</p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Image
                src={assets.heart_icon}
                alt="Empty wishlist"
                className="w-16 h-16 text-gray-400"
              />
            </div>
            <h2 className="text-2xl font-medium text-gray-700 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save items you love for later by clicking the heart icon</p>
            <button
              onClick={() => window.location.href = '/all-products'}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <div key={product._id} className="relative">
                <ProductCard product={product} />
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition"
                  title="Remove from wishlist"
                >
                  <Image
                    src={assets.heart_icon}
                    alt="Remove from wishlist"
                    className="w-5 h-5 text-red-500"
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
