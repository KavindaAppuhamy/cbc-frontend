
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../utils/api";
import { Mail, Lock, Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    // Required fields
    if (!normalizedEmail || !cleanPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate email before sending the request
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

    if (!emailRegex.test(normalizedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/api/users/login", {
        email: normalizedEmail,
        password: cleanPassword,
      });

      /*
       * The backend does NOT return a token at this stage.
       *
       * Successful login response:
       * {
       *   message: "...",
       *   requiresOtp: true,
       *   purpose: "login",
       *   email: "..."
       * }
       *
       * The token is returned only after OTP verification.
       */
      if (
        response?.data?.requiresOtp !== true ||
        response?.data?.purpose !== "login"
      ) {
        toast.error(
          response?.data?.message ||
            "Unable to start email verification. Please try again."
        );
        return;
      }

      /*
       * Always use the normalized email entered by the user.
       * This prevents an undefined/missing response.data.email
       * from breaking the OTP URL.
       */
      const verificationEmail = normalizedEmail;

      navigate(
        `/verify-otp?email=${encodeURIComponent(
          verificationEmail
        )}&purpose=login`,
        { replace: true }
      );

      toast.success(
        response?.data?.message ||
          "Verification code sent to your email"
      );
    } catch (err) {
      console.error("Login error:", err);

      toast.error(
        getErrorMessage(
          err,
          "Login failed. Please check your email and password."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[url('/bg4.jpg')] bg-cover bg-center flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/85 rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/40">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-accent-dark transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="text-center mb-8">
            <img
              src="/Logo.png"
              alt="Logo"
              className="h-14 mx-auto mb-4 object-contain"
            />

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
              Welcome Back
            </h2>

            <p className="text-ink-soft text-sm mt-1">
              Sign in to continue shopping
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                className="block text-ink text-sm font-medium mb-2"
                htmlFor="email"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/50"
                />

                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full pl-11 pr-4 py-3.5 border border-accent/30 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block text-ink text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/50"
                />

                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full pl-11 pr-4 py-3.5 border border-accent/30 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-70"
              type="submit"
            >
              {isLoading && (
                <Loader2 size={18} className="animate-spin" />
              )}

              {isLoading ? "Sending code..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-soft">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-accent-dark font-semibold hover:underline"
            >
              Sign up
            </Link>
          </div>

          <div className="mt-2 text-center text-xs text-ink-soft/60">
            Admin?{" "}
            <Link
              to="/admin/login"
              className="text-accent-dark font-semibold hover:underline"
            >
              Go to admin login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
