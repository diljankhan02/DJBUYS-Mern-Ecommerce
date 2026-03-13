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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
            scrolled || isMenuOpen ? "bg-white/95 backdrop-blur-xl py-3 shadow-lg border-b border-slate-100" : "bg-white py-4 border-b border-slate-100"
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
                
                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-slate-600 focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className={navLinkClass("/")}>Home {activeUnderline("/")}</Link>
                    <Link to="/about" className={navLinkClass("/about")}>About {activeUnderline("/about")}</Link>
                    <div className="h-5 w-px bg-slate-200" />
                    <div className="flex items-center gap-3">
                        <Link to="/signup" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer uppercase tracking-widest">Sign Up</Link>
                        <Link to="/signin" className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-slate-900 text-white transition-all duration-300 font-black text-xs uppercase tracking-widest shadow-md cursor-pointer">
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 flex flex-col p-6 gap-6 md:hidden shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                        <Link to="/" className={navLinkClass("/")} onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link to="/about" className={navLinkClass("/about")} onClick={() => setIsMenuOpen(false)}>About</Link>
                        <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                            <Link to="/signup" className="w-full py-4 text-center font-black text-xs uppercase tracking-widest text-slate-600 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                            <Link to="/signin" className="w-full py-4 text-center font-black text-xs uppercase tracking-widest text-white bg-orange-600 rounded-xl shadow-lg" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                        </div>
                    </div>
                )}
            </NavWrapper>
        );
    }

    // Admin Navbar
    if (user.role === "admin") {
        return (
            <NavWrapper>
                <Logo />
                
                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-slate-600 focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/admin" className={navLinkClass("/admin")}>Dashboard {activeUnderline("/admin")}</Link>
                    <button onClick={handleLogout} className="px-6 py-2.5 rounded-xl bg-red-50 hover:bg-red-600 border border-red-200 text-red-600 hover:text-white text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2">
                        <span>Sign Out</span>
                        <span>⏻</span>
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 flex flex-col p-6 gap-6 md:hidden shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                        <Link to="/admin" className={navLinkClass("/admin")} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full py-4 text-center font-black text-xs uppercase tracking-widest text-red-600 bg-red-50 rounded-xl border border-red-100">
                            Sign Out ⏻
                        </button>
                    </div>
                )}
            </NavWrapper>
        );
    }

    // Authenticated User Navbar
    return (
        <NavWrapper>
            <Logo />

            {/* Mobile Actions (Cart & Toggle) */}
            <div className="flex items-center gap-3 md:hidden">
                <Link to="/cart" className="relative p-2 rounded-xl bg-slate-50 border border-slate-100" onClick={() => setIsMenuOpen(false)}>
                    <span>🛒</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-black shadow-sm">
                            {cartCount}
                        </span>
                    )}
                </Link>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-slate-600 focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
                <Link to="/" className={navLinkClass("/")}>Home {activeUnderline("/")}</Link>
                <Link to="/products" className={navLinkClass("/products")}>Products {activeUnderline("/products")}</Link>
                <Link to="/about" className={navLinkClass("/about")}>About {activeUnderline("/about")}</Link>
                <Link to="/contact" className={navLinkClass("/contact")}>Contact {activeUnderline("/contact")}</Link>
                <Link to="/inbox" className={navLinkClass("/inbox")}>Inbox {activeUnderline("/inbox")}</Link>
            </div>

            <div className="hidden md:flex items-center gap-5">
                <Link to="/cart" className="relative group p-2.5 rounded-xl bg-slate-100 hover:bg-orange-600 transition-all duration-300 cursor-pointer border border-slate-200 hover:border-orange-600">
                    <span className="text-lg group-hover:scale-110 block transition-transform">🛒</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[9px] rounded-full w-5 h-5 flex items-center justify-center font-black shadow-md">
                            {cartCount}
                        </span>
                    )}
                </Link>

                <div className="h-6 w-px bg-slate-200" />

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

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 flex flex-col p-6 md:hidden shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-xl">👤</div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
                            <p className="text-sm font-black text-slate-900">{user.name}</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-4">
                        <Link to="/" className={navLinkClass("/")} onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link to="/products" className={navLinkClass("/products")} onClick={() => setIsMenuOpen(false)}>Products</Link>
                        <Link to="/about" className={navLinkClass("/about")} onClick={() => setIsMenuOpen(false)}>About</Link>
                        <Link to="/contact" className={navLinkClass("/contact")} onClick={() => setIsMenuOpen(false)}>Contact</Link>
                        <Link to="/inbox" className={navLinkClass("/inbox")} onClick={() => setIsMenuOpen(false)}>Inbox</Link>
                    </nav>
                    <div className="pt-8 mt-4 border-t border-slate-100 flex flex-col gap-4">
                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full py-4 text-center font-black text-xs uppercase tracking-widest text-red-600 bg-red-50 rounded-xl border border-red-100">
                            Sign Out ⏻
                        </button>
                    </div>
                </div>
            )}
        </NavWrapper>
    );
};

export default Navbar;
