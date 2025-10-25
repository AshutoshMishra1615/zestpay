import { db } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

const WEEKS = 4; // 4-6 weeks rolling average
const WITHDRAWAL_PERCENTAGE = 0.5; // 50% of earnings
const TRUST_SCORE_INCREMENT = 0.05; // Increment for successful repayments
const MAX_TRUST_SCORE = 0.65; // Maximum 65%
const MIN_TRUST_SCORE = 0.5; // Minimum 50%

// Record daily earnings from gig work
export const recordEarnings = async (userId, amount, source) => {
  try {
    const earningsRef = collection(db, `users/${userId}/earnings`);
    const docRef = await addDoc(earningsRef, {
      amount,
      source, // "ola", "uber", "zomato", etc.
      date: Timestamp.fromDate(new Date()),
      timestamp: Date.now(),
      verified: true,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error recording earnings:", error);
    throw error;
  }
};

// Get rolling average of last 4-6 weeks
export const getRollingAverageIncome = async (userId) => {
  try {
    const earningsRef = collection(db, `users/${userId}/earnings`);
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42); // 6 weeks

    const q = query(
      earningsRef,
      where("date", ">=", Timestamp.fromDate(sixWeeksAgo)),
      orderBy("date", "desc")
    );

    const snapshot = await getDocs(q);
    const earnings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (earnings.length === 0) {
      return { weeklyAverage: 0, totalEarnings: 0, daysWorked: 0 };
    }

    // Group earnings by date
    const dailyEarnings = {};
    earnings.forEach((earning) => {
      const dateKey = earning.date.toDate().toISOString().split("T")[0];
      dailyEarnings[dateKey] = (dailyEarnings[dateKey] || 0) + earning.amount;
    });

    const totalEarnings = Object.values(dailyEarnings).reduce(
      (a, b) => a + b,
      0
    );
    const daysWorked = Object.keys(dailyEarnings).length;
    const weeklyAverage = (totalEarnings / daysWorked) * 7; // Average per week

    return { weeklyAverage, totalEarnings, daysWorked };
  } catch (error) {
    console.error("Error calculating rolling average:", error);
    return { weeklyAverage: 0, totalEarnings: 0, daysWorked: 0 };
  }
};

// Get today's earnings
export const getTodayEarnings = async (userId) => {
  try {
    const earningsRef = collection(db, `users/${userId}/earnings`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const q = query(
      earningsRef,
      where("date", ">=", Timestamp.fromDate(today)),
      where("date", "<", Timestamp.fromDate(tomorrow))
    );

    const snapshot = await getDocs(q);
    const todayEarnings = snapshot.docs.reduce(
      (sum, doc) => sum + doc.data().amount,
      0
    );

    return todayEarnings;
  } catch (error) {
    console.error("Error getting today's earnings:", error);
    return 0;
  }
};

// Calculate dynamic withdrawal limit
export const calculateWithdrawalLimit = async (userId) => {
  try {
    const { weeklyAverage } = await getRollingAverageIncome(userId);
    const todayEarnings = await getTodayEarnings(userId);
    const trustScore = await getTrustScore(userId);

    // Dynamic daily limit = (today's earnings * trust score percentage)
    const dailyLimit = Math.floor(todayEarnings * trustScore);

    return {
      dailyLimit,
      weeklyAverage,
      todayEarnings,
      trustScore,
      safetyBuffer: todayEarnings - dailyLimit, // Amount reserved for platform deductions
    };
  } catch (error) {
    console.error("Error calculating withdrawal limit:", error);
    return {
      dailyLimit: 0,
      weeklyAverage: 0,
      todayEarnings: 0,
      trustScore: MIN_TRUST_SCORE,
      safetyBuffer: 0,
    };
  }
};

// Get trust score (default 50%, increases with successful history)
export const getTrustScore = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDocs(
      query(collection(db, "users"), where("uid", "==", userId))
    );

    if (!docSnap.empty) {
      const userData = docSnap.docs[0].data();
      return userData.trustScore || MIN_TRUST_SCORE;
    }

    return MIN_TRUST_SCORE;
  } catch (error) {
    console.error("Error getting trust score:", error);
    return MIN_TRUST_SCORE;
  }
};

// Update trust score based on repayment history
export const updateTrustScore = async (userId, successful = true) => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDocs(
      query(collection(db, "users"), where("uid", "==", userId))
    );

    if (!docSnap.empty) {
      const userData = docSnap.docs[0].data();
      let newScore = userData.trustScore || MIN_TRUST_SCORE;

      if (successful) {
        newScore = Math.min(newScore + TRUST_SCORE_INCREMENT, MAX_TRUST_SCORE);
      } else {
        newScore = Math.max(
          newScore - TRUST_SCORE_INCREMENT * 2,
          MIN_TRUST_SCORE
        );
      }

      await updateDoc(docSnap.docs[0].ref, { trustScore: newScore });
      return newScore;
    }

    return MIN_TRUST_SCORE;
  } catch (error) {
    console.error("Error updating trust score:", error);
    return MIN_TRUST_SCORE;
  }
};

// Process withdrawal
export const processWithdrawal = async (userId, amount) => {
  try {
    const { dailyLimit } = await calculateWithdrawalLimit(userId);

    if (amount > dailyLimit) {
      throw new Error(
        `Withdrawal amount ₹${amount} exceeds daily limit of ₹${dailyLimit}`
      );
    }

    const withdrawalsRef = collection(db, `users/${userId}/withdrawals`);
    const docRef = await addDoc(withdrawalsRef, {
      amount,
      status: "completed",
      date: Timestamp.fromDate(new Date()),
      timestamp: Date.now(),
      safetyBufferReserved: dailyLimit - amount,
    });

    // Increment trust score on successful withdrawal
    await updateTrustScore(userId, true);

    return {
      id: docRef.id,
      amount,
      status: "completed",
      message: `₹${amount} withdrawn successfully`,
    };
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    throw error;
  }
};

// Get withdrawal history
export const getWithdrawalHistory = async (userId) => {
  try {
    const withdrawalsRef = collection(db, `users/${userId}/withdrawals`);
    const q = query(withdrawalsRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate(),
    }));
  } catch (error) {
    console.error("Error getting withdrawal history:", error);
    return [];
  }
};
