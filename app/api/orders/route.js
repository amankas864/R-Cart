import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';

// GET /api/orders - Get user's orders
export async function GET(request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User ID is required' },
                { status: 400 }
            );
        }

        const skip = (page - 1) * limit;
        const orders = await Order.find({ user: userId })
            .populate('items.product', 'name image price offerPrice')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments({ user: userId });

        return NextResponse.json({
            success: true,
            data: {
                orders,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalOrders: total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

// POST /api/orders - Create a new order
export async function POST(request) {
    try {
        await connectDB();
        
        const body = await request.json();
        const {
            userId,
            items,
            shippingAddress,
            paymentMethod,
            notes = ''
        } = body;

        // Validate required fields
        if (!userId || !items || !shippingAddress || !paymentMethod) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Validate and prepare order items
        const orderItems = [];
        let subtotal = 0;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return NextResponse.json(
                    { success: false, message: `Product ${item.productId} not found` },
                    { status: 404 }
                );
            }

            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { success: false, message: `Insufficient stock for ${product.name}` },
                    { status: 400 }
                );
            }

            const itemTotal = product.offerPrice * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.offerPrice
            });

            // Update product stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Calculate totals
        const shippingCost = subtotal > 50 ? 0 : 10; // Free shipping over $50
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shippingCost + tax;

        // Create order
        const order = new Order({
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal,
            shippingCost,
            tax,
            total,
            notes
        });

        await order.save();
        await order.populate('items.product', 'name image price offerPrice');

        // Clear user's cart
        user.cartItems = {};
        await user.save();

        return NextResponse.json({
            success: true,
            data: order,
            message: 'Order created successfully'
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create order' },
            { status: 500 }
        );
    }
}
