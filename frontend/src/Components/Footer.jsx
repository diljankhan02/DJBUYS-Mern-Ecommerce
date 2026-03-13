import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 mt-auto border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <h2 className="text-xl md:text-2xl font-black flex items-center gap-2 mb-4 tracking-tighter">
                            <span className="text-white uppercase">DJ</span>
                            <span className="text-orange-600 uppercase">Buys</span>
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed mb-2 max-w-sm">
                            Your trusted destination for quality products online.
                        </p>
                        <p className="text-xs text-slate-600 font-medium tracking-tight">Standardized Cash on Delivery available across all provinces.</p>
                    </div>

                    {/* Navigation Links */}
                    <div className="pt-2 md:pt-0">
                        <h3 className="text-white font-black mb-4 md:mb-5 text-[10px] md:text-xs uppercase tracking-widest">Quick Navigation</h3>
                        <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-3 text-sm text-slate-500">
                            <li><Link to="/" className="hover:text-orange-600 transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-orange-600 transition-colors">Products</Link></li>
                            <li><Link to="/about" className="hover:text-orange-600 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-orange-600 transition-colors">Contact Portal</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="pt-2 md:pt-0">
                        <h3 className="text-white font-black mb-4 md:mb-5 text-[10px] md:text-xs uppercase tracking-widest">Contact Support</h3>
                        <ul className="space-y-4 md:space-y-3 text-sm text-slate-500">
                            <li className="flex items-center gap-3">
                                <span className="text-base">📧</span>
                                <span className="truncate">support@djbuys.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-base">📞</span>
                                <span>+92 (300) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-base">📍</span>
                                <span>Swat, KPK, Pakistan</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-600">
                    © 2026 Dil Jan Khan. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
