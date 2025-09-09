import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product, viewMode = "grid" }) => {

    const { currency, router, addToWishlist, isInWishlist, addToCart } = useAppContext()

    if (viewMode === "list") {
        return (
            <div
                onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
                className="flex items-center gap-6 p-4 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer"
            >
                <div className="relative bg-gray-500/10 rounded-lg w-24 h-24 flex items-center justify-center flex-shrink-0">
                    <Image
                        src={product.image[0]}
                        alt={product.name}
                        className="object-cover w-full h-full"
                        width={200}
                        height={200}
                    />
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            addToWishlist(product._id);
                        }}
                        className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-gray-50 transition"
                    >
                        <Image
                            className={`h-3 w-3 ${isInWishlist(product._id) ? 'text-red-500' : 'text-gray-400'}`}
                            src={assets.heart_icon}
                            alt="heart_icon"
                        />
                    </button>
                </div>
                
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Image
                                    key={index}
                                    className="h-3 w-3"
                                    src={index < Math.floor(4) ? assets.star_icon : assets.star_dull_icon}
                                    alt="star_icon"
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">(4.5)</span>
                    </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                    <p className="text-lg font-medium text-gray-800">{currency}{product.offerPrice}</p>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product._id);
                        }}
                        className="mt-2 px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
        >
            <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
                    width={800}
                    height={800}
                />
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        addToWishlist(product._id);
                    }}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition"
                >
                    <Image
                        className={`h-3 w-3 ${isInWishlist(product._id) ? 'text-red-500' : 'text-gray-400'}`}
                        src={assets.heart_icon}
                        alt="heart_icon"
                    />
                </button>
            </div>

            <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
            <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{product.description}</p>
            <div className="flex items-center gap-2">
                <p className="text-xs">{4.5}</p>
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="h-3 w-3"
                            src={
                                index < Math.floor(4)
                                    ? assets.star_icon
                                    : assets.star_dull_icon
                            }
                            alt="star_icon"
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-end justify-between w-full mt-1">
                <p className="text-base font-medium">{currency}{product.offerPrice}</p>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product._id);
                    }}
                    className="max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    )
}

export default ProductCard