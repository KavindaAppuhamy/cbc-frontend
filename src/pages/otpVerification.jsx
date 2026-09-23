import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import api, { getErrorMessage } from "../utils/api";
import { saveSession } from "../utils/auth";

export default function OtpVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialEmail = params.get("email") || "";
  const purpose = params.get("purpose") === "register" ? "register" : "login";
  const isAdminLogin = params.get("admin") === "1" && purpose === "login";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!initialEmail) {
      navigate(
        purpose === "register" ? "/signup" : isAdminLogin ? "/admin/login" : "/login",
        { replace: true }
      );
    }
  }, [initialEmail, navigate, purpose, isAdminLogin]);

  async function handleVerify(e) {
    e.preventDefault();
    const normalizedOtp = otp.replace(/\D/g, "");

    if (!email || !/^\d{6}$/.test(normalizedOtp)) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/api/users/verify-otp", {
        email: email.trim().toLowerCase(),
        otp: normalizedOtp,
        purpose,
      });

      // Admin access is checked only after OTP verification because the login
      // endpoint intentionally does not return role before the code is confirmed.
      if (isAdminLogin && response.data.role !== "admin") {
        toast.error("This account does not have admin access.");
        return;
      }

      if (!response?.data?.token || !response?.data?.user || !response?.data?.role) {
        throw new Error("Verification succeeded but the login session could not be created. Please try again.");
      }

      saveSession({
        token: response.data.token,
        role: response.data.role,
        user: response.data.user,
      });

      toast.success(purpose === "register" ? "Email verified successfully!" : "Login successful!");
      navigate(response.data.role === "admin" ? "/admin" : "/", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, "Verification failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  }

  async function resendCode() {
    if (!email) return;
    setIsResending(true);
    try {
      await api.post("/api/users/resend-otp", { email: email.trim().toLowerCase(), purpose });
      toast.success("A new verification code has been sent to your email");
      setOtp("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not send a new verification code."));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[url('/bg4.jpg')] bg-cover bg-center flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/85 rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/40">
          <button
            type="button"
            onClick={() => navigate(purpose === "register" ? "/signup" : isAdminLogin ? "/admin/login" : "/login")}
            className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-accent-dark transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="text-center mb-8">
            <img src="/Logo.png" alt="Logo" className="h-14 mx-auto mb-4 object-contain" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">Verify Your Email</h2>
            <p className="text-ink-soft text-sm mt-1">Enter the code we sent to your email address</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-ink text-sm font-medium mb-2" htmlFor="otp-email">Email Address</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/50" />
                <input
                  id="otp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="w-full pl-11 pr-4 py-3.5 border border-accent/30 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-ink text-sm font-medium mb-2" htmlFor="otp">6-Digit OTP</label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full px-4 py-3.5 border border-accent/30 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-center tracking-[0.45em] text-xl font-semibold"
                placeholder="000000"
              />
            </div>

            <button
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-70"
              type="submit"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-soft">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={resendCode}
              disabled={isResending}
              className="text-accent-dark font-semibold hover:underline disabled:opacity-60"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          <div className="mt-2 text-center text-xs text-ink-soft/60">
            {purpose === "register" ? (
              <>Already have an account? <Link to="/login" className="text-accent-dark font-semibold hover:underline">Log in</Link></>
            ) : isAdminLogin ? (
              <>Customer login? <Link to="/login" className="text-accent-dark font-semibold hover:underline">Go to customer login</Link></>
            ) : (
              <>Need to register? <Link to="/signup" className="text-accent-dark font-semibold hover:underline">Sign up</Link></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
