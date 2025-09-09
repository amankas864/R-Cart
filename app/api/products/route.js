import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

// GET /api/products - Get all products with optional filtering
export async function GET(request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 12;
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'name';
        const minPrice = parseFloat(searchParams.get('minPrice'));
        const maxPrice = parseFloat(searchParams.get('maxPrice'));
        const featured = searchParams.get('featured');

        // Build query
        let query = { status: 'active' };

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (minPrice !== null && !isNaN(minPrice)) {
            query.offerPrice = { ...query.offerPrice, $gte: minPrice };
        }

        if (maxPrice !== null && !isNaN(maxPrice)) {
            query.offerPrice = { ...query.offerPrice, $lte: maxPrice };
        }

        if (featured === 'true') {
            query.featured = true;
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

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const products = await Product.find(query)
            .populate('category', 'name slug')
            .populate('seller', 'name email')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: {
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
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST /api/products - Create a new product (Admin/Seller only)
export async function POST(request) {
    try {
        await connectDB();
        
        const body = await request.json();
        const {
            name,
            description,
            price,
            offerPrice,
            images,
            category,
            stock,
            featured = false
        } = body;

        // Validate required fields
        if (!name || !description || !price || !offerPrice || !images || !category) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create new product
        const product = new Product({
            name,
            description,
            price,
            offerPrice,
            images,
            category,
            stock: stock || 0,
            featured,
            seller: 'user_2sZFHS1UIIysJyDVzCpQhUhTIhw' // This should come from auth
        });

        await product.save();
        await product.populate('category', 'name slug');

        return NextResponse.json({
            success: true,
            data: product,
            message: 'Product created successfully'
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create product' },
            { status: 500 }
        );
    }
}
