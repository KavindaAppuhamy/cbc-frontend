import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../../utils/api";
import { isAdmin } from "../../utils/auth";
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // If already logged in as admin, skip straight to the dashboard.
    useEffect(() => {
        if (isAdmin()) {
            navigate("/admin/dashboard", { replace: true });
        }
    }, [navigate]);

    async function handleLogin(e) {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please enter your email and password");
            return;
        }

        setIsLoading(true);

        try {
            const normalizedEmail = email.trim().toLowerCase();
            const response = await api.post("/api/users/login", {
                email: normalizedEmail,
                password,
                adminLogin: true,
            });

            if (response?.data?.requiresOtp !== true || response?.data?.purpose !== "login") {
                throw new Error(response?.data?.message || "Unable to start admin verification");
            }

            navigate(`/verify-otp?email=${encodeURIComponent(response.data.email || normalizedEmail)}&purpose=login&admin=1`, { replace: true });
            toast.success(response.data.message || "Admin verification code sent to your email");
        } catch (err) {
            toast.error(getErrorMessage(err, "Login failed. Please check your credentials."));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-admin-900 relative overflow-hidden p-4">
            {/* Decorative background */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

            <div className="relative w-full max-w-md">
                <div className="bg-admin-800 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/15 flex items-center justify-center">
                            <ShieldCheck className="text-accent" size={30} />
                        </div>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Admin Portal</h2>
                        <p className="text-white/50 text-sm mt-1">Sign in to manage Crystal Beauty Clear</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2" htmlFor="admin-email">
                                Admin Email
                            </label>
                            <div className="relative">
                                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    id="admin-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/60"
                                    placeholder="admin@crystalbeautyclear.com"
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2" htmlFor="admin-password">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    id="admin-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/60"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-70"
                        >
                            {isLoading && <Loader2 size={18} className="animate-spin" />}
                            {isLoading ? "Signing in..." : "Sign In to Dashboard"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-white/30">
                        Not an admin? <a href="/login" className="text-accent hover:underline">Go to customer login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
