import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useCart } from "../Context/CartContext";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, decreaseQty, cart } = useCart();

    const [product, setProduct]   = useState(null);
    const [related, setRelated]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [imgError, setImgError] = useState(false);

    const getQty = (productId) => {
        const item = cart.find((i) => i._id === productId);
        return item ? item.quantity : 0;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setImgError(false);
            try {
                // Fetch the product and all products in parallel
                const [productRes, allRes] = await Promise.all([
                    axios.get(`https://djbuys-backend.vercel.app/api/products/${id}`),
                    axios.get("https://djbuys-backend.vercel.app/api/products"),
                ]);
                const fetched = productRes.data;
                setProduct(fetched);
                
                const rel = allRes.data
                    .filter((p) => p.category === fetched.category && p._id !== fetched._id)
                    .slice(0, 4);
                setRelated(rel);
            } catch {
                navigate("/products");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);  

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-14 w-14 border-4 border-orange-600 border-t-transparent" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) return null;

    const discountedPrice = product.discount
        ? (product.price - (product.price * product.discount) / 100)
        : null;

    const qty = getQty(product._id);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />

            {/* Premium Breadcrumb */}
            <div className="bg-white border-b border-slate-100 py-6 px-6">
                <div className="max-w-6xl mx-auto flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <Link to="/products" className="hover:text-orange-600 transition-colors">Products</Link>
                    <span className="opacity-30">/</span>
                    <span className="">{product.category}</span>
                    {product.subCategory && <>
                        <span className="opacity-30">/</span>
                        <span className="">{product.subCategory}</span>
                    </>}
                    <span className="opacity-30">/</span>
                    <span className="text-slate-900 truncate max-w-xs">{product.title}</span>
                </div>
            </div>

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">

                {/* ── Product Detail ── */}
                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden mb-24 lg:mb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                        {/* Visual Panel */}
                        <div className="relative bg-white flex items-center justify-center overflow-hidden group min-h-[500px]">
                            {product.discount && (
                                <span className="absolute top-10 left-10 z-10 bg-orange-600 text-white text-[10px] font-bold px-5 py-2.5 rounded-xl shadow-xl uppercase tracking-widest">
                                    {product.discount}% Off
                                </span>
                            )}
                            {!imgError ? (
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    onError={() => setImgError(true)}
                                    className="w-full h-full object-cover max-h-[700px] transform group-hover:scale-105 transition-transform duration-[2.5s]"
                                />
                            ) : (
                                <div className="text-slate-300 text-7xl flex flex-col items-center gap-4">
                                    <p>🖼️</p>
                                    <p className="text-xs font-bold uppercase tracking-widest">Image Unavailable</p>
                                </div>
                            )}
                        </div>

                      
                        <div className="p-10 md:p-20 flex flex-col justify-between">
                            <div>
                                {/* Category Header */}
                                <div className="flex items-center gap-4 mb-10">
                                    <span className="text-orange-600 font-bold uppercase tracking-widest text-[10px]">
                                        {product.category}
                                    </span>
                                    {product.subCategory && (
                                        <>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                                {product.subCategory}
                                            </span>
                                        </>
                                    )}
                                </div>

                             
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tighter uppercase">
                                    {product.title}
                                </h1>

                                {/* Price Specification */}
                                <div className="flex flex-col gap-2 mb-12">
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-5xl font-black text-slate-900 tracking-tighter">
                                            ${discountedPrice !== null ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
                                        </span>
                                        {product.discount && (
                                            <span className="text-xl text-slate-500 line-through font-bold">
                                                ${product.price.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {product.discount && (
                                        <p className="text-[11px] font-bold text-orange-600 uppercase tracking-widest">
                                            Special Offer • Saved ${(product.price - discountedPrice).toFixed(2)}
                                        </p>
                                    )}
                                </div>

                               
                                <div className="mb-12 border-t border-slate-100 pt-10">
                                    <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Description</h2>
                                    <p className="text-slate-600 leading-relaxed text-lg font-medium max-w-md">{product.description}</p>
                                </div>
                            </div>

                            {/* Purchase Unit */}
                            <div className="space-y-6">
                                {qty === 0 ? (
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-full py-4 bg-orange-600 hover:bg-slate-900 text-white rounded-[1rem] font-black text-xs transition-all duration-500 cursor-pointer shadow-xl shadow-orange-600/20 uppercase tracking-widest flex items-center justify-center gap-3"
                                    >
                                        Add to Cart <span>→</span>
                                    </button>
                                ) : (
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Quantity</p>
                                        <div className="flex items-center justify-center gap-8">
                                            <button
                                                onClick={() => decreaseQty(product._id)}
                                                className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-red-50 text-slate-900 hover:text-red-600 font-bold text-lg flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-90"
                                            >
                                                −
                                            </button>
                                            <span className="text-2xl font-black text-slate-900 w-10 text-center tracking-tighter">{qty}</span>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => navigate("/products")}
                                    className="w-full flex items-center justify-center py-4 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                                >
                                    Back to Products
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Other Products ── */}
                {related.length > 0 && (
                    <section>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div className="max-w-md">
                                <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mb-4">You Might Also Like</p>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase whitespace-nowrap">
                                    Other <span className="text-orange-600">Products</span>
                                </h2>
                            </div>
                            <div className="h-px w-full bg-slate-200 hidden md:block"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {related.map((rel) => {
                                const relPrice = rel.discount
                                    ? (rel.price - (rel.price * rel.discount) / 100).toFixed(2)
                                    : null;
                                const relQty = getQty(rel._id);
                                return (
                                    <div key={rel._id}
                                        className="group flex flex-col transition-all duration-500">
                                        <div
                                            className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-white cursor-pointer border border-slate-100 transition-all duration-700 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] group-hover:-translate-y-2"
                                            onClick={() => navigate(`/product/${rel._id}`)}
                                        >
                                            <img src={rel.image} alt={rel.title}
                                                className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[2s]" />
                                            {rel.discount && (
                                                <span className="absolute top-6 left-6 bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg">
                                                    -{rel.discount}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="pt-6 px-2 flex flex-col flex-1">
                                            <h3
                                                className="font-black text-slate-900 text-sm line-clamp-1 mb-2 cursor-pointer hover:text-orange-600 transition-colors uppercase tracking-widest"
                                                onClick={() => navigate(`/product/${rel._id}`)}
                                            >
                                                {rel.title}
                                            </h3>
                                            <div className="flex items-center justify-between mt-auto pt-4">
                                                <p className="font-black text-slate-500 text-sm tracking-tighter">
                                                    ${relPrice ?? rel.price.toFixed(2)}
                                                </p>
                                                {relQty === 0 ? (
                                                    <button
                                                        onClick={() => navigate(`/product/${rel._id}`)}
                                                        className="text-[10px] font-black text-orange-600 hover:text-slate-900 uppercase tracking-widest transition-colors cursor-pointer"
                                                    >
                                                        Details →
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-3 bg-slate-100 px-2 py-1 rounded-lg">
                                                        <button onClick={() => decreaseQty(rel._id)}
                                                            className="text-slate-400 hover:text-red-500 font-black">-</button>
                                                        <span className="text-[10px] font-black text-slate-900">{relQty}</span>
                                                        <button onClick={() => addToCart(rel)}
                                                            className="text-slate-400 hover:text-orange-600 font-black">+</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetail;
