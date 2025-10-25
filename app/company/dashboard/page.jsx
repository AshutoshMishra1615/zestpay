"use client";
import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiTrash2,
  FiDownload,
  FiUpload,
  FiX,
  FiLogOut,
  FiMenu,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiCheck,
} from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";

const CompanyDashboard = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Placeholder state - will be replaced with actual Firebase integration
  const [company, setCompany] = useState({
    name: "Acme Corporation",
    id: "acme-001",
    employees: 0,
    totalPayroll: 0,
  });

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@acme.com",
      employeeId: "EMP001",
      salary: 50000,
      department: "Engineering",
      trustScore: 75,
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@acme.com",
      employeeId: "EMP002",
      salary: 45000,
      department: "Marketing",
      trustScore: 65,
      status: "active",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [csvFile, setCsvFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    salary: "",
    department: "",
    employeeId: "",
    joiningDate: "",
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-300 border-t-black mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const newEmployee = {
        id: employees.length + 1,
        ...formData,
        salary: parseFloat(formData.salary),
        trustScore: 50,
        status: "active",
      };
      setEmployees([...employees, newEmployee]);
      setMessage({ type: "success", text: "Employee added successfully!" });
      setFormData({
        name: "",
        email: "",
        salary: "",
        department: "",
        employeeId: "",
        joiningDate: "",
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding employee:", error);
      setMessage({ type: "error", text: "Failed to add employee" });
    }
  };

  const handleDeleteEmployee = (id) => {
    if (confirm("Are you sure you want to remove this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
      setMessage({ type: "success", text: "Employee removed successfully!" });
    }
  };

  const totalPayroll = employees.reduce(
    (sum, emp) => sum + (emp.salary || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Premium Gradient Header */}
      <div className="bg-linear-to-r from-black via-gray-950 to-black border-b border-yellow-500/20 sticky top-0 z-50 shadow-2xl backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="text-2xl font-space-grotesk font-bold">
              <span className="text-white">Zest</span>
              <span className="text-yellow-400">Pay</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <span className="text-sm text-gray-400">Admin:</span>
              <span className="font-semibold text-yellow-400">
                {user?.email}
              </span>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-lg font-bold transition-all transform hover:scale-105"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-yellow-500/20 space-y-3 pt-4">
              <div className="text-sm">
                <p className="text-gray-400">Admin:</p>
                <p className="text-yellow-400 font-semibold">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-lg font-bold transition-all"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">
            {company.name} <span className="text-yellow-500">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-400">
            Manage your employees and their salary advance access
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl backdrop-blur-md border flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <FaCheckCircle className="text-xl" />
            <span className="font-semibold">{message.text}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="group bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl p-8 hover:border-yellow-400/40 transition-all transform hover:-translate-y-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">
                  Total Employees
                </p>
                <h3 className="text-5xl font-bold text-white mt-3">
                  {employees.length}
                </h3>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiUsers className="w-7 h-7 text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500">Active in your organization</p>
          </div>

          <div className="group bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl p-8 hover:border-yellow-400/40 transition-all transform hover:-translate-y-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">
                  Active Employees
                </p>
                <h3 className="text-5xl font-bold text-green-400 mt-3">
                  {employees.filter((e) => e.status === "active").length}
                </h3>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiCheck className="w-7 h-7 text-green-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500">Currently active</p>
          </div>

          <div className="group bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl p-8 hover:border-yellow-400/40 transition-all transform hover:-translate-y-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">
                  Total Payroll
                </p>
                <h3 className="text-4xl font-bold text-yellow-400 mt-3">
                  ₹{totalPayroll.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiDollarSign className="w-7 h-7 text-yellow-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500">Monthly payroll</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3.5 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/30"
          >
            <FiPlus className="w-5 h-5" />
            Add Employee
          </button>
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold px-8 py-3.5 rounded-lg transition-all transform hover:scale-105"
          >
            <FiUpload className="w-5 h-5" />
            Bulk Upload CSV
          </button>
          <button
            onClick={() => {
              const csv =
                "Name,Email,Salary,Department,EmployeeID,JoiningDate\n";
              const blob = new Blob([csv], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "employee_template.csv";
              a.click();
            }}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 font-bold px-8 py-3.5 rounded-lg transition-all transform hover:scale-105"
          >
            <FiDownload className="w-5 h-5" />
            Download Template
          </button>
        </div>

        {/* Employees Table */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-black/40 px-8 py-6 border-b border-yellow-500/20">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <FiUsers className="text-yellow-400" />
              Employee Directory
            </h3>
            <p className="text-gray-400 mt-2">
              Manage all employees and their EWA access
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-yellow-500/10 bg-black/40">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Trust Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-500/10">
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-yellow-500/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-semibold">
                      {emp.name}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{emp.email}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono">
                      {emp.employeeId}
                    </td>
                    <td className="px-6 py-4 text-yellow-400 font-bold">
                      ₹{emp.salary.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {emp.department}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-1.5 rounded-lg text-sm font-bold">
                        {emp.trustScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteEmployee(emp.id)}
                        className="text-red-400 hover:text-red-300 transition-colors hover:bg-red-500/10 p-2 rounded-lg"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {employees.length === 0 && (
            <div className="px-10 py-20 text-center">
              <FiUsers className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500 text-lg">No employees yet</p>
              <p className="text-gray-600 mt-2">
                Add your first employee to get started
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-yellow-500/30 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-yellow-500/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Add Employee</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-yellow-500/10 rounded-lg"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-black border border-yellow-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-black border border-yellow-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                required
              />
              <input
                type="number"
                placeholder="Monthly Salary"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                className="w-full bg-black border border-yellow-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full bg-black border border-yellow-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
              />
              <input
                type="text"
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                className="w-full bg-black border border-yellow-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                required
              />
              <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) =>
                  setFormData({ ...formData, joiningDate: e.target.value })
                }
                className="w-full bg-black border border-yellow-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-3.5 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/30 mt-6"
              >
                Add Employee
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CompanyDashboard;
