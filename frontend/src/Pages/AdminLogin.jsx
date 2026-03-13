import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          
            const res = await axios.post("https://djbuys-backend.vercel.app/api/auth/admin/signin", formData);
            const { token, user } = res.data;

           
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/admin");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#020617] text-white">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden border-r border-white/5 bg-white/5">
                <div className="relative z-10 text-center max-w-sm">
                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl text-white">⚙️</span>
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
                        DJ<span className="text-orange-600">Buys</span>
                    </h1>
                    <p className="text-orange-600 font-bold text-sm uppercase tracking-widest mb-8">Admin Portal</p>
                    <p className="text-slate-400 leading-relaxed mb-10 font-medium">
                        Welcome to the dashboard. Here you can control everything on your store.
                    </p>
                    <div className="space-y-4 text-left">
                        {[
                            "Add and Edit Products",
                            "Manage Customer Orders",
                            "Answer Messages",
                            "Change Settings",
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest bg-white/5 p-4 rounded-xl border border-white/10">{item}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-[#020617] relative">
                
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8 relative z-10">
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                            DJ<span className="text-orange-600">Buys</span>
                        </h1>
                        <p className="text-orange-600 text-sm font-bold uppercase tracking-widest mt-1">Admin Portal</p>
                    </div>

                    {/* Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-xl relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/10">
                                <span className="text-xl md:text-2xl text-white">🔐</span>
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">Admin Sign In</h2>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl mb-6 text-sm flex items-start gap-2 font-medium">
                                <span className="flex-shrink-0">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            <div className="space-y-1.5">
                                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Admin Email</label>
                                <input
                                    type="email" name="email" value={formData.email}
                                    onChange={handleChange} required placeholder="Enter admin email"
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-orange-600 transition font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Password</label>
                                <input
                                    type="password" name="password" value={formData.password}
                                    onChange={handleChange} required placeholder="Enter admin password"
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-orange-600 transition font-medium"
                                />
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full py-4.5 bg-orange-600 hover:bg-slate-900 text-white font-black rounded-2xl transition shadow-xl shadow-orange-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-4 uppercase tracking-widest text-xs"
                            >
                                {loading ? "Verifying..." : "Access Admin Panel →"}
                            </button>
                        </form>

                    </div>

                  
                    <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-6">
                        🔒 Restricted Area • Secure Environment
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
