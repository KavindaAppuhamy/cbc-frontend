import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../utils/api";
import { User, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    // Basic validation
    if (
      !cleanFirstName ||
      !cleanLastName ||
      !normalizedEmail ||
      !cleanPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    // Stronger email validation
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

    if (!emailRegex.test(normalizedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Optional basic password validation
    if (cleanPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/api/users", {
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: normalizedEmail,
        password: cleanPassword,
      });

      /*
       * The backend should return the registered email.
       * If it doesn't, use the normalized email that was submitted.
       */
      if (response?.data?.requiresOtp !== true || response?.data?.purpose !== "register") {
        throw new Error(response?.data?.message || "Unable to start email verification");
      }

      const registeredEmail =
        response?.data?.email?.trim()?.toLowerCase() || normalizedEmail;

      navigate(
        `/verify-otp?email=${encodeURIComponent(registeredEmail)}&purpose=register`,
        { replace: true }
      );

      toast.success(response?.data?.message || "Verification code sent to your email");
    } catch (err) {
      console.error("Registration error:", err);

      toast.error(
        getErrorMessage(
          err,
          "Registration failed. Please check your details and try again."
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
            onClick={() => navigate("/login")}
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
              Create an Account
            </h2>

            <p className="text-ink-soft text-sm mt-1">
              Join us for a radiant journey
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-ink text-sm font-medium mb-2"
                  htmlFor="firstName"
                >
                  First Name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/50"
                  />

                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-3 py-3.5 border border-accent/30 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                    placeholder="John"
                    autoComplete="given-name"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-ink text-sm font-medium mb-2"
                  htmlFor="lastName"
                >
                  Last Name
                </label>

                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-3.5 border border-accent/30 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  placeholder="Doe"
                  autoComplete="family-name"
                />
              </div>
            </div>

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
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 border border-accent/30 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="your@email.com"
                  autoComplete="email"
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
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 border border-accent/30 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-70 mt-2"
              type="submit"
            >
              {isLoading && (
                <Loader2 size={18} className="animate-spin" />
              )}

              {isLoading ? "Sending code..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-soft">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent-dark font-semibold hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
