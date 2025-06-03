import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users", {
        firstName,
        lastName,
        email,
        password
      });

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  }

    return (
        <div className="min-h-screen bg-[url('/bg4.jpg')] bg-cover bg-center flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="backdrop-blur-md bg-white/30 rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
                        <p className="text-gray-600">Please fill in your details</p>
                    </div>

                    <form onSubmit={handleSignup}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="firstName">
                                First Name
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full p-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="John"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lastName">
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full p-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Doe"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="your@email.com"
                                autoComplete="username"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                        </div>

                        <button
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        type="submit"
                        >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating account...
                            </span>
                        ) : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800">
                        Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
