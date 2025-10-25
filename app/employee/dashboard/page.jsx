"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiLogOut,
  FiUser,
  FiActivity,
  FiCreditCard,
  FiLock,
} from "react-icons/fi";
import { useAuth } from "@/lib/authContext";
import { auth } from "@/firebase";
import {
  getEmployeeProfile,
  requestMonthlyWithdrawal,
  getEmployeeWithdrawalsHistory,
  activateSubscription,
} from "@/lib/firebaseService";

export default function EmployeeDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [employee, setEmployee] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [notification, setNotification] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchEmployeeData = async () => {
      try {
        const profile = await getEmployeeProfile(user.uid);

        if (!profile) {
          // Employee not found - company needs to add them
          setEmployee({
            name: user.email?.split("@")[0] || "Employee",
            email: user.email,
            monthlySalary: 0,
            trustScore: 50,
            totalWithdrawn: 0,
            onTimeRepayments: 0,
            lateRepayments: 0,
            hasSubscription: false,
          });
          setLoading(false);
          return;
        }

        setEmployee(profile);
        setHasActiveSubscription(profile.hasSubscription || false);

        if (profile.hasSubscription) {
          const withdrawalHistory = await getEmployeeWithdrawalsHistory(
            user.uid
          );
          setWithdrawals(withdrawalHistory);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        showNotificationMessage("error", "Failed to load employee data");
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [user]);

  const showNotificationMessage = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFakePayment = async () => {
    setPaymentProcessing(true);
    showNotificationMessage("success", "Processing payment...");

    try {
      // Activate subscription in Firebase
      await activateSubscription(user.uid);

      // Simulate payment delay for UX
      setTimeout(async () => {
        setHasActiveSubscription(true);
        setEmployee({ ...employee, hasSubscription: true });
        setShowPaymentModal(false);
        setPaymentProcessing(false);
        showNotificationMessage(
          "success",
          "✨ Subscription activated! Welcome to ZestPay!"
        );

        // Fetch withdrawal history after subscription
        const withdrawalHistory = await getEmployeeWithdrawalsHistory(user.uid);
        setWithdrawals(withdrawalHistory);
      }, 2500);
    } catch (error) {
      console.error("Error activating subscription:", error);
      setPaymentProcessing(false);
      showNotificationMessage("error", "Payment failed. Please try again.");
    }
  };

  const handleWithdrawalRequest = async (e) => {
    e.preventDefault();

    if (!hasActiveSubscription) {
      showNotificationMessage("error", "Please activate subscription first");
      setShowPaymentModal(true);
      return;
    }

    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      showNotificationMessage("error", "Please enter a valid amount");
      return;
    }

    const amount = parseFloat(withdrawalAmount);
    const maxWithdrawal = (employee.monthlySalary * employee.trustScore) / 100;
    const alreadyWithdrawn = employee.totalWithdrawn || 0;
    const availableAmount = maxWithdrawal - alreadyWithdrawn;

    if (amount > availableAmount) {
      showNotificationMessage(
        "error",
        `Amount exceeds available limit. Available: ₹${availableAmount.toFixed(
          2
        )}`
      );
      return;
    }

    try {
      await requestMonthlyWithdrawal(user.uid, {
        amount,
        reason: withdrawalReason,
      });

      showNotificationMessage("success", "Withdrawal request submitted!");
      setShowWithdrawalModal(false);
      setWithdrawalAmount("");
      setWithdrawalReason("");

      const withdrawalHistory = await getEmployeeWithdrawalsHistory(user.uid);
      setWithdrawals(withdrawalHistory);
    } catch (error) {
      console.error("Error requesting withdrawal:", error);
      showNotificationMessage(
        "error",
        error.message || "Failed to request withdrawal"
      );
    }
  };

  const calculateAvailableAmount = () => {
    if (!employee) return 0;
    const maxWithdrawal = (employee.monthlySalary * employee.trustScore) / 100;
    const alreadyWithdrawn = employee.totalWithdrawn || 0;
    return Math.max(0, maxWithdrawal - alreadyWithdrawn);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="mt-4 text-yellow-400 font-semibold">
            Loading Dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  if (!employee || employee.monthlySalary === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-8 shadow-2xl">
            <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Account Not Setup
            </h2>
            <p className="text-gray-400 mb-6">
              Your company admin needs to add you to the system. Please contact
              your HR department.
            </p>
            <button
              onClick={() => auth.signOut()}
              className="px-6 py-2 bg-yellow-400/10 text-yellow-400 rounded-lg hover:bg-yellow-400/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const availableAmount = calculateAvailableAmount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-900 border-b border-yellow-400/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
            >
              ZestPay
            </Link>

            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-400">
                {hasActiveSubscription ? (
                  <span className="flex items-center text-green-400">
                    <FiCheckCircle className="mr-1" /> Active
                  </span>
                ) : (
                  <span className="flex items-center text-yellow-400">
                    <FiLock className="mr-1" /> Locked
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-300">{employee.email}</span>
              <button
                onClick={() => auth.signOut()}
                className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                title="Sign Out"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-xl border ${
              notification.type === "success"
                ? "bg-green-500/20 border-green-500/50 text-green-400"
                : "bg-red-500/20 border-red-500/50 text-red-400"
            }`}
          >
            {notification.message}
          </div>
        </div>
      )}

      {/* Subscription Alert Banner */}
      {!hasActiveSubscription && (
        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border-y border-yellow-400/30 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FiLock className="w-6 h-6 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Subscription Required
                  </h3>
                  <p className="text-sm text-gray-400">
                    Activate your subscription to unlock all ZestPay features
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105"
              >
                Activate Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              {employee.name}
            </span>
            !
          </h1>
          <p className="text-gray-400">Here's your financial overview</p>
        </div>

        {/* Trust Score Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-yellow-400/10 to-orange-400/10 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Trust Score</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  {employee.trustScore}%
                </div>
              </div>
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <FiActivity className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-500"
                style={{ width: `${employee.trustScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-6 shadow-xl hover:shadow-yellow-400/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm">Monthly Salary</h3>
              <FiDollarSign className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              ₹{employee.monthlySalary.toLocaleString()}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-6 shadow-xl hover:shadow-yellow-400/20 transition-all relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm">Available Amount</h3>
              <FiTrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              ₹{availableAmount.toLocaleString()}
            </div>
            {!hasActiveSubscription && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FiLock className="w-8 h-8 text-yellow-400" />
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-6 shadow-xl hover:shadow-yellow-400/20 transition-all relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm">Total Withdrawn</h3>
              <FiClock className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              ₹{(employee.totalWithdrawn || 0).toLocaleString()}
            </div>
            {!hasActiveSubscription && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FiLock className="w-8 h-8 text-yellow-400" />
              </div>
            )}
          </div>
        </div>

        {/* Request Withdrawal Button */}
        <div className="mb-8">
          <button
            onClick={() => {
              if (!hasActiveSubscription) {
                setShowPaymentModal(true);
              } else {
                setShowWithdrawalModal(true);
              }
            }}
            disabled={!hasActiveSubscription}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform ${
              hasActiveSubscription
                ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 hover:scale-105"
                : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            {hasActiveSubscription
              ? "Request Withdrawal"
              : "🔒 Unlock to Request Withdrawal"}
          </button>
        </div>

        {/* Withdrawal History */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-6 shadow-2xl relative">
          <h2 className="text-2xl font-bold text-white mb-6">
            Withdrawal History
          </h2>

          {!hasActiveSubscription && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
              <div className="text-center">
                <FiLock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <p className="text-xl text-white font-bold">
                  Activate Subscription
                </p>
                <p className="text-gray-400 mb-4">to view withdrawal history</p>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
                >
                  Unlock Now
                </button>
              </div>
            </div>
          )}

          {withdrawals.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No withdrawals yet</p>
          ) : (
            <div className="space-y-4">
              {withdrawals.slice(0, 5).map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="bg-gray-900/50 border border-yellow-400/10 rounded-xl p-4 hover:border-yellow-400/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-white">
                        ₹{withdrawal.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(withdrawal.requestDate).toLocaleDateString()}
                      </div>
                      {withdrawal.reason && (
                        <div className="text-sm text-gray-500 mt-1">
                          {withdrawal.reason}
                        </div>
                      )}
                    </div>
                    <div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          withdrawal.status === "approved"
                            ? "bg-green-500/20 text-green-400"
                            : withdrawal.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {withdrawal.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCreditCard className="w-10 h-10 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Activate Subscription
              </h2>
              <p className="text-gray-400">Unlock all ZestPay features</p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 mb-6 border border-yellow-400/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">Subscription Plan</span>
                <span className="text-white font-bold">Monthly</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">Amount</span>
                <span className="text-3xl font-bold text-yellow-400">₹99</span>
              </div>
              <div className="border-t border-gray-700 pt-4 mt-4">
                <p className="text-sm text-gray-500">
                  ✓ Unlimited withdrawal requests
                  <br />
                  ✓ Instant approvals
                  <br />
                  ✓ Priority support
                  <br />✓ Trust score tracking
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleFakePayment}
                disabled={paymentProcessing}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentProcessing
                  ? "Processing..."
                  : "Pay with Razorpay (Demo)"}
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={paymentProcessing}
                className="w-full py-3 bg-gray-800/50 text-gray-400 rounded-xl hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              This is a demo payment. No actual charges will be made.
            </p>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && hasActiveSubscription && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              Request Withdrawal
            </h2>

            <form onSubmit={handleWithdrawalRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-yellow-400/20 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="Enter amount"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: ₹{availableAmount.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-yellow-400/20 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="Why do you need this withdrawal?"
                  rows="3"
                ></textarea>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowWithdrawalModal(false);
                    setWithdrawalAmount("");
                    setWithdrawalReason("");
                  }}
                  className="w-full py-3 bg-gray-800/50 text-gray-400 rounded-lg hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
