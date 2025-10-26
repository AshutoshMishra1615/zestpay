"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
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
  FiHome,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiChevronRight,
  FiCalendar,
  FiPlus,
  FiDownload,
  FiFilter,
  FiSearch,
  FiMenu,
  FiX,
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Refs for GSAP animations
  const metricsRef = useRef([]);
  const headerRef = useRef(null);
  const welcomeRef = useRef(null);
  const trustScoreRef = useRef(null);
  const historyRef = useRef(null);
  const quickActionsRef = useRef([]);

  const showNotificationMessage = (type, message) => {
    setNotification({ type, message });

    // GSAP animation for notification
    gsap.fromTo(
      ".notification-toast",
      { x: 400, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );

    setTimeout(() => {
      gsap.to(".notification-toast", {
        x: 400,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setNotification(null),
      });
    }, 3500);
  };

  useEffect(() => {
    if (!user) return;

    const fetchEmployeeData = async () => {
      try {
        const profile = await getEmployeeProfile(user.uid);

        if (!profile) {
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

  // GSAP animations on component mount
  useEffect(() => {
    if (!loading && employee) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Animate header
      tl.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.6,
      });

      // Animate welcome section
      tl.from(
        welcomeRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.5,
        },
        "-=0.3"
      );

      // Animate trust score card
      tl.from(
        trustScoreRef.current,
        {
          scale: 0.9,
          opacity: 0,
          duration: 0.6,
        },
        "-=0.2"
      );

      // Stagger metrics cards
      tl.from(
        metricsRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
        },
        "-=0.4"
      );

      // Animate quick actions
      tl.from(
        quickActionsRef.current,
        {
          scale: 0.95,
          opacity: 0,
          duration: 0.4,
          stagger: 0.08,
        },
        "-=0.3"
      );

      // Animate history section
      tl.from(
        historyRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.5,
        },
        "-=0.2"
      );

      // Animate trust score progress
      gsap.to(".trust-score-progress", {
        width: `${employee.trustScore}%`,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.8,
      });
    }
  }, [loading, employee]);

  // Modal animations
  useEffect(() => {
    if (showWithdrawalModal || showPaymentModal || showDetailsModal) {
      gsap.fromTo(
        ".modal-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(
        ".modal-content",
        { scale: 0.9, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.5)" }
      );
    }
  }, [showWithdrawalModal, showPaymentModal, showDetailsModal]);

  const handleFakePayment = async () => {
    setPaymentProcessing(true);
    showNotificationMessage("success", "Processing payment...");

    try {
      await activateSubscription(user.uid);

      setTimeout(async () => {
        setHasActiveSubscription(true);
        setEmployee({ ...employee, hasSubscription: true });
        setShowPaymentModal(false);
        setPaymentProcessing(false);
        showNotificationMessage(
          "success",
          "Subscription activated successfully"
        );

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

  const handleNavClick = (navId) => {
    setActiveNav(navId);

    // GSAP animation for nav transition
    gsap.fromTo(
      ".content-wrapper",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  };

  const handleExportTransactions = () => {
    if (!hasActiveSubscription || withdrawals.length === 0) {
      showNotificationMessage("error", "No transactions to export");
      return;
    }

    // Create CSV content
    const headers = ["Date", "Time", "Amount", "Reason", "Status"];
    const csvContent = [
      headers.join(","),
      ...withdrawals.map((w) => {
        const date = new Date(w.requestDate);
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const timeStr = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return [
          dateStr,
          timeStr,
          `₹${w.amount}`,
          `"${w.reason || "No reason provided"}"`,
          w.status.charAt(0).toUpperCase() + w.status.slice(1),
        ].join(",");
      }),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `zestpay_transactions_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotificationMessage("success", "Transactions exported successfully");
  };

  const handleViewDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowDetailsModal(true);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-sm text-gray-400 font-medium">
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
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-yellow-500/20 rounded-xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Account Setup Required
            </h2>
            <p className="text-gray-400 mb-6">
              Your company admin needs to add you to the system. Please contact
              your HR department.
            </p>
            <button
              onClick={() => auth.signOut()}
              className="px-6 py-2.5 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const availableAmount = calculateAvailableAmount();

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome },
    { id: "withdrawals", label: "Withdrawals", icon: FiFileText },
    { id: "analytics", label: "Analytics", icon: FiBarChart2 },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex font-inter">
      {/* Sidebar Navigation */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-black via-gray-950 to-black border-r border-yellow-500/20 transition-all duration-300 z-40 ${
          sidebarCollapsed ? "w-20" : "w-64"
        } ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-yellow-500/20">
          {!sidebarCollapsed && (
            <Link href="/" className="text-2xl font-space-grotesk font-bold">
              <span className="text-white">zest</span>
              <span className="text-yellow-400">pay</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-yellow-500/10 rounded-lg transition-all hover:scale-110 hidden lg:block"
          >
            <FiChevronRight
              className={`w-5 h-5 text-yellow-400 transition-transform ${
                sidebarCollapsed ? "" : "rotate-180"
              }`}
            />
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-yellow-500/10 rounded-lg transition-all hover:scale-110 lg:hidden"
          >
            <FiX className="w-5 h-5 text-yellow-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                handleNavClick(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-poppins font-medium transition-all ${
                activeNav === item.id
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-500/30"
                  : "text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-400 hover:translate-x-1"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-yellow-500/20">
          <div
            className={`flex items-center gap-3 p-3 rounded-xl hover:bg-yellow-500/10 transition-all hover:scale-[1.02] cursor-pointer mb-2 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 border border-yellow-500/30 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/20">
              <FiUser className="w-5 h-5 text-black" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-poppins font-semibold text-white truncate">
                  {employee.name}
                </div>
                <div className="text-xs text-gray-400 truncate font-inter">
                  {employee.email}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => auth.signOut()}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-poppins font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all hover:scale-[1.02] ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Top Bar */}
        <header
          ref={headerRef}
          className="h-20 bg-gradient-to-r from-black via-gray-950 to-black border-b border-yellow-500/20 flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-xl bg-opacity-90"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-yellow-500/10 rounded-lg transition-all hover:scale-110 lg:hidden"
            >
              <FiMenu className="w-6 h-6 text-yellow-400" />
            </button>
            <div>
              <h1 className="text-xl font-space-grotesk font-bold text-white">
                Dashboard
              </h1>
              <p className="text-xs text-gray-400 mt-0.5 font-inter">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Subscription Status */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-yellow-500/5 border border-yellow-500/20 rounded-full">
              <div
                className={`w-2 h-2 rounded-full ${
                  hasActiveSubscription ? "bg-green-500" : "bg-yellow-500"
                } animate-pulse`}
              ></div>
              <span className="text-xs font-medium text-yellow-500">
                {hasActiveSubscription ? "Active Plan" : "No Subscription"}
              </span>
            </div>

            <button className="p-2.5 hover:bg-yellow-500/10 rounded-lg transition-colors">
              <FiSearch className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </header>

        {/* Subscription Banner */}
        {!hasActiveSubscription && (
          <div className="mx-6 mt-6 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <FiLock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Unlock Premium Features
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  Activate your subscription to access all withdrawal features
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
            >
              Activate Now
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 space-y-6 content-wrapper">
          {/* Dashboard View */}
          {activeNav === "dashboard" && (
            <>
              {/* Welcome Section */}
              <div ref={welcomeRef}>
                <h2 className="text-3xl font-bold text-white">
                  Welcome back,{" "}
                  <span className="text-yellow-500">{employee.name}</span>
                </h2>
                <p className="text-gray-400 mt-1">
                  Here's your financial overview for today
                </p>
              </div>

              {/* Trust Score Card */}
              <div
                ref={trustScoreRef}
                className="bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border border-yellow-500/20 rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-400 font-medium uppercase tracking-wide mb-2">
                        Trust Score
                      </p>
                      <div className="text-5xl font-bold text-yellow-500">
                        {employee.trustScore}%
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {employee.trustScore >= 80
                          ? "Excellent standing"
                          : employee.trustScore >= 60
                          ? "Good standing"
                          : "Needs improvement"}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                      <FiActivity className="w-8 h-8 text-yellow-500" />
                    </div>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="trust-score-progress h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  ref={(el) => (metricsRef.current[0] = el)}
                  className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-400/40 transition-all group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl group-hover:bg-yellow-400/10 transition-all" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-400 font-poppins font-medium uppercase tracking-wider mb-2">
                          Monthly Salary
                        </p>
                        <h3 className="text-3xl font-space-grotesk font-bold text-white">
                          ₹{(employee.monthlySalary / 1000).toFixed(0)}k
                        </h3>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/10">
                        <FiDollarSign className="w-7 h-7 text-yellow-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 font-inter">
                      ₹{employee.monthlySalary.toLocaleString()} per month
                    </p>
                  </div>
                </div>

                <div
                  ref={(el) => (metricsRef.current[1] = el)}
                  className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-400/40 transition-all group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/5 rounded-full blur-3xl group-hover:bg-green-400/10 transition-all" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-400 font-poppins font-medium uppercase tracking-wider mb-2">
                          Available
                        </p>
                        <h3 className="text-3xl font-space-grotesk font-bold text-white">
                          {hasActiveSubscription
                            ? `₹${(availableAmount / 1000).toFixed(1)}k`
                            : "---"}
                        </h3>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-green-500/10">
                        <FiTrendingUp className="w-7 h-7 text-green-400" />
                      </div>
                    </div>
                    {hasActiveSubscription ? (
                      <p className="text-sm text-gray-500 font-inter">
                        ₹{availableAmount.toLocaleString()} withdrawable
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 font-inter">
                        Subscription required
                      </p>
                    )}
                    {!hasActiveSubscription && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl">
                        <FiLock className="w-10 h-10 text-yellow-400/50" />
                      </div>
                    )}
                  </div>
                </div>

                <div
                  ref={(el) => (metricsRef.current[2] = el)}
                  className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-400/40 transition-all group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/5 rounded-full blur-3xl group-hover:bg-purple-400/10 transition-all" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-400 font-poppins font-medium uppercase tracking-wider mb-2">
                          Withdrawn
                        </p>
                        <h3 className="text-3xl font-space-grotesk font-bold text-white">
                          {hasActiveSubscription
                            ? `₹${(
                                (employee.totalWithdrawn || 0) / 1000
                              ).toFixed(1)}k`
                            : "---"}
                        </h3>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-400/10 to-purple-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/10">
                        <FiClock className="w-7 h-7 text-purple-400" />
                      </div>
                    </div>
                    {hasActiveSubscription ? (
                      <p className="text-sm text-gray-500 font-inter">
                        ₹{(employee.totalWithdrawn || 0).toLocaleString()} this
                        month
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 font-inter">
                        Subscription required
                      </p>
                    )}
                    {!hasActiveSubscription && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl">
                        <FiLock className="w-10 h-10 text-yellow-400/50" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Financial Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Repayment Performance */}
                <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">
                      Repayment Record
                    </h3>
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <FiCheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/50 rounded-xl p-4 border border-green-500/20">
                      <div className="text-2xl font-bold text-green-400">
                        {employee.onTimeRepayments || 0}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        On-time payments
                      </div>
                    </div>
                    <div className="bg-black/50 rounded-xl p-4 border border-red-500/20">
                      <div className="text-2xl font-bold text-red-400">
                        {employee.lateRepayments || 0}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Late payments
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-yellow-500/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Success Rate</span>
                      <span className="text-white font-bold">
                        {employee.onTimeRepayments ||
                        0 + employee.lateRepayments ||
                        0 === 0
                          ? "100%"
                          : `${Math.round(
                              ((employee.onTimeRepayments || 0) /
                                ((employee.onTimeRepayments || 0) +
                                  (employee.lateRepayments || 0))) *
                                100
                            )}%`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Monthly Breakdown */}
                <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">
                      Monthly Overview
                    </h3>
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <FiBarChart2 className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Total Salary
                      </span>
                      <span className="text-white font-bold">
                        ₹{employee.monthlySalary.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-px bg-yellow-500/10"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Max Withdrawal
                      </span>
                      <span className="text-yellow-400 font-bold">
                        ₹
                        {(
                          (employee.monthlySalary * employee.trustScore) /
                          100
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-px bg-yellow-500/10"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Already Withdrawn
                      </span>
                      <span className="text-purple-400 font-bold">
                        ₹{(employee.totalWithdrawn || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-px bg-yellow-500/10"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 font-semibold">
                        Remaining
                      </span>
                      <span className="text-green-400 font-bold text-lg">
                        ₹
                        {hasActiveSubscription
                          ? availableAmount.toLocaleString()
                          : "---"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  ref={(el) => (quickActionsRef.current[0] = el)}
                  onClick={() => {
                    if (!hasActiveSubscription) {
                      setShowPaymentModal(true);
                    } else {
                      setShowWithdrawalModal(true);
                    }
                  }}
                  disabled={!hasActiveSubscription}
                  className={`p-6 border rounded-xl text-left transition-all group transform hover:scale-105 ${
                    hasActiveSubscription
                      ? "bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-500 hover:from-yellow-400 hover:to-yellow-500 shadow-lg shadow-yellow-500/30"
                      : "bg-zinc-900 border-yellow-500/10 cursor-not-allowed opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        hasActiveSubscription
                          ? "bg-black/20"
                          : "bg-yellow-500/10"
                      }`}
                    >
                      <FiPlus
                        className={`w-5 h-5 ${
                          hasActiveSubscription ? "text-black" : "text-gray-500"
                        }`}
                      />
                    </div>
                  </div>
                  <h3
                    className={`font-bold text-base mb-1 ${
                      hasActiveSubscription ? "text-black" : "text-gray-500"
                    }`}
                  >
                    Request Withdrawal
                  </h3>
                  <p
                    className={`text-sm ${
                      hasActiveSubscription ? "text-black/70" : "text-gray-600"
                    }`}
                  >
                    {hasActiveSubscription
                      ? "Submit new request"
                      : "Requires subscription"}
                  </p>
                </button>

                <button
                  ref={(el) => (quickActionsRef.current[1] = el)}
                  onClick={() => handleNavClick("withdrawals")}
                  className="p-6 bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-xl text-left transition-all group hover:border-yellow-400/40 transform hover:scale-105"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <FiFileText className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="font-bold text-base mb-1 text-white">
                    View History
                  </h3>
                  <p className="text-sm text-gray-400">
                    {withdrawals.length} transactions
                  </p>
                </button>

                <button
                  ref={(el) => (quickActionsRef.current[2] = el)}
                  onClick={() => handleNavClick("analytics")}
                  className="p-6 bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-xl text-left transition-all group hover:border-yellow-400/40 transform hover:scale-105"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <FiBarChart2 className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <h3 className="font-bold text-base mb-1 text-white">
                    Analytics
                  </h3>
                  <p className="text-sm text-gray-400">Track your spending</p>
                </button>

                <button
                  ref={(el) => (quickActionsRef.current[3] = el)}
                  disabled={!hasActiveSubscription}
                  className={`p-6 rounded-xl text-left transition-all group transform hover:scale-105 ${
                    hasActiveSubscription
                      ? "bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 hover:border-yellow-400/40"
                      : "bg-zinc-900 border border-yellow-500/10 cursor-not-allowed opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        hasActiveSubscription
                          ? "bg-green-500/10"
                          : "bg-gray-500/10"
                      }`}
                    >
                      <FiDownload
                        className={`w-5 h-5 ${
                          hasActiveSubscription
                            ? "text-green-400"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                  </div>
                  <h3
                    className={`font-bold text-base mb-1 ${
                      hasActiveSubscription ? "text-white" : "text-gray-500"
                    }`}
                  >
                    Download Report
                  </h3>
                  <p
                    className={`text-sm ${
                      hasActiveSubscription ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {hasActiveSubscription
                      ? "Export statements"
                      : "Coming soon"}
                  </p>
                </button>
              </div>

              {/* Withdrawal History */}
              <div
                ref={historyRef}
                className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="p-6 border-b border-yellow-500/10 bg-black/30">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FiFileText className="w-6 h-6 text-yellow-400" />
                        Transaction History
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {withdrawals.length > 0
                          ? `${withdrawals.length} total transaction${
                              withdrawals.length !== 1 ? "s" : ""
                            }`
                          : "No transactions yet"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={
                          !hasActiveSubscription || withdrawals.length === 0
                        }
                        className="flex items-center gap-2 px-4 py-2.5 bg-black/50 border border-yellow-500/20 text-sm text-gray-300 rounded-lg hover:border-yellow-500/40 hover:bg-black/70 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FiFilter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filter</span>
                      </button>
                      <button
                        disabled={
                          !hasActiveSubscription || withdrawals.length === 0
                        }
                        onClick={handleExportTransactions}
                        className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500/10 border border-yellow-500/30 text-sm text-yellow-400 font-medium rounded-lg hover:bg-yellow-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FiDownload className="w-4 h-4" />
                        <span className="hidden sm:inline">Export</span>
                      </button>
                    </div>
                  </div>
                </div>

                {!hasActiveSubscription ? (
                  <div className="p-16 text-center bg-gradient-to-b from-transparent to-black/30">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
                      <FiLock className="w-10 h-10 text-yellow-500/70" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Premium Feature
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
                      Activate your subscription to unlock transaction history
                      and detailed analytics
                    </p>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/30"
                    >
                      Activate Subscription
                    </button>
                  </div>
                ) : withdrawals.length === 0 ? (
                  <div className="p-16 text-center bg-gradient-to-b from-transparent to-black/30">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                      <FiFileText className="w-10 h-10 text-blue-400/70" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      No Transactions Yet
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
                      Your withdrawal history will appear here once you make
                      your first request
                    </p>
                    <button
                      onClick={() => setShowWithdrawalModal(true)}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/30"
                    >
                      Request Withdrawal
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-yellow-500/10 bg-black/40">
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider hidden md:table-cell">
                            Reason
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-yellow-500/10">
                        {withdrawals.slice(0, 10).map((withdrawal, index) => (
                          <tr
                            key={withdrawal.id}
                            className="hover:bg-yellow-500/5 transition-colors group"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                                  <FiCalendar className="w-4 h-4 text-yellow-400" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">
                                    {withdrawal.requestDate &&
                                    !isNaN(
                                      new Date(withdrawal.requestDate).getTime()
                                    )
                                      ? new Date(
                                          withdrawal.requestDate
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })
                                      : new Date().toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {withdrawal.requestDate &&
                                    !isNaN(
                                      new Date(withdrawal.requestDate).getTime()
                                    )
                                      ? new Date(
                                          withdrawal.requestDate
                                        ).toLocaleTimeString("en-US", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : new Date().toLocaleTimeString("en-US", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-base font-bold text-white">
                                ₹{withdrawal.amount.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {withdrawal.status === "approved" ||
                                withdrawal.status === "success"
                                  ? "Credited"
                                  : "Processing"}
                              </div>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              <div className="text-sm text-gray-300 max-w-xs truncate">
                                {withdrawal.reason || "No reason provided"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                                  withdrawal.status === "approved" ||
                                  withdrawal.status === "success" ||
                                  !withdrawal.status
                                    ? "bg-green-500/10 text-green-400 border-green-500/30"
                                    : withdrawal.status === "rejected"
                                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                                }`}
                              >
                                {(withdrawal.status === "approved" ||
                                  withdrawal.status === "success" ||
                                  !withdrawal.status) && (
                                  <FiCheckCircle className="w-3 h-3" />
                                )}
                                {withdrawal.status === "rejected" && (
                                  <FiAlertCircle className="w-3 h-3" />
                                )}
                                {withdrawal.status === "approved" ||
                                withdrawal.status === "success" ||
                                !withdrawal.status
                                  ? "Success"
                                  : withdrawal.status.charAt(0).toUpperCase() +
                                    withdrawal.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button
                                onClick={() => handleViewDetails(withdrawal)}
                                className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination footer for transactions */}
                {hasActiveSubscription && withdrawals.length > 10 && (
                  <div className="px-6 py-4 border-t border-yellow-500/10 bg-black/30 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Showing 1-10 of {withdrawals.length} transactions
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 bg-black/50 border border-yellow-500/20 text-sm text-gray-300 rounded-lg hover:border-yellow-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                      </button>
                      <button className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 text-sm text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-colors">
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <FiActivity className="w-5 h-5 text-blue-400" />
                    </div>
                    <h4 className="font-bold text-white">Next Payday</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-400 mb-1">
                    {new Date(
                      new Date().getFullYear(),
                      new Date().getMonth() + 1,
                      1
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-400">
                    {Math.ceil(
                      (new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 1,
                        1
                      ) -
                        new Date()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days remaining
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <FiCreditCard className="w-5 h-5 text-purple-400" />
                    </div>
                    <h4 className="font-bold text-white">Account Status</h4>
                  </div>
                  <p className="text-2xl font-bold text-purple-400 mb-1">
                    {hasActiveSubscription ? "Premium" : "Free"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {hasActiveSubscription
                      ? "All features unlocked"
                      : "Upgrade to unlock"}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <FiCheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <h4 className="font-bold text-white">Reliability</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-400 mb-1">
                    {employee.trustScore >= 80
                      ? "Excellent"
                      : employee.trustScore >= 60
                      ? "Good"
                      : "Fair"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Trust score: {employee.trustScore}%
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Withdrawals View */}
          {activeNav === "withdrawals" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Withdrawal Management
                </h2>
                <p className="text-gray-400">
                  Request and track your salary advances
                </p>
              </div>

              {/* Withdrawal Request Card */}
              <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Quick Withdrawal Request
                    </h3>
                    <p className="text-gray-400">
                      Available:{" "}
                      <span className="text-yellow-500 font-bold">
                        ₹
                        {hasActiveSubscription
                          ? availableAmount.toLocaleString()
                          : "---"}
                      </span>
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <FiDollarSign className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>

                {!hasActiveSubscription ? (
                  <div className="text-center py-12">
                    <FiLock className="w-16 h-16 text-yellow-500/50 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">
                      Premium Feature
                    </h4>
                    <p className="text-gray-400 mb-6">
                      Activate subscription to request withdrawals
                    </p>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/30"
                    >
                      Activate Now
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowWithdrawalModal(true)}
                    className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-2"
                  >
                    <FiPlus className="w-5 h-5" />
                    Request New Withdrawal
                  </button>
                )}
              </div>

              {/* Withdrawal History Section - Reused from dashboard */}
              <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-yellow-500/10 bg-black/30">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FiFileText className="w-6 h-6 text-yellow-400" />
                        All Withdrawals
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {withdrawals.length > 0
                          ? `${withdrawals.length} total transaction${
                              withdrawals.length !== 1 ? "s" : ""
                            }`
                          : "No transactions yet"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={
                          !hasActiveSubscription || withdrawals.length === 0
                        }
                        className="flex items-center gap-2 px-4 py-2.5 bg-black/50 border border-yellow-500/20 text-sm text-gray-300 rounded-lg hover:border-yellow-500/40 hover:bg-black/70 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FiFilter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filter</span>
                      </button>
                      <button
                        disabled={
                          !hasActiveSubscription || withdrawals.length === 0
                        }
                        onClick={handleExportTransactions}
                        className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500/10 border border-yellow-500/30 text-sm text-yellow-400 font-medium rounded-lg hover:bg-yellow-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FiDownload className="w-4 h-4" />
                        <span className="hidden sm:inline">Export</span>
                      </button>
                    </div>
                  </div>
                </div>

                {!hasActiveSubscription ? (
                  <div className="p-16 text-center bg-gradient-to-b from-transparent to-black/30">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
                      <FiLock className="w-10 h-10 text-yellow-500/70" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Premium Feature
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
                      Activate your subscription to view complete withdrawal
                      history
                    </p>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/30"
                    >
                      Activate Subscription
                    </button>
                  </div>
                ) : withdrawals.length === 0 ? (
                  <div className="p-16 text-center bg-gradient-to-b from-transparent to-black/30">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                      <FiFileText className="w-10 h-10 text-blue-400/70" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      No Withdrawals Yet
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
                      Your withdrawal history will appear here once you make
                      your first request
                    </p>
                    <button
                      onClick={() => setShowWithdrawalModal(true)}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/30"
                    >
                      Request Withdrawal
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-yellow-500/10 bg-black/40">
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider hidden md:table-cell">
                            Reason
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-yellow-500/10">
                        {withdrawals.map((withdrawal, index) => {
                          const withdrawalDate =
                            withdrawal.requestDate &&
                            !isNaN(new Date(withdrawal.requestDate).getTime())
                              ? new Date(withdrawal.requestDate)
                              : new Date();

                          return (
                            <tr
                              key={withdrawal.id}
                              className="hover:bg-yellow-500/5 transition-colors group"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                                    <FiCalendar className="w-4 h-4 text-yellow-400" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-white">
                                      {withdrawalDate.toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        }
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {withdrawalDate.toLocaleTimeString(
                                        "en-US",
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-base font-bold text-white">
                                  ₹{withdrawal.amount.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {withdrawal.status === "approved" ||
                                  withdrawal.status === "success" ||
                                  !withdrawal.status
                                    ? "Credited"
                                    : "Pending"}
                                </div>
                              </td>
                              <td className="px-6 py-4 hidden md:table-cell">
                                <div className="text-sm text-gray-300 max-w-xs truncate">
                                  {withdrawal.reason || "No reason provided"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                                    withdrawal.status === "approved" ||
                                    withdrawal.status === "success" ||
                                    !withdrawal.status
                                      ? "bg-green-500/10 text-green-400 border-green-500/30"
                                      : withdrawal.status === "pending"
                                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                                      : "bg-red-500/10 text-red-400 border-red-500/30"
                                  }`}
                                >
                                  {(withdrawal.status === "approved" ||
                                    withdrawal.status === "success" ||
                                    !withdrawal.status) && (
                                    <FiCheckCircle className="w-3 h-3" />
                                  )}
                                  {withdrawal.status === "pending" && (
                                    <FiClock className="w-3 h-3" />
                                  )}
                                  {withdrawal.status === "rejected" && (
                                    <FiAlertCircle className="w-3 h-3" />
                                  )}
                                  {withdrawal.status === "approved" ||
                                  withdrawal.status === "success" ||
                                  !withdrawal.status
                                    ? "Success"
                                    : withdrawal.status
                                        .charAt(0)
                                        .toUpperCase() +
                                      withdrawal.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <button
                                  onClick={() => handleViewDetails(withdrawal)}
                                  className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics View */}
          {activeNav === "analytics" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Financial Analytics
                </h2>
                <p className="text-gray-400">
                  Track your spending patterns and financial health
                </p>
              </div>

              {!hasActiveSubscription ? (
                <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl p-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
                    <FiLock className="w-10 h-10 text-yellow-500/70" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Premium Analytics
                  </h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Unlock detailed financial insights and spending analytics
                    with a premium subscription
                  </p>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/30"
                  >
                    Activate Subscription
                  </button>
                </div>
              ) : (
                <>
                  {/* Analytics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <FiTrendingUp className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">
                        {withdrawals.length}
                      </h3>
                      <p className="text-sm text-gray-400">Total Requests</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <FiCheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">
                        {
                          withdrawals.filter((w) => w.status === "approved")
                            .length
                        }
                      </h3>
                      <p className="text-sm text-gray-400">Approved</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <FiClock className="w-6 h-6 text-yellow-400" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">
                        {
                          withdrawals.filter((w) => w.status === "pending")
                            .length
                        }
                      </h3>
                      <p className="text-sm text-gray-400">Pending</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <FiDollarSign className="w-6 h-6 text-purple-400" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">
                        ₹{(employee.totalWithdrawn || 0).toLocaleString()}
                      </h3>
                      <p className="text-sm text-gray-400">Total Withdrawn</p>
                    </div>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">
                      Withdrawal Trends
                    </h3>
                    <div className="h-64 bg-black/50 rounded-xl border border-yellow-500/10 flex items-center justify-center">
                      <div className="text-center">
                        <FiBarChart2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500">
                          Chart visualization coming soon
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Spending Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FiActivity className="w-5 h-5 text-yellow-400" />
                        Monthly Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                          <span className="text-gray-400">Average Request</span>
                          <span className="text-white font-bold">
                            ₹
                            {withdrawals.length > 0
                              ? Math.round(
                                  withdrawals.reduce(
                                    (sum, w) => sum + w.amount,
                                    0
                                  ) / withdrawals.length
                                ).toLocaleString()
                              : "0"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                          <span className="text-gray-400">Success Rate</span>
                          <span className="text-green-400 font-bold">
                            {withdrawals.length > 0
                              ? Math.round(
                                  (withdrawals.filter(
                                    (w) => w.status === "approved"
                                  ).length /
                                    withdrawals.length) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                          <span className="text-gray-400">
                            Available Balance
                          </span>
                          <span className="text-yellow-400 font-bold">
                            ₹{availableAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FiCheckCircle className="w-5 h-5 text-green-400" />
                        Financial Health
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">
                              Trust Score
                            </span>
                            <span className="text-yellow-400 font-bold">
                              {employee.trustScore}%
                            </span>
                          </div>
                          <div className="w-full bg-black/50 rounded-full h-2">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-1000"
                              style={{ width: `${employee.trustScore}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">
                              Utilization
                            </span>
                            <span className="text-purple-400 font-bold">
                              {Math.round(
                                ((employee.totalWithdrawn || 0) /
                                  ((employee.monthlySalary *
                                    employee.trustScore) /
                                    100)) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-black/50 rounded-full h-2">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round(
                                    ((employee.totalWithdrawn || 0) /
                                      ((employee.monthlySalary *
                                        employee.trustScore) /
                                        100)) *
                                      100
                                  )
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 notification-toast">
          <div
            className={`px-5 py-4 rounded-lg border backdrop-blur-sm shadow-2xl ${
              notification.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-500"
                : "bg-red-500/10 border-red-500/30 text-red-500"
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === "success" ? (
                <FiCheckCircle className="w-5 h-5" />
              ) : (
                <FiAlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                {notification.message}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-50 p-4 modal-overlay">
          <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/30 rounded-2xl max-w-lg w-full shadow-2xl shadow-yellow-500/20 modal-content relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-600/10 rounded-full blur-3xl"></div>

            <div className="relative p-6 border-b border-yellow-500/20">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
                <FiCreditCard className="w-10 h-10 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-space-grotesk font-bold text-white text-center mb-2">
                Activate Premium
              </h2>
              <p className="text-gray-400 text-center">
                Unlock the full potential of ZestPay
              </p>
            </div>

            <div className="relative p-6 space-y-6">
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                      Monthly Plan
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-5xl font-bold text-yellow-500">
                        ₹99
                      </span>
                      <span className="text-gray-500 text-sm mb-2">/month</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
                    <span className="text-xs font-bold text-yellow-400 uppercase">
                      Best Value
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-yellow-500/20 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiCheckCircle className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Unlimited Withdrawals
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Request as many times as you need
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiCheckCircle className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Instant Processing
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Get approved within minutes
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiCheckCircle className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Priority Support
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        24/7 dedicated assistance
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiCheckCircle className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Advanced Analytics
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Track spending and trust score
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFakePayment}
                disabled={paymentProcessing}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-2"
              >
                {paymentProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FiCreditCard className="w-5 h-5" />
                    <span>Continue to Payment</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={paymentProcessing}
                className="w-full py-3 bg-black/50 border border-yellow-500/20 text-gray-300 font-medium rounded-xl hover:border-yellow-500/40 hover:bg-black/70 transition-all disabled:opacity-50"
              >
                Maybe Later
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  🔒 Demo Mode - No actual charges will be made
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && hasActiveSubscription && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 modal-overlay">
          <div className="bg-zinc-900 border border-yellow-500/20 rounded-2xl max-w-md w-full shadow-2xl shadow-yellow-500/10 modal-content">
            <div className="p-6 border-b border-yellow-500/10">
              <h2 className="text-2xl font-bold text-white">
                Request Withdrawal
              </h2>
              <p className="text-gray-400 mt-1">
                Available:{" "}
                <span className="text-yellow-500 font-bold">
                  ₹{availableAmount.toLocaleString()}
                </span>
              </p>
            </div>

            <form onSubmit={handleWithdrawalRequest} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-yellow-500/20 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-yellow-500/20 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                  placeholder="Why do you need this withdrawal?"
                  rows="4"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowWithdrawalModal(false);
                    setWithdrawalAmount("");
                    setWithdrawalReason("");
                  }}
                  className="flex-1 py-3 bg-black border border-yellow-500/20 text-gray-400 rounded-lg hover:border-yellow-500/40 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 modal-overlay">
          <div className="bg-zinc-900 border border-yellow-500/20 rounded-2xl max-w-lg w-full shadow-2xl shadow-yellow-500/10 modal-content">
            <div className="p-6 border-b border-yellow-500/10 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FiFileText className="w-6 h-6 text-yellow-400" />
                Transaction Details
              </h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedWithdrawal(null);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-black/50 border border-yellow-500/20 text-gray-400 hover:text-white hover:border-yellow-500/40 transition-all"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div
                className={`p-4 rounded-xl border ${
                  selectedWithdrawal.status === "approved" ||
                  selectedWithdrawal.status === "success" ||
                  !selectedWithdrawal.status
                    ? "bg-green-500/10 border-green-500/30"
                    : selectedWithdrawal.status === "pending"
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-bold ${
                      selectedWithdrawal.status === "approved" ||
                      selectedWithdrawal.status === "success" ||
                      !selectedWithdrawal.status
                        ? "text-green-400"
                        : selectedWithdrawal.status === "pending"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {selectedWithdrawal.status === "approved" ||
                    selectedWithdrawal.status === "success" ||
                    !selectedWithdrawal.status
                      ? "✓ Transaction Success"
                      : selectedWithdrawal.status === "pending"
                      ? "⏳ Pending Approval"
                      : "✕ Transaction Failed"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                      selectedWithdrawal.status === "approved" ||
                      selectedWithdrawal.status === "success" ||
                      !selectedWithdrawal.status
                        ? "bg-green-500/20 text-green-400 border-green-500/40"
                        : selectedWithdrawal.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
                        : "bg-red-500/20 text-red-400 border-red-500/40"
                    }`}
                  >
                    {selectedWithdrawal.status === "approved" ||
                    selectedWithdrawal.status === "success" ||
                    !selectedWithdrawal.status
                      ? "Success"
                      : selectedWithdrawal.status.charAt(0).toUpperCase() +
                        selectedWithdrawal.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-black/40 border border-yellow-500/10 rounded-xl p-6 text-center">
                <div className="text-sm text-gray-400 mb-2">
                  Transaction Amount
                </div>
                <div className="text-4xl font-bold text-white mb-1">
                  ₹{selectedWithdrawal.amount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {selectedWithdrawal.status === "approved" ||
                  selectedWithdrawal.status === "success" ||
                  !selectedWithdrawal.status
                    ? "Successfully credited to your account"
                    : selectedWithdrawal.status === "pending"
                    ? "Awaiting approval"
                    : "Transaction not processed"}
                </div>
              </div>

              {/* Transaction Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-yellow-500/10">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiCalendar className="w-4 h-4" />
                    <span className="text-sm">Request Date</span>
                  </div>
                  <div className="text-white font-medium">
                    {selectedWithdrawal.requestDate &&
                    !isNaN(new Date(selectedWithdrawal.requestDate).getTime())
                      ? new Date(
                          selectedWithdrawal.requestDate
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-yellow-500/10">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiDollarSign className="w-4 h-4" />
                    <span className="text-sm">Transaction ID</span>
                  </div>
                  <div className="text-white font-medium font-mono text-sm">
                    {selectedWithdrawal.id || "N/A"}
                  </div>
                </div>

                <div className="flex items-start justify-between py-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiFileText className="w-4 h-4" />
                    <span className="text-sm">Reason</span>
                  </div>
                  <div className="text-white font-medium text-right max-w-xs">
                    {selectedWithdrawal.reason || "No reason provided"}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedWithdrawal(null);
                }}
                className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}
