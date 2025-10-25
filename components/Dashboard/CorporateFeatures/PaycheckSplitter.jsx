"use client";
import React, { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { MdAccountBalance } from "react-icons/md";
import { usePaycheckRules } from "@/lib/useFirebase";

const PaycheckSplitter = () => {
  const { rules, loading, add, remove } = usePaycheckRules();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    percentage: "",
    account: "",
  });
  const [nextPaycheck] = useState(65000);

  const handleAddRule = async () => {
    if (formData.name && formData.percentage && formData.account) {
      try {
        await add({
          name: formData.name,
          percentage: parseFloat(formData.percentage),
          account: formData.account,
        });
        setFormData({ name: "", percentage: "", account: "" });
        setShowModal(false);
      } catch (error) {
        console.error("Error adding rule:", error);
      }
    }
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      await remove(ruleId);
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  const totalPercentage = rules.reduce((sum, rule) => sum + rule.percentage, 0);
  const isValidTotal = totalPercentage === 100;

  if (loading) {
    return <div className="text-center py-8">Loading rules...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-lg">
            <MdAccountBalance className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Paycheck Splitter
            </h2>
            <p className="text-sm text-gray-600">
              Auto-allocate your salary to multiple accounts
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <FiPlus /> Add Rule
        </button>
      </div>

      {/* Next Paycheck Preview */}
      <div className="bg-white rounded-xl p-4 mb-6 border-l-4 border-purple-500">
        <p className="text-sm text-gray-600 mb-2">Next Paycheck (Expected)</p>
        <div className="text-3xl font-bold text-gray-900">
          ₹{nextPaycheck.toLocaleString()}
        </div>
      </div>

      {/* Allocation Rules */}
      <div className="space-y-3 mb-6">
        {rules.map((rule, index) => (
          <div
            key={rule.id}
            className={`rounded-xl p-5 border-l-4 ${rule.color} hover:shadow-md transition-all duration-300 transform hover:translate-x-1 animate-in fade-in slide-in-from-left-4`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                <p className="text-sm text-gray-600">{rule.account}</p>
              </div>
              <div className="text-right space-y-1">
                <div className="text-2xl font-bold text-gray-900">
                  {rule.percentage}%
                </div>
                <div className="text-sm text-gray-700 font-semibold">
                  ₹{((nextPaycheck * rule.percentage) / 100).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => handleDeleteRule(rule.id)}
                className="ml-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-all"
              >
                <FiTrash2 />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-full transition-all duration-500"
                style={{ width: `${rule.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total Check */}
      <div
        className={`rounded-lg p-4 border-2 ${
          isValidTotal
            ? "border-green-500 bg-green-50"
            : "border-yellow-500 bg-yellow-50"
        }`}
      >
        <p className="text-sm font-semibold">
          {isValidTotal ? (
            <span className="text-green-700">✓ Perfect allocation: 100%</span>
          ) : (
            <span className="text-yellow-700">
              ⚠ Total: {totalPercentage}% (must be 100%)
            </span>
          )}
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Add Allocation Rule
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g., Emergency Savings"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Percentage (%)
                </label>
                <input
                  type="number"
                  placeholder="10"
                  max="100"
                  value={formData.percentage}
                  onChange={(e) =>
                    setFormData({ ...formData, percentage: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., HDFC Savings"
                  value={formData.account}
                  onChange={(e) =>
                    setFormData({ ...formData, account: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRule}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaycheckSplitter;
