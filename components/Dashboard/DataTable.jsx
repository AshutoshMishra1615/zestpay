"use client";
import React from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

const DataTable = ({ columns, data, onRowClick, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-md border border-yellow-400/30 rounded-xl p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400/30 border-t-yellow-400 mx-auto"></div>
          <p className="text-gray-300 mt-4 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-md border border-yellow-400/30 rounded-xl p-6">
        <div className="text-center py-12">
          <p className="text-gray-300 font-medium">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-md border border-yellow-400/30 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-black/60 border-b border-yellow-400/30">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-yellow-300"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-yellow-400/10">
            {data.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                className="border-b border-yellow-400/10 hover:bg-yellow-400/5 cursor-pointer transition-all duration-200 group"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm text-gray-300 group-hover:text-gray-100 transition-colors"
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        table tbody tr:hover {
          background-color: rgba(251, 191, 36, 0.08);
        }
      `}</style>
    </div>
  );
};

export default DataTable;
