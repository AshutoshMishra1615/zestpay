"use client";
import React from "react";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { FiLogOut, FiUser } from "react-icons/fi";

const ProtectedLayout = ({ children, requiredRole = null }) => {
  const { user, loading, logout, role } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">Please log in to continue</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">Access Denied</p>
          <p className="text-sm text-gray-500 mb-4">
            You don't have permission to view this page
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                Z
              </div>
              <span className="text-xl font-bold text-gray-900">ZestPay</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3">
                <FiUser className="text-gray-600" />
                <span className="text-sm text-gray-700">{user.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiLogOut /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      {children}
    </div>
  );
};

export default ProtectedLayout;
