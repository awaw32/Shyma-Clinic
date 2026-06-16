import React, { useState } from "react";
import { Apple, Utensils, Check, Calendar, PlusCircle, Trash, AlertTriangle, HelpCircle } from "lucide-react";
import { DietPlan, MealLog, MealType } from "../types";

interface NutritionRoomProps {
  dietPlan: DietPlan;
  mealLogs: MealLog[];
  onAddMealLog: (type: MealType, description: string, calories: number) => void;
  onRemoveMealLog: (id: string) => void;
}

export default function NutritionRoom({ 
  dietPlan, 
  mealLogs, 
  onAddMealLog, 
  onRemoveMealLog 
}: NutritionRoomProps) {
  const [activeTab, setActiveTab] = useState<"diet" | "logger">("diet");
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState<number | "">("");

  const handleSubmitMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onAddMealLog(mealType, description, Number(calories) || 0);
    setDescription("");
    setCalories("");
  };

  const getMealTypeArabic = (type: MealType) => {
    switch (type) {
      case "breakfast": return "الفطور";
      case "lunch": return "الغداء";
      case "dinner": return "العشاء";
      case "snack": return "سناك خفيف";
    }
  };

  const menuPresetSuggestions: Record<MealType, string[]> = {
    breakfast: [
      "2 بيضة مسلوقة + نصف رغيف شوفان + جرجير وطماطم وقهوة خالية من السكر",
      "علبة زبادي لايت + 3 ملاعق شوفان + حبة تفاح أخضر مفرومة رش قرفة",
      "جبن قريش قليل الدسم + خيار + زيتون + شريحة توست بني حائل"
    ],
    lunch: [
      "200 جرام صدر دجاج مشوي + 5 ملاعق أرز بسمتي مسلوق + خضار سوتيه مقرمش",
      "شريحة فيليه سمك سلمون مشوية + طبق كبير سلطة طاقة خضراء بالليمون",
      "طبق شوربة عدس غنية بالبروتين + شريحة توست مقرمش + ربع دجاجة مسلوقة"
    ],
    dinner: [
      "علبة زبادي يوناني بنكهة الفانيلا الطبيعية + حفنة صغيرة لوز نيئ",
      "قطعة جبن قريش بالكمون وزيت الزيتون + حبة طماطم وخس بلدي",
      "كوب حليب دافئ قليل الدسم بنقيع الهيل وقليل من الوعي والصبر"
    ],
    snack: [
      "حبتين من التمر الطبيعي السكري + فنجان قهوة عربية شقراء هادئة",
      "طبق خيار وجزر مقشر طازج مقرمش لسد شهية الطعام",
      "3 أكواب فشار معد بملعقة زيت خفيفة في المنزل دون ملح زائد"
    ]
  };

  const totalCaloriesToday = mealLogs
    .filter(log => log.date === new Date().toISOString().split("T")[0])
    .reduce((sum, log) => sum + log.calories, 0);

  return (
    <div className="bg-clinic-surface border border-clinic-primary/10 rounded-3xl p-6 md:p-8 shadow-md">
      
      {/* Title Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-clinic-primary/10">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
          <Apple className="w-6 h-6 animate-float" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-clinic-charcoal">غرفة التغذية والوجبات العلاجية</h2>
          <p className="text-xs text-clinic-primary font-semibold">حيث نصمم طعامك كعلاج مخصص ونقود تقدمك للامتلاء والرشاقة</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-clinic-primary/10 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("diet")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === "diet" 
              ? "border-clinic-secondary text-clinic-secondary font-black" 
              : "border-transparent text-clinic-charcoal/60 hover:text-clinic-charcoal"
          }`}
        >
          🥬 خطتي التغذوية المصممة لي
        </button>
        <button
          onClick={() => setActiveTab("logger")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === "logger" 
              ? "border-clinic-secondary text-clinic-secondary font-black" 
              : "border-transparent text-clinic-charcoal/60 hover:text-clinic-charcoal"
          }`}
        >
          📝 مدون ومفكرة وجباتي اليومية
        </button>
      </div>

      {/* Content tabs */}
      {activeTab === "diet" ? (
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-clinic-bg/40 p-4 rounded-2xl border border-clinic-primary/5 gap-3">
            <div>
              <h3 className="text-sm font-bold text-clinic-charcoal">{dietPlan.title}</h3>
              <p className="text-xs text-clinic-primary mt-1">تاريخ تنشيط النظام: {new Date(dietPlan.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> معتمد ومفعل حالياً
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Breakfast block */}
            <div className="bg-clinic-bg/25 border border-clinic-primary/10 rounded-2xl p-5 relative">
              <div className="absolute top-4 left-4 bg-amber-100 text-amber-800 rounded-lg px-2 py-0.5 text-[10px] font-bold">صباحي</div>
              <h4 className="text-sm font-extrabold text-clinic-charcoal mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> وجبة وجار الغذاء: الفطور الإجباري
              </h4>
              <p className="text-xs text-clinic-charcoal/90 leading-relaxed bg-white p-3 rounded-xl border border-clinic-primary/5">
                {dietPlan.breakfast}
              </p>
            </div>

            {/* Lunch block */}
            <div className="bg-clinic-bg/25 border border-clinic-primary/10 rounded-2xl p-5 relative">
              <div className="absolute top-4 left-4 bg-orange-100 text-orange-850 rounded-lg px-2 py-0.5 text-[10px] font-bold">نهاري</div>
              <h4 className="text-sm font-extrabold text-clinic-charcoal mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> وجبة المجهود الأكبر: الغداء الساخن
              </h4>
              <p className="text-xs text-clinic-charcoal/90 leading-relaxed bg-white p-3 rounded-xl border border-clinic-primary/5">
                {dietPlan.lunch}
              </p>
            </div>

            {/* Dinner block */}
            <div className="bg-clinic-bg/25 border border-clinic-primary/10 rounded-2xl p-5 relative">
              <div className="absolute top-4 left-4 bg-indigo-100 text-indigo-800 rounded-lg px-2 py-0.5 text-[10px] font-bold">مسائي</div>
              <h4 className="text-sm font-extrabold text-clinic-charcoal mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-505 bg-indigo-500"></span> وجبة السكينة والهضم المريح: العشاء
              </h4>
              <p className="text-xs text-clinic-charcoal/90 leading-relaxed bg-white p-3 rounded-xl border border-clinic-primary/5">
                {dietPlan.dinner}
              </p>
            </div>

            {/* Snacks block */}
            <div className="bg-clinic-bg/25 border border-clinic-primary/10 rounded-2xl p-5 relative">
              <div className="absolute top-4 left-4 bg-emerald-100 text-emerald-800 rounded-lg px-2 py-0.5 text-[10px] font-bold">بين الوجبات</div>
              <h4 className="text-sm font-extrabold text-clinic-charcoal mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> تصريف الشهية والتمثيل الغذائي: سناك
              </h4>
              <p className="text-xs text-clinic-charcoal/90 leading-relaxed bg-white p-3 rounded-xl border border-clinic-primary/5">
                {dietPlan.snacks}
              </p>
            </div>

          </div>

          {/* Doctor considerations */}
          <div className="bg-clinic-pink text-clinic-secondary border border-clinic-secondary/15 rounded-2xl p-5">
            <span className="text-xs font-bold block mb-1">📋 ملاحظات هامة من الدكتورة شيماء:</span>
            <p className="text-xs leading-relaxed">
              {dietPlan.notes}
            </p>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Meal logging form */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-clinic-bg/50 p-5 rounded-2xl border border-clinic-primary/10">
              <h3 className="text-sm font-extrabold text-clinic-charcoal mb-3 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-clinic-secondary" />
                سجل طعام البهجة اليوم!
              </h3>

              <form onSubmit={handleSubmitMeal} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-clinic-charcoal mb-1">نوع وجبتك:</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as MealType)}
                    className="w-full bg-white border border-clinic-primary/20 rounded-xl px-3 py-2 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary"
                  >
                    <option value="breakfast">🌄 الفطور الصباحي</option>
                    <option value="lunch">☀️ الغداء المشبع</option>
                    <option value="dinner">🌙 العشاء الخفيف</option>
                    <option value="snack">🍎 سناك أو فاكهة</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-clinic-charcoal">محتويات الوجبة بالتفصيل:</label>
                    <span className="text-[10px] text-clinic-secondary font-bold">يقترح سحب مسودة 👇</span>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="مثال: 2 بيضة مسلوقة + نصف علبة زبادي وباقي التفاحة..."
                    rows={3}
                    className="w-full bg-white border border-clinic-primary/20 rounded-xl p-3 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary resize-none placeholder-clinic-primary/30"
                  ></textarea>

                  {/* Suggestions presets */}
                  <div className="mt-2 space-y-1">
                    <p className="text-[9px] text-clinic-primary font-bold">وجبات مقترحة ملائمة لنظامك:</p>
                    <div className="flex flex-wrap gap-1">
                      {menuPresetSuggestions[mealType].map((preset, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={() => setDescription(preset)}
                          className="text-[9px] bg-white border border-clinic-primary/10 hover:border-clinic-secondary py-1 px-1.5 rounded-lg text-clinic-charcoal/80 text-right truncate max-w-[200px]"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-clinic-charcoal mb-1">السعرات الحرارية التقريبية (اختياري/كجم):</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="متروك لتقديرك أو دعه فارغاً"
                    className="w-full bg-white border border-clinic-primary/20 rounded-xl px-3 py-2 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!description.trim()}
                  className="w-full bg-clinic-secondary hover:bg-clinic-secondary/90 disabled:bg-clinic-primary/30 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  ادخر وجبتي للمفكرة الطبية
                </button>

              </form>
            </div>

            {/* Daily summary */}
            <div className="bg-clinic-primary/5 p-4 rounded-xl text-[11px] text-clinic-charcoal leading-relaxed flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-clinic-accent shrink-0" />
              <span>مفكرتك اليومية يتم مراجعتها وتعديلها تلقائياً من قبل د. شيماء أثناء زيارتها الدورية لتعديل مستويات السعرات. مجموع السعرات المدونة اليوم: <strong>{totalCaloriesToday} سعرة</strong>.</span>
            </div>
          </div>

          {/* Meal logs list */}
          <div className="lg:col-span-7">
            <h3 className="text-xs font-bold text-clinic-charcoal mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-clinic-primary" />
              الوجبات المسجلة الأحدث (الجدول الموحد)
            </h3>

            {mealLogs.length === 0 ? (
              <div className="text-center p-10 bg-clinic-bg/20 rounded-2xl border border-dashed border-clinic-primary/20 text-clinic-primary">
                <p className="text-xs font-bold">لا يوجد وجبات مدونة في مفكرتك الطبية بعد.</p>
                <p className="text-[10px] mt-1">سجل أول طعام صحي مع المكونات والكمية لتتم مراجعته!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {mealLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="bg-white border border-clinic-primary/10 hover:border-clinic-primary/25 rounded-2xl p-4 shadow-sm transition-all flex justify-between items-start gap-4 animate-fade-in"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          log.type === "breakfast" ? "bg-amber-100 text-amber-800" :
                          log.type === "lunch" ? "bg-orange-100 text-orange-800" :
                          log.type === "dinner" ? "bg-indigo-100 text-indigo-805" : "bg-emerald-100 text-emerald-805"
                        }`}>
                          {getMealTypeArabic(log.type)}
                        </span>
                        <span className="text-[10px] text-clinic-primary/80 font-medium">
                          {log.date}
                        </span>
                        {log.calories > 0 && (
                          <span className="text-[9px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">
                            🔥 {log.calories} سعرة
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-clinic-charcoal leading-relaxed whitespace-pre-line font-medium">
                        {log.description}
                      </p>
                    </div>

                    <button
                      onClick={() => onRemoveMealLog(log.id)}
                      className="text-clinic-primary/50 hover:text-rose-600 transition-all p-1 hover:bg-rose-50 rounded-lg"
                      title="حذف الوجبة"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
