import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Contact = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            alert("Please fill out all fields before sending your message.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");

        setLoading(true);
        try {
            const response = await fetch("https://djbuys-backend.vercel.app/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    userId: user.id || null
                }),
            });

            if (response.ok) {
                setSubmitted(true);
                setFormData({ name: "", email: "", message: "" });
            } else {
                const data = await response.json();
                alert(data.message || "Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            alert("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />

            {/* Hero */}
            <section className="bg-white text-slate-900 pt-24 md:pt-32 pb-16 md:pb-20 px-6 text-center border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-orange-600/5 blur-[80px] md:blur-[120px] rounded-full"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mb-3 md:mb-4">Get in Touch</p>
                    <h1 className="text-4xl md:text-5xl lg:text-[60px] font-black mb-4 md:mb-6 tracking-tighter uppercase leading-[1.1]">Contact <span className="text-orange-600">Us</span></h1>
                    <p className="text-slate-600 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">Have a question, feedback, or need help? Our professional support team is here to assist you.</p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-24 px-6 bg-slate-50 flex-1">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase">Reach Out</h2>
                            <p className="text-slate-500 font-medium text-sm md:text-base">Multiple ways to connect with our team</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
                            {[
                                { icon: "📧", label: "Email", value: "support@djbuys.com", theme: "hover:border-orange-500/30" },
                                { icon: "📞", label: "Phone", value: "+92 (300) 123-4567", theme: "hover:border-blue-500/30" },
                                { icon: "📍", label: "Location", value: "Swat, Pakistan", theme: "hover:border-green-500/30" },
                                { icon: "🕐", label: "Support Hours", value: "24/7 Online Support", theme: "hover:border-purple-500/30" },
                            ].map((c) => (
                                <div key={c.label} className={`bg-white border border-slate-100 rounded-2xl md:rounded-3xl p-5 md:p-6 flex items-center gap-4 md:gap-6 transition-all duration-300 ${c.theme} group shadow-sm hover:shadow-md`}>
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl group-hover:scale-110 transition-transform">
                                        {c.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{c.label}</p>
                                        <p className="font-black text-slate-900 text-sm md:text-base tracking-tight truncate">{c.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2">
                        {submitted ? (
                            <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl p-8 md:p-16 text-center h-full flex flex-col items-center justify-center relative overflow-hidden group min-h-[500px]">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full group-hover:bg-green-500/10 transition-colors"></div>
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 border border-green-500/20 shadow-2xl">
                                    <svg className="w-10 h-10 md:w-12 md:h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Message Sent!</h2>
                                <p className="text-slate-600 mb-8 md:mb-10 max-w-sm mx-auto leading-relaxed font-medium text-sm md:text-base">Thank you for reaching out. Our support team will review your message and respond within 24 hours.</p>
                                <button onClick={() => setSubmitted(false)}
                                    className="px-10 md:px-12 py-4 md:py-5 bg-orange-600 hover:bg-slate-900 text-white font-black rounded-2xl transition-all duration-300 shadow-2xl shadow-orange-600/20 uppercase tracking-widest hover:scale-105 active:scale-95 cursor-pointer text-sm">
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl p-6 md:p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full"></div>
                                <div className="relative z-10">
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase">Send a Message</h2>
                                    <p className="text-slate-500 mb-8 md:mb-10 font-medium text-sm md:text-base">We'll get back to you as soon as possible</p>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                            <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                                            <input 
                                                type="text" 
                                                name="name" 
                                                value={formData.name} 
                                                onChange={handleChange} 
                                                required 
                                                placeholder="Enter your name" 
                                                className="w-full px-6 md:px-8 py-4 md:py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl md:rounded-[2rem] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-600/50 focus:bg-white transition-all duration-300 font-medium text-sm md:text-base" 
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                            <input 
                                                type="email" 
                                                name="email" 
                                                value={formData.email} 
                                                onChange={handleChange} 
                                                required 
                                                placeholder="Enter your email" 
                                                className="w-full px-6 md:px-8 py-4 md:py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl md:rounded-[2rem] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-600/50 focus:bg-white transition-all duration-300 font-medium text-sm md:text-base" 
                                            />
                                        </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Message Body</label>
                                            <textarea name="message" value={formData.message} onChange={handleChange} required rows={6}
                                                placeholder="How can we help you today?"
                                                className="w-full px-6 md:px-8 py-5 md:py-6 bg-slate-50 border-2 border-slate-100 rounded-2xl md:rounded-[2rem] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-600/50 focus:bg-white transition-all duration-300 font-medium resize-none shadow-inner text-sm md:text-base" />
                                        </div>
                                        <button type="submit" disabled={loading}
                                            className="w-full py-4 md:py-5 bg-orange-600 hover:bg-slate-900 text-white font-black rounded-2xl md:rounded-3xl transition-all duration-300 shadow-2xl shadow-orange-600/20 text-base md:text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50">
                                            {loading ? "Sending..." : "Send Secure Message →"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
