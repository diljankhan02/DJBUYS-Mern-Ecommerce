import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


// Google redirects to /success?token=... after login
// This page extracts the token, stores it, and redirects to /products

const Success = () => {
    const navigate = useNavigate();
    const [authError, setAuthError] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            try {
                // Safely decode Base64Url to Base64 (needed for some Google tokens)
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

                // Decode URI component to handle non-latin characters properly
                const jsonPayload = decodeURIComponent(
                    window.atob(base64).split("").map((c) => {
                        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join("")
                );

                const payload = JSON.parse(jsonPayload);

                // Store token and user exactly like our normal signin does
                localStorage.setItem("token", token);
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id: payload.id,
                        name: payload.name,
                        email: payload.email,
                        role: payload.role,
                    })
                );
                window.dispatchEvent(new Event("authChange"));

                // Redirect based on role
                if (payload.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/products");
                }
            } catch (err) {
                console.error("Token decoding failed:", err);
                setAuthError("Failed to parse your Google login data. Please try again.");
            }
        } else {
            setAuthError("No authentication token received from Google.");
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 p-6 relative overflow-hidden">
            <div className="text-center relative z-10">
                {authError ? (
                    <div className="bg-white p-6 md:p-12 rounded-2xl md:rounded-[3rem] shadow-xl max-w-md border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 -rotate-45 translate-x-8 -translate-y-8"></div>
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                            <span className="text-3xl md:text-4xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Login Error</h2>
                        <p className="text-slate-600 mb-8 font-medium leading-relaxed text-sm md:text-base">{authError}</p>
                        <button
                            onClick={() => navigate("/signin")}
                            className="w-full md:w-auto bg-orange-600 hover:bg-slate-900 text-white px-8 md:px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-600/20 active:scale-95 cursor-pointer text-sm"
                        >
                            Back to Sign In
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-orange-600/20 blur-2xl rounded-full animate-pulse"></div>
                            <div className="relative animate-spin rounded-full h-20 w-20 border-4 border-orange-600 border-t-transparent shadow-lg" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-widest uppercase mb-2">Authenticating</h2>
                        <p className="text-slate-400 font-bold text-xs tracking-widest animate-pulse uppercase">Completing Secure Sign In...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Success;
