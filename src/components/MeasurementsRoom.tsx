import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { LineChart as ChartIcon, Plus, Eye, Scale, Sparkles, Image, CheckCircle, HelpCircle } from "lucide-react";
import { MeasurementLog } from "../types";

interface MeasurementsRoomProps {
  measurements: MeasurementLog[];
  onAddMeasurement: (m: Omit<MeasurementLog, "id" | "patientId">) => void;
}

export default function MeasurementsRoom({ measurements, onAddMeasurement }: MeasurementsRoomProps) {
  const [weight, setWeight] = useState<number | "">("");
  const [waist, setWaist] = useState<number | "">("");
  const [hip, setHip] = useState<number | "">("");
  const [chest, setChest] = useState<number | "">("");
  const [arm, setArm] = useState<number | "">("");
  const [thigh, setThigh] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  // Parse measurements for Recharts (reverse to show chronological order from left to right)
  const chartData = [...measurements]
    .reverse()
    .map((m) => ({
      date: m.measuredAt,
      "الوزن (كلغ)": m.weight,
      "الخصر (سم)": m.waist,
    }));

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !waist) return;

    onAddMeasurement({
      weight: Number(weight),
      waist: Number(waist),
      hip: Number(hip) || 0,
      chest: Number(chest) || 0,
      arm: Number(arm) || 0,
      thigh: Number(thigh) || 0,
      notes: notes || "تم التسجيل ذاتياً بواسطة المريض",
      photoUrl: photoUrl || undefined,
      measuredAt: new Date().toISOString().split("T")[0],
    });

    // Reset Form
    setWeight("");
    setWaist("");
    setHip("");
    setChest("");
    setArm("");
    setThigh("");
    setNotes("");
    setPhotoUrl("");

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const loadDemoPhoto = () => {
    // Inject a beautiful fitness progress mock image
    const demoPics = [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400"
    ];
    setPhotoUrl(demoPics[Math.floor(Math.random() * demoPics.length)]);
  };

  return (
    <div className="bg-clinic-surface border border-clinic-primary/10 rounded-3xl p-6 md:p-8 shadow-md">
      
      {/* Title Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-clinic-primary/10">
        <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shadow-inner">
          <Scale className="w-6 h-6 animate-float" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-clinic-charcoal">غرفة القياسات والتحول البياني</h2>
          <p className="text-xs text-clinic-primary font-semibold">تتبع خطوط وزنك ومقاسات خصرك تتقلص أسبوعياً تحت عيون طبيبتنا</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Graph rendering wrapper (1 lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-clinic-primary/10 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-clinic-charcoal flex items-center gap-1.5">
                <ChartIcon className="w-4 h-4 text-clinic-secondary" />
                مخطط التقليص والتغيير الديناميكي
              </h3>
              <span className="text-[10px] text-clinic-primary">تحديث فوري 📈</span>
            </div>

            {chartData.length < 2 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-clinic-primary bg-clinic-bg/10 rounded-xl">
                <Scale className="w-10 h-10 stroke-[1.2] text-clinic-primary/40 mb-2" />
                <p className="text-xs font-bold">المخطط يلزمه تسجيلين أسبوعيين على الأقل لبدء رسم المنحنيات.</p>
                <p className="text-[10px] mt-1 text-clinic-primary/80">من فضلك قم بتسجيل قياساتك الأولى والثانية لرؤية تطورك!</p>
              </div>
            ) : (
              <div className="h-72 w-full antialiased font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(114, 86, 76, 0.05)" />
                    <XAxis dataKey="date" stroke="#72564c" fontSize={10} tickLine={false} />
                    <YAxis stroke="#72564c" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ direction: "rtl", textAlign: "right", borderRadius: "12px", border: "1px solid #72564c20" }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                    <Line type="monotone" dataKey="الوزن (كلغ)" stroke="#964261" strokeWidth={3} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="الخصر (سم)" stroke="#e5a93b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-clinic-primary/5 p-4 rounded-xl text-[11px] text-clinic-charcoal flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-clinic-accent shrink-0" />
            <span>نصيحة الدكتورة: لا تقيس وزنك أكثر من <strong>مرة واحدة بالأسبوع</strong> في ميعاد ثابت (صباحاً قبل تناول الإفطار). التقلبات اليومية هي بفعل احتباس المياه والفضلات عشوائياً.</span>
          </div>
        </div>

        {/* Input new measurements form (2 lg:col-span-4) */}
        <div className="lg:col-span-4 bg-clinic-bg/40 p-5 rounded-3xl border border-clinic-primary/10 relative">
          
          {successMsg && (
            <div className="absolute inset-0 bg-white/95 rounded-3xl flex flex-col items-center justify-center text-center p-6 z-10 animate-fade-in">
              <CheckCircle className="w-12 h-12 text-emerald-600 mb-2" />
              <p className="text-sm font-bold text-clinic-charcoal">تم تسجيل قياساتك بنجاح! 🎉</p>
              <p className="text-xs text-clinic-primary mt-1">تم إرسالها لملف الدكتورة شيماء في لوحة المتابعة الطبية.</p>
            </div>
          )}

          <h3 className="text-sm font-extrabold text-clinic-charcoal mb-3 flex items-center gap-1.5 border-b border-clinic-primary/15 pb-2">
            <Plus className="w-4 h-4 text-clinic-secondary" />
            تسجيل قياس أسبوعي جديد
          </h3>

          <form onSubmit={handleLogSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">الوزن (كلغ) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="مثال: 85.4"
                  className="w-full bg-white border border-clinic-primary/20 rounded-xl px-3 py-1.5 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">الخصر (سم) *</label>
                <input
                  type="number"
                  required
                  value={waist}
                  onChange={(e) => setWaist(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="مثال: 98"
                  className="w-full bg-white border border-clinic-primary/20 rounded-xl px-3 py-1.5 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">الورك/الأرداف (سم)</label>
                <input
                  type="number"
                  value={hip}
                  onChange={(e) => setHip(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="اختياري"
                  className="w-full bg-white border border-clinic-primary/20 rounded-xl px-3 py-1.5 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">الصدر (سم)</label>
                <input
                  type="number"
                  value={chest}
                  onChange={(e) => setChest(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="اختياري"
                  className="w-full bg-white border border-clinic-primary/20 rounded-xl px-3 py-1.5 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">الذراع/العضد (سم)</label>
                <input
                  type="number"
                  value={arm}
                  onChange={(e) => setArm(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="اختياري"
                  className="w-full bg-white border border-clinic-primary/20 rounded-xl px-3 py-1.5 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">الفخذ (سم)</label>
                <input
                  type="number"
                  value={thigh}
                  onChange={(e) => setThigh(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="اختياري"
                  className="w-full bg-white border border-clinic-primary/20 rounded-xl px-3 py-1.5 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] font-bold text-clinic-charcoal">رابط صورة المقاسات التعبيرية:</label>
                <button
                  type="button"
                  onClick={loadDemoPhoto}
                  className="text-[9px] text-clinic-secondary font-bold underline"
                >
                  محاكاة رفع صورة 📷
                </button>
              </div>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-white border border-clinic-primary/20 rounded-xl px-3 py-1.5 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary font-mono"
              />
              {photoUrl && (
                <div className="mt-2 text-center">
                  <span className="text-[10px] text-emerald-600 block mb-1">تم إرفاق صورة التحول بنجاح! ✓</span>
                  <img src={photoUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg mx-auto border" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">ملاحظاتك الشخصية للأسبوع:</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي مجهود خاص أو أعراض جانبية شعرت بها..."
                rows={2}
                className="w-full bg-white border border-clinic-primary/20 rounded-xl p-2.5 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={!weight || !waist}
              className="w-full bg-clinic-secondary hover:bg-clinic-secondary/90 disabled:bg-clinic-primary/30 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              حفّظ القياس والأسبوع
            </button>
          </form>

        </div>

      </div>

      {/* Historical logs table list as defined in spec */}
      <div>
        <h3 className="text-xs font-bold text-clinic-charcoal mb-4 flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-clinic-primary" />
          حقيبة سجلاتي القديمة والأحدث (من الأحدث للأقدم)
        </h3>

        <div className="overflow-x-auto border border-clinic-primary/10 rounded-2xl bg-white shadow-sm">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-clinic-bg/40 text-clinic-charcoal border-b border-clinic-primary/10 select-none">
                <th className="p-3 font-extrabold">تاريخ القياس</th>
                <th className="p-3 font-extrabold">الوزن الحالي</th>
                <th className="p-3 font-extrabold">مقاس الخصر</th>
                <th className="p-3 font-extrabold">الأرداف</th>
                <th className="p-3 font-extrabold">الذراع / الصدر / الفخذ</th>
                <th className="p-3 font-extrabold text-center">الصورة المرفقة</th>
                <th className="p-3 font-extrabold">تفاصيل وأعراض</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((m) => (
                <tr key={m.id} className="border-b border-clinic-primary/5 hover:bg-clinic-bg/10 transition-all font-medium">
                  <td className="p-3 text-clinic-secondary font-bold">{m.measuredAt}</td>
                  <td className="p-3 font-black text-clinic-charcoal text-sm">{m.weight} كجم</td>
                  <td className="p-3 font-bold text-clinic-accent">{m.waist} سم</td>
                  <td className="p-3">{m.hip ? `${m.hip} سم` : "غ/م"}</td>
                  <td className="p-3 text-clinic-primary/80">
                    {m.arm ? `${m.arm}سم` : "-"} / {m.chest ? `${m.chest}سم` : "-"} / {m.thigh ? `${m.thigh}سم` : "-"}
                  </td>
                  <td className="p-3 text-center">
                    {m.photoUrl ? (
                      <a href={m.photoUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                        <img 
                          src={m.photoUrl} 
                          alt="Progress log" 
                          className="w-10 h-10 object-cover rounded-lg border hover:scale-125 transition-all" 
                          referrerPolicy="no-referrer"
                        />
                      </a>
                    ) : (
                      <span className="text-[10px] text-clinic-primary/40">-</span>
                    )}
                  </td>
                  <td className="p-3 text-clinic-primary text-[11px] max-w-xs truncate" title={m.notes}>{m.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
