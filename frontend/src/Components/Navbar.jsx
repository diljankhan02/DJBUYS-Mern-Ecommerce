import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useState, useEffect } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartCount } = useCart();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) => `
        relative px-1 py-2 transition-all duration-300 group
        ${isActive(path) ? "text-orange-600 font-bold" : "text-slate-500 hover:text-slate-900 font-bold"}
    `;

    const activeUnderline = (path) => (
        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 transform origin-left transition-transform duration-300 ${isActive(path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
    );

    // Common Nav Wrap
    const NavWrapper = ({ children }) => (
        <nav className={`sticky top-0 w-full z-50 transition-all duration-500 ${
            scrolled ? "bg-white/95 backdrop-blur-xl py-3 shadow-lg border-b border-slate-100" : "bg-white py-4 border-b border-slate-100"
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {children}
            </div>
        </nav>
    );

    const Logo = () => (
        <Link to={user.role === "admin" ? "/admin" : "/"} className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-9 bg-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform duration-300">
                <span className="text-white font-black text-lg tracking-tighter">DJ</span>
            </div>
            <span className="text-xl font-black tracking-tight flex items-center">
                <span className="text-slate-900 uppercase">DJ</span>
                <span className="text-orange-600 uppercase">Buys</span>
            </span>
        </Link>
    );

    // Unauthenticated Navbar
    if (!token) {
        return (
            <NavWrapper>
                <Logo />
                <div className="flex items-center gap-8">
                    <Link to="/about" className={navLinkClass("/about")}>About {activeUnderline("/about")}</Link>
                    <div className="h-5 w-px bg-slate-200" />
                    <div className="flex items-center gap-3">
                        <Link to="/signup" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer uppercase tracking-widest">Sign Up</Link>
                        <Link to="/signin" className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-slate-900 text-white transition-all duration-300 font-black text-xs uppercase tracking-widest shadow-md cursor-pointer">
                            Sign In
                        </Link>
                    </div>
                </div>
            </NavWrapper>
        );
    }

    // Admin Navbar
    if (user.role === "admin") {
        return (
            <NavWrapper>
                <Logo />
                <div className="flex items-center gap-8">
                    <Link to="/admin" className={navLinkClass("/admin")}>Dashboard {activeUnderline("/admin")}</Link>
                    <button onClick={handleLogout} className="px-6 py-2.5 rounded-xl bg-red-50 hover:bg-red-600 border border-red-200 text-red-600 hover:text-white text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2">
                        <span>Sign Out</span>
                        <span>⏻</span>
                    </button>
                </div>
            </NavWrapper>
        );
    }

    // Authenticated User Navbar
    return (
        <NavWrapper>
            <Logo />
            
            <div className="hidden md:flex items-center gap-8">
                <Link to="/" className={navLinkClass("/")}>Home {activeUnderline("/")}</Link>
                <Link to="/products" className={navLinkClass("/products")}>Products {activeUnderline("/products")}</Link>
                <Link to="/about" className={navLinkClass("/about")}>About {activeUnderline("/about")}</Link>
                <Link to="/contact" className={navLinkClass("/contact")}>Contact {activeUnderline("/contact")}</Link>
                <Link to="/inbox" className={navLinkClass("/inbox")}>Inbox {activeUnderline("/inbox")}</Link>
            </div>

            <div className="flex items-center gap-5">
                <Link to="/cart" className="relative group p-2.5 rounded-xl bg-slate-100 hover:bg-orange-600 transition-all duration-300 cursor-pointer border border-slate-200 hover:border-orange-600">
                    <span className="text-lg group-hover:scale-110 block transition-transform">🛒</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[9px] rounded-full w-5 h-5 flex items-center justify-center font-black shadow-md">
                            {cartCount}
                        </span>
                    )}
                </Link>

                <div className="h-6 w-px bg-slate-200 hidden md:block" />

                <div className="flex items-center gap-3">
                    <div className="hidden lg:block text-right">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Welcome</p>
                        <p className="text-xs font-black text-slate-900">{user.name?.split(" ")[0]}</p>
                    </div>
                    <button onClick={handleLogout} className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 hover:bg-red-600 hover:border-red-600 text-slate-500 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer group" title="Sign Out">
                        <span className="text-xl group-hover:rotate-90 transition-transform">⏻</span>
                    </button>
                </div>
            </div>
        </NavWrapper>
    );
};

export default Navbar;
