import React from "react";
import { FileText, Printer, Award, Scale, Flame, Droplet, CheckCircle, Sparkles, AlertCircle } from "lucide-react";
import { Patient, MeasurementLog, MealLog, WaterLog } from "../types";

interface ReportViewProps {
  patient: Patient;
  measurements: MeasurementLog[];
  mealLogs: MealLog[];
  waterLog: WaterLog;
}

export default function ReportView({ patient, measurements, mealLogs, waterLog }: ReportViewProps) {
  
  const handlePrint = () => {
    window.print();
  };

  // Calculations
  const initialWeight = measurements.length > 0 
    ? measurements[measurements.length - 1].weight 
    : 100; // fallback
  
  const latestWeight = measurements.length > 0 
    ? measurements[0].weight 
    : 80; // fallback

  const totalLost = Math.max(Number((initialWeight - latestWeight).toFixed(1)), 0);

  // Simple BMI approximation assuming average Arabic female/male height (e.g. 1.68m)
  const estimatedHeightM = 1.68;
  const initialBMI = Number((initialWeight / (estimatedHeightM * estimatedHeightM)).toFixed(1));
  const latestBMI = Number((latestWeight / (estimatedHeightM * estimatedHeightM)).toFixed(1));

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "نقص وزن مفرط", color: "text-amber-500" };
    if (bmi < 25) return { label: "وزن صحي مثالي", color: "text-emerald-600" };
    if (bmi < 30) return { label: "زيادة وزن بسيطة", color: "text-orange-500" };
    return { label: "سمنة مفرطة من الدرجة الطبية", color: "text-red-500" };
  };

  const initialBMICat = getBMICategory(initialBMI);
  const latestBMICat = getBMICategory(latestBMI);

  return (
    <div className="bg-clinic-surface border border-clinic-primary/10 rounded-3xl p-6 md:p-8 shadow-md">
      
      {/* Title Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-clinic-primary/10 select-none print:hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-clinic-charcoal">تقريري الشهري الطبي المعتمد</h2>
            <p className="text-xs text-clinic-primary font-semibold">تحليل دوري شامل لمستويات الوزن ومقاسات الجسم لتقديمها للأطباء ومسؤولي التامين</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="bg-clinic-primary hover:bg-clinic-primary-light text-white font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow"
        >
          <Printer className="w-4 h-4" />
          طباعة التقرير / تحميل PDF
        </button>
      </div>

      {/* Actual Certificate Document to Print */}
      <div className="bg-white border-2 border-clinic-primary/20 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden print:border-none print:shadow-none font-sans">
        
        {/* Frame backgrounds */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-clinic-bg/40 rounded-full scale-110 -translate-x-8 -translate-y-8 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-clinic-pink/20 rounded-full scale-110 translate-x-12 translate-y-12 pointer-events-none"></div>

        <div className="relative z-10 space-y-8">
          
          {/* Print Letterhead */}
          <div className="flex justify-between items-start border-b-2 border-clinic-primary/10 pb-6">
            <div>
              <h1 className="text-2xl font-black text-clinic-secondary leading-tight">Shyma Nutrition Clinic</h1>
              <p className="text-[11px] text-clinic-primary font-bold mt-1">عيادة الدكتورة شيماء للتغذية العلاجية وإدارة السمنة والوزن</p>
              <p className="text-[10px] text-clinic-primary/80">تراخيص وزارة الصحة السعودية والأرقام التدريبية المعتمدة</p>
            </div>
            
            <div className="text-left font-mono text-[10px] text-clinic-primary/80 font-bold">
              <p>تاريخ إصدار المستند: {new Date().toLocaleDateString("ar-EG")}</p>
              <p>كود الحالة: SHY-P-8034</p>
              <p>الحالة الطبية: نشط مستمر 🟢</p>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-clinic-charcoal tracking-tight">شهادة قياس وتأهيل للياقة والوزن الصحي</h2>
            <div className="w-16 h-1 bg-clinic-accent mx-auto rounded-full"></div>
            <p className="text-xs text-clinic-primary/80 leading-relaxed max-w-lg mx-auto">
              يشهد مركز عيادة د. شيماء للتنمية الغذائية والعلاجية بأن العميل المثبت بياناته أدناه يواصل التطور والتقدم الفسيولوجي بالتنسيق السريري الدائم مع طواقم العيادة الصحية.
            </p>
          </div>

          {/* 1. Patient Metadata Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-clinic-primary/10 p-4 rounded-2xl bg-clinic-bg/10 text-xs">
            <div>
              <span className="text-clinic-primary font-bold">اسم العميل الثلاثي:</span>
              <p className="font-extrabold text-clinic-charcoal text-sm mt-0.5">{patient.name}</p>
            </div>
            <div>
              <span className="text-clinic-primary font-bold">هاتف التواصل المقيد:</span>
              <p className="font-mono font-bold text-clinic-charcoal text-sm mt-0.5">{patient.phone}</p>
            </div>
            <div>
              <span className="text-clinic-primary font-bold">مستوى وعي الالتزام عيادياً:</span>
              <p className="font-bold text-clinic-secondary text-sm mt-0.5">👑 {patient.level} ({patient.points} نقطة)</p>
            </div>
          </div>

          {/* 2. Weight Loss progress block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Weight metrics */}
            <div className="border border-clinic-primary/10 p-5 rounded-2xl bg-white space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-clinic-charcoal flex items-center gap-1">
                <Scale className="w-4 h-4 text-clinic-secondary" />
                تحليل منحنيات الوزن والسمنة المرجحة
              </h3>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-clinic-bg/40 p-2.5 rounded-xl border border-clinic-primary/5">
                  <span className="text-[10px] text-clinic-primary font-bold">الوزن الافتتاحي</span>
                  <p className="font-mono text-sm font-black text-clinic-charcoal mt-1">{initialWeight} كغم</p>
                </div>
                <div className="bg-clinic-pink p-2.5 rounded-xl border border-clinic-secondary/10">
                  <span className="text-[10px] text-clinic-secondary font-bold">الوزن الأحدث</span>
                  <p className="font-mono text-sm font-black text-clinic-secondary mt-1">{latestWeight} كغم</p>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 font-bold">صافي النحافة</span>
                  <p className="font-mono text-sm font-black text-emerald-700 mt-1">-{totalLost} كغم</p>
                </div>
              </div>

              <div className="space-y-2 border-t border-clinic-primary/10 pt-3 text-xs leading-relaxed">
                <div className="flex justify-between font-semibold">
                  <span className="text-clinic-primary">مؤشر البدانة (BMI) الافتتاحي:</span>
                  <span className="text-clinic-charcoal">{initialBMI} ({initialBMICat.label})</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-clinic-secondary">مؤشر البدانة (BMI) الحالي:</span>
                  <span className="text-clinic-charcoal">{latestBMI} (<span className={latestBMICat.color}>{latestBMICat.label}</span>)</span>
                </div>
              </div>
            </div>

            {/* Support and compliance charts */}
            <div className="border border-clinic-primary/10 p-5 rounded-2xl bg-white space-y-4 shadow-sm text-xs">
              <h3 className="text-xs font-black text-clinic-charcoal flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-clinic-accent" />
                تتبع هيدرات المياه الالتزامية والنشاط
              </h3>

              <div className="space-y-4 leading-relaxed font-semibold">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-clinic-primary">تراكم السلسلة اليومية (Streaks):</span>
                    <span className="text-rose-600 font-extrabold flex items-center gap-0.5"><Flame className="w-3.5 h-3.5 fill-current" /> {patient.streak} أيام متواصلة</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full" style={{ width: `${Math.min((patient.streak / 30) * 100, 100)}%` }}></div>
                  </div>
                  <p className="text-[9px] text-clinic-primary/70 mt-1">معدل البقاء والوعي ممتاز مقارنة بالأشهر العادية.</p>
                </div>

                <div className="border-t border-clinic-primary/5 pt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-clinic-primary">امتثال شرب المياه اليومي:</span>
                    <span className="text-blue-600 font-extrabold flex items-center gap-0.5"><Droplet className="w-3.5 h-3.5 fill-current" /> {waterLog.cups} / {patient.targetWaterCups} كوب</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${Math.min((waterLog.cups / patient.targetWaterCups) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 3. Medical Form Verification & Signatures */}
          <div className="border-t-2 border-dashed border-clinic-primary/15 pt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            
            {/* Disclaimer list (md:col-span-8) */}
            <div className="md:col-span-8 space-y-2 text-[10px] text-clinic-primary/80 leading-relaxed">
              <div className="flex items-start gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>تم قياس وتحديث المؤشرات والدهون السطحية من غرف لوحة المرضى المقيدة بـ Shyma-Clinic.</span>
              </div>
              <div className="flex items-start gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>النتائج ممتازة وتعكس فاعلية في تفعيل الصيام كعلاج وتقوية اللياقة البدنية والكتلة الرياضية المخصصة.</span>
              </div>
              <div className="flex items-start gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-clinic-accent shrink-0 mt-0.5" />
                <span>هذا التقرير هو فحص غير تعهدي يُستأنس به في المتابعة الطبية وتحسين الخطط التغذوية العلاجية مستقبلاً.</span>
              </div>
            </div>

            {/* Right Signature Area (md:col-span-4) */}
            <div className="md:col-span-4 text-center space-y-1 block select-none">
              <p className="text-[10px] text-clinic-primary font-bold">مصدق ومعتمد بتوقيع الطبيبة رئيسة المركز:</p>
              <div className="w-32 h-12 inline-block relative border border-clinic-primary/10 rounded-xl bg-clinic-bg/20 overflow-hidden">
                <span className="font-serif italic text-clinic-secondary/40 font-black text-xl select-none block translate-y-2 pointer-events-none">Dr. Shyma Aly</span>
              </div>
              <p className="text-[10px] font-extrabold text-clinic-charcoal">د. شيماء - تخصص التغذية العلاجية</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
