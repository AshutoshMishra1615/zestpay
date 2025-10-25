"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WithdrawalChart = ({ data, type = "line" }) => {
  const colors = ["#fbbf24", "#fcd34d", "#fde047", "#f59e0b", "#d97706"];

  if (type === "pie") {
    return (
      <div className="bg-black/40 backdrop-blur-md border border-yellow-400/30 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up">
        <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
          <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
          Withdrawal Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ₹${value}`}
              outerRadius={100}
              fill="#fbbf24"
              dataKey="value"
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #fbbf24",
                borderRadius: "8px",
                color: "#fbbf24",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  if (type === "bar") {
    return (
      <div className="bg-black/40 backdrop-blur-md border border-yellow-400/30 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up">
        <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
          <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
          Withdrawal Amount
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #fbbf24",
                borderRadius: "8px",
                color: "#fbbf24",
              }}
            />
            <Legend />
            <Bar
              dataKey="amount"
              fill="#fbbf24"
              name="Amount"
              animationDuration={800}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-md border border-yellow-400/30 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up">
      <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
        <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
        Withdrawal Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            formatter={(value) => `₹${value.toLocaleString()}`}
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #fbbf24",
              borderRadius: "8px",
              color: "#fbbf24",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#fbbf24"
            strokeWidth={3}
            dot={{ fill: "#fbbf24", r: 5 }}
            activeDot={{ r: 7 }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WithdrawalChart;
