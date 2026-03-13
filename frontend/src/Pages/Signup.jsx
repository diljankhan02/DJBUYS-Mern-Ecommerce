import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const { name, email, password } = formData;

        
        if (!name.trim()) {
            setError("Full Name is required.");
            return;
        }
        if (!email.trim()) {
            setError("Email address is required.");
            return;
        }
        if (!password.trim()) {
            setError("Password is required.");
            return;
        }

       
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        
        if (password.trim().length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:5000/api/auth/signup", {
                name: name.trim(),
                email: email.trim(),
                password: password.trim()
            });
            navigate("/signin");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#020617] text-white">
            
            <div className="hidden lg:flex flex-1 bg-white/5 items-center justify-center p-20 relative overflow-hidden border-r border-white/5">
                
                <div className="relative z-10 max-w-lg text-center lg:text-left">
                    <p className="text-orange-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6">Join Us</p>
                    <h1 className="text-7xl font-black text-white mb-8 tracking-tighter leading-none">
                        DJ<span className="text-orange-600 italic font-medium">Buys</span>
                    </h1>
                    <p className="text-slate-400 text-xl mb-16 font-medium leading-relaxed">Create an account to start shopping, track orders, and get exclusive offers.</p>
                    
                    <div className="space-y-8">
                        {[
                            { icon: "✨", title: "Great Selection", text: "Find exactly what you are looking for." },
                            { icon: "🛡️", title: "Secure Shopping", text: "Your data and payments are always safe." },
                            { icon: "⚡", title: "Fast Shipping", text: "Get your orders delivered quickly." },
                            { icon: "💎", title: "Reliable Support", text: "Our team is here to help you." }
                        ].map(t => (
                            <div key={t.title} className="flex items-start gap-6 group">
                                <span className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-110">{t.icon}</span>
                                <div>
                                    <h3 className="font-black text-white uppercase tracking-widest text-[10px] mb-1">{t.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium">{t.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative bg-[#020617]">
               
                <Link to="/" className="absolute top-10 left-10 lg:left-16 flex items-center gap-4 text-slate-500 hover:text-orange-600 transition-all font-black text-[10px] uppercase tracking-[0.3em] group">
                    <span className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">←</span>
                    Back to Home
                </Link>

                <div className="w-full max-w-md">
                    <div className="text-center lg:text-left mb-12">
                        <Link to="/" className="lg:hidden text-4xl font-black text-white mb-6 block tracking-tighter">
                            DJ<span className="text-orange-600">Buys</span>
                        </Link>
                        <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">Create an Account</h2>
                        <p className="text-slate-500 font-medium">Please fill in the details below to sign up.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-8 text-sm font-semibold flex items-center gap-3">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                placeholder="Full Name"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-orange-600 transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                placeholder="Enter your email"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-orange-600 transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 ml-1">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required
                                placeholder="Create a password"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-orange-600 transition-all font-medium" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-4 bg-orange-600 hover:bg-white hover:text-orange-600 text-white font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95 disabled:opacity-50 cursor-pointer text-sm uppercase tracking-widest mt-4">
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="flex items-center my-8">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="px-4 text-slate-600 text-xs font-bold">OR</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {/* Google Login Button */}
                    <button
                        onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
                        className="w-full py-4 bg-white text-slate-900 rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-600 hover:text-white transition-all font-black text-xs uppercase tracking-widest shadow-xl mb-8 cursor-pointer active:scale-95"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        Already have an account?{" "}
                        <Link to="/signin" className="text-orange-600 hover:text-white transition-all">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
