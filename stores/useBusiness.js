// src/stores/useBusiness.js
import { create } from "zustand";
import { db } from "../firebase"; // Adjust path if needed
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";

const useBusinessStore = create((set, get) => ({
  form: false,
  
  // States for creating a business
  isCreating: false,
  createError: null,
  
  // States for fetching businesses
  businesses: [],
  isFetching: false,
  fetchError: null,

  setForm: (isOpen) => set({ form: isOpen, createError: null }), // Clear create error on open/close

  // Updated createBusiness function
  createBusiness: async (businessData) => {
    set({ isCreating: true, createError: null }); 
    try {
      const docRef = await addDoc(collection(db, "businesses"), {
        ...businessData,
        createdAt: serverTimestamp() 
      });
      
      console.log("Document written with ID: ", docRef.id);
      set({ isCreating: false });
      
      // Optionally re-fetch businesses after creating a new one
      get().fetchBusinesses(); 
      
      return { success: true, id: docRef.id };
      
    } catch (e) {
      console.error("Error adding document: ", e);
      set({ isCreating: false, createError: e.message });
      return { success: false, error: e.message };
    }
  },

  // --- NEW FUNCTION to fetch all businesses ---
  fetchBusinesses: async () => {
    set({ isFetching: true, fetchError: null });
    try {
      // Query the collection, order by 'createdAt' in descending order (newest first)
      const businessesCollection = collection(db, "businesses");
      const q = query(businessesCollection, orderBy("createdAt", "desc"));
      
      const querySnapshot = await getDocs(q);
      
      const businessesList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Convert Firestore Timestamp to JavaScript Date
        const createdAt = data.createdAt ? data.createdAt.toDate() : null;
        
        let meetingScheduled = null;
        if (createdAt) {
          // Calculate meeting date (+1 day)
          const meetingDate = new Date(createdAt);
          meetingDate.setDate(meetingDate.getDate() + 1);
          meetingScheduled = meetingDate;
        }

        return {
          id: doc.id,
          ...data,
          createdAt: createdAt, // Now a JS Date object
          meetingScheduled: meetingScheduled // Also a JS Date object
        };
      });

      set({ businesses: businessesList, isFetching: false });

    } catch (e) {
      console.error("Error fetching documents: ", e);
      set({ isFetching: false, fetchError: e.message });
    }
  },
}));

export default useBusinessStore;