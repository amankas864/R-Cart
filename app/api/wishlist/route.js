import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/models/User';
import Product from '@/models/Product';

// GET /api/wishlist - Get user's wishlist
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

        const user = await User.findById(userId).populate({
            path: 'wishlist',
            populate: {
                path: 'category',
                select: 'name slug'
            }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: user.wishlist || []
        });

    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch wishlist' },
            { status: 500 }
        );
    }
}

// POST /api/wishlist - Add/remove item from wishlist
export async function POST(request) {
    try {
        await connectDB();
        
        const body = await request.json();
        const { userId, productId, action } = body;
        
        if (!userId || !productId || !action) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
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

        // Initialize wishlist if it doesn't exist
        if (!user.wishlist) {
            user.wishlist = [];
        }

        let message = '';
        
        if (action === 'add') {
            // Add to wishlist if not already present
            if (!user.wishlist.includes(productId)) {
                user.wishlist.push(productId);
                message = 'Product added to wishlist';
            } else {
                message = 'Product already in wishlist';
            }
        } else if (action === 'remove') {
            // Remove from wishlist
            user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
            message = 'Product removed from wishlist';
        } else {
            return NextResponse.json(
                { success: false, message: 'Invalid action. Use "add" or "remove"' },
                { status: 400 }
            );
        }

        await user.save();

        return NextResponse.json({
            success: true,
            message,
            data: {
                wishlist: user.wishlist,
                isInWishlist: user.wishlist.includes(productId)
            }
        });

    } catch (error) {
        console.error('Error updating wishlist:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update wishlist' },
            { status: 500 }
        );
    }
}
