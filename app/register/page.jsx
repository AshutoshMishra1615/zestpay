"use client";
/**
 * ZestPay Registration Page
 *
 * Registration Flow:
 * 1. User enters email, password, confirm password
 * 2. System checks if company domain is registered in the system
 * 3. If registered, sends OTP to email via Firebase Auth
 * 4. User enters OTP to verify email
 * 5. Account is created and user can login
 *
 * Note: Only employees from registered company domains can register
 */
import { useState } from "react";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  FiMail,
  FiLock,
  FiAlertCircle,
  FiCheckCircle,
  FiShield,
} from "react-icons/fi";

const RegisterPage = () => {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  // UI states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
  const [userCredential, setUserCredential] = useState(null);

  // Extract domain from email
  const extractDomain = (email) => {
    return email.split("@")[1]?.toLowerCase();
  };

  // Check if company domain is registered
  const checkCompanyDomain = async (email) => {
    const domain = extractDomain(email);

    if (!domain) {
      throw new Error("Invalid email format");
    }

    try {
      // Check if any company has this domain registered
      const companiesRef = collection(db, "companies");
      const q = query(companiesRef, where("domain", "==", domain));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error(
          `Your company domain (${domain}) is not registered with us. Please contact your HR department.`
        );
      }

      // Return company data
      return querySnapshot.docs[0].data();
    } catch (error) {
      throw error;
    }
  };

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate password match
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Validate password strength
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Check if company domain is registered
      const companyData = await checkCompanyDomain(email);

      // Create user account with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send email verification (acts as OTP)
      await sendEmailVerification(user);

      // Store user credential for later use
      setUserCredential(userCredential);

      setSuccess(
        "Verification email sent! Please check your inbox and verify your email."
      );
      setStep(2);
    } catch (error) {
      console.error("Registration Failed:", error);

      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format. Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification (email verification check)
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Sign out and sign in again to refresh the verification status
      await auth.signOut();
      const result = await signInWithEmailAndPassword(auth, email, password);
      await result.user.reload();

      if (!result.user.emailVerified) {
        throw new Error(
          "Email not verified yet. Please check your email and click the verification link."
        );
      }

      // Get company data again
      const domain = extractDomain(email);
      const companiesRef = collection(db, "companies");
      const q = query(companiesRef, where("domain", "==", domain));
      const querySnapshot = await getDocs(q);
      const companyData = querySnapshot.docs[0].data();
      const companyId = querySnapshot.docs[0].id;

      // Create employee profile in Firestore
      await setDoc(doc(db, "employees", result.user.uid), {
        email: email,
        name: email.split("@")[0],
        companyId: companyId,
        companyName: companyData.name || "Unknown",
        domain: domain,
        trustScore: 50,
        monthlySalary: 0, // To be set by company admin
        totalWithdrawn: 0,
        totalRepaid: 0,
        onTimeRepayments: 0,
        lateRepayments: 0,
        hasSubscription: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setSuccess("Registration successful! Redirecting to login...");

      // Sign out and redirect to login
      await auth.signOut();
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Verification Failed:", error);

      if (error.message) {
        setError(error.message);
      } else {
        setError(
          "Verification failed. Please try again or request a new verification email."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const resendVerificationEmail = async () => {
    setError("");
    setLoading(true);

    try {
      if (userCredential && userCredential.user) {
        await sendEmailVerification(userCredential.user);
        setSuccess("Verification email sent again! Please check your inbox.");
      } else {
        throw new Error("Session expired. Please register again.");
      }
    } catch (error) {
      setError("Failed to resend verification email. Please try again.");
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
          <Link
            href="/"
            className="flex items-center justify-center bg-black text-white w-28 py-3 rounded-full font-bold text-2xl"
          >
            <span>
              zest<span className="text-yellow-300">pay</span>
            </span>
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">
          {step === 1 ? "Create Account" : "Verify Email"}
        </h1>
        <p className="text-gray-400 text-base mb-8">
          {step === 1
            ? "Register with your company email"
            : "Check your email for verification link"}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start text-left">
            <FiAlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start text-left">
            <FiCheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 shrink-0" />
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        {/* Step 1: Registration Form */}
        {step === 1 && (
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Email Input */}
            <div className="text-left">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Company Email *
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
                  placeholder="john.doe@company.com"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use your company email address
              </p>
            </div>

            {/* Password Input */}
            <div className="text-left">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password *
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
                  placeholder="Create a strong password"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div className="text-left">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-yellow-400/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-linear-to-r from-yellow-400 to-yellow-500 text-black rounded-xl text-base font-semibold hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        {/* Step 2: Email Verification */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-6">
              <FiShield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">
                Verification Email Sent!
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                We've sent a verification link to:
              </p>
              <p className="text-yellow-400 font-semibold mb-4">{email}</p>
              <p className="text-xs text-gray-500">
                Click the link in the email to verify your account, then click
                the button below.
              </p>
            </div>

            <button
              onClick={handleVerifyEmail}
              disabled={loading}
              className="w-full px-6 py-3 bg-linear-to-r from-yellow-400 to-yellow-500 text-black rounded-xl text-base font-semibold hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "I've Verified My Email"}
            </button>

            <button
              onClick={resendVerificationEmail}
              disabled={loading}
              className="w-full px-6 py-3 bg-white/5 border border-yellow-400/20 text-gray-300 rounded-xl text-sm font-medium hover:bg-yellow-400/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend Verification Email
            </button>

            <button
              onClick={() => {
                setStep(1);
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setError("");
                setSuccess("");
              }}
              className="w-full text-gray-400 hover:text-yellow-400 text-sm transition-colors"
            >
              Back to Registration
            </button>
          </div>
        )}

        <p className="mt-8 text-gray-400 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
