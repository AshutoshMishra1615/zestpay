import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import {
  getBills,
  addBill,
  deleteBill,
  getPaycheckRules,
  addPaycheckRule,
  deletePaycheckRule,
  getExpenses,
  addExpense,
  deleteExpense,
  getEarnings,
  addEarning,
  getTaxReserve,
  updateTaxReserve,
} from "@/lib/firebaseService";

export const useBills = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!user) return;
    try {
      const data = await getBills(user.uid);
      setBills(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [user]);

  const add = async (billData) => {
    if (!user) return;
    try {
      await addBill(user.uid, billData);
      await fetch();
    } catch (error) {
      console.error("Error adding bill:", error);
    }
  };

  const remove = async (billId) => {
    if (!user) return;
    try {
      await deleteBill(user.uid, billId);
      await fetch();
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  return { bills, loading, add, remove };
};

export const usePaycheckRules = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!user) return;
    try {
      const data = await getPaycheckRules(user.uid);
      setRules(data);
    } catch (error) {
      console.error("Error fetching paycheck rules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [user]);

  const add = async (ruleData) => {
    if (!user) return;
    try {
      await addPaycheckRule(user.uid, ruleData);
      await fetch();
    } catch (error) {
      console.error("Error adding rule:", error);
    }
  };

  const remove = async (ruleId) => {
    if (!user) return;
    try {
      await deletePaycheckRule(user.uid, ruleId);
      await fetch();
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  return { rules, loading, add, remove };
};

export const useExpenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!user) return;
    try {
      const data = await getExpenses(user.uid);
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [user]);

  const add = async (expenseData) => {
    if (!user) return;
    try {
      await addExpense(user.uid, expenseData);
      await fetch();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const remove = async (expenseId) => {
    if (!user) return;
    try {
      await deleteExpense(user.uid, expenseId);
      await fetch();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return { expenses, loading, add, remove };
};

export const useEarnings = (startDate, endDate) => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!user) return;
    try {
      const data = await getEarnings(user.uid, startDate, endDate);
      setEarnings(data);
    } catch (error) {
      console.error("Error fetching earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [user, startDate, endDate]);

  const add = async (earningData) => {
    if (!user) return;
    try {
      await addEarning(user.uid, earningData);
      await fetch();
    } catch (error) {
      console.error("Error adding earning:", error);
    }
  };

  return { earnings, loading, add };
};

export const useTaxReserve = () => {
  const { user } = useAuth();
  const [taxReserve, setTaxReserve] = useState({
    percentage: 15,
    total: 0,
    enabled: false,
  });
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!user) return;
    try {
      const data = await getTaxReserve(user.uid);
      setTaxReserve(data);
    } catch (error) {
      console.error("Error fetching tax reserve:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [user]);

  const update = async (data) => {
    if (!user) return;
    try {
      await updateTaxReserve(user.uid, data);
      await fetch();
    } catch (error) {
      console.error("Error updating tax reserve:", error);
    }
  };

  return { taxReserve, loading, update };
};
