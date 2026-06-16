import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Smile, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  Flame, 
  ShoppingBag, 
  ShieldAlert, 
  VolumeX, 
  CheckCircle2, 
  Clock, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Scale, 
  Heart,
  Droplet,
  Dumbbell,
  Utensils,
  TrendingUp,
  Check,
  Shuffle
} from "lucide-react";
import { Role, Product, SuccessStory } from "../types";
import { INITIAL_PRODUCTS, INITIAL_SUCCESS_STORIES, INITIAL_MOTIVATIONS } from "../data";
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../lib/firebase";

const fitnessHeroImg = "/src/assets/images/wooden_fitness_nutrition_hero_1781650054960.jpg";

interface HomepageProps {
  onLoginSuccess: (userId: string, email: string, name: string, phone: string, role: Role, docFetched?: any) => void;
  onContinueAsGuest: () => void;
}

export default function Homepage({ onLoginSuccess, onContinueAsGuest }: HomepageProps) {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [isLoginTab, setIsLoginTab] = useState(true);
  
  // Auth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [weightGoal, setWeightGoal] = useState<number | "">("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Interactive Goal pathways state
  const [selectedGoal, setSelectedGoal] = useState<"loss" | "gain" | "fitness">("loss");
  const [challenge1, setChallenge1] = useState(false);
  const [challenge2, setChallenge2] = useState(false);
  const [challenge3, setChallenge3] = useState(false);
  const [challengeCompletedMsg, setChallengeCompletedMsg] = useState("");

  const handleSelectGoal = (goal: "loss" | "gain" | "fitness") => {
    setSelectedGoal(goal);
    setChallenge1(false);
    setChallenge2(false);
    setChallenge3(false);
    setChallengeCompletedMsg("");
    
    if (goal === "loss") {
      setWeightGoal(65);
    } else if (goal === "gain") {
      setWeightGoal(85);
    } else {
      setWeightGoal(70);
    }
  };

  const getChallengeTasks = () => {
    switch (selectedGoal) {
      case "loss":
        return {
          title: "مسار التخسيس والصحة الأيضية 🥗",
          description: "تحديات ممتعة صممتها د. شيماء لتجهيز مستويات الحرق وجسمك لبدء الحمية الكاملة:",
          task1: "الاستغناء بالكامل عن السكر الأبيض لليوم المتبقي واستخدام محليات أو عسل طبيعي 🚫",
          task2: "شرب كوب ماء دافئ كبير فور الاستيقاظ وعند البدء لتنشيط الكبد وتنظيف الهضم 💧",
          task3: "المشي الخفيف والمستمر لمدة 15 دقيقة بعد الوجبة الرئيسية المتاحة 🚶‍♂️",
        };
      case "gain":
        return {
          title: "مسار زيادة الوزن وبناء كتلة عضلية صافية وصحية 💪",
          description: "تحديات مصممة خصيصاً لتعزيز الكتلة العضلية والبدء بزيادة السعرات الصحية بانتظام:",
          task1: "تناول وجبة خفيفة ومحفزة من المكسرات الطبيعية أو التمر مباشرة بعد الوجبة 🥜",
          task2: "الالتزام بوجبة فطور غنية بالبروتين (بيضتين وموزة كاملة مع الحليب) 🍌",
          task3: "تأدية تمرين بدني منزلي خفيف ومحفز للعضلة (مثل 12 تكرار ضغط أو قرفصاء) 🏋️‍♂️",
        };
      case "fitness":
      default:
        return {
          title: "مسار اللياقة المتكاملة والنشاط وزيادة طاقة حرق الدهون 🏃‍♂️",
          description: "تحديات وحوافز دورية للمثابرة البدنية وتنشيط الدورة الدموية الكلية:",
          task1: "أداء جلسة إحماء وكارديو خفيف متتابع لمدة 10 دقائق ⏱️",
          task2: "الالتزام بشرب 2.5 لتر مياه على الأقل لحماية ومرونة ألياف العضلات 💧",
          task3: "ضبط موعد النوم ليكون مبكراً وعميقاً (7 ساعات) لتنشيط هرمون الاستشفاء 🛌",
        };
    }
  };

  useEffect(() => {
    if (challenge1 && challenge2 && challenge3) {
      setChallengeCompletedMsg("🎉 مذهل جداً! لقد أكملت التحديات الانطلاقية الثلاثة بنجاح! نهديك (+100 نقطة ترحيبية إضافية مجاناً) تم تفعيلها فورياً! قم بملء استمارة تسجيل الحساب أدناه لتأكيد ملفك ومصادقة حرق السعرات مع د. شيماء بانتظام.");
    } else {
      setChallengeCompletedMsg("");
    }
  }, [challenge1, challenge2, challenge3]);

  // Motivational quote cycle
  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % INITIAL_MOTIVATIONS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNextStory = () => {
    setActiveStoryIdx((prev) => (prev + 1) % INITIAL_SUCCESS_STORIES.length);
  };
  
  const handlePrevStory = () => {
    setActiveStoryIdx((prev) => (prev - 1 + INITIAL_SUCCESS_STORIES.length) % INITIAL_SUCCESS_STORIES.length);
  };

  // Firebase auth registration or login helper
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    if (isLoginTab) {
      // Sign in
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        setSuccessMsg("✓ تم الدخول بنجاح! جاري تحويلك لبوابتك الصحية...");
        setTimeout(() => {
          // Let standard app logic fetch Profile from Firestore or fallback
          onLoginSuccess(credential.user.uid, email, "", "", email.includes("admin") ? Role.ADMIN : Role.PATIENT);
        }, 1200);
      } catch (err: any) {
        console.error(err);
        let msg = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
          msg = "خطأ في بيانات الدخول، يرجى التحقق وإعادة المحاولة.";
        } else if (err.code === "auth/invalid-email") {
          msg = "بريد إلكتروني غير صالح.";
        }
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    } else {
      // Sign up
      if (!fullName || !phone) {
        setErrorMsg("يرجى ملء جميع الحقول المطلوبة.");
        setLoading(false);
        return;
      }
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMsg("🎉 تم إنشاء حسابك وبناء ملفك الطبي بنجاح!");
        
        // Form doc updates
        setTimeout(() => {
          onLoginSuccess(
            credential.user.uid, 
            email, 
            fullName, 
            phone, 
            Role.PATIENT,
            {
              id: credential.user.uid,
              name: fullName,
              phone: phone,
              email: email,
              role: Role.PATIENT,
              points: 100, // Signup bonus!
              streak: 1,
              longestStreak: 1,
              lastCheckinDate: new Date().toISOString().split("T")[0],
              targetWaterCups: 8,
              weightGoal: Number(weightGoal) || 70,
              joinedDate: new Date().toISOString().split("T")[0],
              level: "برونزي"
            }
          );
        }, 1200);
      } catch (err: any) {
        console.error(err);
        let msg = "تعذر التسجيل في العيادة.";
        if (err.code === "auth/email-already-in-use") {
          msg = "البريد الإلكتروني مستخدم مسبقاً لحساب آخر.";
        } else if (err.code === "auth/weak-password") {
          msg = "كلمة المرور يجب أن تكون 6 أحرف على الأقل.";
        }
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  const currentStory = INITIAL_SUCCESS_STORIES[activeStoryIdx];

  return (
    <div className="min-h-screen bg-clinic-bg text-clinic-charcoal font-sans flex flex-col justify-between">
      
      {/* Dynamic Top Motivate Banner */}
      <div className="bg-clinic-secondary text-white py-2 px-4 text-center text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 select-none">
        <Sparkles className="w-4 h-4 text-clinic-accent animate-pulse shrink-0" />
        <span className="truncate">{INITIAL_MOTIVATIONS[quoteIdx]}</span>
      </div>

      {/* Main Header / Navigation */}
      <header className="bg-clinic-surface border-b border-clinic-primary/10 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-clinic-secondary flex items-center justify-center font-serif text-white font-black text-lg">
            S
          </div>
          <div>
            <h1 className="text-sm font-black text-clinic-secondary leading-tight">Shyma Clinic</h1>
            <p className="text-[10px] text-clinic-primary font-bold">بوابة المستشار التغذوي الذكي</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onContinueAsGuest}
            className="text-xs bg-clinic-pink text-clinic-secondary hover:bg-clinic-secondary/10 px-4 py-2 rounded-xl transition-all font-black border border-clinic-secondary/20"
          >
            استكشاف كزائر تجريبي 💻
          </button>
        </div>
      </header>

      {/* Hero Container Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="home-hero">
        
        {/* Clinque Info / Introductory (lg:col-span-12 or 7) */}
        <div className="lg:col-span-7 space-y-6 text-right">
          
          <div className="inline-flex items-center gap-2 bg-clinic-pink text-clinic-secondary border border-clinic-secondary/20 px-3 py-1 rounded-full text-[11px] font-extrabold shadow-sm">
            <Activity className="w-4 h-4 text-clinic-accent animate-pulse" />
            تحت إشراف مباشر من أخصائية التغذية العلاجية د. شيماء علي
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-clinic-charcoal tracking-tight leading-tight md:leading-snug">
            غيّر جسدك، <br/>
            <span className="text-clinic-secondary">واستعد نشاطك وصحتك المثالية</span> <br/>
            بمتابعة ممتعة وحوافز مستمرة!
          </h2>

          <p className="text-xs leading-relaxed text-clinic-primary font-bold max-w-2xl">
            أهلاً بك في البوابة الذكية الأولى لعيادة الدكتورة شيماء علي. نقوم بصياغة برامجك الغذائية والبدنية بناءً على بياناتك الأسبوعية ونستمر بتشجيعك من خلال متجر العيادة الحصري ومكافآت نقاط حقيقية ومستمرة عند التزامك اليومي!
          </p>

          {/* Core App Feature: Beautiful High Quality Generated Healthy Sports & Eating Image Banner */}
          <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl group transition-all duration-300 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-clinic-charcoal/80 via-transparent to-transparent z-10"></div>
            <img 
              src={fitnessHeroImg} 
              alt="تغذية ورياضة صحية" 
              className="w-full h-52 md:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 right-4 left-4 z-20 text-white text-right space-y-1">
              <span className="bg-clinic-accent hover:bg-amber-500 text-clinic-charcoal text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider select-none inline-block">
                🌿 نمط حياة صحي ومتوازن
              </span>
              <h4 className="text-sm md:text-md font-black drop-shadow font-sans">معادلة الحيوية: طبيعة الغذاء ومثابرة الحركة اليومية</h4>
              <p className="text-[10px] text-zinc-100 font-bold opacity-90">دمج الأغذية منخفضة المؤشر السكري مع التمارين المنزلية البسيطة والترطيب المستمر</p>
            </div>
          </div>

          {/* Interactive Goal & Challenges Pathway Selector - Fun and gamified! */}
          <div className="bg-white border-2 border-clinic-secondary/15 rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <span className="text-xl">🎯</span>
              <div>
                <h4 className="text-xs font-black text-clinic-charcoal">مسارات د. شيماء للتحديات الفورية الممتعة:</h4>
                <p className="text-[10px] text-clinic-primary font-bold">اختر هدفك للبدء في تحدي اليوم التمهيدي لتجهيز طاقة حرقك وحصد نقاط الانطلاق!</p>
              </div>
            </div>

            {/* Quick selectors cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSelectGoal("loss")}
                className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between gap-2 ${
                  selectedGoal === "loss" 
                    ? "bg-clinic-pink text-clinic-secondary border-clinic-secondary font-black shadow-inner" 
                    : "bg-clinic-surface border-clinic-primary/10 text-clinic-charcoal hover:bg-slate-50 font-bold"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-black">1. تخسيس ورشاقة 🥗</span>
                  <span className="text-[9px] opacity-80 mt-0.5">نزول هادئ وصحة أيضية</span>
                </div>
                {selectedGoal === "loss" && <CheckCircle2 className="w-4 h-4 text-clinic-secondary shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => handleSelectGoal("gain")}
                className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between gap-2 ${
                  selectedGoal === "gain" 
                    ? "bg-clinic-pink text-clinic-secondary border-clinic-secondary font-black shadow-inner" 
                    : "bg-clinic-surface border-clinic-primary/10 text-clinic-charcoal hover:bg-slate-50 font-bold"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-black">2. زيادة وزن صحي 💪</span>
                  <span className="text-[9px] opacity-80 mt-0.5">بناء حجم وكتلة عضلية</span>
                </div>
                {selectedGoal === "gain" && <CheckCircle2 className="w-4 h-4 text-clinic-secondary shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => handleSelectGoal("fitness")}
                className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between gap-2 ${
                  selectedGoal === "fitness" 
                    ? "bg-clinic-pink text-clinic-secondary border-clinic-secondary font-black shadow-inner" 
                    : "bg-clinic-surface border-clinic-primary/10 text-clinic-charcoal hover:bg-slate-50 font-bold"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-black">3. نشاط بدني كلي 🏃‍♂️</span>
                  <span className="text-[9px] opacity-80 mt-0.5">زيادة طاقة وعادات حركة</span>
                </div>
                {selectedGoal === "fitness" && <CheckCircle2 className="w-4 h-4 text-clinic-secondary shrink-0" />}
              </button>
            </div>

            {/* Render selected goal's interactive checklist description */}
            <div className="p-4 bg-clinic-pink/30 rounded-2xl text-right border border-clinic-secondary/10 space-y-3">
              <span className="text-[10px] bg-clinic-secondary text-white font-black px-2 py-0.5 rounded-md">
                {getChallengeTasks().title}
              </span>
              <p className="text-[11px] text-clinic-primary font-bold">{getChallengeTasks().description}</p>
              
              <div className="space-y-2 border-t pt-3 border-clinic-primary/10">
                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <input 
                    type="checkbox" 
                    checked={challenge1} 
                    onChange={(e) => setChallenge1(e.target.checked)} 
                    className="w-4 h-4 accent-clinic-secondary rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                  <span className={`text-xs font-bold transition-all ${challenge1 ? "line-through text-clinic-primary/60" : "text-clinic-charcoal group-hover:text-clinic-secondary"}`}>
                    {getChallengeTasks().task1}
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <input 
                    type="checkbox" 
                    checked={challenge2} 
                    onChange={(e) => setChallenge2(e.target.checked)} 
                    className="w-4 h-4 accent-clinic-secondary rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                  <span className={`text-xs font-bold transition-all ${challenge2 ? "line-through text-clinic-primary/60" : "text-clinic-charcoal group-hover:text-clinic-secondary"}`}>
                    {getChallengeTasks().task2}
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <input 
                    type="checkbox" 
                    checked={challenge3} 
                    onChange={(e) => setChallenge3(e.target.checked)} 
                    className="w-4 h-4 accent-clinic-secondary rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                  <span className={`text-xs font-bold transition-all ${challenge3 ? "line-through text-clinic-primary/60" : "text-clinic-charcoal group-hover:text-clinic-secondary"}`}>
                    {getChallengeTasks().task3}
                  </span>
                </label>
              </div>

              {/* Congratulations popups upon ticks */}
              {challengeCompletedMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-black text-center animate-fade-in">
                  {challengeCompletedMsg}
                </div>
              )}
            </div>
          </div>

          {/* Quick Doctor Profile details */}
          <div className="bg-white border border-clinic-primary/10 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300" 
                alt="الدكتورة شيماء علي" 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-clinic-secondary"
                referrerPolicy="no-referrer"
              />
              <div className="text-right">
                <h4 className="text-sm font-black text-clinic-charcoal">د. شيماء علي</h4>
                <p className="text-xs text-clinic-primary font-bold">أخصائية التغذية العلاجية وعلاج داء السمنة والكبد الدهني ومقاومة الأنسولين</p>
                <div className="flex gap-1.5 items-center mt-1 text-[10px] text-clinic-accent font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>عضو الجمعية العربية للتغذية والدايت المستمر</span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-clinic-primary font-medium leading-relaxed border-t pt-3">
              "نؤمن في عيادتنا بأن الطعام ليس مجرد وقود بل هو علاج لمستويات الأيض. نقوم بتوجيه عافيتك الصحية واختيار خطوط البدائل الصحية لتسهيل بناء عهد صحي جديد."
            </p>
          </div>

          {/* Quick Clinic pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="text-xl">🥗</span>
              <p className="text-xs font-bold text-emerald-800 mt-1">حمية وجبات مخصصة</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
              <span className="text-xl">🏃‍♂️</span>
              <p className="text-xs font-bold text-blue-800 mt-1">تمارين رياضية متدرجة</p>
            </div>
            <div className="p-3 bg-violet-50 rounded-xl border border-violet-100 text-center">
              <span className="text-xl">📊</span>
              <p className="text-xs font-bold text-violet-800 mt-1">تفريغ قياسات أسبوعية</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
              <span className="text-xl">💬</span>
              <p className="text-xs font-bold text-amber-800 mt-1">استشارات ودردشة طبية</p>
            </div>
          </div>

        </div>

        {/* Unified Registration & Verification portal (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white border-2 border-clinic-primary/10 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden" id="auth-portal">
          <div className="absolute top-0 right-0 w-full h-1.5 bg-clinic-secondary"></div>
          
          <div className="flex justify-center gap-2 mb-6 border-b pb-4">
            <button
              onClick={() => { setIsLoginTab(true); setErrorMsg(""); setSuccessMsg(""); }}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all ${
                isLoginTab ? "bg-clinic-secondary text-white font-black shadow" : "text-clinic-charcoal/60 hover:bg-clinic-bg"
              }`}
            >
              تسجيل الدخول في العيادة
            </button>
            <button
              onClick={() => { setIsLoginTab(false); setErrorMsg(""); setSuccessMsg(""); }}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all ${
                !isLoginTab ? "bg-clinic-secondary text-white font-black shadow" : "text-clinic-charcoal/60 hover:bg-clinic-bg"
              }`}
            >
              انضمام وتسجيل مريض جديد
            </button>
          </div>

          <h3 className="text-sm font-black text-clinic-charcoal mb-4 text-center">
            {isLoginTab ? "أهلاً بك مجدداً في عيادتك الخاصة 🔐" : "ابدأ رحلتك وصمم نظامك الغذائي اليومي 🚀"}
          </h3>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-right">
            
            {/* Show errors or success */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs font-bold text-center">
                ⚠️ {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold text-center">
                {successMsg}
              </div>
            )}

            {!isLoginTab && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">الاسم بالكامل (ثنائي أو ثلاثي):</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="منى الأحمد"
                      className="w-full bg-clinic-bg border border-clinic-primary/20 rounded-xl px-3 py-2 text-xs text-clinic-charcoal focus:outline-none focus:border-clinic-secondary"
                    />
                    <User className="w-4 h-4 text-clinic-primary/50 absolute left-3.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">رقم الهاتف الجوال:</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="05xxxxxxx"
                      className="w-full bg-clinic-bg border border-clinic-primary/20 rounded-xl px-3 py-2 text-xs text-clinic-charcoal focus:outline-none focus:border-clinic-secondary text-left font-mono"
                    />
                    <Phone className="w-4 h-4 text-clinic-primary/50 absolute left-3.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">الوزن المستهدف الوصول إليه (كجم):</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={weightGoal}
                      onChange={(e) => setWeightGoal(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="مثال: 65"
                      className="w-full bg-clinic-bg border border-clinic-primary/20 rounded-xl px-3 py-2 text-xs text-clinic-charcoal focus:outline-none focus:border-clinic-secondary text-left font-mono"
                    />
                    <Scale className="w-4 h-4 text-clinic-primary/50 absolute left-3.5 top-2.5" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">البريد الإلكتروني:</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-clinic-bg border border-clinic-primary/20 rounded-xl px-3 py-2 text-xs text-clinic-charcoal focus:outline-none focus:border-clinic-secondary text-left font-mono"
                />
                <Mail className="w-4 h-4 text-clinic-primary/50 absolute left-3.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">كلمة المرور:</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="******"
                  className="w-full bg-clinic-bg border border-clinic-primary/20 rounded-xl px-3 py-2 text-xs text-clinic-charcoal focus:outline-none focus:border-clinic-secondary text-left font-mono"
                />
                <Lock className="w-4 h-4 text-clinic-primary/50 absolute left-3.5 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-clinic-secondary hover:bg-clinic-secondary/90 text-white font-extrabold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              {loading ? "جاري المعالجة والأرشفة الفورية..." : (isLoginTab ? "تسجيل دخول وتأشير الملف" : "اعتماد وتسجيل حمية جديدة")}
            </button>

            {/* Quick Login for Doctor and Demo Patient */}
            <div className="border-t border-clinic-primary/10 pt-4 mt-2 space-y-2">
              <p className="text-[10px] text-clinic-primary text-center font-bold">بوابة المراجعة والتقييم الفورية السريعة:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    // Pre-fill fields for standard test account or bypass
                    setEmail("patient@shyma.com");
                    setPassword("123456");
                    setIsLoginTab(true);
                    onContinueAsGuest();
                  }}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] py-1.5 px-3 rounded-xl font-bold border border-emerald-200 transition-all text-center"
                >
                  دخول تجريبي بمحمد الحربي 👤
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess("doctor-demo-auth", "admin@shyma.com", "د. شيماء علي", "", Role.ADMIN);
                  }}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] py-1.5 px-3 rounded-xl font-bold border border-amber-200 transition-all text-center"
                >
                  لوحة تحكم الطبيبة مباشرة 🩺
                </button>
              </div>
            </div>

          </form>

        </div>
      </section>

      {/* Success Stories showcase before/after */}
      <section className="bg-white border-y border-clinic-primary/10 py-12 md:py-16 select-none shadow-inner">
        <div className="w-full max-w-5xl mx-auto px-6 text-center space-y-8">
          <div>
            <span className="text-clinic-secondary font-black text-xs uppercase tracking-wider block">معجزات الالتزام وقلم التغيير</span>
            <h3 className="text-xl md:text-3xl font-extrabold text-clinic-charcoal mt-2">معرض قصص النجاح الحية</h3>
            <p className="text-xs text-clinic-primary font-bold mt-1 max-w-lg mx-auto">شاهد كيف تمكن حلفاء عيادتنا من تغيير أوزانهم وتحقيق أحلامهم الرياضية والعلاجية معنا</p>
          </div>

          <div className="relative bg-clinic-bg rounded-3xl p-6 md:p-10 border border-clinic-primary/10 flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto shadow-sm">
            
            {/* Before After Image Panel */}
            <div className="flex gap-4 shrink-0">
              <div className="text-center">
                <div className="w-28 h-36 md:w-32 md:h-44 rounded-2xl overflow-hidden border-2 border-dashed border-clinic-primary/20 relative shadow-inner">
                  <img src={currentStory.beforeUrl} alt="Before" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute bottom-2 left-2 bg-rose-600/90 text-white text-[9px] py-0.5 px-2 font-black rounded-lg">قبل</span>
                </div>
                <span className="text-xs font-mono font-bold mt-1.5 block text-rose-700">{currentStory.beforeWeight} كجم</span>
              </div>

              <div className="text-center">
                <div className="w-28 h-36 md:w-32 md:h-44 rounded-2xl overflow-hidden border-2 border-clinic-secondary/40 relative shadow-md">
                  <img src={currentStory.afterUrl} alt="After" className="w-full h-full object-cover animate-pulse" referrerPolicy="no-referrer" />
                  <span className="absolute bottom-2 left-2 bg-emerald-600/95 text-white text-[9px] py-0.5 px-2 font-black rounded-lg">بعد</span>
                </div>
                <span className="text-xs font-mono font-bold mt-1.5 block text-emerald-700">{currentStory.afterWeight} كجم</span>
              </div>
            </div>

            {/* Testimonial Text */}
            <div className="text-right space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-clinic-charcoal">البطلة/البطل: {currentStory.name}</h4>
                <span className="bg-clinic-accent/15 text-amber-800 text-[10px] py-0.5 px-2 rounded-lg font-bold">
                  في غضون {currentStory.durationMonths} أشهر
                </span>
              </div>

              <p className="text-xs text-clinic-primary leading-relaxed font-medium italic">
                " {currentStory.text} "
              </p>

              <div className="flex gap-2 text-xs font-black text-clinic-secondary pt-2">
                <Flame className="w-4 h-4 text-clinic-accent" />
                <span>إجمالي الخسارة الصحية: {currentStory.beforeWeight - currentStory.afterWeight} كجم دهون ونشويات</span>
              </div>
            </div>

            {/* Carousel navigation buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6">
              <button 
                onClick={handleNextStory}
                className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white text-clinic-charcoal shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center border hover:bg-slate-50"
              >
                <ChevronLeft className="w-5 h-5 shrink-0" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6">
              <button 
                onClick={handlePrevStory}
                className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white text-clinic-charcoal shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center border hover:bg-slate-50"
              >
                <ChevronRight className="w-5 h-5 shrink-0" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Boutique Healthy Shop Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16 text-center space-y-8 select-none">
        <div>
          <span className="text-clinic-secondary font-black text-xs uppercase tracking-wider block">متجر عيادة د. شيماء للتغيير</span>
          <h3 className="text-xl md:text-3xl font-extrabold text-clinic-charcoal mt-2">البدائل والأغذية الصحية العلاجية</h3>
          <p className="text-xs text-clinic-primary font-bold mt-1 max-w-lg mx-auto">منتجات طبيعية ممتازة ومثبتة لتنشيط الغدد وحرق دهون الأحشاء بسرعة</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {INITIAL_PRODUCTS.slice(0, 4).map((p) => (
            <div key={p.id} className="bg-white border border-clinic-primary/10 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all text-right">
              <div>
                <div className="w-full h-36 rounded-xl overflow-hidden mb-3 relative bg-slate-50">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute top-2 right-2 bg-clinic-pink text-clinic-secondary border border-clinic-secondary/20 font-bold text-[9px] py-1 px-2 rounded-lg">
                    +{p.pointsReward} نقطة عيادة
                  </span>
                </div>
                <h4 className="text-xs font-black text-clinic-charcoal leading-snug line-clamp-2">{p.name}</h4>
                <p className="text-[10px] text-clinic-primary font-semibold leading-relaxed mt-1 line-clamp-2">{p.description}</p>
              </div>

              <div className="flex justify-between items-center mt-3 border-t pt-3">
                <span className="text-xs text-clinic-secondary font-black">{p.price} ريال سعودي</span>
                <span className="bg-slate-100 text-slate-800 text-[9px] px-2 py-0.5 rounded font-bold">{p.category}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <a
            href="#auth-portal"
            className="inline-flex items-center gap-2 bg-clinic-accent hover:bg-amber-500 text-clinic-charcoal font-black text-xs px-6 py-2.5 rounded-xl shadow-md transform hover:scale-105 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            انضم الآن وتسوق تشكيلة العسل والمكملات بالنقاط
          </a>
        </div>
      </section>

      {/* Simple elegant footer */}
      <footer className="bg-clinic-surface border-t border-clinic-primary/10 py-8 text-center select-none text-xs text-clinic-primary font-bold">
        <p>عيادة الدكتورة شيماء للتغذية العلاجية وإدارة السمنة والوزن والمكملات الطبيعية © 2026</p>
        <p className="text-[10px] text-clinic-primary/60 mt-1">بوابة السعرات والغدد والرياضية الآمنة مع تتبع السلاسل والسجل المتكامل</p>
      </footer>

    </div>
  );
}
