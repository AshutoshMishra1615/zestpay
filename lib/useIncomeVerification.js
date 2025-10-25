"use client";
import { useState, useEffect } from "react";
import {
  calculateWithdrawalLimit,
  processWithdrawal,
  getWithdrawalHistory,
  getTodayEarnings,
  getRollingAverageIncome,
} from "@/lib/incomeVerificationService";
import { useAuth } from "@/lib/authContext";

export const useIncomeVerification = () => {
  const { user } = useAuth();
  const [withdrawalLimit, setWithdrawalLimit] = useState(null);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [trustScore, setTrustScore] = useState(0.5);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const limit = await calculateWithdrawalLimit(user.uid);
        setWithdrawalLimit(limit.dailyLimit);
        setTodayEarnings(limit.todayEarnings);
        setWeeklyAverage(limit.weeklyAverage);
        setTrustScore(limit.trustScore);

        const history = await getWithdrawalHistory(user.uid);
        setWithdrawalHistory(history);
      } catch (error) {
        console.error("Error fetching income verification data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const withdraw = async (amount) => {
    if (!user) throw new Error("User not authenticated");
    const result = await processWithdrawal(user.uid, amount);
    // Refresh data
    const limit = await calculateWithdrawalLimit(user.uid);
    setWithdrawalLimit(limit.dailyLimit);
    return result;
  };

  return {
    withdrawalLimit,
    todayEarnings,
    weeklyAverage,
    trustScore,
    withdrawalHistory,
    loading,
    withdraw,
  };
};
