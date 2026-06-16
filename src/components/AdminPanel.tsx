import React, { useState } from "react";
import { 
  Users, 
  Apple, 
  MessageSquare, 
  Compass, 
  ShoppingBag, 
  PlusCircle, 
  Trash, 
  Send, 
  Check, 
  Activity, 
  Cpu, 
  ChevronRight, 
  Sparkles, 
  ShieldAlert,
  Save,
  HelpCircle
} from "lucide-react";
import { 
  Patient, 
  DietPlan, 
  MealLog, 
  ChatMessage, 
  QuickConsult, 
  Product, 
  Role,
  MessageTemplate
} from "../types";

interface AdminPanelProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
  dietPlan: DietPlan;
  onUpdateDiet: (updated: DietPlan) => void;
  mealLogs: MealLog[];
  chatMessages: ChatMessage[];
  onDoctorSendChat: (text: string) => void;
  consultations: QuickConsult[];
  onAnswerConsult: (id: string, answer: string) => void;
  products: Product[];
  onAddProduct: (p: Omit<Product, "id">) => void;
  onRemoveProduct: (id: string) => void;
  onAwardPoints: (points: number) => void;
  patientsList?: Patient[];
  onSelectPatient?: (patientId: string) => void;
  selectedPatientId?: string;
}

