"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Shield, ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!role) {
            setError("Please select a sector");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Registry error occurred");
                setLoading(false);
                return;
            }

            router.push("/login?registered=true");
        } catch (err) {
            setError("Synchronization failed. Try again.");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 font-sans antialiased text-slate-900">
            <div className="w-full max-w-[480px] z-10">
                <div className="bg-white rounded-[2rem] p-10 lg:p-12 shadow-sm border border-slate-200/60">
                    {/* Branding */}
                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="bg-black p-2 rounded-lg">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14,2 14,8 20,8" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold tracking-tight text-slate-900 uppercase">MoM.AI</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">Initialize your personnel profile</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 animate-shake">
                                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                </div>
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-5">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 font-semibold text-sm text-slate-700"
                                        placeholder="James Carter"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 font-semibold text-sm text-slate-700"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 font-semibold text-sm text-slate-700"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Governance Sector</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <Shield size={18} />
                                    </div>
                                    <select
                                        required
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full h-14 pl-12 pr-10 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 font-semibold text-sm text-slate-700 appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select Role</option>
                                        <option value="admin">Administration</option>
                                        <option value="meeting_convener">Meeting Convener</option>
                                        <option value="staff">Staff Operations</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Register Profile</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        <div className="text-center mt-8">
                            <a href="/login" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all border-b border-transparent hover:border-slate-900 pb-1">
                                Already Registered? Sign In
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}