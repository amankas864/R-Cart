import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Category from '@/models/Category';

// GET /api/categories - Get all categories
export async function GET(request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const active = searchParams.get('active');
        
        let query = {};
        if (active === 'true') {
            query.isActive = true;
        }

        const categories = await Category.find(query)
            .sort({ sortOrder: 1, name: 1 });

        return NextResponse.json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST /api/categories - Create a new category (Admin only)
export async function POST(request) {
    try {
        await connectDB();
        
        const body = await request.json();
        const { name, description, image, parent, sortOrder = 0 } = body;

        // Validate required fields
        if (!name || !description || !image) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create new category
        const category = new Category({
            name,
            description,
            image,
            parent,
            sortOrder
        });

        await category.save();

        return NextResponse.json({
            success: true,
            data: category,
            message: 'Category created successfully'
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create category' },
            { status: 500 }
        );
    }
}
