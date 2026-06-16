import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  deleteDoc 
} from "./firebase";
import { 
  Patient, 
  MealLog, 
  WaterLog, 
  MeasurementLog, 
  ChatMessage, 
  QuickConsult, 
  DietPlan, 
  Product,
  Role
} from "../types";
import { INITIAL_PRODUCTS, INITIAL_DIET_PLAN } from "../data";

// Collection names
const PATIENTS_COLL = "patients";
const MEALS_COLL = "meal_logs";
const MEASUREMENTS_COLL = "measurements";
const WATER_COLL = "water_logs";
const CHAT_COLL = "chat_messages";
const CONSULT_COLL = "consultations";
const PRODUCTS_COLL = "products";
const DIET_COLL = "diet_plans";

export const dbService = {
  // 1. Patient Profile
  async getPatient(id: string): Promise<Patient | null> {
    try {
      const docRef = doc(db, PATIENTS_COLL, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as Patient;
      }
      return null;
    } catch (err) {
      console.error("Error getting patient profile:", err);
      return null;
    }
  },

  async setPatient(patient: Patient): Promise<void> {
    try {
      const docRef = doc(db, PATIENTS_COLL, patient.id);
      await setDoc(docRef, patient);
    } catch (err) {
      console.error("Error creating/writing patient profile:", err);
    }
  },

  async updatePatient(id: string, updates: Partial<Patient>): Promise<void> {
    try {
      const docRef = doc(db, PATIENTS_COLL, id);
      await updateDoc(docRef, updates);
    } catch (err) {
      console.error("Error updating patient profile:", err);
    }
  },

  async listPatients(): Promise<Patient[]> {
    try {
      const collRef = collection(db, PATIENTS_COLL);
      const snap = await getDocs(collRef);
      const patients: Patient[] = [];
      snap.forEach((doc) => {
        patients.push(doc.data() as Patient);
      });
      return patients;
    } catch (err) {
      console.error("Error listing patients:", err);
      return [];
    }
  },

  // 2. Meal Logs
  async getMealLogs(patientId: string): Promise<MealLog[]> {
    try {
      const collRef = collection(db, MEALS_COLL);
      const q = query(collRef, where("patientId", "==", patientId), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const logs: MealLog[] = [];
      snap.forEach((doc) => {
        logs.push({ ...doc.data(), id: doc.id } as MealLog);
      });
      return logs;
    } catch (err) {
      console.error("Error fetching meals:", err);
      // Fallback if index isn't created yet or other error
      try {
        const collRef = collection(db, MEALS_COLL);
        const q = query(collRef, where("patientId", "==", patientId));
        const snap = await getDocs(q);
        const logs: MealLog[] = [];
        snap.forEach((doc) => {
          logs.push({ ...doc.data(), id: doc.id } as MealLog);
        });
        return logs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      } catch (e) {
        return [];
      }
    }
  },

  async addMealLog(log: Omit<MealLog, "id">): Promise<string> {
    try {
      const collRef = collection(db, MEALS_COLL);
      const docRef = await addDoc(collRef, log);
      // Save direct ID
      await updateDoc(docRef, { id: docRef.id });
      return docRef.id;
    } catch (err) {
      console.error("Error adding meal:", err);
      return "";
    }
  },

  async deleteMealLog(id: string): Promise<void> {
    try {
      const docRef = doc(db, MEALS_COLL, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Error deleting meal log:", err);
    }
  },

  // 3. Measurement Logs
  async getMeasurements(patientId: string): Promise<MeasurementLog[]> {
    try {
      const collRef = collection(db, MEASUREMENTS_COLL);
      const q = query(collRef, where("patientId", "==", patientId), orderBy("measuredAt", "desc"));
      const snap = await getDocs(q);
      const list: MeasurementLog[] = [];
      snap.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as MeasurementLog);
      });
      return list;
    } catch (err) {
      console.error("Error fetching measurements:", err);
      try {
        const collRef = collection(db, MEASUREMENTS_COLL);
        const q = query(collRef, where("patientId", "==", patientId));
        const snap = await getDocs(q);
        const list: MeasurementLog[] = [];
        snap.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id } as MeasurementLog);
        });
        return list.sort((a, b) => b.measuredAt.localeCompare(a.measuredAt));
      } catch (e) {
        return [];
      }
    }
  },

  async addMeasurement(m: Omit<MeasurementLog, "id">): Promise<string> {
    try {
      const collRef = collection(db, MEASUREMENTS_COLL);
      const docRef = await addDoc(collRef, m);
      await updateDoc(docRef, { id: docRef.id });
      return docRef.id;
    } catch (err) {
      console.error("Error adding measurement:", err);
      return "";
    }
  },

  // 4. Water Logs
  async getWaterLog(patientId: string, date: string): Promise<WaterLog | null> {
    try {
      const docRef = doc(db, WATER_COLL, `${patientId}_${date}`);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as WaterLog;
      }
      return null;
    } catch (err) {
      console.error("Error loaded water log:", err);
      return null;
    }
  },

  async setWaterLog(patientId: string, date: string, cups: number): Promise<void> {
    try {
      const docRef = doc(db, WATER_COLL, `${patientId}_${date}`);
      await setDoc(docRef, { cups, date, patientId });
    } catch (err) {
      console.error("Error writing water log:", err);
    }
  },

  // 5. Chat messages
  async getChatMessages(patientId: string): Promise<ChatMessage[]> {
    try {
      const collRef = collection(db, CHAT_COLL);
      const q = query(collRef, where("patientId", "==", patientId), orderBy("createdAt", "asc"));
      const snap = await getDocs(q);
      const list: ChatMessage[] = [];
      snap.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as ChatMessage);
      });
      return list;
    } catch (err) {
      console.error("Error fetching chat:", err);
      try {
        const collRef = collection(db, CHAT_COLL);
        const q = query(collRef, where("patientId", "==", patientId));
        const snap = await getDocs(q);
        const list: ChatMessage[] = [];
        snap.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id } as ChatMessage);
        });
        return list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      } catch (e) {
        return [];
      }
    }
  },

  async addChatMessage(msg: Omit<ChatMessage, "id">): Promise<string> {
    try {
      const collRef = collection(db, CHAT_COLL);
      const docRef = await addDoc(collRef, msg);
      await updateDoc(docRef, { id: docRef.id });
      return docRef.id;
    } catch (err) {
      console.error("Error sending chat message:", err);
      return "";
    }
  },

  // 6. Consultations (Public Wall)
  async getConsultations(): Promise<QuickConsult[]> {
    try {
      const collRef = collection(db, CONSULT_COLL);
      const q = query(collRef, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list: QuickConsult[] = [];
      snap.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as QuickConsult);
      });
      return list;
    } catch (err) {
      console.error("Error fetching consultations:", err);
      try {
        const collRef = collection(db, CONSULT_COLL);
        const snap = await getDocs(collRef);
        const list: QuickConsult[] = [];
        snap.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id } as QuickConsult);
        });
        return list.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
      } catch (e) {
        return [];
      }
    }
  },

  async addConsultation(c: Omit<QuickConsult, "id">): Promise<string> {
    try {
      const collRef = collection(db, CONSULT_COLL);
      const docRef = await addDoc(collRef, c);
      await updateDoc(docRef, { id: docRef.id });
      return docRef.id;
    } catch (err) {
      console.error("Error adding consultation:", err);
      return "";
    }
  },

  async answerConsultation(id: string, answer: string): Promise<void> {
    try {
      const docRef = doc(db, CONSULT_COLL, id);
      await updateDoc(docRef, {
        answerByDoctor: answer,
        status: "answered"
      });
    } catch (err) {
      console.error("Error answering consultation:", err);
    }
  },

  // 7. Diet Plan
  async getDietPlan(patientId: string): Promise<DietPlan | null> {
    try {
      const docRef = doc(db, DIET_COLL, patientId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as DietPlan;
      }
      return null;
    } catch (err) {
      console.error("Error getting diet plan:", err);
      return null;
    }
  },

  async setDietPlan(plan: DietPlan): Promise<void> {
    try {
      const docRef = doc(db, DIET_COLL, plan.patientId);
      await setDoc(docRef, plan);
    } catch (err) {
      console.error("Error saving diet plan:", err);
    }
  },

  // 8. Custom Shop Products
  async getProducts(): Promise<Product[]> {
    try {
      const collRef = collection(db, PRODUCTS_COLL);
      const snap = await getDocs(collRef);
      const list: Product[] = [];
      snap.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as Product);
      });
      if (list.length === 0) {
        // Initialize default ones in Firestore for seamless first-time install
        for (const p of INITIAL_PRODUCTS) {
          await setDoc(doc(db, PRODUCTS_COLL, p.id), p);
          list.push(p);
        }
      }
      return list;
    } catch (err) {
      console.error("Error getting products:", err);
      return INITIAL_PRODUCTS;
    }
  },

  async addProduct(p: Product): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLL, p.id);
      await setDoc(docRef, p);
    } catch (err) {
      console.error("Error writing product:", err);
    }
  },

  async removeProduct(id: string): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLL, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  }
};
