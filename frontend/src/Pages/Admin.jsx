import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const categoriesInfo = {
    "Men": ["Clothing", "Footwear", "Watches", "Accessories", "Fragrance"],
    "Women": ["Clothing", "Footwear", "Handbags", "Makeup", "Fragrance", "Jewelry"],
    "Electronics": ["Mobiles", "Laptops", "Audio", "Accessories"],
    "Home & Kitchen": ["Living Room", "Kitchenware", "Decor"],
    "Beauty & Grooming": ["Skincare", "Haircare", "Bath & Body"]
};

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState("");
    const [editProduct, setEditProduct] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", price: "", category: "", subCategory: "", discount: "" });
    const [imageFile, setImageFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [activeTab, setActiveTab] = useState("products"); 
    const [replyTexts, setReplyTexts] = useState({}); 

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/products");
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/messages", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        }
    };

    useEffect(() => { 
        fetchProducts(); 
        fetchMessages();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccess("");
        const data = new FormData();
        Object.entries(formData).forEach(([k, v]) => { if (v) data.append(k, v); });
        if (imageFile) data.append("image", imageFile);

        const token = localStorage.getItem("token");
        const authHeaders = {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        };

        try {
            if (editProduct) {
                await axios.put(`http://localhost:5000/api/products/${editProduct._id}`, data, { headers: authHeaders });
                setSuccess("✅ Success: Product updated.");
                setEditProduct(null);
            } else {
                await axios.post("http://localhost:5000/api/products", data, { headers: authHeaders });
                setSuccess("✅ Success: Product added to store.");
            }
            setFormData({ title: "", description: "", price: "", category: "", subCategory: "", discount: "" });
            setImageFile(null);
            fetchProducts();
            setTimeout(() => setSuccess(""), 5000);
        } catch {
            alert("Error: Failed to save product.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setFormData({ title: product.title, description: product.description, price: product.price, category: product.category, subCategory: product.subCategory || "", discount: product.discount || "" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`Delete "${product.title}" permanently?`)) return;

        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:5000/api/products/${product._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccess(`🗑️ Success: "${product.title}" deleted.`);
            setTimeout(() => setSuccess(""), 5000);
            if (editProduct && editProduct._id === product._id) {
                setEditProduct(null);
                setFormData({ title: "", description: "", price: "", category: "", subCategory: "", discount: "" });
            }
            fetchProducts();
        } catch {
            alert("Error: Failed to delete product.");
        }
    };

    const handleMessageDelete = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:5000/api/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(messages.filter(m => m._id !== id));
            setSuccess("🗑️ Message Deleted.");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            alert("Error: Failed to delete message.");
        }
    };

    const handleReplySubmit = async (messageId) => {
        const text = replyTexts[messageId];
        if (!text || !text.trim()) return;

        const token = localStorage.getItem("token");
        try {
            const res = await axios.post(`http://localhost:5000/api/messages/${messageId}/chat`, 
                { text: text.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setMessages(messages.map(m => 
                m._id === messageId ? res.data.updatedMessage : m
            ));
            
            setSuccess("✅ Reply Sent.");
            setTimeout(() => setSuccess(""), 3000);
            
            setReplyTexts(prev => {
                const updated = { ...prev };
                delete updated[messageId];
                return updated;
            });
        } catch (err) {
            alert("Error: Failed to send reply.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#020617] text-white">
            <Navbar />

          
            <div className="bg-[#020617] border-b border-white/5 pt-32 pb-16 px-6 relative overflow-hidden">
               
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div>
                        <p className="text-orange-600 font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Store Management</p>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
                            Admin <span className="text-slate-500 not-italic">Dashboard</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-4">
                            {activeTab === "products" ? "Update Products" : "Customer Support"}
                        </p>
                    </div>
                    
                    {/* Tab Navigation */}
                    <div className="flex bg-white/5 p-1.5 rounded-[2rem] border border-white/10 self-start shadow-2xl backdrop-blur-md">
                        <button 
                            onClick={() => setActiveTab("products")}
                            className={`px-8 py-4 rounded-[1.5rem] font-black transition-all duration-500 flex items-center gap-3 cursor-pointer ${
                                activeTab === "products" 
                                ? "bg-orange-600 text-white shadow-[0_0_25px_rgba(249,115,22,0.4)]" 
                                : "text-slate-500 hover:text-white"
                            }`}
                        >
                            📦 <span className="text-xs uppercase tracking-widest">Products</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black ${activeTab === "products" ? "bg-black/20" : "bg-white/10"}`}>{products.length}</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab("messages")}
                            className={`px-8 py-4 rounded-[1.5rem] font-black transition-all duration-500 flex items-center gap-3 cursor-pointer ${
                                activeTab === "messages" 
                                ? "bg-orange-600 text-white shadow-[0_0_25px_rgba(249,115,22,0.4)]" 
                                : "text-slate-500 hover:text-white"
                            }`}
                        >
                            📩 <span className="text-xs uppercase tracking-widest">Messages</span>
                            {messages.length > 0 && (
                                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-lg font-black animate-pulse">{messages.length}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
                {activeTab === "products" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
                        {/* Add/Edit Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/5 rounded-[3rem] shadow-sm border border-white/5 overflow-hidden sticky top-32 group hover:shadow-2xl hover:shadow-orange-600/5 transition-all duration-700">
                                <div className="bg-white/5 px-10 py-8 border-b border-white/5">
                                    <h2 className="text-white font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-4">
                                        <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                                        {editProduct ? "Edit Product" : "Add New Product"}
                                    </h2>
                                </div>
                                <div className="p-10">
                                    {success && activeTab === "products" && (
                                        <div className="bg-orange-600/10 border border-orange-600/20 text-orange-500 px-6 py-4 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-widest animate-bounce">
                                            {success}
                                        </div>
                                    )}
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Product Name *</label>
                                            <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Product name..."
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:border-orange-600 focus:bg-white/10 transition-all font-bold text-sm" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Category *</label>
                                                <select 
                                                    name="category" 
                                                    value={formData.category} 
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value, subCategory: "" })} 
                                                    required
                                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-orange-600 transition-all font-bold text-sm cursor-pointer"
                                                >
                                                    <option value="" disabled className="bg-[#020617]">Select...</option>
                                                    {Object.keys(categoriesInfo).map(cat => (
                                                        <option key={cat} value={cat} className="bg-[#020617]">{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Subcategory *</label>
                                                <select 
                                                    name="subCategory" 
                                                    value={formData.subCategory} 
                                                    onChange={handleChange} 
                                                    required
                                                    disabled={!formData.category}
                                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-orange-600 transition-all font-bold text-sm disabled:opacity-30 cursor-pointer"
                                                >
                                                    <option value="" disabled className="bg-[#020617]">Select...</option>
                                                    {formData.category && categoriesInfo[formData.category]?.map(sub => (
                                                        <option key={sub} value={sub} className="bg-[#020617]">{sub}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Description *</label>
                                            <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} placeholder="Product description..."
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:border-orange-600 focus:bg-white/10 transition-all resize-none font-bold text-sm" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Price ($) *</label>
                                                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" placeholder="0.00"
                                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:border-orange-600 transition-all font-bold text-sm" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Discount (%)</label>
                                                <input type="number" name="discount" value={formData.discount} onChange={handleChange} min="0" max="100" placeholder="0"
                                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:border-orange-600 transition-all font-bold text-sm" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Product Image</label>
                                            <div className="relative group/file">
                                                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
                                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 focus:outline-none border-dashed hover:border-orange-600 transition-all text-xs font-bold cursor-pointer file:hidden" />
                                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover/file:text-orange-600 transition-colors">
                                                    {imageFile ? imageFile.name : "Upload Image"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 pt-4">
                                            <button type="submit" disabled={submitting}
                                                className="flex-1 py-6 bg-orange-600 hover:bg-white hover:text-orange-600 text-white font-black rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(249,115,22,0.4)] disabled:opacity-50 text-[10px] uppercase tracking-[0.3em] cursor-pointer">
                                                {submitting ? "Saving..." : editProduct ? "Save Changes" : "Save Product"}
                                            </button>
                                            {editProduct && (
                                                <button type="button"
                                                    onClick={() => { setEditProduct(null); setFormData({ title: "", description: "", price: "", category: "", subCategory: "", discount: "" }); }}
                                                    className="px-8 py-6 border border-white/10 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all text-[10px] uppercase tracking-widest cursor-pointer">
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Grid: Matrix Display */}
                        <div className="lg:col-span-3">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="font-black text-[10px] text-slate-500 uppercase tracking-[0.4em]">Products List ({products.length})</h2>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-40 gap-6">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
                                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] animate-pulse">Loading Products...</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-white/5 flex flex-col items-center">
                                    <span className="text-6xl mb-10 opacity-20">📦</span>
                                    <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">No Products Found</p>
                                </div>
                            ) : (
                                <div className="space-y-6 max-h-[1000px] overflow-y-auto pr-4 custom-scrollbar">
                                    {products.map((product) => (
                                        <div key={product._id}
                                            className="bg-white/5 rounded-[2.5rem] border border-white/5 p-6 flex gap-8 hover:bg-white/[0.07] hover:border-orange-600/30 transition-all duration-500 group relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] -rotate-45 translate-x-12 -translate-y-12 rounded-full group-hover:bg-orange-600/5 transition-colors duration-1000"></div>
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white flex-shrink-0 border border-white/10 p-4 transition-transform group-hover:scale-105 duration-700">
                                                <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-[9px] font-black bg-orange-600 text-white px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">{product.category}</span>
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{product.subCategory}</span>
                                                </div>
                                                <h3 className="font-bold text-white text-xl truncate tracking-tight uppercase group-hover:text-orange-600 transition-colors uppercase italic">{product.title}</h3>
                                                <div className="flex items-center gap-4 mt-3">
                                                    <span className="font-black text-white text-2xl tracking-tighter">${product.price.toFixed(2)}</span>
                                                    {product.discount && (
                                                        <span className="text-[9px] bg-red-600 text-white font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.3)]">-{product.discount}% OFF</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3 justify-center relative z-10 w-24">
                                                <button onClick={() => handleEdit(product)}
                                                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-orange-600 text-slate-500 hover:text-white border border-white/10 flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer active:scale-90">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(product)}
                                                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-red-600 text-slate-500 hover:text-white border border-white/10 flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer active:scale-90">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                     <div className="animate-in slide-in-from-bottom-10 duration-700">
                         <div className="flex items-center justify-between mb-12">
                             <div>
                                 <h2 className="font-black text-4xl text-white tracking-tighter uppercase italic">Customer <span className="text-slate-500 not-italic">Support</span></h2>
                                 <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Manage customer inquiries</p>
                             </div>
                            {messages.length > 0 && (
                                <span className="bg-orange-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                                    {messages.length} Active Messages
                                </span>
                            )}
                        </div>
                        
                        {success && activeTab === "messages" && (
                            <div className="bg-orange-600/10 border border-orange-600/20 text-orange-500 px-6 py-4 rounded-2xl mb-12 text-[10px] font-black uppercase tracking-widest animate-bounce">
                                {success}
                            </div>
                        )}

                        {messages.length === 0 ? (
                            <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-white/5 flex flex-col items-center">
                                <span className="text-6xl mb-10 opacity-20">📭</span>
                                <h3 className="text-xl font-black text-white uppercase tracking-widest">No Messages</h3>
                                <p className="text-slate-500 mt-4 font-bold text-xs uppercase tracking-widest">Inbox is currently empty.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                                {messages.map((m) => (
                                    <div key={m._id} className="bg-white/5 rounded-[3rem] border border-white/5 p-10 shadow-sm hover:shadow-2xl hover:shadow-orange-600/5 transition-all duration-700 group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-2 h-full bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white/5 border border-white/10 text-orange-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                                                    {m.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-white text-xl tracking-tight uppercase italic">{m.name}</h3>
                                                    <p className="text-orange-600 text-[10px] font-bold uppercase tracking-widest mt-1">{m.email}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleMessageDelete(m._id)}
                                                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-600 text-slate-500 hover:text-white transition-all cursor-pointer flex items-center justify-center group/del"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                            {m.conversation.map((chat, idx) => (
                                                <div key={idx} className={`flex ${chat.sender === "admin" ? "justify-end" : "justify-start"}`}>
                                                    <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm shadow-xl ${
                                                        chat.sender === "admin" 
                                                        ? "bg-orange-600 text-white rounded-tr-none shadow-orange-600/20" 
                                                        : "bg-white/5 text-slate-300 rounded-tl-none border border-white/10"
                                                    }`}>
                                                        <p className="leading-relaxed font-bold italic tracking-tight">{chat.text}</p>
                                                        <div className={`flex items-center gap-2 mt-3 ${chat.sender === "admin" ? "text-white/60" : "text-slate-500"} text-[9px] font-black uppercase tracking-widest`}>
                                                            <span>{chat.sender === "admin" ? "ADMIN" : "CUSTOMER"}</span>
                                                            <span className="w-1 h-1 rounded-full bg-current opacity-30"></span>
                                                            <span>{new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Reply Module */}
                                        <div className="space-y-4">
                                            <textarea 
                                                placeholder="Write your reply..."
                                                value={replyTexts[m._id] || ""}
                                                onChange={(e) => setReplyTexts({ ...replyTexts, [m._id]: e.target.value })}
                                                className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-sm focus:outline-none focus:border-orange-600 focus:bg-white/10 transition-all resize-none min-h-[120px] font-bold text-white placeholder-slate-700"
                                            />
                                            <button 
                                                onClick={() => handleReplySubmit(m._id)}
                                                disabled={!replyTexts[m._id]?.trim()}
                                                className="w-full py-6 bg-orange-600 text-white text-[10px] font-black rounded-full hover:bg-white hover:text-orange-600 transition-all duration-500 shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-30 cursor-pointer uppercase tracking-[0.4em]"
                                            >
                                                Send Reply
                                            </button>
                                        </div>

                                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] text-center mt-8 pt-8 border-t border-white/5">
                                            Received: {new Date(m.createdAt).toLocaleDateString()} // {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Admin;
