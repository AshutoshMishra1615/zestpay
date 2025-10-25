"use client";
import React, { useState } from "react";
import { FiAlertTriangle, FiTrendingDown } from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const OverUsageWarning = () => {
  const [withdrawals] = useState({
    count: 4,
    fees: 200,
    avgFeePerWithdrawal: 50,
    optimalWithdrawals: 1,
    optimalFee: 50,
  });

  const savingsAmount = withdrawals.fees - withdrawals.optimalFee;
  const warningLevel =
    withdrawals.count > 3 ? "high" : withdrawals.count > 2 ? "medium" : "low";

  const pieData = [
    { name: "Current Fees", value: withdrawals.fees },
    { name: "Could Save", value: savingsAmount },
  ];

  const colors = {
    high: {
      bg: "bg-red-50",
      border: "border-red-500",
      icon: "text-red-500",
      text: "text-red-700",
      button: "bg-red-500 hover:bg-red-600",
    },
    medium: {
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      icon: "text-yellow-500",
      text: "text-yellow-700",
      button: "bg-yellow-500 hover:bg-yellow-600",
    },
    low: {
      bg: "bg-green-50",
      border: "border-green-500",
      icon: "text-green-500",
      text: "text-green-700",
      button: "bg-green-500 hover:bg-green-600",
    },
  };

  const c = colors[warningLevel];

  return (
    <div
      className={`${c.bg} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${c.border}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FiAlertTriangle className={`text-3xl ${c.icon}`} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Frequent Withdrawal Cost Calculator
          </h2>
          <p className="text-sm text-gray-600">
            Analyze your withdrawal patterns
          </p>
        </div>
      </div>

      {/* Alert Box */}
      <div
        className={`rounded-xl border-2 ${c.border} ${c.bg} p-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-500`}
      >
        <h3 className={`text-xl font-bold ${c.text} mb-3`}>
          {warningLevel === "high"
            ? "🚨 High Usage Detected"
            : warningLevel === "medium"
            ? "⚠️ Moderate Usage"
            : "✓ Low Usage"}
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          You have made <strong>{withdrawals.count} withdrawals</strong> this
          pay period. Total fees are <strong>₹{withdrawals.fees}</strong>.
          {warningLevel === "high" &&
            " Consider consolidating your withdrawals to save money."}
        </p>

        {/* Savings Potential */}
        <div
          className="bg-white rounded-lg p-4 border-2 border-green-500 animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: "100ms" }}
        >
          <p className="text-sm text-gray-600 mb-2">Potential Savings</p>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-bold text-green-600">
              ₹{savingsAmount}
            </div>
            <p className="text-sm text-gray-700 mb-1">
              if you made only {withdrawals.optimalWithdrawals} withdrawal
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Current */}
        <div
          className="bg-white rounded-xl p-5 border-2 border-red-200 transform hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-left-4"
          style={{ animationDelay: "150ms" }}
        >
          <p className="text-xs text-gray-600 font-semibold uppercase mb-3">
            Your Current Pattern
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Withdrawals:</span>
              <span className="text-2xl font-bold text-red-600">
                {withdrawals.count}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Fees:</span>
              <span className="text-2xl font-bold text-red-600">
                ₹{withdrawals.fees}
              </span>
            </div>
          </div>
        </div>

        {/* Optimal */}
        <div
          className="bg-white rounded-xl p-5 border-2 border-green-200 transform hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-right-4"
          style={{ animationDelay: "200ms" }}
        >
          <p className="text-xs text-gray-600 font-semibold uppercase mb-3">
            Optimal Pattern
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Withdrawals:</span>
              <span className="text-2xl font-bold text-green-600">
                {withdrawals.optimalWithdrawals}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Fees:</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{withdrawals.optimalFee}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl p-5 mb-6">
        <p className="text-sm text-gray-600 font-semibold mb-4">
          Fee Breakdown
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              <Cell fill="#ef4444" />
              <Cell fill="#10b981" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Action Button */}
      <button
        className={`w-full ${c.button} text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105`}
      >
        <FiTrendingDown /> Consolidate Withdrawals
      </button>

      {/* Tips */}
      <div className="mt-6 bg-white rounded-xl p-4 border-l-4 border-blue-500">
        <h4 className="font-semibold text-gray-900 mb-2">💡 Pro Tip</h4>
        <p className="text-sm text-gray-700">
          Plan your withdrawals for the entire week instead of daily. Save up to
          ₹150 per pay period!
        </p>
      </div>
    </div>
  );
};

export default OverUsageWarning;
