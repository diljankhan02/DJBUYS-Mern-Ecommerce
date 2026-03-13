import { useCart } from "../Context/CartContext";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Cart = () => {
    const { cart, removeFromCart, addToCart, clearCart, cartCount } = useCart();

    const totalPrice = cart.reduce((acc, item) => {
        const price = item.discount
            ? item.price - (item.price * item.discount) / 100
            : item.price;
        return acc + price * item.quantity;
    }, 0);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />

            {/* Header Area */}
            <div className="bg-white border-b border-slate-100 pt-20 md:pt-28 pb-8 md:pb-12 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className="text-orange-600 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mb-3 md:mb-4">Your Shopping Cart</p>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">
                            Your <span className="text-orange-600 font-medium">Cart</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-3">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full"></span>
                        {cartCount} Items in your cart
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
                {cart.length === 0 ? (
                    <div className="text-center py-20 md:py-40 bg-white rounded-[1.5rem] md:rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center relative overflow-hidden px-6">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -rotate-45 translate-x-12 -translate-y-12"></div>
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 md:mb-10 text-2xl md:text-4xl border border-slate-100">
                            📦
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 md:mb-6 tracking-tighter uppercase">Your Cart is Empty</h2>
                        <p className="text-slate-500 mb-8 md:mb-12 max-w-md mx-auto leading-relaxed font-medium uppercase tracking-widest text-[10px] md:text-xs">You haven't added any products to your cart yet.</p>
                        <Link to="/products"
                            className="w-full sm:w-auto px-12 md:px-16 py-4 md:py-6 bg-orange-600 hover:bg-slate-900 text-white font-black rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(249,115,22,0.4)] uppercase tracking-widest text-xs text-center">
                            Start Shopping →
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Selected Items */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">Cart Items</h2>
                                <button onClick={clearCart} className="text-slate-500 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer border-b border-transparent hover:border-red-500 pb-1">
                                    Clear Cart
                                </button>
                            </div>
                            
                            <div className="space-y-8">
                                {cart.map((item) => {
                                    const itemPrice = item.discount
                                        ? item.price - (item.price * item.discount) / 100
                                        : item.price;
                                    return (
                                        <div key={item._id}
                                            className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-600/5 group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -rotate-45 translate-x-12 -translate-y-12 transition-colors"></div>
                                            {/* Image Unit */}
                                            <div className="w-full md:w-32 lg:w-40 h-48 md:h-32 lg:h-40 rounded-xl md:rounded-[2rem] overflow-hidden bg-white flex-shrink-0 border border-slate-100 p-4 relative z-10">
                                                <img src={item.image} alt={item.title}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-[2s]" />
                                            </div>

                                            {/* Details Unit */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between relative z-10">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">{item.category}</span>
                                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.brand || 'D&J'}</span>
                                                    </div>
                                                    <h3 className="font-bold text-slate-900 text-xl md:text-2xl truncate mb-1 md:mb-2 tracking-tighter uppercase">{item.title}</h3>
                                                    <p className="text-slate-500 font-bold text-xs md:text-sm tracking-tight">${itemPrice.toFixed(2)} / unit</p>
                                                </div>

                                                <div className="flex items-center justify-between md:justify-start gap-6 mt-6 md:mt-8">
                                                    <div className="flex items-center gap-3 md:gap-4 bg-slate-50 p-1 md:p-1.5 rounded-full border border-slate-100">
                                                        <button onClick={() => removeFromCart(item._id)}
                                                            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-base md:text-xl transition-all cursor-pointer shadow-sm active:scale-90 border border-slate-200">
                                                            −
                                                        </button>
                                                        <span className="font-bold text-slate-900 text-base md:text-lg w-6 md:w-8 text-center tracking-tighter">{item.quantity}</span>
                                                        <button onClick={() => addToCart(item)}
                                                            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-base md:text-xl transition-all shadow-lg cursor-pointer active:scale-90">
                                                            +
                                                        </button>
                                                    </div>

                                                    <button onClick={() => removeFromCart(item._id)}
                                                        className="md:hidden w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center transition-all cursor-pointer border border-red-100 active:scale-90">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Item Total (Desktop) */}
                                            <div className="hidden md:flex text-right flex-col justify-between items-end border-l border-slate-100 pl-10 relative z-10">
                                                <div className="flex flex-col items-end">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                                    <p className="font-black text-slate-900 text-3xl tracking-tighter">${(itemPrice * item.quantity).toFixed(2)}</p>
                                                </div>
                                                <button onClick={() => removeFromCart(item._id)}
                                                    className="w-12 h-12 rounded-2xl bg-white hover:bg-red-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer group/del active:scale-90 border border-slate-200">
                                                    <svg className="w-5 h-5 transition-transform group-hover/del:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>

                                            {/* Item Total (Mobile) */}
                                            <div className="md:hidden flex justify-between items-center pt-6 border-t border-slate-50 relative z-10">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item Total</p>
                                                <p className="font-black text-slate-900 text-2xl tracking-tighter">${(itemPrice * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Summary */}
                        <div className="w-full lg:w-[450px] flex-shrink-0">
                            <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden sticky top-32">
                                <div className="p-8 md:p-12 relative overflow-hidden">
                                    <h2 className="text-slate-900 font-bold text-[10px] uppercase tracking-[0.4em] mb-8 md:mb-12 text-center relative z-10">Order Summary</h2>
                                    
                                    <div className="space-y-4 md:space-y-6 mb-8 md:mb-12 relative z-10">
                                        <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Subtotal</span>
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
                                        <Link to="/checkout"
                                            className="w-full flex items-center justify-center py-5 md:py-6 bg-orange-600 hover:bg-slate-900 text-white font-black rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(249,115,22,0.4)] text-[10px] md:text-xs uppercase tracking-widest group">
                                            Proceed to Checkout <span className="ml-3 transition-transform group-hover:translate-x-2">→</span>
                                        </Link>
                                        <Link to="/products"
                                            className="w-full flex items-center justify-center py-2 md:py-4 text-slate-400 hover:text-slate-900 font-bold text-[9px] md:text-[10px] uppercase tracking-widest transition-colors">
                                            Continue Shopping
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

export default Cart;