export default function AdminPanel({
  patient,
  onUpdatePatient,
  dietPlan,
  onUpdateDiet,
  mealLogs,
  chatMessages,
  onDoctorSendChat,
  consultations,
  onAnswerConsult,
  products,
  onAddProduct,
  onRemoveProduct,
  onAwardPoints,
  patientsList = [],
  onSelectPatient,
  selectedPatientId
}: AdminPanelProps) {
  const [adminTab, setAdminTab] = useState<"patient" | "chat" | "consult" | "store" | "export">("patient");
  
  // Edit Patient state
  const [patientName, setPatientName] = useState(patient.name);
  const [patientPhone, setPatientPhone] = useState(patient.phone);
  const [patientPoints, setPatientPoints] = useState(patient.points);
  const [patientLevel, setPatientLevel] = useState(patient.level);
  const [patientGoal, setPatientGoal] = useState(patient.weightGoal);

  // Edit Diet plan states
  const [dietTitle, setDietTitle] = useState(dietPlan.title);
  const [dietBreakfast, setDietBreakfast] = useState(dietPlan.breakfast);
  const [dietLunch, setDietLunch] = useState(dietPlan.lunch);
  const [dietDinner, setDietDinner] = useState(dietPlan.dinner);
  const [dietSnacks, setDietSnacks] = useState(dietPlan.snacks);
  const [dietNotes, setDietNotes] = useState(dietPlan.notes);

  // Synchronize component editor with selected patient form props
  React.useEffect(() => {
    if (patient) {
      setPatientName(patient.name);
      setPatientPhone(patient.phone);
      setPatientPoints(patient.points);
      setPatientLevel(patient.level);
      setPatientGoal(patient.weightGoal);
    }
  }, [patient]);

  React.useEffect(() => {
    if (dietPlan) {
      setDietTitle(dietPlan.title);
      setDietBreakfast(dietPlan.breakfast);
      setDietLunch(dietPlan.lunch);
      setDietDinner(dietPlan.dinner);
      setDietSnacks(dietPlan.snacks);
      setDietNotes(dietPlan.notes);
    }
  }, [dietPlan]);

  // Send doctor message states
  const [doctorMsg, setDoctorMsg] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const messageTemplates: MessageTemplate[] = [
    { id: "t1", title: "ترحيب بالانضمام 🌸", content: "أهلاً بك يا بطل في عيادتنا الخاصة للتغذية! لقد تم تنشيط ملفك ونظامك الغذائي المتوازن بنجاح. سنرافقك خطوة بخطوة بالرياضة والمياه حتى الصول للوزن المنشود.", type: "chat" },
    { id: "t2", title: "مقاومة Cravings 🍫", content: "يا بطل تذكر أن الرغبة (Craving) هي مجرد شحنة عصبية تستقر لـ 15 دقيقة فقط وتمر بسلام. اشرب كأسي ماء بارد الآن وتناول خضار مقرمشة أو ملعقة عسل سدر طبيعي من متجرنا لتعديل سكر الدم بشكل آمن.", type: "chat" },
    { id: "t3", title: "تشجيع ثبات الوزن ⚖️", content: "لا تكترث للميزان هذا الأسبوع! فالجسم يعيد توزيع المياه وبناء النسيج العضلي رداً على مجهودك الرياضي الجبار. ركز بالمازورة واللباس والمرآة وستكسر هذا الثبات قريباً!", type: "chat" },
    { id: "t4", title: "شكر على الالتزام 🔥", content: "أحييك جداً على المحافظة على السلسلة (Streak) وتسجيل وجباتك الطبية يومياً. تطورك رائع ومنحنى حرق دهونك يتصاعد بنمط مثالي! استمر على الدرب.", type: "chat" }
  ];

  // Answer quick consult state
  const [selectedConsultId, setSelectedConsultId] = useState<string>("");
  const [doctorAnswerText, setDoctorAnswerText] = useState("");

  // Store management state
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState<number | "">("");
  const [newProdCat, setNewProdCat] = useState<Product["category"]>("أغذية صحية");
  const [newProdImg, setNewProdImg] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");

  // Save Patient Profile Changes
  const handleSavePatient = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePatient({
      ...patient,
      name: patientName,
      phone: patientPhone,
      points: Number(patientPoints),
      level: patientLevel,
      weightGoal: Number(patientGoal)
    });
    alert("تم تحديث وحفظ مصفوفة بيانات المريض بنجاح ✓");
  };

  // Save Diet Plan Changes
  const handleSaveDiet = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDiet({
      ...dietPlan,
      title: dietTitle,
      breakfast: dietBreakfast,
      lunch: dietLunch,
      dinner: dietDinner,
      snacks: dietSnacks,
      notes: dietNotes
    });
    alert("تم تصديق وتحديث النظام الغذائي لوجبات المريض بنجاح ✓");
  };

  // Handle Templates click
  const selectMsgTemplate = (content: string) => {
    setDoctorMsg(content);
  };

  const submitDoctorMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorMsg.trim()) return;

    onDoctorSendChat(doctorMsg);
    setDoctorMsg("");
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsultId || !doctorAnswerText.trim()) return;

    onAnswerConsult(selectedConsultId, doctorAnswerText);
    setDoctorAnswerText("");
    setSelectedConsultId("");
    alert("تم اعتماد ونشر إفادة الدكتورة الطبية على حائط العيادة بنجاح ✓");
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    onAddProduct({
      name: newProdName,
      price: Number(newProdPrice),
      category: newProdCat,
      image: newProdImg || "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&q=80&w=400",
      description: newProdDesc || "منتج غذائي مميز معتمد طبياً من مركز د. شيماء للتخسيس",
      pointsReward: Math.round(Number(newProdPrice) * 0.1)
    });

    setNewProdName("");
    setNewProdPrice("");
    setNewProdImg("");
    setNewProdDesc("");
    alert("تم إدراج وعرض المنتج في متجر عيادة التخسيس بنجاح ✓");
  };

  return (
    <div className="bg-clinic-surface border-2 border-amber-600/30 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden select-none">
      
      {/* Decorative Administrator simulator header */}
      <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-l from-amber-600 via-clinic-secondary to-amber-500"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-clinic-primary/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black mb-3 border border-amber-200">
            <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
            وضع معاينة محاكاة الأدمن النشط - د. شيماء علي
          </div>
          <h2 className="text-xl font-extrabold text-clinic-charcoal">منصة تحكم وتصديق د. شيماء علي</h2>
          <p className="text-xs text-clinic-primary font-bold">هذه هي لوحة الإدارة لإثبات سير العمل وتحديث وجبات وعيادة الاستشارة الفورية للمرضى</p>
        </div>
      </div>

      {/* Internal Tabs for Admin Section */}
      <div className="flex flex-wrap border-b border-clinic-primary/10 mb-6 gap-2 bg-white/40 p-1.5 rounded-2xl border">
        <button
          onClick={() => setAdminTab("patient")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            adminTab === "patient" ? "bg-clinic-primary text-white font-black" : "text-clinic-charcoal/70 hover:bg-clinic-bg"
          }`}
        >
          <Users className="w-4 h-4" /> ملف المريض المتكامل والدايت
        </button>
        <button
          onClick={() => setAdminTab("chat")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            adminTab === "chat" ? "bg-clinic-primary text-white font-black" : "text-clinic-charcoal/70 hover:bg-clinic-bg"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> دبلجة الشات وقوالب الطبيبة
        </button>
        <button
          onClick={() => setAdminTab("consult")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            adminTab === "consult" ? "bg-clinic-primary text-white font-black" : "text-clinic-charcoal/70 hover:bg-clinic-bg"
          }`}
        >
          <Compass className="w-4 h-4" /> فحص وتصديق استشارات الحائط
        </button>
        <button
          onClick={() => setAdminTab("store")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            adminTab === "store" ? "bg-clinic-primary text-white font-black" : "text-clinic-charcoal/70 hover:bg-clinic-bg"
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> مخازن المتجر وبدائل الغذاء
        </button>
        <button
          onClick={() => setAdminTab("export")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            adminTab === "export" ? "bg-clinic-primary text-white font-black" : "text-clinic-charcoal/70 hover:bg-clinic-bg"
          }`}
        >
          🚀 دليل التصدير والاستضافة الخارجية
        </button>
      </div>

      {/* Patient Selector for Doctor */}
      {patientsList.length > 0 && (
        <div className="bg-clinic-pink text-clinic-secondary border border-clinic-secondary/15 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black">🌟 مريض المتابعة المحدد حالياً بالعيادة:</span>
            <select
              value={selectedPatientId || patient.id}
              onChange={(e) => onSelectPatient && onSelectPatient(e.target.value)}
              className="bg-white border text-clinic-charcoal border-clinic-secondary/25 text-xs py-1.5 px-3 rounded-lg focus:outline-none font-bold"
            >
              {patientsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.phone}) - {p.level} • {p.points} نقطة
                </option>
              ))}
            </select>
          </div>
          <div className="text-[10px] bg-white border px-3 py-1.5 rounded-lg text-clinic-primary font-bold">
            💡 جاري سحب وتصديق ملف الوجبات وحمية الغذاء ومؤشرات وزن {patientName} من الـ Database.
          </div>
        </div>
      )}

      {adminTab === "export" && (
        <div className="bg-white border border-clinic-primary/10 p-6 md:p-8 rounded-2xl space-y-6 shadow-sm select-text text-right">
          <div className="flex items-center gap-2 border-b pb-3 text-clinic-secondary">
            <Cpu className="w-5 h-5" />
            <h3 className="text-md font-black">دليل تصدير العيادة واستضافتها على سيرفر خارجي</h3>
          </div>
          
          <p className="text-xs text-clinic-primary leading-relaxed font-bold">
            مبارك البناء يا بطل! هذه العيادة متصلة بقاعدة بيانات سحابية حقيقية (Firebase Firestore) وأنظمة توثيق وتسجيل (Firebase Auth). لتصدير هذا الكود واستضافته على مزودي خدمة خارجيين مثل <span className="text-clinic-secondary font-black">Vercel</span> أو <span className="text-clinic-secondary font-black">Firebase Hosting</span> أو <span className="text-clinic-secondary font-black">Netlify</span>، يُرجى تتبع الخطوات الإرشادية التفصيلية التالية:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Phase 1: ZIP extraction and setup */}
            <div className="p-4 bg-clinic-bg/40 rounded-xl border border-clinic-primary/10 space-y-3">
              <h4 className="text-xs font-black text-clinic-charcoal flex items-center gap-1">
                <span className="bg-clinic-secondary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono">1</span>
                تحميل الملفات وتشغيلها محلياً (Local Setup)
              </h4>
              <ul className="text-[11px] text-clinic-primary space-y-2 list-disc list-inside pr-2 leading-relaxed">
                <li>في محيط <strong>Google AI Studio Build</strong>، توجه لأيقونة الترس أو الإعدادات في الزاوية العلوية واضغط على <strong>Export ZIP</strong> لتحميل المشروع بأكمله كملف مضغوط.</li>
                <li>قم بفك ضغط الملف على حاسوبك الشخصي وافتحه بمحرر الكود الخاص بك مثل <strong>VS Code</strong>.</li>
                <li>افتح سطر الأوامر (Terminal) وثبّت الإضافات والمكتبات اللازمة بكتابة:
                  <code className="block bg-clinic-charcoal text-white text-[10px] p-2 rounded mt-1.5 text-left font-mono">npm install</code>
                </li>
                <li>لتشغيل البيئة التجريبية المحلية، اكتب:
                  <code className="block bg-clinic-charcoal text-white text-[10px] p-2 rounded mt-1.5 text-left font-mono">npm run dev</code>
                </li>
              </ul>
            </div>

            {/* Phase 2: Firebase Connection */}
            <div className="p-4 bg-clinic-bg/40 rounded-xl border border-clinic-primary/10 space-y-3">
              <h4 className="text-xs font-black text-clinic-charcoal flex items-center gap-1">
                <span className="bg-clinic-secondary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono">2</span>
                ربط المشروع بـ Firebase الخاص بك (Production DB)
              </h4>
              <ul className="text-[11px] text-clinic-primary space-y-2 lg:space-y-1.5 list-disc list-inside pr-2 leading-relaxed">
                <li>المشروع حالياً مضبوط على قاعدة بيانات عيادة AI Studio المؤقتة. لإنشاء السيرفر الإنتاجي الحصري بك:</li>
                <li>انتقل إلى <a href="https://console.firebase.google.com/" target="_blank" className="text-clinic-secondary underline font-black">Firebase Console</a> وأنشئ مشروعاً جديداً.</li>
                <li>قم بتفعيل <strong>Authentication</strong> (مع اختيار تسجيل الدخول بالبريد الإلكتروني والرمز السري Email / Password).</li>
                <li>قم بتفعيل قاعدة بيانات سحابية <strong>Cloud Firestore</strong> بوضع الإنتاج أو التجربة.</li>
                <li>انسخ بيانات الربط (Firebase Config Object) واستبدلها مباشرة بمحتويات الملف الجذري:
                  <code className="block bg-slate-100 text-slate-800 text-[10px] p-1.5 rounded mt-1 text-left font-mono">/firebase-applet-config.json</code>
                </li>
              </ul>
            </div>

            {/* Phase 3: Vercel Deployment */}
            <div className="p-4 bg-clinic-bg/40 rounded-xl border border-clinic-primary/10 space-y-3">
              <h4 className="text-xs font-black text-clinic-charcoal flex items-center gap-1">
                <span className="bg-clinic-secondary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono">3</span>
                استضافة مجانية سريعة على Vercel أو Netlify
              </h4>
              <p className="text-[11px] text-clinic-primary leading-relaxed">
                يعتبر <strong>Vercel</strong> أفضل منصة لاستضافة مشاريع React SPA:
              </p>
              <ul className="text-[11px] text-clinic-primary space-y-2 list-disc list-inside pr-2 leading-relaxed">
                <li>ارفع الكود ومجلد المشروع لـ <strong>GitHub</strong> الخاص بك في مستودع خاص أو عام.</li>
                <li>سجل الدخول بموقع <a href="https://vercel.com" target="_blank" className="text-clinic-secondary underline font-black">Vercel</a> واضغط على <strong>Add New Project</strong> ثم اربطه بمستودع GitHub.</li>
                <li>اترك إعدادات البناء كما هي (فهي تميز Vite تلقائياً) وسيتم بناء التطبيق عبر الأمر:
                  <code className="block bg-clinic-charcoal text-white text-[10px] p-2 rounded mt-1 text-left font-mono">npm run build</code>
                </li>
                <li>اضغط على <strong>Deploy</strong>، وبذلك ستحصل على رابط وموقع عام آمن (https) لمشاركته مع د. شيماء ومرضى العيادة!</li>
              </ul>
            </div>

            {/* Phase 4: Firebase Hosting */}
            <div className="p-4 bg-clinic-bg/40 rounded-xl border border-clinic-primary/10 space-y-3">
              <h4 className="text-xs font-black text-clinic-charcoal flex items-center gap-1">
                <span className="bg-clinic-secondary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono">4</span>
                أو الاستضافة المباشرة بـ Firebase Hosting
              </h4>
              <ul className="text-[11px] text-clinic-primary space-y-2 list-disc list-inside pr-2 leading-relaxed">
                <li>يمكنك أيضاً استضافة التطبيق على نفس السيرفر الذي يحمل سجلات التغذية باستخدام أدوات المطورين:</li>
                <li>ثبّت أدوات Firebase محلياً عبر سطر الأوامر:
                  <code className="block bg-clinic-charcoal text-white text-[10px] p-1.5 rounded mt-1 text-left font-mono">npm install -g firebase-tools</code>
                </li>
                <li>سجل دخولك وأنشئ تهيئة المشروع بكتابة:
                  <code className="block bg-clinic-charcoal text-white text-[10px] p-1.5 rounded mt-1 text-left font-mono">firebase login && firebase init</code>
                </li>
                <li>اختر <strong>Hosting</strong> وحدد المجلد العام المنتج للمخرجات ليكون <code className="text-clinic-secondary font-black">dist</code> عوضاً عن <code className="text-slate-800 font-mono">public</code>.</li>
                <li>ابنِ التطبيق واطرحه على السحابة فوراً بـ:
                  <code className="block bg-clinic-charcoal text-white text-[10px] p-1.5 rounded mt-1 text-left font-mono">npm run build && firebase deploy</code>
                </li>
              </ul>
            </div>

          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs font-bold text-amber-900 leading-relaxed">
            <span>💡</span>
            <p>
              ملاحظة أمان هامة: تأكد من تفعيل قواعد الحماية لقاعدة البيانات <strong>Firestore Rules</strong> لمنع القراءة العشوائية وضمان خصوصية بيانات المرضى بوضع المريض ومصداقية تصديقات الدكتورة شيماء!
            </p>
          </div>

        </div>
      )}

      {/* Tabs Content rendering */}
      {adminTab === "patient" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Edit patient record info (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-white border border-clinic-primary/10 p-5 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-xs font-black text-clinic-charcoal flex items-center gap-1 border-b pb-2">
              <Users className="w-4 h-4 text-clinic-secondary" />
              تعديل مصفوفة العميل الطبية
            </h3>

            <form onSubmit={handleSavePatient} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-clinic-charcoal mb-0.5">اسم المريض:</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-clinic-bg/50 border border-clinic-primary/20 rounded-lg px-2.5 py-1 text-xs text-clinic-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-clinic-charcoal mb-0.5">هاتف المريض:</label>
                <input
                  type="text"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full bg-clinic-bg/50 border border-clinic-primary/20 rounded-lg px-2.5 py-1 text-xs text-clinic-charcoal focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-clinic-charcoal mb-0.5">النقاط المخزنة:</label>
                  <input
                    type="number"
                    value={patientPoints}
                    onChange={(e) => setPatientPoints(Number(e.target.value))}
                    className="w-full bg-clinic-bg/50 border border-clinic-primary/20 rounded-lg px-2.5 py-1 text-xs text-clinic-charcoal focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-clinic-charcoal mb-0.5">هدف الوزن (كجم):</label>
                  <input
                    type="number"
                    value={patientGoal}
                    onChange={(e) => setPatientGoal(Number(e.target.value))}
                    className="w-full bg-clinic-bg/50 border border-clinic-primary/20 rounded-lg px-2.5 py-1 text-xs text-clinic-charcoal focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-clinic-charcoal mb-0.5">تصنيف المستوى الحالي:</label>
                <select
                  value={patientLevel}
                  onChange={(e) => setPatientLevel(e.target.value)}
                  className="w-full bg-clinic-bg/50 border border-clinic-primary/20 rounded-lg px-2.5 py-1 text-xs text-clinic-charcoal focus:outline-none"
                >
                  <option value="جديد">جديد</option>
                  <option value="برونزي">برونزي</option>
                  <option value="فضي">فضي</option>
                  <option value="ذهبي">ذهبي</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-clinic-secondary text-white font-bold py-1.5 px-3 rounded-lg text-xs hover:bg-clinic-secondary/90 transition-all flex items-center justify-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                حفظ مصفوفة المريض
              </button>
            </form>

            {/* Grant manual points shortcut */}
            <div className="border-t border-clinic-primary/10 pt-3 space-y-2 select-none">
              <p className="text-[10px] text-clinic-primary font-bold">باقة تحفيز النقاط اليدوي:</p>
              <div className="flex gap-1.5 flex-wrap">
                <button 
                  onClick={() => { onAwardPoints(50); alert("تم منح العميل 50 نقطة تحفيزية بنجاح ✓"); }}
                  className="bg-clinic-bg hover:bg-clinic-primary/10 text-clinic-primary font-bold text-[9px] py-1 px-2 rounded border"
                >
                  +50 نقطة التزام
                </button>
                <button 
                  onClick={() => { onAwardPoints(100); alert("تم منح العميل 100 نقطة تحفيزية بنجاح ✓"); }}
                  className="bg-clinic-bg hover:bg-clinic-primary/10 text-clinic-primary font-bold text-[9px] py-1 px-2 rounded border"
                >
                  +100 نقطة نزول وزن
                </button>
              </div>
            </div>
          </div>

          {/* Edit diet plan for patient (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-clinic-primary/10 p-5 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-xs font-black text-clinic-charcoal flex items-center gap-1 border-b pb-2">
              <Apple className="w-4 h-4 text-emerald-600 animate-pulse" />
              تحديث وتأليف نظام الوجبات والدايت الخاص بالعميل
            </h3>

            <form onSubmit={handleSaveDiet} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">اسم النظام/البرنامج:</label>
                <input
                  type="text"
                  value={dietTitle}
                  onChange={(e) => setDietTitle(e.target.value)}
                  className="w-full bg-clinic-bg/40 border border-clinic-primary/25 rounded-xl px-3 py-1.5 text-xs text-clinic-charcoal focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">🌄 الفطور المصمم:</label>
                  <textarea
                    value={dietBreakfast}
                    onChange={(e) => setDietBreakfast(e.target.value)}
                    rows={4}
                    className="w-full bg-clinic-bg/40 border border-clinic-primary/15 rounded-xl p-2.5 text-xs text-clinic-charcoal focus:outline-none resize-none leading-relaxed"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">☀️ الغداء المصمم:</label>
                  <textarea
                    value={dietLunch}
                    onChange={(e) => setDietLunch(e.target.value)}
                    rows={4}
                    className="w-full bg-clinic-bg/40 border border-clinic-primary/15 rounded-xl p-2.5 text-xs text-clinic-charcoal focus:outline-none resize-none leading-relaxed"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">🌙 العشاء المصمم:</label>
                  <textarea
                    value={dietDinner}
                    onChange={(e) => setDietDinner(e.target.value)}
                    rows={4}
                    className="w-full bg-clinic-bg/40 border border-clinic-primary/15 rounded-xl p-2.5 text-xs text-clinic-charcoal focus:outline-none resize-none leading-relaxed"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">🍎 سناك إضافي:</label>
                  <textarea
                    value={dietSnacks}
                    onChange={(e) => setDietSnacks(e.target.value)}
                    rows={4}
                    className="w-full bg-clinic-bg/40 border border-clinic-primary/15 rounded-xl p-2.5 text-xs text-clinic-charcoal focus:outline-none resize-none leading-relaxed"
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">📋 توجيهات الطبيبة وملاحظات الكرياتين أو المياه:</label>
                <textarea
                  value={dietNotes}
                  onChange={(e) => setDietNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-clinic-bg/45 border border-clinic-primary/20 rounded-xl p-3 text-xs text-clinic-charcoal focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs hover:bg-emerald-600 transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                اعتماد وتحديث مصفوفة حمية المريض المثبتة
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Direct thread reply screen and templates select */}
      {adminTab === "chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 flex flex-col h-[400px] bg-white border border-clinic-primary/10 rounded-2xl overflow-hidden">
            <div className="bg-clinic-bg/50 p-3 border-b text-xs font-bold text-clinic-charcoal">
              صندوق الرد المباشر بلسان د. شيماء للتغذية
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-clinic-bg/5">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-xs leading-normal font-medium max-w-[90%] bg-white p-2.5 rounded-xl border border-clinic-primary/5">
                  <div className="flex items-center gap-1.5 text-[9px] text-clinic-primary mb-1">
                    <span className="font-bold">{msg.senderName} ({msg.senderRole === Role.ADMIN ? "طبيبة" : "مريض"})</span>
                    <span>•</span>
                    <span className="font-mono">{msg.createdAt.split("T")[0]}</span>
                  </div>
                  <p className="text-clinic-charcoal whitespace-pre-line">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={submitDoctorMsg} className="p-3 border-t bg-white flex gap-2">
              <input
                type="text"
                value={doctorMsg}
                onChange={(e) => setDoctorMsg(e.target.value)}
                placeholder="اكتب ردك أو اختر قالبًا سريعًا..."
                className="flex-1 bg-clinic-bg/50 border rounded-xl px-3 py-2 text-xs text-clinic-charcoal focus:outline-none"
              />
              <button
                type="submit"
                disabled={!doctorMsg.trim()}
                className="bg-clinic-secondary text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-md shrink-0"
              >
                <Send className="w-4 h-4 transform rotate-180" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-4 bg-white border border-clinic-primary/10 p-5 rounded-2xl space-y-3 shadow-sm h-fit">
            <h4 className="text-xs font-black text-clinic-charcoal flex items-center gap-1 border-b pb-1">
              <Sparkles className="w-4 h-4 text-clinic-accent" />
              قوالب صياغة الردود الطبية الجاهزة
            </h4>
            <p className="text-[9px] text-clinic-primary">تحدد القالب ليملأ صندوق النص فورياً للارسال:</p>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 select-none">
              {messageTemplates.map((temp) => (
                <button
                  type="button"
                  key={temp.id}
                  onClick={() => selectMsgTemplate(temp.content)}
                  className="w-full p-2.5 text-right bg-clinic-bg/20 hover:bg-clinic-pink/35 rounded-xl border text-[11px] leading-relaxed block transition-all"
                >
                  <span className="font-extrabold text-clinic-secondary block mb-0.5">{temp.title}</span>
                  <p className="text-clinic-charcoal/80 truncate">{temp.content}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Answer quick pending consultations */}
      {adminTab === "consult" && (
        <div className="space-y-6">
          <div className="bg-white border border-clinic-primary/10 p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-clinic-charcoal mb-4 flex items-center gap-1">
              <Compass className="w-4 h-4 text-clinic-secondary animate-float" />
              الاستشارات الطارئة المطروحة من المرضى بصندوق الانتظار
            </h3>

            {consultations.length === 0 ? (
              <p className="text-xs text-clinic-primary">لا يوجد استشارات حالياً بانتظار تصديقك.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {consultations.map((consult) => (
                  <div key={consult.id} className="bg-clinic-bg/20 p-4 rounded-xl border border-clinic-primary/10 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2 flex-wrap text-[10px] font-bold">
                        <span className="text-clinic-secondary bg-white px-2 py-0.5 border rounded-lg">🏷️ {consult.category}</span>
                        <span className={consult.status === "answered" ? "text-emerald-700" : "text-amber-800 animate-pulse"}>
                          {consult.status === "answered" ? "✓ تم الحل" : "⏳ بانتظام رد عيادي"}
                        </span>
                      </div>
                      <p className="text-xs font-black text-clinic-charcoal leading-relaxed mb-3">
                        "{consult.question}"
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedConsultId(consult.id);
                        if (consult.answerByDoctor) setDoctorAnswerText(consult.answerByDoctor);
                        else setDoctorAnswerText("");
                      }}
                      className="bg-clinic-primary hover:bg-clinic-primary-light text-white text-[10px] font-bold py-1.5 px-3 rounded-lg w-fit transition-all flex items-center gap-1 self-end"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                      كتابة أو تعديل الإفادة الطبية
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedConsultId && (
            <form onSubmit={handleAnswerSubmit} className="bg-clinic-pink text-clinic-secondary border border-clinic-secondary/20 p-5 rounded-2xl space-y-4 animate-fade-in text-right">
              <h4 className="text-xs font-black text-clinic-secondary">تحت التحرير: صياغة الرد على الاستفسار المختار</h4>
              
              <div>
                <textarea
                  value={doctorAnswerText}
                  onChange={(e) => setDoctorAnswerText(e.target.value)}
                  placeholder="اكتب إفادتك الطبية بأسلوب هادئ وعلمي دقيق لتوضيح المفاهيم للمرضى..."
                  rows={4}
                  required
                  className="w-full bg-white border border-clinic-secondary/25 text-clinic-charcoal text-xs p-3 focus:outline-none rounded-xl leading-relaxed resize-none"
                ></textarea>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-clinic-secondary text-white font-extrabold text-xs py-2 px-5 rounded-xl shadow transition-all"
                >
                  نشر واعتماد الرد الطبي
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedConsultId("")}
                  className="bg-white text-clinic-primary border text-xs py-2 px-4 rounded-xl hover:bg-slate-50 transition-all font-bold"
                >
                  إلغاء التعديل
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Custom Inventory Products Setup */}
      {adminTab === "store" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* New product addition Form (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white border border-clinic-primary/10 p-5 rounded-2xl shadow-sm h-fit">
            <h3 className="text-xs font-black text-clinic-charcoal flex items-center gap-1 border-b pb-2 mb-4">
              <PlusCircle className="w-4 h-4 text-clinic-secondary" />
              إضافة مكمل أو طعام صحي للمتجر
            </h3>

            <form onSubmit={handleAddNewProduct} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-clinic-charcoal mb-0.5">اسم السلعة الصحية:</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="مثال: حبوب بذور السيلوم العضوية للتخسيس"
                  className="w-full bg-clinic-bg/40 border border-clinic-primary/15 rounded-lg px-2.5 py-1 text-xs text-clinic-charcoal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-clinic-charcoal mb-0.5">السعر بالريال (ر.س):</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="مثال: 120"
                    className="w-full bg-clinic-bg/40 border border-clinic-primary/15 rounded-lg px-2.5 py-1 text-xs text-clinic-charcoal focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-clinic-charcoal mb-0.5">تصنيف السلعة:</label>
                  <select
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value as Product["category"])}
                    className="w-full bg-clinic-bg/40 border border-clinic-primary/15 rounded-lg px-2 py-1 text-xs text-clinic-charcoal focus:outline-none"
                  >
                    <option value="عسل طبيعي">عسل طبيعي</option>
                    <option value="أعشاب علاجية">أعشاب علاجية</option>
                    <option value="مكملات غذائية">مكملات غذائية</option>
                    <option value="أغذية صحية">أغذية صحية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-clinic-charcoal mb-0.5">رابط صورة عينة السلعة:</label>
                <input
                  type="text"
                  value={newProdImg}
                  onChange={(e) => setNewProdImg(e.target.value)}
                  placeholder="ضع رابط تفصيلي للصورة أو دعه فارغًا"
                  className="w-full bg-clinic-bg/40 border border-clinic-primary/15 rounded-lg px-2.5 py-1 text-xs text-clinic-charcoal focus:outline-none font-mono text-left"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-clinic-charcoal mb-0.5">مواصفات السلعة الطبية:</label>
                <textarea
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="مزايا المنتج وفوائده للتخسيس وسد الجوع..."
                  rows={2}
                  className="w-full bg-clinic-bg/40 border border-clinic-primary/15 rounded-lg p-2 text-xs text-clinic-charcoal focus:outline-none resize-none leading-relaxed"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-clinic-primary hover:bg-clinic-primary-light text-white font-extrabold py-2 px-4 rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-1"
              >
                <PlusCircle className="w-4 h-4" />
                إدراج السلعة بصالات العرض
              </button>
            </form>
          </div>

          {/* Exist product list manager (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white border border-clinic-primary/10 p-5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-black text-clinic-charcoal mb-3 flex items-center gap-1.5 border-b pb-1">
              <ShoppingBag className="w-4 h-4 text-clinic-primary" />
              المنتجات المعروضة بالمتجر حالياً والتحكم بها
            </h3>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {products.map((p) => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-clinic-bg/25 border border-clinic-primary/5 rounded-xl gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.image} alt={p.name} className="w-9 h-9 object-cover rounded border shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold text-clinic-charcoal truncate">{p.name}</h4>
                      <p className="text-[10px] text-clinic-primary font-bold">{p.category} • {p.price} ريال</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveProduct(p.id)}
                    className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg shrink-0 transition-all"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
