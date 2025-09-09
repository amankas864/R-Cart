'use client'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const CategoriesPage = () => {
    const { categories } = useAppContext();

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 pt-14 pb-20">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-medium text-gray-700 mb-4">
                        Shop by Category
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Discover our wide range of products organized by category. 
                        Find exactly what you're looking for with ease.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categories.map((category) => (
                        <Link
                            key={category._id}
                            href={`/category/${category.slug}`}
                            className="group block bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                            <div className="aspect-square bg-gray-100 flex items-center justify-center p-8">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    className="w-24 h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                                    width={96}
                                    height={96}
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-medium text-gray-800 mb-2 group-hover:text-orange-600 transition">
                                    {category.name}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2">
                                    {category.description}
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-sm text-gray-400">
                                        Explore products
                                    </span>
                                    <Image
                                        src={assets.arrow_right_icon_colored}
                                        alt="Arrow"
                                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Featured Categories Section */}
                <div className="mt-20">
                    <h2 className="text-2xl font-medium text-gray-700 mb-8 text-center">
                        Popular Categories
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.slice(0, 3).map((category) => (
                            <Link
                                key={category._id}
                                href={`/category/${category.slug}`}
                                className="group relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 hover:from-orange-100 hover:to-orange-200 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            className="w-8 h-8 object-cover"
                                            width={32}
                                            height={32}
                                        />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800">
                                        {category.name}
                                    </h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">
                                    {category.description}
                                </p>
                                <div className="flex items-center text-orange-600 text-sm font-medium">
                                    Shop Now
                                    <Image
                                        src={assets.arrow_right_icon_colored}
                                        alt="Arrow"
                                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-20 text-center bg-gray-50 rounded-xl p-12">
                    <h2 className="text-2xl font-medium text-gray-700 mb-4">
                        Can't find what you're looking for?
                    </h2>
                    <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
                        Browse our complete product catalog or use our search feature to find exactly what you need.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/all-products"
                            className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition"
                        >
                            Browse All Products
                        </Link>
                        <Link
                            href="/"
                            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CategoriesPage;
