import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

   
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        {
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Premium Desk Setup
            badge: "🔥 Discover the Future of Shopping",
            title: "Shop the Best Products Online",
            highlight: "Best",
            desc: "A curated e-commerce experience offering a seamless, secure, and modern way to shop for premium tech and lifestyle goods."
        },
        {
            image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Premium Footwear
            badge: "🚀 Fresh Drops Weekly",
            title: "Elevate Your Everyday Style",
            highlight: "Style",
            desc: "Step up your game with our exclusive collection of premium, limited-edition footwear and apparel. Uncompromising quality."
        },
        {
            image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Premium Audio/Lifestyle
            badge: "🎧 Immerse Yourself",
            title: "Experience Audiophile Quality",
            highlight: "Quality",
            desc: "Don't just listen—feel every beat. Discover our handpicked selection of professional-grade audio equipment."
        }
    ];

    // Auto-slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000); 
        return () => clearInterval(timer);
    }, [slides.length]);
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />

          
            <section className="relative h-[500px] md:h-[550px] flex items-center justify-center overflow-hidden bg-white">
                
            
                {slides.map((slide, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-110 rotate-1"}`}
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

                
                <div className="max-w-7xl mx-auto w-full px-8 md:px-12 relative z-10 grid grid-cols-1 md:grid-cols-2">
                    <div 
                        key={currentSlide}
                        className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out py-10 md:py-16"
                    >
                        
                        <div className="inline-flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 md:px-5 py-2 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-4 md:mb-6 shadow-2xl">
                            <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-orange-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></span>
                            {slides[currentSlide].badge}
                        </div>

                      
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.2] mb-4 md:mb-6 text-white tracking-tighter max-w-3xl drop-shadow-2xl uppercase">
                            {slides[currentSlide].title.split(slides[currentSlide].highlight).map((part, i, arr) => (
                                <span key={i}>
                                    {part}
                                    {i < arr.length - 1 && (
                                        <span className="relative inline-block text-orange-600 italic">
                                            {slides[currentSlide].highlight}
                                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/30 rounded-full"></span>
                                        </span>
                                    )}
                                </span>
                            ))}
                        </h1>

                       
                        <p className="text-white/70 text-sm md:text-base font-medium leading-relaxed mb-6 md:mb-10 max-w-lg drop-shadow-lg line-clamp-2 md:line-clamp-none">
                            {slides[currentSlide].desc}
                        </p>

                       
                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 mt-2 md:mt-4 w-full sm:w-auto">
                            <button onClick={() => navigate(token ? "/products" : "/signup")}
                                className="px-8 md:px-12 py-4 md:py-6 bg-orange-600 hover:bg-white hover:text-orange-600 text-white font-black rounded-full md:rounded-[2rem] text-[10px] md:text-sm transition-all duration-500 shadow-2xl shadow-orange-600/40 hover:shadow-white/20 transform hover:-translate-y-2 cursor-pointer uppercase tracking-[0.2em]">
                                Shop Collection
                            </button>
                            {!token && (
                                <Link to="/signin"
                                    className="px-8 md:px-12 py-4 md:py-6 bg-white/5 backdrop-blur-lg border border-white/20 text-white hover:bg-white hover:text-slate-900 font-black rounded-full md:rounded-[2rem] text-[10px] md:text-sm transition-all duration-500 shadow-2xl transform hover:-translate-y-2 cursor-pointer uppercase tracking-[0.2em] text-center">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Carousel Navigation Dots */}
                <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
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

            {/* Why DJBuys Section */}
            <section className="py-32 px-6 bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-left mb-20 max-w-2xl">
                        <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mb-4">Why Choose Us</p>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
                            Built for the <span className="text-orange-600">Everyday Shopper</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: "🚚", title: "Fast Delivery", desc: "Reliable shipping that ensures your orders arrive on time, every time." },
                            { icon: "🛡️", title: "Secure Payments", desc: "Your transactions are fully protected. Shop with confidence, always." },
                            { icon: "💎", title: "Quality Products", desc: "Every item in our store is carefully selected to meet high quality standards." }
                        ].map((item, idx) => (
                            <div key={idx} className="group flex flex-col items-start transition-all duration-500">
                                <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-500">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight uppercase group-hover:text-orange-600 transition-colors">{item.title}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Boutique CTA Section */}
            <section className="py-32 px-6 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto bg-slate-50 rounded-[3rem] p-12 md:p-24 text-center relative z-10 border border-slate-100 shadow-sm overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 -rotate-45 translate-x-32 -translate-y-32 transition-transform duration-1000 group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mb-6">Start Shopping</p>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
                            Find What You <br/><span className="text-orange-600">Love</span>
                        </h2>
                        <p className="text-lg text-slate-600 mb-12 font-medium max-w-xl mx-auto leading-relaxed">
                            Join the DJBuys community. Discover our latest arrivals and experience the best in online shopping.
                        </p>
                        <button 
                            onClick={() => navigate("/products")}
                            className="px-12 py-5 bg-orange-600 hover:bg-slate-900 hover:text-white text-white font-black text-sm rounded-full shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-500 cursor-pointer uppercase tracking-widest"
                        >
                            Shop Now
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
