"use client";
import React, { useState } from "react";
import { FiPlus, FiTrash2, FiCalendar, FiDollarSign } from "react-icons/fi";
import { GiHook } from "react-icons/gi";
import { useBills } from "@/lib/useFirebase";

const BillLinkedEWA = () => {
  const { bills, loading, add, remove } = useBills();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    vendor: "",
    amount: "",
    dueDate: "",
  });

  const handleAddBill = async () => {
    if (
      formData.name &&
      formData.vendor &&
      formData.amount &&
      formData.dueDate
    ) {
      try {
        await add({
          name: formData.name,
          vendor: formData.vendor,
          amount: parseFloat(formData.amount),
          dueDate: formData.dueDate,
          status: "linked",
        });
        setFormData({ name: "", vendor: "", amount: "", dueDate: "" });
        setShowModal(false);
      } catch (error) {
        console.error("Error adding bill:", error);
      }
    }
  };

  const handleDeleteBill = async (billId) => {
    try {
      await remove(billId);
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bills...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg">
            <GiHook className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Direct Bill Advance (DBA)
            </h2>
            <p className="text-sm text-gray-600">
              Link bills and pay directly from earned wages
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <FiPlus /> Add Bill
        </button>
      </div>

      {/* Bills List */}
      <div className="space-y-3">
        {bills.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <GiHook className="text-gray-300 text-5xl mx-auto mb-3" />
            <p className="text-gray-500">
              No bills linked yet. Add your first bill!
            </p>
          </div>
        ) : (
          bills.map((bill, index) => (
            <div
              key={bill.id}
              className="bg-white rounded-xl p-5 border-l-4 border-blue-500 hover:shadow-md transition-all duration-300 transform hover:translate-x-1 animate-in fade-in slide-in-from-left-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {bill.name}
                  </h3>
                  <p className="text-sm text-gray-600">{bill.vendor}</p>
                  <div className="flex gap-6 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-gray-700">
                      <FiDollarSign className="text-green-500" />₹
                      {bill.amount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-gray-700">
                      <FiCalendar className="text-purple-500" />
                      Due {bill.dueDate}
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Linked
                  </span>
                  <button
                    onClick={() => handleDeleteBill(bill.id)}
                    className="block w-full text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-all"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Link a New Bill
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Electricity"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vendor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., DISCOM Board"
                  value={formData.vendor}
                  onChange={(e) =>
                    setFormData({ ...formData, vendor: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="2500"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="text"
                  placeholder="15th"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                onClick={handleAddBill}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Add Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillLinkedEWA;
