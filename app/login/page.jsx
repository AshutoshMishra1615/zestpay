
"use client";
import React from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';

const LoginPage = () => {

    const router = useRouter();
 
    const handleGoogleLogin = async() => {
    try{
        const result = await signInWithPopup(auth , googleProvider);
        const user = result.user;
        console.log(user)   
        console.log("user logged in")
        console.log("user email : "+user.email)
        console.log("user name : "+user.displayName)
        console.log("user uid : "+user.uid)
        router.push('/dashboard')
    }
    catch{
        console.log("Login Failed")
    }
  };

  return (
    
    <div className="min-h-screen bg-yellow-300 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
    
      <div className="bg-white rounded-lg shadow-xl p-8 sm:p-10 md:p-12 w-full max-w-md text-center">
        
        {/* Logo (same style as navbar) */}
        <div className="flex justify-center mb-8">
          <a href="#" className="flex items-center justify-center bg-black text-white w-28 py-3 rounded-full font-bold text-lg">
            <span style={{ transform: '' }}>zest pay</span>
          </a>
        </div>

        {/* Welcome/Login Title */}
        <h1 className="text-4xl font-bold text-black mb-4">Welcome Back!</h1>
        <p className="text-gray-700 text-lg mb-8">Sign in to your account</p>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full px-6 py-3 border border-gray-300 rounded-full shadow-sm text-lg font-semibold text-gray-800 bg-white hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black mb-6"
        >
          <FcGoogle className="h-6 w-6 mr-3" /> {/* Google Icon */}
          Login with Google
        </button>

        {/* Separator or "or" text */}
        <div className="relative flex items-center my-8">
          <div className="grow border-t border-gray-300"></div>
          <span className="shrink mx-4 text-gray-500 text-sm">or</span>
          <div className="
          grow border-t border-gray-300"></div>
        </div>

        {/* Placeholder for Email/Password (if you wanted to add it later) */}
        {/* For now, it encourages Google login, but this section shows where more options would go */}
        <p className="text-gray-600 text-base mb-4">
          Prefer using email?
          {/* You could add a link or button here to switch to email/password form */}
        </p>
        <button className="w-full px-6 py-3 bg-black text-white rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
          Continue with Email
        </button>

        {/* Optional: Signup Link */}
        <p className="mt-8 text-gray-700 text-base">
          Don't have an account?{' '}
          <a href="#" className="font-semibold text-black hover:underline">
            Sign up
          </a>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;