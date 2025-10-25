"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Check if user is company admin
          const companyDoc = await getDoc(
            doc(db, "companies", currentUser.uid)
          );
          if (companyDoc.exists()) {
            setRole("company");
            setCompanyId(currentUser.uid);
            setUser({ ...currentUser, companyId: currentUser.uid });
          } else {
            // Check if user is employee
            const employeeDoc = await getDoc(
              doc(db, "employees", currentUser.uid)
            );
            if (employeeDoc.exists()) {
              const empData = employeeDoc.data();
              setRole("employee");
              setCompanyId(empData.companyId);
              setUser({ ...currentUser, companyId: empData.companyId });
            } else {
              // New user - assign based on email domain
              const emailDomain = currentUser.email?.split("@")[1];
              setRole("employee");
              setUser(currentUser);
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole("employee");
          setUser(currentUser);
        }
      } else {
        setUser(null);
        setRole(null);
        setCompanyId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      setCompanyId(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, role, companyId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
