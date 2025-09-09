'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const {user} = useUser();

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(true)
    const [cartItems, setCartItems] = useState({})
    const [wishlist, setWishlist] = useState([])
    const [categories, setCategories] = useState([])

    const fetchProductData = async () => {
        setProducts(productsDummyData)
    }

    const fetchUserData = async () => {
        setUserData(userDummyData)
    }

    const addToCart = async (itemId) => {
        try {
            let cartData = structuredClone(cartItems);
            if (cartData[itemId]) {
                cartData[itemId] += 1;
            }
            else {
                cartData[itemId] = 1;
            }
            setCartItems(cartData);
            toast.success('Added to cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart');
        }
    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    const addToWishlist = async (productId) => {
        try {
            if (wishlist.includes(productId)) {
                setWishlist(wishlist.filter(id => id !== productId));
                toast.success('Removed from wishlist');
            } else {
                setWishlist([...wishlist, productId]);
                toast.success('Added to wishlist');
            }
        } catch (error) {
            console.error('Error updating wishlist:', error);
            toast.error('Failed to update wishlist');
        }
    }

    const removeFromWishlist = async (productId) => {
        setWishlist(wishlist.filter(id => id !== productId));
    }

    const isInWishlist = (productId) => {
        return wishlist.includes(productId);
    }

    const fetchCategories = async () => {
        // This will be implemented with API call later
        setCategories([
            { _id: '1', name: 'Electronics', slug: 'electronics', image: '/api/placeholder/300/200' },
            { _id: '2', name: 'Clothing', slug: 'clothing', image: '/api/placeholder/300/200' },
            { _id: '3', name: 'Home & Garden', slug: 'home-garden', image: '/api/placeholder/300/200' },
            { _id: '4', name: 'Sports', slug: 'sports', image: '/api/placeholder/300/200' }
        ]);
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        fetchUserData()
        fetchCategories()
    }, [])

    const value = {
        user,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount,
        wishlist, setWishlist,
        addToWishlist, removeFromWishlist,
        isInWishlist,
        categories, fetchCategories
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}