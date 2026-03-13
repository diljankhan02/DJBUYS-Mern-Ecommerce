import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyTexts, setReplyTexts] = useState({}); 
    const [sending, setSending] = useState(false);

    const fetchMyMessages = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get("http://localhost:5000/api/messages/my-messages", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyMessages();
    }, []);

    const handleReply = async (threadId) => {
        const text = replyTexts[threadId];
        if (!text || !text.trim()) return;

        setSending(true);
        const token = localStorage.getItem("token");
        try {
            await axios.post(`http://localhost:5000/api/messages/${threadId}/chat`, 
                { text: text.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
          
            setReplyTexts(prev => {
                const updated = { ...prev };
                delete updated[threadId];
                return updated;
            });
            await fetchMyMessages();
        } catch (err) {
            alert("Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />
            
            <div className="bg-white text-slate-900 pt-28 pb-16 px-6 relative overflow-hidden border-b border-slate-100">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full"></div>
                <div className="max-w-5xl mx-auto relative z-10 text-center md:text-left">
                    <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mb-4">Support Center</p>
                    <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter uppercase">My <span className="text-orange-600">Inbox</span></h1>
                    <p className="text-slate-600 font-medium">Manage your private conversations with DJBuys Support</p>
                </div>
            </div>

            <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-600/[0.02] blur-[150px] rounded-full pointer-events-none"></div>
                
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-orange-600/20 blur-xl rounded-full animate-pulse"></div>
                            <div className="relative animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent" />
                        </div>
                        <p className="text-slate-400 font-bold text-[10px] tracking-widest uppercase animate-pulse">Retrieving Messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200 p-12 relative overflow-hidden group shadow-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -rotate-45 translate-x-12 -translate-y-12 transition-colors group-hover:bg-slate-100"></div>
                        <span className="text-7xl block mb-6">📭</span>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase">Your inbox is empty</h3>
                        <p className="text-slate-500 mb-10 max-w-xs mx-auto font-medium">Have a question? Our support team is ready to help through our contact portal.</p>
                        <button onClick={() => window.location.href = "/contact"} className="px-10 py-4 bg-orange-600 hover:bg-slate-900 text-white font-black rounded-2xl transition shadow-xl shadow-orange-600/20 uppercase tracking-widest text-xs">
                            Start Conversation
                        </button>
                    </div>
                ) : (
                    <div className="space-y-12 relative z-10">
                        {messages.map((m) => (
                            <div key={m._id} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden transition-all duration-500 hover:border-orange-600/30 group">
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-600 font-black text-lg border border-orange-600/20">
                                            {m.conversation[0]?.sender === "user" ? "U" : "S"}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Reference ID</p>
                                            <p className="text-sm font-black text-slate-900 tracking-widest">#{m._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Initialized</p>
                                        <p className="text-xs text-slate-600 font-bold uppercase tracking-tighter">
                                            {new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="space-y-6 mb-10 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                        {m.conversation.map((chat, idx) => (
                                            <div key={idx} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                                                <div className={`max-w-[80%] p-6 rounded-3xl relative ${
                                                    chat.sender === "user" 
                                                    ? "bg-orange-600 text-white rounded-tr-none shadow-lg" 
                                                    : "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100 shadow-inner"
                                                }`}>
                                                    <p className="leading-relaxed font-medium text-sm">{chat.text}</p>
                                                    <div className={`text-[9px] mt-3 font-bold uppercase tracking-widest ${chat.sender === "user" ? "text-orange-100" : "text-slate-400"} flex items-center gap-1 opacity-80`}>
                                                        <span className="w-1 h-1 rounded-full bg-current"></span>
                                                        {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Reply Box */}
                                    <div className="pt-8 border-t border-slate-100">
                                        <div className="relative group/reply">
                                            <textarea 
                                                value={replyTexts[m._id] || ""}
                                                onChange={(e) => setReplyTexts({ ...replyTexts, [m._id]: e.target.value })}
                                                placeholder="Write your message..."
                                                className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-600/50 focus:bg-white transition-all duration-300 resize-none min-h-[140px] font-medium shadow-inner"
                                            />
                                            <button 
                                                onClick={() => handleReply(m._id)}
                                                disabled={sending || !replyTexts[m._id]?.trim()}
                                                className="absolute bottom-6 right-6 bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                                            >
                                                {sending ? "Sending..." : "Send Message →"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Inbox;
