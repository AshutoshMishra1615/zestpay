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
    <div className="min-h-screen bg-white">
      {/* Premium Gradient Header */}
      <div className="bg-linear-to-r from-black via-black to-gray-900 text-white sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center justify-center bg-white text-black w-24 py-2 rounded-full font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105"
            >
              <span>
                zest<span className="text-yellow-300">pay</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <span className="text-sm text-gray-300">Admin:</span>
              <span className="font-semibold text-yellow-300">
                {user?.email}
              </span>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-yellow-300 hover:text-yellow-400 transition-colors"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-yellow-400/20 space-y-3">
              <div className="text-sm">
                <p className="text-gray-300">Admin:</p>
                <p className="text-yellow-300 font-semibold">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold transition-all"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-20 -left-32 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-black rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-black mb-3">
            {company.name} <span className="text-yellow-500">Admin Panel</span>
          </h1>
          <p className="text-xl text-gray-600">
            Manage your employees and their salary advance access
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-2xl backdrop-blur-md border-2 flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-red-50 border-red-300 text-red-700"
            }`}
          >
            <FaCheckCircle className="text-xl" />
            <span className="font-semibold">{message.text}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-yellow-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  Total Employees
                </p>
                <h3 className="text-5xl font-bold text-black mt-3">
                  {employees.length}
                </h3>
              </div>
              <div className="bg-linear-to-br from-blue-400 to-blue-600 p-4 rounded-2xl transform group-hover:scale-110 transition-transform">
                <FiUsers className="text-3xl text-white" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Active in your organization</p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-yellow-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  Active Employees
                </p>
                <h3 className="text-5xl font-bold text-green-600 mt-3">
                  {employees.filter((e) => e.status === "active").length}
                </h3>
              </div>
              <div className="bg-linear-to-br from-green-400 to-green-600 p-4 rounded-2xl transform group-hover:scale-110 transition-transform">
                <FiCheck className="text-3xl text-white" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Currently active</p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-yellow-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  Total Payroll
                </p>
                <h3 className="text-4xl font-bold text-orange-600 mt-3">
                  ₹{totalPayroll.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="bg-linear-to-br from-orange-400 to-orange-600 p-4 rounded-2xl transform group-hover:scale-110 transition-transform">
                <FiDollarSign className="text-3xl text-white" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Monthly payroll</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <FiPlus className="w-5 h-5" />
            Add Employee
          </button>
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-700 font-semibold px-8 py-3 rounded-full border-2 border-yellow-400 transition-all transform hover:scale-105 active:scale-95"
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
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-8 py-3 rounded-full transition-all transform hover:scale-105 active:scale-95"
          >
            <FiDownload className="w-5 h-5" />
            Download Template
          </button>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-black to-gray-900 px-10 py-8 text-white">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <FiUsers className="text-yellow-300" />
              Employee Directory
            </h3>
            <p className="text-gray-300 mt-2">
              Manage all employees and their EWA access
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Trust Score
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-gray-200 hover:bg-yellow-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      {emp.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">
                      {emp.employeeId}
                    </td>
                    <td className="px-6 py-4 text-yellow-600 font-bold">
                      ₹{emp.salary.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {emp.department}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold">
                        {emp.trustScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteEmployee(emp.id)}
                        className="text-red-500 hover:text-red-700 transition-colors hover:bg-red-50 p-2 rounded-lg"
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
              <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500 text-lg">No employees yet</p>
              <p className="text-gray-400 mt-2">
                Add your first employee to get started
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Add Employee</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                required
              />
              <input
                type="number"
                placeholder="Monthly Salary"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
              />
              <input
                type="text"
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                required
              />
              <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) =>
                  setFormData({ ...formData, joiningDate: e.target.value })
                }
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
              />

              <button
                type="submit"
                className="w-full bg-linear-to-r from-yellow-400 to-yellow-500 hover:shadow-lg hover:shadow-yellow-400/50 text-black font-bold py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 mt-6"
              >
                Add Employee
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
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
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
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
