"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { FiTrendingUp, FiTarget } from "react-icons/fi";
import { BiLineChart } from "react-icons/bi";
import { useEarnings } from "@/lib/useFirebase";

const DailyEarningsChart = () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { earnings, loading } = useEarnings(thirtyDaysAgo, new Date());

  if (loading) {
    return <div className="text-center py-8">Loading earnings data...</div>;
  }

  // Transform earnings to daily format for chart
  const earningsByDate = {};
  earnings.forEach((earning) => {
    const date = new Date(earning.date).toISOString().split("T")[0];
    if (!earningsByDate[date]) {
      earningsByDate[date] = 0;
    }
    earningsByDate[date] += earning.amount;
  });

  const earningData = Object.entries(earningsByDate)
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
      earnings: amount,
      target: 650,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalEarnings = earningData.reduce((sum, day) => sum + day.earnings, 0);
  const averageDaily =
    earningData.length > 0 ? Math.round(totalEarnings / earningData.length) : 0;
  const targetMonthly = 19500; // 650 * 30
  const currentMonthProjection = Math.round(averageDaily * 30);
  const onTrack = currentMonthProjection >= targetMonthly;

  const stats = [
    {
      label: "Avg Daily Earnings",
      value: `₹${averageDaily}`,
      subtext: "Last 10 days",
      icon: FiTrendingUp,
      color: "bg-green-100 border-green-500 text-green-600",
      iconColor: "text-green-600",
    },
    {
      label: "Monthly Target",
      value: `₹${targetMonthly.toLocaleString()}`,
      subtext: "Goal amount",
      icon: FiTarget,
      color: "bg-blue-100 border-blue-500 text-blue-600",
      iconColor: "text-blue-600",
    },
    {
      label: "Projected Monthly",
      value: `₹${currentMonthProjection.toLocaleString()}`,
      subtext: onTrack ? "✓ On track!" : "⚠ Behind target",
      icon: BiLineChart,
      color: onTrack
        ? "bg-green-100 border-green-500 text-green-600"
        : "bg-yellow-100 border-yellow-500 text-yellow-600",
      iconColor: onTrack ? "text-green-600" : "text-yellow-600",
    },
  ];

  return (
    <div className="bg-linear-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-linear-to-br from-indigo-500 to-blue-600 p-3 rounded-lg">
          <BiLineChart className="text-white text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Daily Earning Variance Chart
          </h2>
          <p className="text-sm text-gray-600">
            Track your income stability and stay on target
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`rounded-xl p-4 border-2 ${stat.color} transform hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <Icon className={`text-2xl ${stat.iconColor}`} />
              </div>
              <p className="text-sm text-gray-700 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-600 mt-1">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
        <h3 className="font-semibold text-gray-900 mb-4">
          Last 10 Days Earnings
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={earningData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "2px solid #6366f1",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => `₹${value}`}
            />
            <Legend />
            <ReferenceLine
              y={650}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              name="Target Line"
              label={{
                value: "Daily Target (₹650)",
                position: "top",
                fill: "#d97706",
              }}
            />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 5 }}
              activeDot={{ r: 7 }}
              name="Your Earnings"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500 animate-in fade-in slide-in-from-left-4 duration-500">
          <h4 className="font-semibold text-green-900 mb-2">✓ Good Days</h4>
          <p className="text-sm text-green-700">
            Oct 4, 6, 8, 10 exceeded your daily target
          </p>
        </div>
        <div
          className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500 animate-in fade-in slide-in-from-right-4 duration-500"
          style={{ animationDelay: "100ms" }}
        >
          <h4 className="font-semibold text-yellow-900 mb-2">⚠ Low Days</h4>
          <p className="text-sm text-yellow-700">
            Oct 3, 7 fell short. Consider extra hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyEarningsChart;
