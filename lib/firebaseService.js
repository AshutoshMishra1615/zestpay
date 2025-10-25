import { db, auth } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  increment,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// ==================== EMPLOYEE PROFILE ====================

// Create or Update Employee Profile
export const createOrUpdateEmployeeProfile = async (userId, profileData) => {
  try {
    const employeeRef = doc(db, "employees", userId);
    const employeeDoc = await getDoc(employeeRef);

    if (!employeeDoc.exists()) {
      // New employee - set initial trust score to 50%
      await setDoc(employeeRef, {
        ...profileData,
        trustScore: 50,
        totalWithdrawn: 0,
        totalRepaid: 0,
        onTimeRepayments: 0,
        lateRepayments: 0,
        hasSubscription: false, // Subscription starts as inactive
        subscriptionPaidAt: null,
        subscriptionExpiresAt: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } else {
      // Update existing employee
      await updateDoc(employeeRef, {
        ...profileData,
        updatedAt: Timestamp.now(),
      });
    }

    return employeeRef.id;
  } catch (error) {
    console.error("Error creating/updating employee profile:", error);
    throw error;
  }
};

// Activate Subscription (Fake Payment)
export const activateSubscription = async (userId) => {
  try {
    const employeeRef = doc(db, "employees", userId);
    const now = Timestamp.now();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription

    await updateDoc(employeeRef, {
      hasSubscription: true,
      subscriptionPaidAt: now,
      subscriptionExpiresAt: Timestamp.fromDate(expiresAt),
      updatedAt: now,
    });

    return true;
  } catch (error) {
    console.error("Error activating subscription:", error);
    throw error;
  }
};

// Check Subscription Status
export const checkSubscriptionStatus = async (userId) => {
  try {
    const employeeProfile = await getEmployeeProfile(userId);

    if (!employeeProfile || !employeeProfile.hasSubscription) {
      return { active: false };
    }

    // Check if subscription is expired
    const now = new Date();
    const expiresAt = employeeProfile.subscriptionExpiresAt?.toDate();

    if (expiresAt && expiresAt < now) {
      // Subscription expired - deactivate it
      const employeeRef = doc(db, "employees", userId);
      await updateDoc(employeeRef, {
        hasSubscription: false,
        updatedAt: Timestamp.now(),
      });
      return { active: false, expired: true };
    }

    return {
      active: true,
      paidAt: employeeProfile.subscriptionPaidAt?.toDate(),
      expiresAt: expiresAt,
    };
  } catch (error) {
    console.error("Error checking subscription:", error);
    throw error;
  }
};

// Get Employee Profile
export const getEmployeeProfile = async (userId) => {
  try {
    const employeeRef = doc(db, "employees", userId);
    const employeeDoc = await getDoc(employeeRef);

    if (!employeeDoc.exists()) {
      return null;
    }

    return {
      id: employeeDoc.id,
      ...employeeDoc.data(),
    };
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    throw error;
  }
};

// Update Trust Score
export const updateTrustScore = async (userId, newScore) => {
  try {
    const employeeRef = doc(db, "employees", userId);
    await updateDoc(employeeRef, {
      trustScore: Math.min(100, Math.max(0, newScore)), // Keep between 0-100
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating trust score:", error);
    throw error;
  }
};

// ==================== MONTHLY SALARY & WITHDRAWALS ====================

// Request Withdrawal
export const requestMonthlyWithdrawal = async (userId, withdrawalData) => {
  try {
    const employeeProfile = await getEmployeeProfile(userId);

    if (!employeeProfile) {
      throw new Error("Employee profile not found");
    }

    // Calculate max withdrawal based on trust score
    const maxWithdrawal =
      (employeeProfile.monthlySalary * employeeProfile.trustScore) / 100;
    const alreadyWithdrawn = employeeProfile.totalWithdrawn || 0;
    const availableAmount = maxWithdrawal - alreadyWithdrawn;

    if (withdrawalData.amount > availableAmount) {
      throw new Error(
        `Withdrawal amount exceeds available limit. Available: ₹${availableAmount.toFixed(
          2
        )}`
      );
    }

    const withdrawalRef = await addDoc(collection(db, "withdrawals"), {
      userId,
      employeeEmail: employeeProfile.email,
      employeeName: employeeProfile.name,
      companyId: employeeProfile.companyId,
      amount: withdrawalData.amount,
      reason: withdrawalData.reason || "",
      status: "pending",
      requestedAt: Timestamp.now(),
      monthlySalary: employeeProfile.monthlySalary,
      trustScore: employeeProfile.trustScore,
      maxAllowed: maxWithdrawal,
    });

    return withdrawalRef.id;
  } catch (error) {
    console.error("Error requesting withdrawal:", error);
    throw error;
  }
};

// Get Employee Withdrawals
export const getEmployeeWithdrawalsHistory = async (userId) => {
  try {
    const q = query(
      collection(db, "withdrawals"),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    const withdrawals = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by requestedAt in JavaScript (client-side)
    return withdrawals.sort((a, b) => {
      const timeA = a.requestedAt?.seconds || 0;
      const timeB = b.requestedAt?.seconds || 0;
      return timeB - timeA; // descending order (newest first)
    });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    throw error;
  }
};

// Approve Withdrawal (Company Admin)
export const approveWithdrawalRequest = async (withdrawalId, userId) => {
  try {
    const withdrawalRef = doc(db, "withdrawals", withdrawalId);
    const withdrawalDoc = await getDoc(withdrawalRef);

    if (!withdrawalDoc.exists()) {
      throw new Error("Withdrawal not found");
    }

    const withdrawal = withdrawalDoc.data();

    // Update withdrawal status
    await updateDoc(withdrawalRef, {
      status: "approved",
      approvedAt: Timestamp.now(),
    });

    // Update employee's total withdrawn
    const employeeRef = doc(db, "employees", withdrawal.userId);
    await updateDoc(employeeRef, {
      totalWithdrawn: increment(withdrawal.amount),
      updatedAt: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error("Error approving withdrawal:", error);
    throw error;
  }
};

// Reject Withdrawal (Company Admin)
export const rejectWithdrawalRequest = async (withdrawalId, reason) => {
  try {
    const withdrawalRef = doc(db, "withdrawals", withdrawalId);
    await updateDoc(withdrawalRef, {
      status: "rejected",
      rejectedAt: Timestamp.now(),
      rejectionReason: reason || "Not specified",
    });

    return true;
  } catch (error) {
    console.error("Error rejecting withdrawal:", error);
    throw error;
  }
};

// Record Repayment (Called on payday)
export const recordRepayment = async (userId, amount, isOnTime = true) => {
  try {
    const employeeRef = doc(db, "employees", userId);
    const employeeDoc = await getDoc(employeeRef);

    if (!employeeDoc.exists()) {
      throw new Error("Employee not found");
    }

    const employee = employeeDoc.data();

    // Add repayment record
    await addDoc(collection(db, "repayments"), {
      userId,
      amount,
      isOnTime,
      recordedAt: Timestamp.now(),
    });

    // Update employee stats
    const updates = {
      totalRepaid: increment(amount),
      totalWithdrawn: Math.max(0, (employee.totalWithdrawn || 0) - amount), // Reset for new month
      updatedAt: Timestamp.now(),
    };

    if (isOnTime) {
      updates.onTimeRepayments = increment(1);

      // Increase trust score for on-time repayment
      const totalRepayments =
        (employee.onTimeRepayments || 0) + (employee.lateRepayments || 0) + 1;
      const onTimePercentage =
        ((employee.onTimeRepayments || 0) + 1) / totalRepayments;

      // Gradually increase trust score based on payment history
      if (onTimePercentage >= 0.9 && employee.trustScore < 100) {
        updates.trustScore = Math.min(100, employee.trustScore + 5);
      } else if (onTimePercentage >= 0.75 && employee.trustScore < 85) {
        updates.trustScore = Math.min(85, employee.trustScore + 2);
      }
    } else {
      updates.lateRepayments = increment(1);

      // Decrease trust score for late repayment
      updates.trustScore = Math.max(30, employee.trustScore - 10);
    }

    await updateDoc(employeeRef, updates);

    return true;
  } catch (error) {
    console.error("Error recording repayment:", error);
    throw error;
  }
};

// ==================== LEGACY FUNCTIONS (keeping for backward compatibility) ====================

// Bills
export const addBill = async (userId, billData) => {
  try {
    const docRef = await addDoc(collection(db, "users", userId, "bills"), {
      ...billData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding bill:", error);
    throw error;
  }
};

export const getBills = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "bills")
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching bills:", error);
    throw error;
  }
};

export const deleteBill = async (userId, billId) => {
  try {
    await deleteDoc(doc(db, "users", userId, "bills", billId));
  } catch (error) {
    console.error("Error deleting bill:", error);
    throw error;
  }
};

// Paycheck Rules
export const addPaycheckRule = async (userId, ruleData) => {
  try {
    const docRef = await addDoc(
      collection(db, "users", userId, "paycheckRules"),
      {
        ...ruleData,
        createdAt: new Date(),
      }
    );
    return docRef.id;
  } catch (error) {
    console.error("Error adding paycheck rule:", error);
    throw error;
  }
};

export const getPaycheckRules = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "paycheckRules")
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching paycheck rules:", error);
    throw error;
  }
};

export const deletePaycheckRule = async (userId, ruleId) => {
  try {
    await deleteDoc(doc(db, "users", userId, "paycheckRules", ruleId));
  } catch (error) {
    console.error("Error deleting paycheck rule:", error);
    throw error;
  }
};

// Withdrawals (for over-usage tracking)
export const addWithdrawal = async (userId, withdrawalData) => {
  try {
    const docRef = await addDoc(
      collection(db, "users", userId, "withdrawals"),
      {
        ...withdrawalData,
        createdAt: new Date(),
      }
    );
    return docRef.id;
  } catch (error) {
    console.error("Error adding withdrawal:", error);
    throw error;
  }
};

export const getWithdrawals = async (userId, payPeriodStart) => {
  try {
    const q = query(
      collection(db, "users", userId, "withdrawals"),
      where("createdAt", ">=", payPeriodStart),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    throw error;
  }
};

// Earnings (Gig Workers)
export const addEarning = async (userId, earningData) => {
  try {
    const docRef = await addDoc(collection(db, "users", userId, "earnings"), {
      ...earningData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding earning:", error);
    throw error;
  }
};

export const getEarnings = async (userId, startDate, endDate) => {
  try {
    const q = query(
      collection(db, "users", userId, "earnings"),
      where("createdAt", ">=", startDate),
      where("createdAt", "<=", endDate),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching earnings:", error);
    throw error;
  }
};

// Tax Reserve
export const updateTaxReserve = async (userId, taxData) => {
  try {
    const taxRef = doc(db, "users", userId, "settings", "taxReserve");
    await updateDoc(taxRef, {
      ...taxData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating tax reserve:", error);
    throw error;
  }
};

export const getTaxReserve = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "users", userId, "settings"))
    );
    let taxData = null;
    querySnapshot.forEach((doc) => {
      if (doc.id === "taxReserve") {
        taxData = { id: doc.id, ...doc.data() };
      }
    });
    return (
      taxData || {
        percentage: 15,
        total: 0,
        enabled: false,
      }
    );
  } catch (error) {
    console.error("Error fetching tax reserve:", error);
    throw error;
  }
};

// Expenses (Gig Workers)
export const addExpense = async (userId, expenseData) => {
  try {
    const docRef = await addDoc(collection(db, "users", userId, "expenses"), {
      ...expenseData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

export const getExpenses = async (userId) => {
  try {
    const q = query(
      collection(db, "users", userId, "expenses"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

export const deleteExpense = async (userId, expenseId) => {
  try {
    await deleteDoc(doc(db, "users", userId, "expenses", expenseId));
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

// User Profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Company Operations
export const createCompany = async (companyData) => {
  try {
    // Validate that domain is provided
    if (!companyData.domain) {
      throw new Error("Company domain is required for employee registration");
    }

    const docRef = await addDoc(collection(db, "companies"), {
      ...companyData,
      domain: companyData.domain.toLowerCase(), // Store domain in lowercase
      createdAt: new Date(),
      totalEmployees: 0,
      totalDisbursed: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};

export const getCompanyData = async (companyId) => {
  try {
    const docSnap = await getDocs(
      query(collection(db, "companies"), where("__name__", "==", companyId))
    );
    if (docSnap.empty) return null;
    return { id: docSnap.docs[0].id, ...docSnap.docs[0].data() };
  } catch (error) {
    console.error("Error fetching company data:", error);
    throw error;
  }
};

export const getCompanyEmployees = async (companyId) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "employees"), where("companyId", "==", companyId))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const getCompanyWithdrawals = async (companyId, filters = {}) => {
  try {
    let q = query(
      collection(db, "withdrawals"),
      where("companyId", "==", companyId)
    );

    if (filters.startDate && filters.endDate) {
      q = query(
        collection(db, "withdrawals"),
        where("companyId", "==", companyId),
        where("date", ">=", filters.startDate),
        where("date", "<=", filters.endDate)
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    throw error;
  }
};

// Employee Operations
export const createEmployee = async (employeeData) => {
  try {
    const docRef = await addDoc(collection(db, "employees"), {
      ...employeeData,
      createdAt: new Date(),
      totalWithdrawn: 0,
      status: "active",
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

export const getEmployeeData = async (employeeId) => {
  try {
    const docSnap = await getDocs(
      query(collection(db, "employees"), where("__name__", "==", employeeId))
    );
    if (docSnap.empty) return null;
    return { id: docSnap.docs[0].id, ...docSnap.docs[0].data() };
  } catch (error) {
    console.error("Error fetching employee data:", error);
    throw error;
  }
};

export const getEmployeeWithdrawals = async (employeeId) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, "withdrawals"),
        where("employeeId", "==", employeeId),
        orderBy("date", "desc")
      )
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching employee withdrawals:", error);
    throw error;
  }
};

export const requestWithdrawal = async (withdrawalData) => {
  try {
    const docRef = await addDoc(collection(db, "withdrawals"), {
      ...withdrawalData,
      date: new Date(),
      status: "pending",
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error requesting withdrawal:", error);
    throw error;
  }
};

export const approveWithdrawal = async (withdrawalId, approvalData) => {
  try {
    await updateDoc(doc(db, "withdrawals", withdrawalId), {
      status: "approved",
      approvedAt: new Date(),
      approvedBy: approvalData.approvedBy,
    });
  } catch (error) {
    console.error("Error approving withdrawal:", error);
    throw error;
  }
};

export const rejectWithdrawal = async (withdrawalId, rejectionData) => {
  try {
    await updateDoc(doc(db, "withdrawals", withdrawalId), {
      status: "rejected",
      rejectedAt: new Date(),
      rejectionReason: rejectionData.reason,
      rejectedBy: rejectionData.rejectedBy,
    });
  } catch (error) {
    console.error("Error rejecting withdrawal:", error);
    throw error;
  }
};
