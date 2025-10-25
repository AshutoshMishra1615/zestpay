/**
 * ZestPay Dummy Data Setup Script
 *
 * This script creates:
 * 1. A dummy company with domain "testcompany.com"
 * 2. Dummy employees registered to that domain
 * 3. Sample withdrawal and repayment data
 *
 * Run this script to populate your Firebase with test data
 */

const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // You'll need to download this from Firebase Console

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

const COMPANY_DOMAIN = "testcompany.com";
const COMPANY_NAME = "Test Company Inc.";
const TEST_PASSWORD = "Test@123"; // Use this password for all test accounts

const dummyCompanyData = {
  name: COMPANY_NAME,
  domain: COMPANY_DOMAIN,
  email: `admin@${COMPANY_DOMAIN}`,
  industry: "Technology",
  size: "50-200 employees",
  totalEmployees: 0,
  totalDisbursed: 0,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

const dummyEmployees = [
  {
    name: "John Doe",
    email: `john.doe@${COMPANY_DOMAIN}`,
    monthlySalary: 50000,
    department: "Engineering",
    trustScore: 75,
    hasSubscription: true,
  },
  {
    name: "Jane Smith",
    email: `jane.smith@${COMPANY_DOMAIN}`,
    monthlySalary: 45000,
    department: "Marketing",
    trustScore: 85,
    hasSubscription: true,
  },
  {
    name: "Bob Johnson",
    email: `bob.johnson@${COMPANY_DOMAIN}`,
    monthlySalary: 60000,
    department: "Engineering",
    trustScore: 65,
    hasSubscription: false,
  },
  {
    name: "Alice Williams",
    email: `alice.williams@${COMPANY_DOMAIN}`,
    monthlySalary: 55000,
    department: "Sales",
    trustScore: 90,
    hasSubscription: true,
  },
  {
    name: "Charlie Brown",
    email: `charlie.brown@${COMPANY_DOMAIN}`,
    monthlySalary: 48000,
    department: "Support",
    trustScore: 70,
    hasSubscription: false,
  },
];

async function createCompanyAdmin() {
  console.log("\n📋 Creating Company Admin Account...");

  try {
    // Create auth user for company admin
    const companyEmail = `admin@${COMPANY_DOMAIN}`;
    let companyUser;

    try {
      companyUser = await auth.createUser({
        email: companyEmail,
        password: TEST_PASSWORD,
        displayName: "Company Admin",
        emailVerified: true,
      });
      console.log(`✅ Company admin auth created: ${companyEmail}`);
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        companyUser = await auth.getUserByEmail(companyEmail);
        console.log(`ℹ️  Company admin already exists: ${companyEmail}`);
      } else {
        throw error;
      }
    }

    // Create company document
    await db.collection("companies").doc(companyUser.uid).set(dummyCompanyData);
    console.log(`✅ Company document created with domain: ${COMPANY_DOMAIN}`);

    console.log(`\n🔑 Company Admin Credentials:`);
    console.log(`   Email: ${companyEmail}`);
    console.log(`   Password: ${TEST_PASSWORD}`);

    return companyUser.uid;
  } catch (error) {
    console.error("❌ Error creating company admin:", error);
    throw error;
  }
}

async function createEmployees(companyId) {
  console.log("\n👥 Creating Employee Accounts...");

  for (const employee of dummyEmployees) {
    try {
      // Create auth user
      let userRecord;
      try {
        userRecord = await auth.createUser({
          email: employee.email,
          password: TEST_PASSWORD,
          displayName: employee.name,
          emailVerified: true,
        });
        console.log(`✅ Created auth for: ${employee.name}`);
      } catch (error) {
        if (error.code === "auth/email-already-exists") {
          userRecord = await auth.getUserByEmail(employee.email);
          console.log(`ℹ️  Employee already exists: ${employee.name}`);
        } else {
          throw error;
        }
      }

      // Create employee document
      const employeeData = {
        name: employee.name,
        email: employee.email,
        companyId: companyId,
        companyName: COMPANY_NAME,
        domain: COMPANY_DOMAIN,
        monthlySalary: employee.monthlySalary,
        department: employee.department,
        trustScore: employee.trustScore,
        totalWithdrawn: 0,
        totalRepaid: 0,
        onTimeRepayments: 0,
        lateRepayments: 0,
        hasSubscription: employee.hasSubscription,
        subscriptionPaidAt: employee.hasSubscription
          ? admin.firestore.FieldValue.serverTimestamp()
          : null,
        subscriptionExpiresAt: employee.hasSubscription
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection("employees").doc(userRecord.uid).set(employeeData);
      console.log(`✅ Created employee document for: ${employee.name}`);
    } catch (error) {
      console.error(`❌ Error creating employee ${employee.name}:`, error);
    }
  }

  console.log(`\n🔑 All Employee Credentials:`);
  console.log(`   Password: ${TEST_PASSWORD} (same for all)`);
  dummyEmployees.forEach((emp) => {
    console.log(`   - ${emp.email}`);
  });
}

async function createSampleWithdrawals() {
  console.log("\n💰 Creating Sample Withdrawal Requests...");

  try {
    // Get John Doe's UID
    const johnUser = await auth.getUserByEmail(`john.doe@${COMPANY_DOMAIN}`);

    const withdrawals = [
      {
        userId: johnUser.uid,
        employeeEmail: `john.doe@${COMPANY_DOMAIN}`,
        employeeName: "John Doe",
        amount: 10000,
        reason: "Medical emergency",
        status: "approved",
        requestedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        approvedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        monthlySalary: 50000,
        trustScore: 75,
        maxAllowed: 37500,
      },
      {
        userId: johnUser.uid,
        employeeEmail: `john.doe@${COMPANY_DOMAIN}`,
        employeeName: "John Doe",
        amount: 5000,
        reason: "Home repairs",
        status: "pending",
        requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        monthlySalary: 50000,
        trustScore: 75,
        maxAllowed: 37500,
      },
    ];

    for (const withdrawal of withdrawals) {
      await db.collection("withdrawals").add(withdrawal);
      console.log(
        `✅ Created withdrawal: ₹${withdrawal.amount} (${withdrawal.status})`
      );
    }
  } catch (error) {
    console.error("❌ Error creating withdrawals:", error);
  }
}

async function main() {
  console.log("🚀 ZestPay Dummy Data Setup");
  console.log("================================\n");

  try {
    const companyId = await createCompanyAdmin();
    await createEmployees(companyId);
    await createSampleWithdrawals();

    console.log("\n✅ Setup Complete!");
    console.log("\n📝 Summary:");
    console.log(`   - Company: ${COMPANY_NAME}`);
    console.log(`   - Domain: ${COMPANY_DOMAIN}`);
    console.log(`   - Employees: ${dummyEmployees.length}`);
    console.log(`   - Test Password: ${TEST_PASSWORD}`);

    console.log("\n🧪 Test Scenarios:");
    console.log("   1. Login as company admin: admin@testcompany.com");
    console.log(
      "   2. Login as employee with subscription: john.doe@testcompany.com"
    );
    console.log(
      "   3. Login as employee without subscription: bob.johnson@testcompany.com"
    );
    console.log("   4. Register new employee: newemployee@testcompany.com");

    console.log("\n⚠️  Note: You need to create a serviceAccountKey.json file");
    console.log(
      "   Download it from Firebase Console > Project Settings > Service Accounts\n"
    );

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Setup failed:", error);
    process.exit(1);
  }
}

main();
