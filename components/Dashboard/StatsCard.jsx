"use client";
import React from "react";

const StatsCard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-600 to-blue-700 border-blue-500/50",
    green: "from-green-600 to-emerald-700 border-green-500/50",
    purple: "from-purple-600 to-pink-700 border-purple-500/50",
    orange: "from-orange-600 to-amber-700 border-orange-500/50",
    red: "from-red-600 to-rose-700 border-red-500/50",
  };

  const hoverEffectColors = {
    blue: "hover:from-blue-500 hover:to-blue-600",
    green: "hover:from-green-500 hover:to-emerald-600",
    purple: "hover:from-purple-500 hover:to-pink-600",
    orange: "hover:from-orange-500 hover:to-amber-600",
    red: "hover:from-red-500 hover:to-rose-600",
  };

  return (
    <div
      className={`relative bg-linear-to-br ${colorClasses[color]} ${hoverEffectColors[color]} rounded-lg p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border backdrop-blur-sm group overflow-hidden animate-slide-up`}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-100 font-medium tracking-wide">
            {title}
          </p>
          <h3 className="text-4xl font-bold mt-3 group-hover:scale-110 transition-transform duration-300">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-200 mt-2 opacity-80">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="bg-white/20 p-4 rounded-xl group-hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110">
            <Icon className="text-3xl text-white" />
          </div>
        )}
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform group-hover:translate-x-full transition-all duration-700 pointer-events-none rounded-lg"></div>
    </div>
  );
};

export default StatsCard;
