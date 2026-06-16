import React, { useState } from "react";
import { Flame, Droplet, Award, CheckCircle2, Trophy, Sparkles } from "lucide-react";
import { Patient, WaterLog } from "../types";

interface StatWidgetsProps {
  patient: Patient;
  onCheckin: () => void;
  waterLog: WaterLog;
  onUpdateWater: (cups: number) => void;
}

export default function StatWidgets({ 
  patient, 
  onCheckin, 
  waterLog, 
  onUpdateWater 
}: StatWidgetsProps) {
  const [showCheckinEffect, setShowCheckinEffect] = useState(false);

  const handleCheckin = () => {
    onCheckin();
    setShowCheckinEffect(true);
    setTimeout(() => {
      setShowCheckinEffect(false);
    }, 2500);
  };

  // Water calculations
  const waterPercentage = Math.min((waterLog.cups / patient.targetWaterCups) * 100, 100);

  // Badge picker based on Streak
  const getStreakBadge = (streak: number) => {
    if (streak >= 100) return { title: "أسطورة الالتزام", desc: "👑 أكثر من 100 يوم حضور متواصل" };
    if (streak >= 30) return { title: "الشهر الذهبي", desc: "🏆 أكثر من 30 يوماً متواصلة" };
    if (streak >= 7) return { title: "أسبوع التحدي", desc: "🔥🔥 تحديت نفسك لأسبوع كامل" };
    return { title: "انطلاقة واعدة", desc: "🔥 حضور يومي مستمر" };
  };

  const badge = getStreakBadge(patient.streak);

  // Time-based greetings for Arab user
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "صباح الصداقة والصحة الأبدية صباح الخير";
    if (hours < 18) return "طاب يومك بكل حيوية ونشاط";
    return "مساء السلام والاسترخاء الهادئ";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      
      {/* 1. Patient Welcome Panel */}
      <div className="bg-gradient-to-br from-clinic-primary to-clinic-primary/90 text-white rounded-3xl p-6 shadow-md relative overflow-hidden select-none">
        <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-full scale-150 transform -translate-x-4 -translate-y-4"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-clinic-secondary/20 rounded-full scale-110 transform translate-x-8 translate-y-8"></div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-clinic-accent" />
              {getGreeting()}
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-1">{patient.name}</h2>
            <p className="text-xs text-white/85 leading-relaxed">
              سعداء بتقدمك! هدفك المنشود للوزن هو <span className="font-bold underline text-clinic-accent">{patient.weightGoal} كجم</span>.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-white/90">
            <span>تاريخ الانضمام: {patient.joinedDate}</span>
            <span className="font-bold bg-clinic-secondary px-2.5 py-0.5 rounded-lg">المستوى {patient.level}</span>
          </div>
        </div>
      </div>

      {/* 2. Streak Daily Check-In */}
      <div className="bg-clinic-surface border border-clinic-primary/10 rounded-3xl p-6 shadow-md relative overflow-hidden select-none">
        
        {showCheckinEffect && (
          <div className="absolute inset-0 bg-clinic-secondary/10 flex flex-col items-center justify-center z-10 backdrop-blur-[1px] animate-fade-in text-center p-4">
            <Trophy className="w-12 h-12 text-clinic-accent animate-bounce mb-2" />
            <p className="text-sm font-bold text-clinic-secondary">تم تسجيل الحضور اليوم بنجاح والتهام النقاط! 🎉</p>
            <p className="text-xs text-clinic-charcoal/80 mt-1">سلسلتك الآن {patient.streak} أيام متواصلة</p>
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs text-clinic-primary font-bold">تسجيل الحضور اليومي</span>
            <h3 className="text-lg font-extrabold text-clinic-charcoal mt-0.5">سلسلة الالتزام الحارق</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-4 py-2 border-y border-clinic-primary/5 my-3">
          <div className="text-center flex-1">
            <p className="text-2xl font-black text-clinic-secondary">{patient.streak}</p>
            <p className="text-[10px] text-clinic-charcoal/70 font-semibold">اليوم الحالي</p>
          </div>
          <div className="w-[1px] h-10 bg-clinic-primary/15"></div>
          <div className="text-center flex-1">
            <p className="text-2xl font-black text-clinic-primary">{patient.longestStreak}</p>
            <p className="text-[10px] text-clinic-charcoal/70 font-semibold">أطول سلسلة</p>
          </div>
          <div className="w-[1px] h-10 bg-clinic-primary/15"></div>
          <div className="text-center flex-1">
            <span className="text-xs font-bold text-emerald-600 block bg-emerald-50 py-1 px-1 rounded-lg">👑 {badge.title}</span>
          </div>
        </div>

        <button 
          onClick={handleCheckin}
          className="w-full bg-clinic-secondary hover:bg-clinic-secondary/90 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          سجل حضوري اليومي (+10 نقاط)
        </button>
      </div>

      {/* 3. Hydration Water Tracker */}
      <div className="bg-clinic-surface border border-clinic-primary/10 rounded-3xl p-6 shadow-md select-none">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs text-clinic-primary font-bold">متتبع شرب المياه</span>
            <h3 className="text-lg font-extrabold text-clinic-charcoal mt-0.5">الترطيب الخلوي وحرق الدهون</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner">
            <Droplet className="w-6 h-6 fill-current" />
          </div>
        </div>

        <div className="flex justify-between items-end mb-2">
          <span className="text-xs text-clinic-charcoal/80 font-bold">معدل الإنجاز: {waterLog.cups} / {patient.targetWaterCups} كوب</span>
          <span className="text-xs text-blue-600 font-bold">{Math.round(waterPercentage)}%</span>
        </div>

        <div className="w-full bg-clinic-primary/10 h-3 rounded-full overflow-hidden mb-4 border border-clinic-primary/5">
          <div 
            className="bg-blue-500 h-full transition-all duration-500"
            style={{ width: `${waterPercentage}%` }}
          ></div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => onUpdateWater(waterLog.cups + 1)}
            disabled={waterLog.cups >= 16}
            className="flex-1 bg-clinic-bg border border-clinic-primary/20 hover:border-clinic-secondary text-clinic-charcoal hover:bg-clinic-secondary/5 font-extrabold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
          >
            <span>+</span> كوب ماء
          </button>
          <button 
            onClick={() => onUpdateWater(Math.max(waterLog.cups - 1, 0))}
            disabled={waterLog.cups <= 0}
            className="bg-clinic-bg border border-clinic-primary/10 text-clinic-primary hover:text-rose-600 font-extrabold py-2 px-3 rounded-xl text-xs transition-all"
          >
            مسح كوب
          </button>
        </div>

        {waterLog.cups >= patient.targetWaterCups && (
          <p className="text-[10px] text-emerald-600 text-center font-bold mt-2 animate-bounce flex items-center justify-center gap-1">
            ✨ مرحى! لقد حققت المعدل الموصى به لترطيب عضلاتك اليوم.
          </p>
        )}
      </div>

    </div>
  );
}
