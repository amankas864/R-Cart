import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';

// GET /api/products/[id] - Get a single product
export async function GET(request, { params }) {
    try {
        await connectDB();
        
        const { id } = params;
        
        const product = await Product.findById(id)
            .populate('category', 'name slug description')
            .populate('seller', 'name email')
            .populate('reviews.user', 'name imageUrl');

        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

// PUT /api/products/[id] - Update a product (Admin/Seller only)
export async function PUT(request, { params }) {
    try {
        await connectDB();
        
        const { id } = params;
        const body = await request.json();
        
        const product = await Product.findByIdAndUpdate(
            id,
            { ...body, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate('category', 'name slug');

        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: product,
            message: 'Product updated successfully'
        });

    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE /api/products/[id] - Delete a product (Admin/Seller only)
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        
        const { id } = params;
        
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
