import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const About = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />

            {/* Hero */}
            <section className="bg-white text-slate-900 pt-24 md:pt-32 pb-16 md:pb-24 px-6 text-center relative overflow-hidden border-b border-slate-100">
                <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-600/5 blur-[100px] md:blur-[150px] rounded-full"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mb-3 md:mb-4">Our Story</p>
                    <h1 className="text-4xl md:text-6xl lg:text-[68px] font-black mb-4 md:mb-6 tracking-tighter uppercase leading-[1.1]">About <span className="text-orange-600">DJBuys</span></h1>
                    <p className="text-slate-600 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium">We're on a mission to redefine online shopping. Simple, authentic, and undeniably premium.</p>
                </div>
            </section>

            {/* Story */}
            <section className="py-20 md:py-28 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-block px-4 py-1.5 bg-orange-600/10 border border-orange-600/20 rounded-full mb-6">
                            <span className="text-orange-600 text-[10px] font-bold uppercase tracking-widest">Our Story</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 md:mb-8 tracking-tight uppercase leading-tight">Who We Are</h2>
                        <div className="space-y-4 md:space-y-6">
                            <p className="text-slate-600 leading-relaxed text-base md:text-lg font-medium">
                                DJBuys was created to make online shopping simple, fast, and reliable. We know that finding great products at good prices shouldn't be complicated. Our goal is to bring you a great selection of everyday items, electronics, and lifestyle products all in one place.
                            </p>
                            <p className="text-slate-600 leading-relaxed text-base md:text-lg font-medium">
                                We focus on exactly what matters to our customers: a clean website, high-quality products, easy checkout, and cash on delivery. We are always working to improve our store so you can shop with confidence every single time.
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 relative w-full max-w-xl mx-auto lg:max-w-none lg:mx-0 mt-12 lg:mt-0">
                        <div className="absolute -inset-4 bg-orange-600/5 blur-3xl rounded-full opacity-50"></div>
                        {[
                            ["Quality", "Products"],
                            ["Fast", "Delivery"],
                            ["Secure", "Payments"],
                            ["Reliable", "Support"],
                        ].map(([num, label]) => (
                            <div key={label} className="bg-white rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 text-center border border-slate-100 hover:border-orange-600/30 transition-all duration-500 group relative z-10 shadow-sm hover:shadow-xl">
                                <p className="text-2xl md:text-3xl font-black text-orange-600 group-hover:scale-110 transition-transform tracking-tight">{num}</p>
                                <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 md:py-28 px-6 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 md:mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 md:mb-4 tracking-tighter uppercase leading-tight">Our Promise</h2>
                        <p className="text-slate-400 text-[10px] md:text-sm font-bold tracking-widest uppercase">What you can expect from us</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { icon: "🛍️", title: "Easy Shopping", desc: "We design our store to make finding and buying products as simple as possible.", border: "group-hover:border-red-500/30" },
                            { icon: "⭐", title: "Great Quality", desc: "We carefully check our suppliers to make sure you only get products you'll love.", border: "group-hover:border-orange-500/30" },
                            { icon: "🚚", title: "Fast Service", desc: "From checkout to delivery, we work hard to get your orders to you quickly and safely.", border: "group-hover:border-blue-500/30" },
                        ].map((v) => (
                            <div key={v.title} className={`bg-slate-50 border border-slate-100 rounded-3xl md:rounded-[3rem] p-8 md:p-10 text-center transition-all duration-500 group ${v.border} relative overflow-hidden hover:shadow-xl hover:bg-white`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 -rotate-45 translate-x-16 -translate-y-16"></div>
                                <div className="text-5xl md:text-6xl mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500 transform-gpu">{v.icon}</div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight uppercase">{v.title}</h3>
                                <p className="text-slate-600 leading-relaxed font-medium text-sm md:text-base">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
