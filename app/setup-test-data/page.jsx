"use client";
/**
 * ZestPay Test Data Setup Page
 *
 * Visit this page to automatically create test data in your Firebase
 * This uses the client SDK so no service account is needed
 */

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

const COMPANY_DOMAIN = "testcompany.com";
const COMPANY_NAME = "Test Company Inc.";
const TEST_PASSWORD = "Test@123";

export default function SetupPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const addLog = (message, type = "info") => {
    setLogs((prev) => [
      ...prev,
      { message, type, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const setupDummyData = async () => {
    setLoading(true);
    setLogs([]);
    addLog("🚀 Starting ZestPay setup...", "success");

    try {
      // Step 1: Create Company Admin
      addLog("📋 Creating company admin account...");
      const companyEmail = `admin@${COMPANY_DOMAIN}`;

      let companyUid;
      try {
        const companyCredential = await createUserWithEmailAndPassword(
          auth,
          companyEmail,
          TEST_PASSWORD
        );
        companyUid = companyCredential.user.uid;
        addLog(`✅ Company admin created: ${companyEmail}`, "success");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          addLog(`ℹ️  Company admin already exists`, "warning");
          // Sign out if needed
          await auth.signOut();
          throw new Error(
            "Company admin already exists. Please delete existing data first or use different email."
          );
        }
        if (error.code === "auth/operation-not-allowed") {
          throw new Error(
            "Email/Password authentication is not enabled in Firebase. Please enable it in Firebase Console → Authentication → Sign-in method → Email/Password. See FIREBASE_SETUP.md for detailed instructions."
          );
        }
        throw error;
      }

      // Create company document
      await setDoc(doc(db, "companies", companyUid), {
        name: COMPANY_NAME,
        domain: COMPANY_DOMAIN,
        email: companyEmail,
        industry: "Technology",
        size: "50-200 employees",
        totalEmployees: 0,
        totalDisbursed: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      addLog(`✅ Company document created`, "success");

      // Sign out company admin
      await auth.signOut();

      // Step 2: Create Employees
      const employees = [
        {
          name: "John Doe",
          email: `john.doe@${COMPANY_DOMAIN}`,
          salary: 50000,
          dept: "Engineering",
          trust: 75,
          sub: true,
        },
        {
          name: "Jane Smith",
          email: `jane.smith@${COMPANY_DOMAIN}`,
          salary: 45000,
          dept: "Marketing",
          trust: 85,
          sub: true,
        },
        {
          name: "Bob Johnson",
          email: `bob.johnson@${COMPANY_DOMAIN}`,
          salary: 60000,
          dept: "Engineering",
          trust: 65,
          sub: false,
        },
        {
          name: "Alice Williams",
          email: `alice.williams@${COMPANY_DOMAIN}`,
          salary: 55000,
          dept: "Sales",
          trust: 90,
          sub: true,
        },
        {
          name: "Charlie Brown",
          email: `charlie.brown@${COMPANY_DOMAIN}`,
          salary: 48000,
          dept: "Support",
          trust: 70,
          sub: false,
        },
      ];

      addLog("👥 Creating employee accounts...");

      const employeeUids = [];
      for (const emp of employees) {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            emp.email,
            TEST_PASSWORD
          );
          const uid = userCredential.user.uid;
          employeeUids.push(uid);

          // Create employee document
          await setDoc(doc(db, "employees", uid), {
            name: emp.name,
            email: emp.email,
            companyId: companyUid,
            companyName: COMPANY_NAME,
            domain: COMPANY_DOMAIN,
            monthlySalary: emp.salary,
            department: emp.dept,
            trustScore: emp.trust,
            totalWithdrawn: 0,
            totalRepaid: 0,
            onTimeRepayments: 0,
            lateRepayments: 0,
            hasSubscription: emp.sub,
            subscriptionPaidAt: emp.sub ? new Date() : null,
            subscriptionExpiresAt: emp.sub
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              : null,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          addLog(`✅ Created: ${emp.name}`, "success");

          // Sign out after each employee creation
          await auth.signOut();
        } catch (error) {
          addLog(`❌ Failed to create ${emp.name}: ${error.message}`, "error");
        }
      }

      // Step 3: Create Sample Withdrawals
      addLog("💰 Creating sample withdrawal requests...");

      if (employeeUids.length > 0) {
        await addDoc(collection(db, "withdrawals"), {
          userId: employeeUids[0],
          employeeEmail: employees[0].email,
          employeeName: employees[0].name,
          companyId: companyUid,
          amount: 10000,
          reason: "Medical emergency",
          status: "approved",
          requestedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          approvedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
          monthlySalary: employees[0].salary,
          trustScore: employees[0].trust,
          maxAllowed: (employees[0].salary * employees[0].trust) / 100,
        });

        await addDoc(collection(db, "withdrawals"), {
          userId: employeeUids[0],
          employeeEmail: employees[0].email,
          employeeName: employees[0].name,
          companyId: companyUid,
          amount: 5000,
          reason: "Home repairs",
          status: "pending",
          requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          monthlySalary: employees[0].salary,
          trustScore: employees[0].trust,
          maxAllowed: (employees[0].salary * employees[0].trust) / 100,
        });

        addLog("✅ Sample withdrawals created", "success");
      }

      addLog("🎉 Setup completed successfully!", "success");
      setCompleted(true);
    } catch (error) {
      addLog(`❌ Setup failed: ${error.message}`, "error");
      console.error("Setup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          ZestPay Test Data Setup
        </h1>
        <p className="text-gray-400 mb-8">
          Click the button below to populate your Firebase with dummy data for
          testing
        </p>

        {!completed && (
          <button
            onClick={setupDummyData}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-8"
          >
            {loading ? "Setting up..." : "🚀 Setup Test Data"}
          </button>
        )}

        {completed && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              ✅ Setup Complete!
            </h2>

            <div className="space-y-4 text-sm">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-2">
                <p className="text-blue-300 text-xs flex items-start">
                  <span className="mr-2">ℹ️</span>
                  <span>
                    Test accounts (@testcompany.com) can login without email
                    verification. Real accounts need to verify their email
                    first.
                  </span>
                </p>
              </div>

              <div>
                <h3 className="font-bold text-yellow-400 mb-2">
                  🔑 Test Credentials
                </h3>
                <p className="text-gray-300 mb-1">
                  Password for all accounts:{" "}
                  <code className="bg-gray-800 px-2 py-1 rounded">
                    {TEST_PASSWORD}
                  </code>
                </p>
              </div>

              <div>
                <h3 className="font-bold text-yellow-400 mb-2">
                  👨‍💼 Company Admin
                </h3>
                <p className="text-gray-300">
                  Email:{" "}
                  <code className="bg-gray-800 px-2 py-1 rounded">
                    admin@{COMPANY_DOMAIN}
                  </code>
                </p>
              </div>

              <div>
                <h3 className="font-bold text-yellow-400 mb-2">
                  👥 Employees (with subscription)
                </h3>
                <ul className="text-gray-300 space-y-1">
                  <li>
                    • john.doe@{COMPANY_DOMAIN} - Engineering (₹50,000/mo,
                    Trust: 75%)
                  </li>
                  <li>
                    • jane.smith@{COMPANY_DOMAIN} - Marketing (₹45,000/mo,
                    Trust: 85%)
                  </li>
                  <li>
                    • alice.williams@{COMPANY_DOMAIN} - Sales (₹55,000/mo,
                    Trust: 90%)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-yellow-400 mb-2">
                  👥 Employees (without subscription)
                </h3>
                <ul className="text-gray-300 space-y-1">
                  <li>
                    • bob.johnson@{COMPANY_DOMAIN} - Engineering (₹60,000/mo,
                    Trust: 65%)
                  </li>
                  <li>
                    • charlie.brown@{COMPANY_DOMAIN} - Support (₹48,000/mo,
                    Trust: 70%)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-yellow-400 mb-2">
                  🧪 Test Scenarios
                </h3>
                <ul className="text-gray-300 space-y-1">
                  <li>1. Login as company admin to manage employees</li>
                  <li>
                    2. Login as John Doe to see approved/pending withdrawals
                  </li>
                  <li>
                    3. Login as Bob Johnson to test subscription activation
                  </li>
                  <li>
                    4. Register new employee with email ending in @
                    {COMPANY_DOMAIN}
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <a
                href="/login"
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Go to Login
              </a>
              <a
                href="/register"
                className="px-6 py-3 bg-white/10 border border-yellow-400/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
              >
                Go to Register
              </a>
            </div>
          </div>
        )}

        {/* Logs */}
        <div className="bg-gray-900/50 border border-yellow-400/20 rounded-xl p-6 max-h-96 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Setup Logs</h2>
          {logs.length === 0 ? (
            <p className="text-gray-500">
              No logs yet. Click the setup button to start.
            </p>
          ) : (
            <div className="space-y-2 font-mono text-sm">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`${
                    log.type === "success"
                      ? "text-green-400"
                      : log.type === "error"
                      ? "text-red-400"
                      : log.type === "warning"
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  [{log.timestamp}] {log.message}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help section for common errors */}
        {logs.some((log) => log.type === "error") && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-400 mb-3">
              🆘 Need Help?
            </h3>
            <div className="text-gray-300 space-y-2 text-sm">
              <p className="font-semibold">
                Common Error: "auth/operation-not-allowed"
              </p>
              <p>
                📖 This means Email/Password authentication is not enabled in
                Firebase.
              </p>
              <p className="mt-2">
                ✅ <span className="font-semibold">Quick Fix:</span>
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>
                  Go to{" "}
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 underline"
                  >
                    Firebase Console
                  </a>
                </li>
                <li>Select your project → Authentication → Sign-in method</li>
                <li>Enable "Email/Password" (toggle the switch)</li>
                <li>Click "Save" and refresh this page</li>
              </ol>
              <p className="mt-3">
                📄 For detailed instructions, see{" "}
                <code className="bg-gray-800 px-2 py-1 rounded">
                  FIREBASE_SETUP.md
                </code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
