import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Order from '@/models/Order';

// GET /api/orders/[id] - Get a single order
export async function GET(request, { params }) {
    try {
        await connectDB();
        
        const { id } = params;
        
        const order = await Order.findById(id)
            .populate('user', 'name email')
            .populate('items.product', 'name image price offerPrice category');

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

// PUT /api/orders/[id] - Update order status (Admin only)
export async function PUT(request, { params }) {
    try {
        await connectDB();
        
        const { id } = params;
        const body = await request.json();
        const { orderStatus, paymentStatus, trackingNumber } = body;
        
        const updateData = {};
        if (orderStatus) updateData.orderStatus = orderStatus;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        if (trackingNumber) updateData.trackingNumber = trackingNumber;
        
        const order = await Order.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('items.product', 'name image price offerPrice');

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: order,
            message: 'Order updated successfully'
        });

    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update order' },
            { status: 500 }
        );
    }
}
