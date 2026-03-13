import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 mt-auto border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Section */}
                    <div>
                        <h2 className="text-xl font-black flex items-center gap-2 mb-4 tracking-tighter">
                            <span className="text-white uppercase">DJ</span>
                            <span className="text-orange-600 uppercase">Buys</span>
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed mb-2">
                            Your trusted destination for quality products online.
                        </p>
                        <p className="text-xs text-slate-600 font-medium">Cash on Delivery available.</p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="text-white font-black mb-5 text-xs uppercase tracking-widest">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li><Link to="/" className="hover:text-orange-600 transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-orange-600 transition-colors">Products</Link></li>
                            <li><Link to="/about" className="hover:text-orange-600 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-orange-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-black mb-5 text-xs uppercase tracking-widest">Contact</h3>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li className="flex items-center gap-3">
                                <span>📧</span>
                                <span>support@djbuys.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span>📞</span>
                                <span>+92 (300) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span>📍</span>
                                <span>Swat, Pakistan</span>
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
