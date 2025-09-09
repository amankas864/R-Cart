import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Category from '@/models/Category';
import Product from '@/models/Product';

// GET /api/categories/[slug] - Get category by slug with products
export async function GET(request, { params }) {
    try {
        await connectDB();
        
        const { slug } = params;
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 12;
        const sortBy = searchParams.get('sortBy') || 'name';
        
        // Find category
        const category = await Category.findOne({ slug, isActive: true });
        
        if (!category) {
            return NextResponse.json(
                { success: false, message: 'Category not found' },
                { status: 404 }
            );
        }

        // Build sort object
        let sort = {};
        switch (sortBy) {
            case 'price-low':
                sort = { offerPrice: 1 };
                break;
            case 'price-high':
                sort = { offerPrice: -1 };
                break;
            case 'rating':
                sort = { rating: -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            default:
                sort = { name: 1 };
        }

        // Get products in this category
        const skip = (page - 1) * limit;
        const products = await Product.find({ 
            category: category._id, 
            status: 'active' 
        })
            .populate('category', 'name slug')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments({ 
            category: category._id, 
            status: 'active' 
        });

        return NextResponse.json({
            success: true,
            data: {
                category,
                products,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalProducts: total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch category' },
            { status: 500 }
        );
    }
}
