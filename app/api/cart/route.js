import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/models/User';
import Product from '@/models/Product';

// GET /api/cart - Get user's cart
export async function GET(request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User ID is required' },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Get cart items with product details
        const cartItems = [];
        let totalAmount = 0;
        let totalItems = 0;

        for (const [productId, quantity] of Object.entries(user.cartItems || {})) {
            if (quantity > 0) {
                const product = await Product.findById(productId)
                    .populate('category', 'name slug');
                
                if (product && product.status === 'active') {
                    const itemTotal = product.offerPrice * quantity;
                    cartItems.push({
                        product,
                        quantity,
                        itemTotal
                    });
                    totalAmount += itemTotal;
                    totalItems += quantity;
                }
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                items: cartItems,
                summary: {
                    totalItems,
                    subtotal: totalAmount,
                    shipping: totalAmount > 50 ? 0 : 10, // Free shipping over $50
                    tax: totalAmount * 0.08, // 8% tax
                    total: totalAmount + (totalAmount > 50 ? 0 : 10) + (totalAmount * 0.08)
                }
            }
        });

    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch cart' },
            { status: 500 }
        );
    }
}

// POST /api/cart - Update cart items
export async function POST(request) {
    try {
        await connectDB();
        
        const body = await request.json();
        const { userId, productId, quantity, action } = body;
        
        if (!userId || !productId) {
            return NextResponse.json(
                { success: false, message: 'User ID and Product ID are required' },
                { status: 400 }
            );
        }

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        // Find or create user
        let user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Initialize cart if it doesn't exist
        if (!user.cartItems) {
            user.cartItems = {};
        }

        let message = '';
        
        if (action === 'add') {
            // Add to cart
            const currentQuantity = user.cartItems[productId] || 0;
            const newQuantity = currentQuantity + (quantity || 1);
            
            // Check stock availability
            if (newQuantity > product.stock) {
                return NextResponse.json(
                    { success: false, message: 'Insufficient stock' },
                    { status: 400 }
                );
            }
            
            user.cartItems[productId] = newQuantity;
            message = 'Product added to cart';
        } else if (action === 'update') {
            // Update quantity
            if (quantity < 0) {
                return NextResponse.json(
                    { success: false, message: 'Quantity cannot be negative' },
                    { status: 400 }
                );
            }
            
            if (quantity === 0) {
                delete user.cartItems[productId];
                message = 'Product removed from cart';
            } else {
                // Check stock availability
                if (quantity > product.stock) {
                    return NextResponse.json(
                        { success: false, message: 'Insufficient stock' },
                        { status: 400 }
                    );
                }
                
                user.cartItems[productId] = quantity;
                message = 'Cart updated';
            }
        } else if (action === 'remove') {
            // Remove from cart
            delete user.cartItems[productId];
            message = 'Product removed from cart';
        } else {
            return NextResponse.json(
                { success: false, message: 'Invalid action. Use "add", "update", or "remove"' },
                { status: 400 }
            );
        }

        await user.save();

        return NextResponse.json({
            success: true,
            message,
            data: {
                cartItems: user.cartItems
            }
        });

    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update cart' },
            { status: 500 }
        );
    }
}
