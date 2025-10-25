"use client";
/**
 * ZestPay Login Page
 *
 * Authentication Flow:
 * - Employees login using their registered email address
 * - Firebase Authentication validates credentials
 * - Redirects to appropriate dashboard based on role:
 *   - Company Admin → /company/dashboard
 *   - Employee → /employee/dashboard
 *
 * Note: Employees must register first or be added by company admin
 */
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Sign in with Firebase Auth using email
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Check if email is verified
      if (!user.emailVerified) {
        await auth.signOut();
        throw new Error(
          "Please verify your email before logging in. Check your inbox for the verification link."
        );
      }

      // Check if user is company admin
      const companyDoc = await getDoc(doc(db, "companies", user.uid));
      if (companyDoc.exists()) {
        router.push("/company/dashboard");
        return;
      }

      // Check if user is employee
      const employeeDoc = await getDoc(doc(db, "employees", user.uid));
      if (employeeDoc.exists()) {
        router.push("/employee/dashboard");
        return;
      }

      // If neither, redirect to employee dashboard by default
      router.push("/employee/dashboard");
    } catch (error) {
      console.error("Login Failed:", error);
      if (error.code === "auth/user-not-found") {
        setError("Email not found. Please register first.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mb-2 bg-white/5 backdrop-blur-xl border text-2xl border-yellow-400/20 rounded-2xl shadow-2xl p-8 sm:p-10 md:p-12 w-full max-w-md text-center">
        <div className="shrink-0 flex justify-center mb-2">
          <a
            href="/"
            className="flex items-center justify-center bg-black text-white w-28 py-3 rounded-full font-bold text-2xl"
          >
            <span>
              zest<span className="text-yellow-300">pay</span>
            </span>
          </a>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400 text-base mb-8">
          Sign in with your email address
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start text-left">
            <FiAlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          {/* Email Input */}
          <div className="text-left">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-yellow-400/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="your.email@company.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="text-left">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-yellow-400/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-linear-to-r from-yellow-400 to-yellow-500 text-black rounded-xl text-base font-semibold hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-gray-400 text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
          >
            Register Now
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
