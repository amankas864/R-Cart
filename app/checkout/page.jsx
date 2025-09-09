'use client'
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Checkout = () => {
    const { user, cartItems, products, getCartAmount, router } = useAppContext();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [orderNotes, setOrderNotes] = useState('');

    // Address form state
    const [addressForm, setAddressForm] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'United States'
    });

    const [showAddressForm, setShowAddressForm] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/');
            toast.error('Please sign in to checkout');
            return;
        }

        if (Object.keys(cartItems).length === 0) {
            router.push('/cart');
            toast.error('Your cart is empty');
            return;
        }

        // Load saved addresses (mock data for now)
        setAddresses([
            {
                _id: '1',
                fullName: 'John Doe',
                phoneNumber: '1234567890',
                address: '123 Main St, Apt 4B',
                city: 'New York',
                state: 'NY',
                pincode: '10001',
                country: 'United States',
                isDefault: true
            }
        ]);
    }, [user, cartItems, router]);

    const cartItemsArray = Object.entries(cartItems)
        .filter(([_, quantity]) => quantity > 0)
        .map(([productId, quantity]) => {
            const product = products.find(p => p._id === productId);
            return { product, quantity };
        })
        .filter(item => item.product);

    const subtotal = getCartAmount();
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        const newAddress = {
            _id: Date.now().toString(),
            ...addressForm,
            isDefault: addresses.length === 0
        };
        setAddresses([...addresses, newAddress]);
        setSelectedAddress(newAddress);
        setShowAddressForm(false);
        setAddressForm({
            fullName: '',
            phoneNumber: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            country: 'United States'
        });
        toast.success('Address added successfully');
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select a shipping address');
            return;
        }

        setLoading(true);
        try {
            // Simulate order creation
            const orderData = {
                userId: user.id,
                items: cartItemsArray.map(item => ({
                    productId: item.product._id,
                    quantity: item.quantity
                })),
                shippingAddress: selectedAddress,
                paymentMethod,
                notes: orderNotes
            };

            // Here you would make an API call to create the order
            console.log('Order data:', orderData);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            toast.success('Order placed successfully!');
            router.push('/order-placed');
        } catch (error) {
            toast.error('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, title: 'Shipping Address', description: 'Where should we deliver your order?' },
        { number: 2, title: 'Payment Method', description: 'How would you like to pay?' },
        { number: 3, title: 'Review & Place Order', description: 'Review your order details' }
    ];

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 pt-14 pb-20">
                <div className="max-w-6xl mx-auto">
                    {/* Progress Steps */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                        currentStep >= step.number
                                            ? 'bg-orange-600 border-orange-600 text-white'
                                            : 'border-gray-300 text-gray-400'
                                    }`}>
                                        {step.number}
                                    </div>
                                    <div className="ml-4 hidden md:block">
                                        <h3 className="font-medium text-gray-800">{step.title}</h3>
                                        <p className="text-sm text-gray-500">{step.description}</p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-16 h-0.5 mx-4 ${
                                            currentStep > step.number ? 'bg-orange-600' : 'bg-gray-300'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Step 1: Shipping Address */}
                            {currentStep === 1 && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-xl font-medium text-gray-800 mb-6">Shipping Address</h2>
                                    
                                    {/* Saved Addresses */}
                                    {addresses.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="font-medium text-gray-700 mb-4">Saved Addresses</h3>
                                            <div className="space-y-3">
                                                {addresses.map((address) => (
                                                    <div
                                                        key={address._id}
                                                        onClick={() => setSelectedAddress(address)}
                                                        className={`p-4 border rounded-lg cursor-pointer transition ${
                                                            selectedAddress?._id === address._id
                                                                ? 'border-orange-500 bg-orange-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h4 className="font-medium text-gray-800">{address.fullName}</h4>
                                                                <p className="text-gray-600">{address.address}</p>
                                                                <p className="text-gray-600">{address.city}, {address.state} {address.pincode}</p>
                                                                <p className="text-gray-600">{address.phoneNumber}</p>
                                                            </div>
                                                            {address.isDefault && (
                                                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Add New Address */}
                                    <button
                                        onClick={() => setShowAddressForm(!showAddressForm)}
                                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition"
                                    >
                                        + Add New Address
                                    </button>

                                    {/* Address Form */}
                                    {showAddressForm && (
                                        <form onSubmit={handleAddressSubmit} className="mt-6 p-6 border border-gray-200 rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={addressForm.fullName}
                                                        onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={addressForm.phoneNumber}
                                                        onChange={(e) => setAddressForm({...addressForm, phoneNumber: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={addressForm.address}
                                                        onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={addressForm.city}
                                                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        State
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={addressForm.state}
                                                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        ZIP Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={addressForm.pincode}
                                                        onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Country
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={addressForm.country}
                                                        onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-4 mt-6">
                                                <button
                                                    type="submit"
                                                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                                                >
                                                    Save Address
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddressForm(false)}
                                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Payment Method */}
                            {currentStep === 2 && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-xl font-medium text-gray-800 mb-6">Payment Method</h2>
                                    
                                    <div className="space-y-4">
                                        <div
                                            onClick={() => setPaymentMethod('credit_card')}
                                            className={`p-4 border rounded-lg cursor-pointer transition ${
                                                paymentMethod === 'credit_card'
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    checked={paymentMethod === 'credit_card'}
                                                    onChange={() => setPaymentMethod('credit_card')}
                                                    className="mr-3"
                                                />
                                                <div>
                                                    <h3 className="font-medium text-gray-800">Credit/Debit Card</h3>
                                                    <p className="text-sm text-gray-500">Pay with Visa, Mastercard, or American Express</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => setPaymentMethod('paypal')}
                                            className={`p-4 border rounded-lg cursor-pointer transition ${
                                                paymentMethod === 'paypal'
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    checked={paymentMethod === 'paypal'}
                                                    onChange={() => setPaymentMethod('paypal')}
                                                    className="mr-3"
                                                />
                                                <div>
                                                    <h3 className="font-medium text-gray-800">PayPal</h3>
                                                    <p className="text-sm text-gray-500">Pay securely with your PayPal account</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => setPaymentMethod('stripe')}
                                            className={`p-4 border rounded-lg cursor-pointer transition ${
                                                paymentMethod === 'stripe'
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    checked={paymentMethod === 'stripe'}
                                                    onChange={() => setPaymentMethod('stripe')}
                                                    className="mr-3"
                                                />
                                                <div>
                                                    <h3 className="font-medium text-gray-800">Stripe</h3>
                                                    <p className="text-sm text-gray-500">Secure payment processing</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review Order */}
                            {currentStep === 3 && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-xl font-medium text-gray-800 mb-6">Review Your Order</h2>
                                    
                                    {/* Order Items */}
                                    <div className="space-y-4 mb-6">
                                        {cartItemsArray.map((item) => (
                                            <div key={item.product._id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                                <Image
                                                    src={item.product.image[0]}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                    width={64}
                                                    height={64}
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-800">
                                                        ${(item.product.offerPrice * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="mb-6">
                                        <h3 className="font-medium text-gray-800 mb-2">Shipping Address</h3>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="font-medium">{selectedAddress?.fullName}</p>
                                            <p>{selectedAddress?.address}</p>
                                            <p>{selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.pincode}</p>
                                            <p>{selectedAddress?.phoneNumber}</p>
                                        </div>
                                    </div>

                                    {/* Order Notes */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Order Notes (Optional)
                                        </label>
                                        <textarea
                                            value={orderNotes}
                                            onChange={(e) => setOrderNotes(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Any special instructions for your order..."
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    disabled={currentStep === 1}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                
                                {currentStep < 3 ? (
                                    <button
                                        onClick={() => setCurrentStep(currentStep + 1)}
                                        disabled={currentStep === 1 && !selectedAddress}
                                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Placing Order...' : 'Place Order'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                                <h2 className="text-xl font-medium text-gray-800 mb-6">Order Summary</h2>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">
                                            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium">${tax.toFixed(2)}</span>
                                    </div>
                                    <hr className="border-gray-200" />
                                    <div className="flex justify-between text-lg font-medium">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {shipping === 0 && (
                                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm text-green-800">
                                            🎉 You qualify for free shipping!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;
