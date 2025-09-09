# R-cart - Modern E-Commerce Platform

A fully functional e-commerce web application built with Next.js and Tailwind CSS, featuring a complete shopping experience with modern UI/UX design.

🌐 **Live Demo**: [https://r-cart-black.vercel.app/](https://r-cart-black.vercel.app/)

## Features

- 🏠 **Home Page** - Hero banner, featured products, categories preview
- 🛍️ **Product Listing** - Advanced filtering, search, pagination, grid/list view
- 📱 **Product Details** - Image gallery, reviews, add to cart/wishlist
- ❤️ **Wishlist** - Save and manage favorite products
- 🛒 **Shopping Cart** - Add/remove items, quantity management, real-time totals
- 📂 **Categories** - Dynamic category pages with product listings
- 🔐 **Authentication** - User registration/login with Clerk
- 💳 **Checkout Flow** - Multi-step checkout with address management
- 👨‍💼 **Admin Dashboard** - Complete product and order management
- 📊 **Analytics** - Sales metrics and performance tracking

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: Clerk
- **Deployment**: Vercel
- **State Management**: Context API

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Quick Setup

### 1. Environment Variables
Create a `.env.local` file in your project root:

```bash
# MongoDB Database (Required for full functionality)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

# Clerk Authentication (Required for user features)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Currency
NEXT_PUBLIC_CURRENCY=$
```

### 2. Install and Run
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### 3. Test Functionality
- Visit [http://localhost:3000/test](http://localhost:3000/test) to test basic functionality
- Visit [http://localhost:3000](http://localhost:3000) for the full application

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
