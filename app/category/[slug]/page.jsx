'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";

const CategoryPage = () => {
    const { products, categories } = useAppContext();
    const params = useParams();
    const categorySlug = params.slug;
    
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [viewMode, setViewMode] = useState("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Find the category
    const category = categories.find(cat => cat.slug === categorySlug);

    // Filter products by category
    const categoryProducts = useMemo(() => {
        if (!category) return [];
        return products.filter(product => product.category === category.name);
    }, [products, category]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = categoryProducts;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return a.offerPrice - b.offerPrice;
                case "price-high":
                    return b.offerPrice - a.offerPrice;
                case "name":
                    return a.name.localeCompare(b.name);
                case "rating":
                    return (b.rating || 0) - (a.rating || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [categoryProducts, searchTerm, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!category) {
        return (
            <>
                <Navbar />
                <div className="px-6 md:px-16 lg:px-32 pt-14 pb-20">
                    <div className="text-center py-20">
                        <h1 className="text-2xl font-medium text-gray-700 mb-4">Category not found</h1>
                        <p className="text-gray-500 mb-8">The category you're looking for doesn't exist.</p>
                        <button
                            onClick={() => window.location.href = '/all-products'}
                            className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition"
                        >
                            Browse All Products
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 pt-14 pb-20">
                {/* Category Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Image
                                src={category.image}
                                alt={category.name}
                                className="w-12 h-12 object-cover"
                                width={48}
                                height={48}
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-medium text-gray-700">
                                {category.name}
                            </h1>
                            <p className="text-gray-500">
                                {filteredProducts.length} products in this category
                            </p>
                        </div>
                    </div>
                    {category.description && (
                        <p className="text-gray-600 max-w-3xl">{category.description}</p>
                    )}
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    {/* Search Bar */}
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={`Search in ${category.name}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <Image
                                src={assets.search_icon}
                                alt="Search"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="lg:w-48">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`px-4 py-3 ${viewMode === "grid" ? "bg-orange-600 text-white" : "bg-white text-gray-600"}`}
                        >
                            <Image src={assets.product_list_icon} alt="Grid" className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`px-4 py-3 ${viewMode === "list" ? "bg-orange-600 text-white" : "bg-white text-gray-600"}`}
                        >
                            <Image src={assets.menu_icon} alt="List" className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Products Grid/List */}
                {paginatedProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-medium text-gray-700 mb-4">No products found</h2>
                        <p className="text-gray-500 mb-8">Try adjusting your search criteria</p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSortBy("name");
                            }}
                            className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={`grid gap-6 ${
                            viewMode === "grid" 
                                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                                : "grid-cols-1"
                        }`}>
                            {paginatedProducts.map((product) => (
                                <ProductCard key={product._id} product={product} viewMode={viewMode} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 border rounded-lg ${
                                            currentPage === page
                                                ? "bg-orange-600 text-white border-orange-600"
                                                : "border-gray-300 hover:bg-gray-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CategoryPage;
