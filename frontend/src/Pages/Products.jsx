import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useCart } from "../Context/CartContext";

const categoriesInfo = {
    "All Products": [],
    "Men": ["Clothing", "Footwear", "Watches", "Accessories", "Fragrance"],
    "Women": ["Clothing", "Footwear", "Handbags", "Makeup", "Fragrance", "Jewelry"],
    "Electronics": ["Mobiles", "Laptops", "Audio", "Accessories"],
    "Home & Kitchen": ["Living Room", "Kitchenware", "Decor"],
    "Beauty & Grooming": ["Skincare", "Haircare", "Bath & Body"]
};

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Products");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const { addToCart, removeFromCart, decreaseQty, cart } = useCart();
 
    // Carousel logic
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        { image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" }, 
        { image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" }, 
        { image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" }  
    ];
 
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("https://djbuys-backend.vercel.app/api/products");
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Get quantity of a product already in cart (0 if not in cart)
    const getQty = (productId) => {
        const item = cart.find((i) => i._id === productId);
        return item ? item.quantity : 0;
    };

    const filtered = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                              p.category.toLowerCase().includes(search.toLowerCase()) ||
                              (p.subCategory && p.subCategory.toLowerCase().includes(search.toLowerCase()));
        
        const matchesMainCategory = selectedCategory === "All Products" || p.category === selectedCategory;
        const matchesSubCategory = !selectedSubCategory || p.subCategory === selectedSubCategory;

        return matchesSearch && matchesMainCategory && matchesSubCategory;
    });

    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        setSelectedSubCategory(""); 
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />

         
            <section className="relative h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden bg-white">
                
                
                {slides.map((slide, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
                    >
                        <div 
                            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[10s] ease-linear"
                            style={{ 
                                backgroundImage: `url(${slide.image})`,
                                transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)'
                            }}
                        ></div>
                       
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/20 to-transparent"></div>
                    </div>
                ))}
 
                <div className="max-w-7xl mx-auto w-full px-6 relative z-10 text-center">
                   
                    <div 
                        key={currentSlide}
                        className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out"
                    >
                        <p className="text-orange-600 font-bold uppercase tracking-[0.4em] text-[8px] md:text-[10px] mb-3 md:mb-4 shadow-black drop-shadow-md">Browse Products</p>
                        <h1 className="text-3xl md:text-6xl lg:text-[68px] font-black mb-4 md:mb-6 tracking-tighter text-white uppercase drop-shadow-2xl">
                            Our <span className="text-orange-600 italic">Products</span>
                        </h1>
                        <p className="text-white/80 mb-8 md:mb-12 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg px-4">
                            Discover a wide range of quality products curated for your daily needs.
                        </p>
                    </div>

                    
                    <div className="relative max-w-2xl mx-auto group px-4 sm:px-0">
                        <div className="absolute inset-y-0 left-4 sm:left-0 pl-4 sm:pl-8 flex items-center pointer-events-none z-10">
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-focus-within:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-6 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/40 focus:outline-none text-base sm:text-lg font-semibold focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 transition-all shadow-2xl focus:shadow-orange-600/20"
                        />
                    </div>
                </div>
 
                {/* Navigation Dots */}
                <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
                    {slides.map((_, index) => (
                        <button 
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`transition-all duration-700 rounded-full h-1 md:h-1.5 ${
                                index === currentSlide 
                                    ? "w-8 md:w-12 bg-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.8)]" 
                                    : "w-4 md:w-6 bg-white/20 hover:bg-white/40"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 flex flex-col md:flex-row gap-12">
                
                {/* 🗂️ Boutique Sidebar */}
                <aside className="w-full md:w-72 flex-shrink-0">
                    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 p-4 md:p-8 md:sticky md:top-28 shadow-sm overflow-hidden">
                        <h2 className="hidden md:block font-black text-xs uppercase tracking-[0.3em] text-slate-400 mb-8">Categories</h2>
                        
                        {/* Mobile Categories (Horizontal Scroll) */}
                        <div className="flex md:hidden overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth">
                            <button 
                                onClick={() => handleCategoryClick("All Products")}
                                className={`whitespace-nowrap px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
                                    selectedCategory === "All Products" 
                                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                                    : "bg-slate-50 text-slate-400"
                                }`}
                            >
                                All Products
                            </button>
                            {Object.keys(categoriesInfo).map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => handleCategoryClick(cat)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
                                        selectedCategory === cat 
                                        ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                                        : "bg-slate-50 text-slate-400"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Desktop Categories (Vertical List) */}
                        <ul className="hidden md:block space-y-2">
                                            <button 
                                                onClick={() => handleCategoryClick("All Products")}
                                                className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 font-black text-xs uppercase tracking-widest flex items-center justify-between ${
                                                    selectedCategory === "All Products" 
                                                    ? "bg-orange-600 text-white shadow-[0_0_30px_rgba(249,115,22,0.4)]" 
                                                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                                                }`}
                                            >
                                                <span>All Products</span>
                                                <span className="opacity-40">→</span>
                                            </button>
                            {Object.keys(categoriesInfo).map(cat => (
                                <li key={cat}>
                                    <button 
                                        onClick={() => handleCategoryClick(cat)}
                                        className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 font-black text-xs uppercase tracking-widest flex items-center justify-between group ${
                                            selectedCategory === cat 
                                            ? "bg-orange-600 text-white shadow-[0_0_30px_rgba(249,115,22,0.4)]" 
                                            : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                                        }`}
                                    >
                                        <span>{cat}</span>
                                        {categoriesInfo[cat].length > 0 && (
                                            <svg 
                                                className={`w-4 h-4 transition-transform duration-300 ${selectedCategory === cat ? 'rotate-90 text-white' : 'text-slate-300 group-hover:text-orange-600'}`} 
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </button>
                                    
                                    {/* Subcategories */}
                                    <div className={`overflow-hidden transition-all duration-500 ${selectedCategory === cat && categoriesInfo[cat].length > 0 ? 'max-h-96 opacity-100 mt-4 mb-4' : 'max-h-0 opacity-0'}`}>
                                        <div className="pl-6 space-y-3 flex flex-col border-l-2 border-slate-100 ml-4">
                                            {categoriesInfo[cat].map(sub => (
                                                <button 
                                                    key={sub}
                                                    onClick={() => setSelectedSubCategory(sub)}
                                                    className={`text-left transition-all duration-200 text-[11px] font-black uppercase tracking-widest ${
                                                        selectedSubCategory === sub 
                                                        ? "text-orange-600" 
                                                        : "text-slate-500 hover:text-slate-900 hover:pl-2"
                                                    }`}
                                                >
                                                    {sub}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        
                        {/* Mobile Subcategories (Horizontal Scroll) */}
                        {selectedCategory !== "All Products" && categoriesInfo[selectedCategory]?.length > 0 && (
                            <div className="flex md:hidden overflow-x-auto pb-2 gap-2 no-scrollbar border-t border-slate-50 pt-4 mt-2">
                                {categoriesInfo[selectedCategory].map(sub => (
                                    <button 
                                        key={sub}
                                        onClick={() => setSelectedSubCategory(sub)}
                                        className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wider transition-all ${
                                            selectedSubCategory === sub 
                                            ? "bg-orange-100 text-orange-600 border border-orange-200" 
                                            : "bg-white text-slate-400 border border-slate-100"
                                        }`}
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>

                {/* 🛍️ Collection Grid */}
                <main className="flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                            <div className="relative w-16 h-16 mb-8">
                                <div className="absolute inset-0 border-[3px] border-slate-100 rounded-full"></div>
                                <div className="absolute inset-0 border-[3px] border-orange-600 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Loading Products...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm flex flex-col items-center justify-center">
                            <p className="text-6xl mb-8 opacity-40 grayscale">🏷️</p>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">No Matching Products</h3>
                            <p className="text-slate-600 max-w-sm mx-auto mb-10 font-medium">
                                {search || selectedSubCategory || selectedCategory !== "All Products" 
                                    ? "Your search didn't match any products in our store." 
                                    : "We are currently adding new products. Please visit again soon."}
                            </p>
                            {(search || selectedCategory !== "All Products") && (
                                <button 
                                    onClick={() => { setSearch(""); setSelectedCategory("All Products"); setSelectedSubCategory(""); }}
                                    className="px-8 py-4 bg-orange-600 hover:bg-white hover:text-orange-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full transition-all duration-500"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-12 pb-6 border-b border-slate-100">
                                <div className="flex items-baseline gap-4">
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                                        {selectedSubCategory || selectedCategory}
                                    </h2>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filtered.length} Items</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filtered.map((product) => {
                                const discountedPrice = product.discount
                                    ? (product.price - (product.price * product.discount) / 100).toFixed(2)
                                    : null;
                                const qty = getQty(product._id);

                                return (
                                    <div key={product._id}
                                        className="group flex flex-col transition-all duration-500"
                                    >
                                       
                                        <div 
                                            className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white cursor-pointer border border-slate-100 transition-all duration-700 group-hover:shadow-[0_0_50px_rgba(249,115,22,0.15)] group-hover:-translate-y-2"
                                            onClick={() => navigate(`/product/${product._id}`)}
                                        >
                                            <img src={product.image} alt={product.title}
                                                className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-out" 
                                            />
                                            {product.discount && (
                                                <div className="absolute top-6 left-6 z-20 bg-orange-600 text-white text-[9px] font-black px-4 py-2 rounded-lg shadow-lg uppercase tracking-widest">
                                                    -{product.discount}%
                                                </div>
                                            )}
                                           
                                            <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                                                    className="w-full bg-orange-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:text-orange-600 transition-all"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>

                                        
                                        <div className="pt-8 px-2 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 opacity-80">{product.category}</p>
                                                    <h3 
                                                        className="text-lg font-black text-slate-900 line-clamp-1 cursor-pointer hover:text-orange-600 transition-colors tracking-tighter"
                                                        onClick={() => navigate(`/product/${product._id}`)}
                                                    >
                                                        {product.title}
                                                    </h3>
                                                </div>
                                                <div className="text-right flex flex-col items-end">
                                                    <p className="text-lg font-black text-slate-900 leading-none">
                                                        ${discountedPrice ?? product.price.toFixed(2)}
                                                    </p>
                                                    {product.discount && (
                                                        <p className="text-[10px] font-black text-slate-400 line-through mt-1">
                                                            ${product.price.toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                           
                                            <div className="mt-4">
                                                {qty === 0 ? (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                        className="w-full py-3 rounded-xl text-[10px] font-black bg-orange-600 hover:bg-slate-900 text-white shadow-lg shadow-orange-600/20 transition-all duration-500 cursor-pointer uppercase tracking-widest flex items-center justify-center gap-2"
                                                    >
                                                        <span className="text-xs uppercase tracking-wider text-white">Add to Cart</span>
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); decreaseQty(product._id); }}
                                                            className="flex-1 h-11 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-lg flex items-center justify-center transition-colors cursor-pointer"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-12 text-center font-black text-slate-900 text-sm">{qty}</span>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                            className="flex-1 h-11 rounded-xl bg-orange-600 text-white font-black text-lg flex items-center justify-center transition-all cursor-pointer hover:bg-orange-700"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Products;
