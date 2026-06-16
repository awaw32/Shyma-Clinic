import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Menu, 
  Grid, 
  Bell, 
  Sparkles, 
  Smile, 
  UserCheck, 
  Trash2, 
  Heart,
  Calendar,
  AlertCircle,
  LogOut,
  ChevronLeft
} from "lucide-react";
import { 
  Role, 
  Patient, 
  Product, 
  CartItem, 
  MealLog, 
  WaterLog, 
  MeasurementLog, 
  ChatMessage, 
  QuickConsult, 
  MealType,
  ExerciseVideo,
  ExerciseProgress,
  DietPlan
} from "./types";
import { 
  INITIAL_PRODUCTS, 
  INITIAL_VIDEOS, 
  INITIAL_SUCCESS_STORIES, 
  INITIAL_DIET_PLAN, 
  INITIAL_CHAT, 
  INITIAL_QUICK_CONSULT, 
  SAMPLE_PATIENT, 
  INITIAL_MOTIVATIONS,
  getSavedData, 
  saveToStorage 
} from "./data";

// Firebase and Database imports
import { auth, onAuthStateChanged, signOut } from "./lib/firebase";
import { dbService } from "./lib/dbService";

// Components
import Homepage from "./components/Homepage";
import Sidebar from "./components/Sidebar";
import BottomNavBar from "./components/BottomNavBar";
import StatWidgets from "./components/StatWidgets";
import NutritionRoom from "./components/NutritionRoom";
import SportsRoom from "./components/SportsRoom";
import MeasurementsRoom from "./components/MeasurementsRoom";
import ShopRoom from "./components/ShopRoom";
import ChatAndConsult from "./components/ChatAndConsult";
import RageRoom from "./components/RageRoom";
import GalleryRoom from "./components/GalleryRoom";
import ReportView from "./components/ReportView";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [currentRoom, setRoom] = useState<string>("nutrition");
  const [userRole, setUserRole] = useState<Role>(Role.PATIENT);
  const [showNotificationOverlay, setShowNotificationOverlay] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [currentMotivation, setCurrentMotivation] = useState("");
  
  // App journey state: homepage or portal
  const [isAuthActive, setIsAuthActive] = useState(false); // True means they passed the Homepage
  const [currentUser, setCurrentUser] = useState<any>(null); // Firebase authenticated user
  const [patientsList, setPatientsList] = useState<Patient[]>([]); // For Doctor
  const [selectedPatientId, setSelectedPatientId] = useState<string>(""); // For Doctor

  // Persistent States synced on Storage / FireStore
  const [patient, setPatient] = useState<Patient>(() => getSavedData("patient", SAMPLE_PATIENT));
  const [products, setProducts] = useState<Product[]>(() => getSavedData("products", INITIAL_PRODUCTS));
  const [cart, setCart] = useState<CartItem[]>(() => getSavedData("cart", []));
  const [mealLogs, setMealLogs] = useState<MealLog[]>(() => getSavedData("meal_logs", []));
  const [waterLog, setWaterLog] = useState<WaterLog>(() => getSavedData("water_log", {
    date: new Date().toISOString().split("T")[0],
    cups: 3
  }));
  const [measurements, setMeasurements] = useState<MeasurementLog[]>(() => getSavedData("measurements", []));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => getSavedData("chat_messages", INITIAL_CHAT));
  const [consultations, setConsultations] = useState<QuickConsult[]>(() => getSavedData("consultations", INITIAL_QUICK_CONSULT));
  const [dietPlan, setDietPlan] = useState<DietPlan>(() => getSavedData("diet_plan", INITIAL_DIET_PLAN[0]));
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>(() => getSavedData("ex_progress", []));
  const [loadingDb, setLoadingDb] = useState(false);

  // Sync back to LocalStorage as a persistent fallback
  useEffect(() => { saveToStorage("patient", patient); }, [patient]);
  useEffect(() => { saveToStorage("products", products); }, [products]);
  useEffect(() => { saveToStorage("cart", cart); }, [cart]);
  useEffect(() => { saveToStorage("meal_logs", mealLogs); }, [mealLogs]);
  useEffect(() => { saveToStorage("water_log", waterLog); }, [waterLog]);
  useEffect(() => { saveToStorage("measurements", measurements); }, [measurements]);
  useEffect(() => { saveToStorage("chat_messages", chatMessages); }, [chatMessages]);
  useEffect(() => { saveToStorage("consultations", consultations); }, [consultations]);
  useEffect(() => { saveToStorage("diet_plan", dietPlan); }, [dietPlan]);
  useEffect(() => { saveToStorage("ex_progress", exerciseProgress); }, [exerciseProgress]);

  // Set random daily motivational quote at load
  useEffect(() => {
    const randomQuote = INITIAL_MOTIVATIONS[Math.floor(Math.random() * INITIAL_MOTIVATIONS.length)];
    setCurrentMotivation(randomQuote);
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setCurrentUser(fbUser);
        setIsAuthActive(true);
        if (fbUser.email && fbUser.email.includes("admin")) {
          // Doctor role
          setUserRole(Role.ADMIN);
          setRoom("admin");
          // Fetch patients list
          fetchPatientsListDb();
        } else {
          // Patient role
          setUserRole(Role.PATIENT);
          // Load database for this patient
          await loadPatientDataFromDb(fbUser.uid, fbUser.email || "");
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch all registered patients for Admin panel
  const fetchPatientsListDb = async () => {
    try {
      const plist = await dbService.listPatients();
      setPatientsList(plist);
      if (plist.length > 0) {
        // Select first patient by default
        const first = plist[0];
        setSelectedPatientId(first.id);
        await loadPatientDoctorView(first.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Switch doctor's active patient viewer
  const handleSelectPatientDoctor = async (patientId: string) => {
    setSelectedPatientId(patientId);
    await loadPatientDoctorView(patientId);
  };

  // Load patient's database into states
  const loadPatientDataFromDb = async (uid: string, email: string) => {
    setLoadingDb(true);
    try {
      // 1. Check patient profile
      let pProfile = await dbService.getPatient(uid);
      if (!pProfile) {
        // Create standard record in Firestore
        pProfile = {
          id: uid,
          name: email.split("@")[0],
          phone: "055",
          email: email,
          role: Role.PATIENT,
          points: 100, // New user bonus!
          streak: 1,
          longestStreak: 1,
          lastCheckinDate: new Date().toISOString().split("T")[0],
          targetWaterCups: 8,
          weightGoal: 70,
          joinedDate: new Date().toISOString().split("T")[0],
          level: "برونزي"
        };
        await dbService.setPatient(pProfile);
      }
      setPatient(pProfile);

      // 2. Load water log for today
      const todayStr = new Date().toISOString().split("T")[0];
      const water = await dbService.getWaterLog(uid, todayStr);
      if (water) {
        setWaterLog(water);
      } else {
        setWaterLog({ date: todayStr, cups: 0 });
      }

      // 3. Load other collections
      const meals = await dbService.getMealLogs(uid);
      setMealLogs(meals);

      const measures = await dbService.getMeasurements(uid);
      setMeasurements(measures);

      const plan = await dbService.getDietPlan(uid);
      if (plan) {
        setDietPlan(plan);
      } else {
        setDietPlan(INITIAL_DIET_PLAN[0]);
      }

      const chats = await dbService.getChatMessages(uid);
      setChatMessages(chats);

      // 4. Load products
      const shopProducts = await dbService.getProducts();
      setProducts(shopProducts);

    } catch (err) {
      console.error("Error loading patient database:", err);
    } finally {
      setLoadingDb(false);
    }

    // Refresh general consultations wall
    try {
      const qcs = await dbService.getConsultations();
      setConsultations(qcs);
    } catch (e) {}
  };

  // Doctor specialized loader to view a patient's data
  const loadPatientDoctorView = async (patientId: string) => {
    try {
      const pProfile = await dbService.getPatient(patientId);
      if (pProfile) {
        setPatient(pProfile);
        
        // Load target meal logs
        const meals = await dbService.getMealLogs(patientId);
        setMealLogs(meals);

        // Load targeted measurement logs
        const measures = await dbService.getMeasurements(patientId);
        setMeasurements(measures);

        // Load custom diet
        const customPlan = await dbService.getDietPlan(patientId);
        if (customPlan) {
          setDietPlan(customPlan);
        } else {
          setDietPlan({
            id: `plan-${patientId}`,
            patientId: patientId,
            title: "نظام مصمم يدوياً من د.شيماء",
            breakfast: "3 معالق فول بالكمون وليمون + شريحة توست أسمر",
            lunch: "طبق خضار سوتيه طبيعي أو متبل + ربع فرخة بيضاء مسلوقة",
            dinner: "كوب زبادي منزوع الدسم مع بذور الكتان الكثيفة",
            snacks: "خيار وطماطم بكميات مفتوحة",
            notes: "يرجى شرب 2 لتر مياه والتزام السناكس المقررة",
            createdAt: new Date().toISOString()
          });
        }

        // Load private chat with this patient
        const chats = await dbService.getChatMessages(patientId);
        setChatMessages(chats);
      }
    } catch (e) {
      console.error(e);
    }

    // Load consultations and products globally
    try {
      const qcs = await dbService.getConsultations();
      setConsultations(qcs);
      const prod = await dbService.getProducts();
      setProducts(prod);
    } catch (e) {}
  };

  // Trigger app notification banner
  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setShowNotificationOverlay(true);
    setTimeout(() => {
      setShowNotificationOverlay(false);
    }, 4500);
  };

  // Gamification: Awarding points and updating levels securely
  const handleAwardPoints = async (amount: number) => {
    const updatedPoints = patient.points + amount;
    let newLevel = "جديد";
    if (updatedPoints >= 1000) newLevel = "ذهبي";
    else if (updatedPoints >= 500) newLevel = "فضي";
    else if (updatedPoints >= 100) newLevel = "برونزي";

    if (newLevel !== patient.level) {
      triggerNotification(`👑 تبريكاتنا! لقد ترقيت للمستوى [ ${newLevel} ] بفضل التزامك اليومي!`);
    }

    const updatedProfile = {
      ...patient,
      points: updatedPoints,
      level: newLevel
    };

    setPatient(updatedProfile);

    // Save profile to database
    if (currentUser) {
      await dbService.updatePatient(patient.id, {
        points: updatedPoints,
        level: newLevel
      });
    }
  };

  // Daily Check-In with sequence streaks
  const handleCheckin = async () => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (patient.lastCheckinDate === todayStr) {
      triggerNotification("⚠️ لقد قمت بتسجيل حضورك لليوم مسبقاً! تابع تسجيل وجباتك ومستويات المياه.");
      return;
    }

    let currentStreak = patient.streak;
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (patient.lastCheckinDate === yesterdayStr) {
      currentStreak += 1;
    } else {
      currentStreak = 1; // broken sequence, reset to 1
    }

    const longest = Math.max(currentStreak, patient.longestStreak);
    
    const updatedProfile = {
      ...patient,
      streak: currentStreak,
      longestStreak: longest,
      lastCheckinDate: todayStr,
    };

    setPatient(updatedProfile);

    // Save to database
    if (currentUser) {
      await dbService.updatePatient(patient.id, {
        streak: currentStreak,
        longestStreak: longest,
        lastCheckinDate: todayStr
      });
    }

    // Grant bonus
    let bonus = 10;
    if (currentStreak >= 30) bonus += 15;
    else if (currentStreak >= 7) bonus += 10;
    else if (currentStreak >= 3) bonus += 5;

    await handleAwardPoints(bonus);
    triggerNotification(`🔥 رائع! تم الحضور لليوم وحصد (+${bonus}) نقطة! استمر على السلسلة ولا تفوّت أي يوم.`);
  };

  // Hydration tracking update
  const handleUpdateWater = async (cups: number) => {
    const todayStr = new Date().toISOString().split("T")[0];
    setWaterLog({
      date: todayStr,
      cups
    });

    if (currentUser) {
      await dbService.setWaterLog(patient.id, todayStr, cups);
    }

    if (cups === patient.targetWaterCups) {
      await handleAwardPoints(10);
      triggerNotification("💧 أحسنت! الترطيب مكتمل اليوم وصرف السوائل نشط (+10 نقاط).");
    }
  };

  // Meals Logging
  const handleAddMeal = async (type: MealType, description: string, calories: number) => {
    const newLog: Omit<MealLog, "id"> = {
      patientId: patient.id,
      date: new Date().toISOString().split("T")[0],
      type,
      description,
      calories,
      createdAt: new Date().toISOString()
    };

    if (currentUser) {
      const generatedId = await dbService.addMealLog(newLog);
      setMealLogs([{ ...newLog, id: generatedId } as MealLog, ...mealLogs]);
    } else {
      setMealLogs([{ ...newLog, id: `meal-${Date.now()}` } as MealLog, ...mealLogs]);
    }

    await handleAwardPoints(5);
    triggerNotification("🥗 تم إدراج وجبتك الطبية بنجاح (+5 نقاط).");
  };

  const handleRemoveMeal = async (id: string) => {
    setMealLogs(mealLogs.filter(log => log.id !== id));
    if (currentUser) {
      await dbService.deleteMealLog(id);
    }
    triggerNotification("✓ تم حذف الوجبة بنجاح.");
  };

  // Measurements tracking
  const handleAddMeasurement = async (m: Omit<MeasurementLog, "id" | "patientId">) => {
    const newM: Omit<MeasurementLog, "id"> = {
      ...m,
      patientId: patient.id,
    };

    if (currentUser) {
      const generatedId = await dbService.addMeasurement(newM);
      setMeasurements([{ ...newM, id: generatedId } as MeasurementLog, ...measurements]);
    } else {
      setMeasurements([{ ...newM, id: `meas-${Date.now()}` } as MeasurementLog, ...measurements]);
    }

    await handleAwardPoints(30); // Major reward for weekly tracking
    triggerNotification("📊 تم تسجيل قياس الأسبوع ومقاسات وزنك بنجاح (+30 نقطة).");
  };

  // e-Commerce Shopping Cart handlers
  const handleAddToCart = (productId: string) => {
    setCart((prev) => {
      const exist = prev.find(item => item.productId === productId);
      if (exist) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId, quantity: 1 }];
    });
    triggerNotification("🛒 تم إضافة بديل غذائي صحي لسلة المشتريات.");
  };

  const handleUpdateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      setCart(cart.map(item => item.productId === productId ? { ...item, quantity: qty } : item));
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
    triggerNotification("✓ تم إمساك العنصر من السلة.");
  };

  // Chat message handlers
  const handleSendChatMessage = async (text: string) => {
    const newMsg: Omit<ChatMessage, "id"> = {
      senderId: patient.id,
      senderName: patient.name,
      senderRole: Role.PATIENT,
      text,
      createdAt: new Date().toISOString(),
      patientId: patient.id
    };

    if (currentUser) {
      const genId = await dbService.addChatMessage(newMsg);
      setChatMessages((prev) => [...prev, { ...newMsg, id: genId } as ChatMessage]);
    } else {
      setChatMessages((prev) => [...prev, { ...newMsg, id: `msg-${Date.now()}` } as ChatMessage]);
    }

    // Simulated doctor automated feedback representation after message
    setTimeout(async () => {
      const autoDoctorMsg: Omit<ChatMessage, "id"> = {
        senderId: "doctor",
        senderName: "د. شيماء تغذية علاجية",
        senderRole: Role.ADMIN,
        text: "أهلاً بك يا بطل، لقد استلمت رسالتك وصور فحوصاتك بنجاح. أقوم حالياً بفحص الوجبات الأسبوعية والتحاليل الطبية لملائمة الـ Diet Plan وسأرد عليك رداً تفصيلياً قريباً! استمر بمحيط الحرق القوي.",
        createdAt: new Date().toISOString(),
        patientId: patient.id
      };

      if (currentUser) {
        const docId = await dbService.addChatMessage(autoDoctorMsg);
        setChatMessages((prev) => [...prev, { ...autoDoctorMsg, id: docId } as ChatMessage]);
      } else {
        setChatMessages((prev) => [...prev, { ...autoDoctorMsg, id: `msg-${Date.now() + 1}` } as ChatMessage]);
      }
      triggerNotification("💬 الدكتورة شيماء استلمت رسالتك ووثقت ملفك.");
    }, 2000);
  };

  // Quick consultations (Public consultations wall)
  const handlePostConsultation = async (question: string, cat: string) => {
    const newConsult: Omit<QuickConsult, "id"> = {
      patientId: patient.id,
      patientName: patient.name,
      question,
      category: cat,
      answerByDoctor: null,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    if (currentUser) {
      const genId = await dbService.addConsultation(newConsult);
      setConsultations([{ ...newConsult, id: genId } as QuickConsult, ...consultations]);
    } else {
      setConsultations([{ ...newConsult, id: `qc-${Date.now()}` } as QuickConsult, ...consultations]);
    }

    await handleAwardPoints(10);
    triggerNotification("🧭 نُشرت استشارتك الفورية لحائط تعليقات العيادة بنجاح (+10 نقاط).");
  };

  // Exercise completed tracking
  const handleCompleteVideo = async (videoId: string, reward: number) => {
    const updatedProgress = [
      ...exerciseProgress,
      { videoId, completed: true, completedAt: new Date().toISOString() }
    ];
    setExerciseProgress(updatedProgress);
    await handleAwardPoints(reward);
    triggerNotification(`🏆 مبروك! أغلقت هذا مقرر بدني وحققت (+${reward}) نقطة رياضية.`);
  };

  // Admin / Doctor Control functions linked to Firestore
  const handleUpdatePatientProfile = async (updated: Patient) => {
    setPatient(updated);
    if (currentUser) {
      await dbService.setPatient(updated);
      // Refresh list
      await fetchPatientsListDb();
    }
  };

  const handleUpdateDietPlan = async (updated: DietPlan) => {
    setDietPlan(updated);
    if (currentUser) {
      await dbService.setDietPlan(updated);
    }
  };

  const handleDoctorSendChat = async (text: string) => {
    const newMsg: Omit<ChatMessage, "id"> = {
      senderId: "doctor",
      senderName: "د. شيماء تغذية علاجية",
      senderRole: Role.ADMIN,
      text,
      createdAt: new Date().toISOString(),
      patientId: patient.id
    };

    if (currentUser) {
      const genId = await dbService.addChatMessage(newMsg);
      setChatMessages((prev) => [...prev, { ...newMsg, id: genId } as ChatMessage]);
    } else {
      setChatMessages((prev) => [...prev, { ...newMsg, id: `msg-${Date.now()}` } as ChatMessage]);
    }
    triggerNotification("💬 تم إرسال توجيه الدكتورة للمحادثة بنجاح ✓");
  };

  const handleAnswerConsultation = async (id: string, answer: string) => {
    setConsultations(
      consultations.map(c => c.id === id ? { ...c, answerByDoctor: answer, status: "answered" } : c)
    );
    if (currentUser) {
      await dbService.answerConsultation(id, answer);
    }
  };

  const handleAddProduct = async (p: Omit<Product, "id">) => {
    const newP: Product = {
      ...p,
      id: `prod-${Date.now()}`
    };
    setProducts([...products, newP]);
    if (currentUser) {
      await dbService.addProduct(newP);
    }
  };

  const handleRemoveProduct = async (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    if (currentUser) {
      await dbService.removeProduct(id);
    }
  };

  // Reset app demo simulator
  const handleResetAppDemo = () => {
    if (confirm("هل تود تصفير وإعادة تعيين بيانات محاكاة العيادة بأكملها لتجربة رحلة جديدة؟")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Authenticate from landing homepage
  const handleLoginSuccess = async (uid: string, email: string, name: string, phone: string, role: Role, docFetched?: any) => {
    setIsAuthActive(true);
    if (role === Role.ADMIN) {
      setUserRole(Role.ADMIN);
      setRoom("admin");
      await fetchPatientsListDb();
    } else {
      setUserRole(Role.PATIENT);
      setRoom("nutrition");
      if (docFetched) {
        // If they registered, write the pre-compiled profile directly
        await dbService.setPatient(docFetched);
        setPatient(docFetched);
        // Add greeting messages
        const initialGreet: Omit<ChatMessage, "id"> = {
          senderId: "doctor",
          senderName: "د. شيماء تغذية علاجية",
          senderRole: Role.ADMIN,
          text: `مرحباً بك يا بطل ${name}! تم فتح وتنشيط ملفك الطبي والرياضي الخاص بوضع التخسيس بنجاح. أنا د. شيماء، ومحفورة في هذا الشات معك يومياً لأتابع الـ Weight progress وسلسلة شرب المياه والوجبات.`,
          createdAt: new Date().toISOString(),
          patientId: uid
        };
        await dbService.addChatMessage(initialGreet);
      }
      await loadPatientDataFromDb(uid, email);
    }
    triggerNotification("🎉 تم الدخول بنجاح! نُقلك لبوابتك ومجال حرقك اليومي.");
  };

  // Logout trigger
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setIsAuthActive(false);
    setCurrentUser(null);
    setUserRole(Role.PATIENT);
    setRoom("nutrition");
    triggerNotification("👋 تم الخروج من بوابتك الطبية بنجاح. نراك قريباً بنجاح صحي جديد!");
  };

  // Continue as guest simulator bypass is clicked
  const handleContinueAsGuest = () => {
    setIsAuthActive(true);
    // Initialise with standard patient
    setPatient(SAMPLE_PATIENT);
    setProducts(INITIAL_PRODUCTS);
    setMealLogs([
      {
        id: "meal-1",
        patientId: "patient-1",
        date: new Date().toISOString().split("T")[0],
        type: "breakfast" as MealType,
        description: "بيضة مسلوقة + نصف علبة زبادي مع جرجير وخس وطماطم",
        calories: 140,
        createdAt: new Date().toISOString()
      }
    ]);
    triggerNotification("⚡ تصفح تجريبي أوفلاين مرن ونشط الآن!");
  };

  // Fallback views when they haven't authenticated or entered guest session
  if (!isAuthActive) {
    return (
      <Homepage 
        onLoginSuccess={handleLoginSuccess}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-clinic-bg text-clinic-charcoal font-sans select-none pb-24 lg:pb-0 flex flex-col justify-between">
      
      {/* 1. Global Alert Notification Banner */}
      {showNotificationOverlay && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:w-96 md:right-4 z-50 bg-clinic-secondary text-white border border-clinic-secondary-light/20 p-4 rounded-2xl shadow-2xl flex items-start gap-3 animate-fade-in antialiased select-none">
          <Smile className="w-5 h-5 text-clinic-accent shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-wider block font-bold text-clinic-accent font-mono">إشعار العيادة الذكي:</span>
            <p className="text-xs font-bold leading-relaxed">{notificationMsg}</p>
          </div>
        </div>
      )}

      {/* 2. Top Header Navigation */}
      <header className="bg-clinic-surface border-b border-clinic-primary/10 py-4 px-6 md:px-8 select-none sticky top-0 z-30 shadow-sm flex justify-between items-center print:hidden">
        
        {/* Clinque logo */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <button 
              onClick={handleLogout}
              className="text-clinic-charcoal/60 hover:text-rose-600 transition-all p-1.5 hover:bg-slate-100 rounded-lg lg:hidden"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}

          <div className="w-10 h-10 rounded-xl bg-clinic-secondary flex items-center justify-center font-serif text-white font-black text-lg shadow-sm">
            S
          </div>
          <div>
            <h1 className="text-sm font-black text-clinic-secondary leading-tight">Shyma Clinic</h1>
            <p className="text-[10px] text-clinic-primary font-bold">بوابة المستشار التغذوي الذكي</p>
          </div>
        </div>

        {/* Dynamic motivation Quote display */}
        <div className="hidden md:flex items-center gap-2 max-w-md bg-clinic-primary/5 px-4 py-2 rounded-xl text-[10px] text-clinic-primary/90 font-medium">
          <Sparkles className="w-4 h-4 text-clinic-accent animate-pulse" />
          <span className="truncate italic">" {currentMotivation} "</span>
        </div>

        {/* Reset button & badge */}
        <div className="flex items-center gap-3">
          
          <button 
            onClick={handleResetAppDemo}
            className="hidden sm:inline-block text-[10px] text-clinic-primary/60 hover:text-rose-600 hover:underline font-bold transition-all border border-clinic-primary/15 rounded-lg py-1 px-2 hover:bg-rose-50"
          >
            تصفير المحاكاة 🔄
          </button>
          
          {currentUser && (
            <button 
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-1 text-[10px] text-clinic-primary/80 hover:text-rose-600 transition-all border border-clinic-primary/15 rounded-lg py-1 px-2 hover:bg-rose-50 font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          )}

          <span className={`text-[10px] px-2.5 py-1 font-bold rounded-lg ${
            userRole === Role.ADMIN 
              ? "bg-amber-100 text-amber-900 border border-amber-200 animate-pulse" 
              : "bg-clinic-pink text-clinic-secondary border border-clinic-secondary/20"
          }`}>
            {userRole === Role.ADMIN ? "الطبيبة شيماء علي" : `المريض: ${patient.name.split(" ")[0]}`}
          </span>
        </div>

      </header>

      {/* 3. Main Workspace Grid */}
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col lg:flex-row min-h-screen">
        
        {/* Sidebar Navigation */}
        <Sidebar 
          currentRoom={currentRoom} 
          setRoom={setRoom} 
          userRole={userRole} 
          setUserRole={setUserRole}
          points={patient.points}
          streak={patient.streak}
          level={patient.level}
        />

        {/* Main Work Frame Panel */}
        <main className="flex-1 p-5 md:p-8 space-y-6 relative">
          
          {loadingDb && (
            <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white p-5 rounded-3xl border shadow-xl flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-clinic-secondary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black text-clinic-secondary">جاري جلب ملفاتك وتلقين السعرات من السحابة... 🌐</p>
              </div>
            </div>
          )}

          {userRole === Role.PATIENT ? (
            <>
              {/* Daily metrics log block shows up on core client dashboard screens */}
              {currentRoom !== "report" && (
                <StatWidgets 
                  patient={patient} 
                  onCheckin={handleCheckin} 
                  waterLog={waterLog} 
                  onUpdateWater={handleUpdateWater} 
                />
              )}

              {/* Dynamic room frames */}
              {currentRoom === "nutrition" && (
                <NutritionRoom 
                  dietPlan={dietPlan}
                  mealLogs={mealLogs}
                  onAddMealLog={handleAddMeal}
                  onRemoveMealLog={handleRemoveMeal}
                />
              )}

              {currentRoom === "sports" && (
                <SportsRoom 
                  videos={INITIAL_VIDEOS}
                  progress={exerciseProgress}
                  onCompleteVideo={handleCompleteVideo}
                  onAwardPoints={handleAwardPoints}
                />
              )}

              {currentRoom === "measurements" && (
                <MeasurementsRoom 
                  measurements={measurements}
                  onAddMeasurement={handleAddMeasurement}
                />
              )}

              {currentRoom === "shop" && (
                <ShopRoom 
                  products={products}
                  cart={cart}
                  onAddToCart={handleAddToCart}
                  onUpdateCartQty={handleUpdateCartQty}
                  onRemoveFromCart={handleRemoveFromCart}
                  onClearCart={() => setCart([])}
                  patientPhone={patient.phone}
                />
              )}

              {currentRoom === "chat" && (
                <ChatAndConsult 
                  chatMessages={chatMessages}
                  consultations={consultations}
                  userRole={userRole}
                  patientId={patient.id}
                  patientName={patient.name}
                  onSendChatMessage={handleSendChatMessage}
                  onPostConsultation={handlePostConsultation}
                />
              )}

              {currentRoom === "consult" && (
                <ChatAndConsult 
                  chatMessages={chatMessages}
                  consultations={consultations}
                  userRole={userRole}
                  patientId={patient.id}
                  patientName={patient.name}
                  onSendChatMessage={handleSendChatMessage}
                  onPostConsultation={handlePostConsultation}
                />
              )}

              {currentRoom === "rage" && (
                <RageRoom onAwardPoints={handleAwardPoints} />
              )}

              {currentRoom === "gallery" && (
                <GalleryRoom stories={INITIAL_SUCCESS_STORIES} />
              )}

              {currentRoom === "report" && (
                <ReportView 
                  patient={patient}
                  measurements={measurements}
                  mealLogs={mealLogs}
                  waterLog={waterLog}
                />
              )}
            </>
          ) : (
            /* Dr. Shyma Aly Administration Command center */
            <AdminPanel 
              patient={patient}
              onUpdatePatient={handleUpdatePatientProfile}
              dietPlan={dietPlan}
              onUpdateDiet={handleUpdateDietPlan}
              mealLogs={mealLogs}
              chatMessages={chatMessages}
              onDoctorSendChat={handleDoctorSendChat}
              consultations={consultations}
              onAnswerConsult={handleAnswerConsultation}
              products={products}
              onAddProduct={handleAddProduct}
              onRemoveProduct={handleRemoveProduct}
              onAwardPoints={handleAwardPoints}
              patientsList={patientsList}
              onSelectPatient={handleSelectPatientDoctor}
              selectedPatientId={selectedPatientId}
            />
          )}

        </main>

      </div>

      {/* Floating Action Button (FAB) shortcut to Shop */}
      {currentRoom !== "shop" && userRole === Role.PATIENT && (
        <button
          onClick={() => setRoom("shop")}
          className="fixed bottom-24 lg:bottom-8 left-6 z-40 bg-clinic-accent text-clinic-charcoal font-black rounded-full w-14 h-14 hover:scale-105 transition-all shadow-lg flex items-center justify-center animate-bounce hover:bg-amber-400 border-2 border-white"
          title="افتح متجر المكملات الغذائية"
        >
          <ShoppingBag className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* 4. Bottom Nav Bar for Mobile phones */}
      <BottomNavBar 
        currentRoom={currentRoom} 
        setRoom={setRoom} 
        userRole={userRole} 
        setUserRole={setUserRole} 
      />

      {/* 5. Clean footer */}
      <footer className="bg-clinic-surface border-t border-clinic-primary/10 py-6 text-center select-none text-xs text-clinic-primary font-bold print:hidden">
        <p>عيادة الدكتورة شيماء للتغذية العلاجية وإدارة السمنة والوزن © 2026</p>
        <p className="text-[10px] text-clinic-primary/60 mt-1">تطبيق معتمد ومصمم بوعي احترافي متجاوب للهواتف والحواسب المكتبية الحصرية</p>
      </footer>

    </div>
  );
}
