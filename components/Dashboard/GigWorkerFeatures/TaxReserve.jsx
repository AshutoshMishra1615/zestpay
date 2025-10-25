"use client";
import React, { useState } from "react";
import { FiCheck, FiX, FiDollarSign } from "react-icons/fi";
import { MdAccountBalanceWallet } from "react-icons/md";
import { useTaxReserve } from "@/lib/useFirebase";

const TaxReserve = () => {
  const { taxReserve, loading, update } = useTaxReserve();
  const [taxPercentage, setTaxPercentage] = useState(
    taxReserve?.percentage || 15
  );
  const [isEnabled, setIsEnabled] = useState(taxReserve?.isEnabled !== false);

  const dailyEarnings = 650;
  const dailyReserve = (dailyEarnings * taxPercentage) / 100;
  const monthlyProjection = dailyReserve * 30;

  const handlePercentageChange = async (e) => {
    const value = parseFloat(e.target.value);
    if (value >= 0 && value <= 30) {
      setTaxPercentage(value);
      try {
        await update({ percentage: value });
      } catch (error) {
        console.error("Error updating tax percentage:", error);
      }
    }
  };

  const handleToggleEnabled = async () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    try {
      await update({ isEnabled: newEnabled });
    } catch (error) {
      console.error("Error updating tax reserve status:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tax reserve...</div>;
  }

  return (
    <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-orange-500 to-amber-600 p-3 rounded-lg">
            <MdAccountBalanceWallet className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Self-Employment Tax Reserve
            </h2>
            <p className="text-sm text-gray-600">
              Automatically set aside tax money
            </p>
          </div>
        </div>
        <button
          onClick={handleToggleEnabled}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
            isEnabled
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
        >
          {isEnabled ? <FiCheck /> : <FiX />}
          {isEnabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* Total Reserve */}
      <div className="bg-gradient-to-r from-orange-400 to-amber-500 rounded-xl p-6 mb-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-in fade-in slide-in-from-top-4 duration-500">
        <p className="text-sm opacity-90 mb-2">Total Tax Reserve</p>
        <div className="text-4xl font-bold mb-2">
          ₹{taxReserve.total.toLocaleString()}
        </div>
        <p className="text-sm opacity-75">Updated: {taxReserve.lastUpdated}</p>
      </div>

      {/* Percentage Control */}
      <div className="bg-white rounded-xl p-6 mb-6 border-2 border-orange-200">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Tax Reservation Percentage:{" "}
            <span className="text-orange-600 text-lg">{taxPercentage}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="30"
            value={taxPercentage}
            onChange={handlePercentageChange}
            disabled={!isEnabled}
            className="w-full h-2 bg-gradient-to-r from-orange-300 to-amber-400 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>0%</span>
            <span>15%</span>
            <span>30%</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
          <p className="text-xs text-blue-700">
            <strong>Typical Rates:</strong> Freelancers pay 20-30% for
            self-employment tax. Adjust based on your estimated liability.
          </p>
        </div>
      </div>

      {/* Projections Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className="bg-white rounded-xl p-5 border-2 border-orange-200 transform hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-left-4"
          style={{ animationDelay: "100ms" }}
        >
          <p className="text-xs text-gray-600 font-semibold uppercase mb-3">
            Daily Reservation
          </p>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-orange-600">
              ₹{dailyReserve.toFixed(0)}
            </div>
            <p className="text-xs text-gray-600">Auto-reserved daily</p>
          </div>
        </div>

        <div
          className="bg-white rounded-xl p-5 border-2 border-amber-200 transform hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-right-4"
          style={{ animationDelay: "150ms" }}
        >
          <p className="text-xs text-gray-600 font-semibold uppercase mb-3">
            Monthly Projection
          </p>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-amber-600">
              ₹{monthlyProjection.toFixed(0)}
            </div>
            <p className="text-xs text-gray-600">Expected monthly reserve</p>
          </div>
        </div>
      </div>

      {/* Tax Bracket Guide */}
      <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiDollarSign className="text-orange-500" />
          Tax Bracket Guide for Freelancers
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200 hover:bg-orange-50 p-2 rounded transition-all">
            <span className="text-sm text-gray-700">
              Annual Income: ₹0 - 5 Lakhs
            </span>
            <span className="font-semibold text-gray-900">10-15% Reserve</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200 hover:bg-orange-50 p-2 rounded transition-all">
            <span className="text-sm text-gray-700">
              Annual Income: 5L - 20L
            </span>
            <span className="font-semibold text-gray-900">20-25% Reserve</span>
          </div>
          <div className="flex justify-between items-center hover:bg-orange-50 p-2 rounded transition-all">
            <span className="text-sm text-gray-700">Annual Income: 20L+</span>
            <span className="font-semibold text-gray-900">25-30% Reserve</span>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {isEnabled && (
        <div className="mt-6 bg-green-50 rounded-xl p-4 border-2 border-green-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-sm text-green-700">
            <strong>✓ Smart Move!</strong> You're automatically reserving{" "}
            {taxPercentage}% of your earnings. No tax bill surprises this year!
          </p>
        </div>
      )}
    </div>
  );
};

export default TaxReserve;
