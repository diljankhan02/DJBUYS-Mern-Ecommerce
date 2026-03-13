import { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";


const Field = ({ label, name, type = "text", placeholder, half = false, formData, errors, handleChange }) => (
    <div className={half ? "col-span-2 sm:col-span-1" : "col-span-2"}>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 md:mb-3 ml-1">
            {label} <span className="text-orange-600">*</span>
        </label>
        <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-slate-100 rounded-xl md:rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-600 focus:bg-white transition-all duration-300 text-sm font-semibold
                ${errors[name] ? "border-red-500 bg-red-50" : ""}`}
        />
        {errors[name] && <p className="text-red-500 text-[10px] font-black uppercase tracking-tight mt-2 ml-1">{errors[name]}</p>}
    </div>
);


const Section = ({ title, children }) => (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-2xl hover:shadow-orange-600/5 duration-500">
        <div className="bg-slate-50 px-6 md:px-10 py-4 md:py-6 border-b border-slate-100">
            <h2 className="font-black text-slate-900 uppercase tracking-[0.4em] text-[9px] md:text-[10px] flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                {title}
            </h2>
        </div>
        <div className="p-6 md:p-10">{children}</div>
    </div>
);

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [placedOrderData, setPlacedOrderData] = useState(null);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        fullName:   storedUser.name  || "",
        email:      storedUser.email || "",
        phone:      "",
        street:     "",
        city:       "",
        province:   "",
        postalCode: "",
        country:    "Pakistan",
    });

    const totalPrice = cart.reduce((acc, item) => {
        const price = item.discount
            ? item.price - (item.price * item.discount) / 100
            : item.price;
        return acc + price * item.quantity;
    }, 0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim())   newErrors.fullName   = "Full name is required";
        if (!formData.email.trim())      newErrors.email      = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email";
        if (!formData.phone.trim())      newErrors.phone      = "Phone number is required";
        if (!formData.street.trim())     newErrors.street     = "Street address is required";
        if (!formData.city.trim())       newErrors.city       = "City is required";
        if (!formData.province.trim())   newErrors.province   = "Province / State is required";
        if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const orderData = {
                userName: formData.fullName,
                email:    formData.email,
                phone:    formData.phone,
                shippingAddress: {
                    street:     formData.street,
                    city:       formData.city,
                    province:   formData.province,
                    postalCode: formData.postalCode,
                    country:    formData.country,
                },
                products: cart.map((item) => ({
                    productId: item._id,
                    title:     item.title,
                    price:     item.discount
                        ? item.price - (item.price * item.discount) / 100
                        : item.price,
                    image:    item.image,
                    quantity: item.quantity,
                })),
                totalPrice,
            };
            const res = await axios.post("https://djbuys-backend.vercel.app/api/orders", orderData);
            clearCart();
            setPlacedOrderData({ ...orderData, orderId: res.data.order?._id });
            setOrderPlaced(true);
        } catch {
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    /* ─── ORDER CONFIRMED SCREEN ─── */
    if (orderPlaced && placedOrderData) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
                <Navbar />
                <main className="flex-1 flex items-center justify-center px-6 py-32 relative">
                    <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden relative z-10 transition-all">
                        <div className="bg-white px-12 py-16 text-center relative overflow-hidden border-b border-slate-100">
                            <div className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl scale-110">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">Order Complete</h2>
                            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
                                Thank You • <span className="text-orange-600">{placedOrderData.userName.split(' ')[0]}</span>
                            </p>
                        </div>
                        <div className="p-12 space-y-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                                <div>
                                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2 md:mb-4">Contact Info</p>
                                    <div className="space-y-1">
                                        <p className="font-extrabold text-slate-900 text-sm md:text-base truncate">{placedOrderData.email}</p>
                                        <p className="text-slate-500 text-[10px] md:text-xs font-medium italic">{placedOrderData.phone}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2 md:mb-4">Shipping Address</p>
                                    <div className="space-y-1">
                                        <p className="font-extrabold text-slate-900 text-sm md:text-base">{placedOrderData.shippingAddress.city}</p>
                                        <p className="text-slate-500 text-[10px] md:text-xs font-medium italic">{placedOrderData.shippingAddress.province}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</span>
                                    <span className="text-[10px] font-black text-white bg-orange-600 px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-sm">Cash on Delivery</span>
                                </div>
                                <div className="flex justify-between items-end border-t border-slate-200 pt-6">
                                    <span className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Order Total</span>
                                    <span className="font-black text-slate-900 text-4xl tracking-tighter italic">${placedOrderData.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <button
                                    onClick={() => navigate("/products")}
                                    className="w-full py-6 bg-orange-600 hover:bg-slate-900 text-white rounded-full font-black transition-all duration-500 shadow-[0_0_30px_rgba(249,115,22,0.4)] uppercase tracking-[0.3em] text-xs group"
                                >
                                    Back to Shop <span className="ml-3 transition-transform group-hover:translate-x-2">→</span>
                                </button>
                                <p className="text-center text-slate-500 text-[10px] uppercase font-black tracking-[0.4em] italic leading-tight">Your order is being prepared for shipping</p>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    /* ─── MAIN CHECKOUT FORM ─── */
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />

            {/* Header */}
            <div className="bg-white border-b border-slate-100 pt-24 md:pt-32 pb-10 md:pb-16 px-6 relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">
                            Checkout
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                        {cart.length} Items in order
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16">
                {cart.length === 0 ? (
                    <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-100 shadow-sm p-12 flex flex-col items-center">
                        <p className="text-5xl mb-10 text-slate-300">🏛️</p>
                        <p className="text-3xl font-black text-slate-900 mb-8 uppercase italic tracking-tighter">Cart is Empty</p>
                        <Link to="/products" className="inline-block px-12 py-5 bg-orange-600 hover:bg-slate-900 text-white font-black rounded-full transition shadow-[0_0_30px_rgba(249,115,22,0.4)] uppercase tracking-widest text-[10px]">
                            Back to Shop →
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-16">

                        {/* ── LEFT: Forms ── */}
                        <div className="flex-1 space-y-12">

                            {/* CONTACT INFORMATION */}
                            <Section title="Contact Information">
                                <div className="grid grid-cols-2 gap-4 md:gap-8">
                                    <Field label="Full Name" name="fullName" placeholder="Enter your full name"
                                        formData={formData} errors={errors} handleChange={handleChange} />
                                    <Field label="Email Address" name="email" type="email" placeholder="example@email.com"
                                        formData={formData} errors={errors} handleChange={handleChange} />
                                    <Field label="Phone Number" name="phone" type="tel" placeholder="+92 XXX XXXXXXX"
                                        formData={formData} errors={errors} handleChange={handleChange} />
                                </div>
                            </Section>

                            {/* SHIPPING ADDRESS */}
                            <Section title="Shipping Address">
                                <div className="grid grid-cols-2 gap-4 md:gap-8">
                                    <div className="col-span-2">
                                        <Field label="Street Address" name="street" placeholder="House no, Street name, etc."
                                        formData={formData} errors={errors} handleChange={handleChange} />
                                    </div>
                                    <Field label="City" name="city" placeholder="e.g. Swat" half
                                        formData={formData} errors={errors} handleChange={handleChange} />
                                    <Field label="Province" name="province" placeholder="e.g. KPK" half
                                        formData={formData} errors={errors} handleChange={handleChange} />
                                    <Field label="Postal Code" name="postalCode" placeholder="e.g. 19130" half
                                        formData={formData} errors={errors} handleChange={handleChange} />
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 md:mb-3 ml-1">
                                            Country <span className="text-orange-600">*</span>
                                        </label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-slate-100 rounded-xl md:rounded-2xl text-slate-900 focus:outline-none focus:border-orange-600 transition-all text-sm font-semibold cursor-pointer"
                                        >
                                            {["Pakistan", "Afghanistan", "India", "UAE", "Saudi Arabia", "Other"].map((c) => (
                                                <option key={c} className="bg-white text-slate-900">{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </Section>

                            {/* ORDER ITEMS */}
                            <Section title={`Order Items (${cart.length})`}>
                                <div className="divide-y divide-slate-100">
                                    {cart.map((item) => {
                                        const itemPrice = item.discount
                                            ? item.price - (item.price * item.discount) / 100
                                            : item.price;
                                        return (
                                            <div key={item._id} className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-8 py-6 md:py-8 group relative overflow-hidden">
                                                 <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -rotate-45 translate-x-12 -translate-y-12 transition-colors opacity-0 group-hover:opacity-100 duration-500"></div>
                                                <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden bg-white flex-shrink-0 border border-slate-100 p-2 md:p-3 relative z-10">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-[1.5s]"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 relative z-10">
                                                    <p className="font-bold text-slate-900 text-base md:text-lg truncate group-hover:text-orange-600 transition-colors uppercase">{item.title}</p>
                                                    <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1 md:mt-2">
                                                        Qty: {item.quantity} • <span>${itemPrice.toFixed(2)} unit</span>
                                                    </p>
                                                </div>
                                                <p className="font-black text-slate-900 text-xl md:text-2xl flex-shrink-0 tracking-tighter relative z-10">
                                                    ${(itemPrice * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Section>

                            {/* PAYMENT METHOD */}
                            <Section title="Payment Method">
                                <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 p-6 md:p-10 bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[2.5rem] relative overflow-hidden group hover:border-orange-600 transition-all duration-500">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -rotate-45 translate-x-8 -translate-y-8"></div>
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-orange-600 transition-all duration-500 relative z-10">
                                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-orange-600 group-hover:bg-white transition-all" />
                                    </div>
                                    <div className="relative z-10 text-center sm:text-left">
                                        <p className="font-black text-slate-900 uppercase tracking-widest text-xs md:text-sm mb-1">Cash on Delivery</p>
                                        <p className="text-slate-500 text-[10px] md:text-xs font-medium tracking-tight">Pay securely in cash upon order delivery.</p>
                                    </div>
                                    <span className="sm:ml-auto text-3xl md:text-4xl grayscale group-hover:grayscale-0 transition-all duration-500 relative z-10">💵</span>
                                </div>
                                <p className="mt-6 md:mt-8 text-center text-slate-400 text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em] px-4 md:px-10">Secure Payment Gateway Active</p>
                            </Section>
                        </div>

                        {/* Summary */}
                        <div className="w-full lg:w-[450px] flex-shrink-0">
                            <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden sticky top-32 transition-all hover:shadow-2xl hover:shadow-orange-600/5 duration-500">
                                <div className="p-8 md:p-12 relative overflow-hidden">
                                    <h2 className="text-slate-900 font-bold text-[10px] uppercase tracking-[0.4em] mb-8 md:mb-12 text-center relative z-10">Order Summary</h2>
                                    
                                    <div className="space-y-4 md:space-y-6 mb-8 md:mb-12 relative z-10">
                                        <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Subtotal</span>
                                            <span className="text-slate-900 font-bold text-lg md:text-xl tracking-tighter italic">${totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-end pb-4 border-b border-slate-100 text-orange-600">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Shipping</span>
                                            <span className="font-bold text-xs md:text-sm uppercase tracking-widest italic">FREE</span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] mb-8 md:mb-12 border border-slate-100 relative z-10">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[9px] md:text-[10px] font-bold text-orange-600 uppercase tracking-[0.3em]">Order Total</span>
                                        </div>
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                            <span className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">${totalPrice.toFixed(2)}</span>
                                            <span className="text-slate-400 font-bold text-[9px] md:text-[10px] uppercase">USD</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 md:space-y-6 relative z-10">
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={loading}
                                            className="w-full py-5 md:py-6 bg-orange-600 hover:bg-slate-900 text-white font-black rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(249,115,22,0.4)] disabled:opacity-50 cursor-pointer uppercase tracking-widest text-[10px] md:text-xs group"
                                        >
                                            {loading ? "Processing..." : "Place Order →"}
                                        </button>
                                        <Link
                                            to="/cart"
                                            className="w-full flex items-center justify-center py-2 md:py-4 text-slate-400 hover:text-slate-900 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.3em] transition-colors"
                                        >
                                            Back to Cart
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Checkout;
