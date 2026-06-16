import React, { useState } from "react";
import { Flame, Star, Sparkles, Quote, Image, Trophy, ArrowRight, ArrowLeft } from "lucide-react";
import { SuccessStory } from "../types";

interface GalleryRoomProps {
  stories: SuccessStory[];
}

export default function GalleryRoom({ stories }: GalleryRoomProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userFuturePic, setUserFuturePic] = useState<string>("https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400");
  const [picInput, setPicInput] = useState("");

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const currentCase = stories[currentIndex];
  const weightLost = currentCase.beforeWeight - currentCase.afterWeight;

  const handleUpdateFuturePic = (e: React.FormEvent) => {
    e.preventDefault();
    if (picInput.trim()) {
      setUserFuturePic(picInput);
      setPicInput("");
    }
  };

  return (
    <div className="bg-clinic-surface border border-clinic-primary/10 rounded-3xl p-6 md:p-8 shadow-md">
      
      {/* Title Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-clinic-primary/10">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-inner">
          <Flame className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-clinic-charcoal">غرفة أحلامك واقع ومستقبل قادم</h2>
          <p className="text-xs text-clinic-primary font-semibold">استلهم وقود المضي بالتنمية البشرية والغذائية من بطولات حقيقية سخرناها لك</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* 1. Before & After Case Study Slider (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-clinic-primary/10 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center bg-clinic-bg/40 p-3 rounded-2xl border border-clinic-primary/5">
            <h3 className="text-xs font-black text-clinic-charcoal flex items-center gap-1">
              <Trophy className="w-4 h-4 text-clinic-accent" />
              قصة التحول البطلة الحائزة على التكريم الأكبر
            </h3>
            <div className="flex gap-1.5 select-none font-sans">
              <button onClick={handlePrev} className="bg-white hover:bg-clinic-primary/5 p-1.5 rounded-lg border border-clinic-primary/10 transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleNext} className="bg-white hover:bg-clinic-primary/5 p-1.5 rounded-lg border border-clinic-primary/10 transition-all">
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dynamic Comparison Panel */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Pictures comparison (md:col-span-5) */}
            <div className="md:col-span-5 grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-clinic-primary bg-clinic-bg border border-clinic-primary/10 font-bold block text-center py-1 rounded-lg">السابق (قبل)</span>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border">
                  <img 
                    src={currentCase.beforeUrl} 
                    alt="Before weight loss" 
                    className="w-full h-full object-cover filter brightness-[0.85] contrast-[0.9]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-center font-mono text-[10px] font-extrabold text-clinic-primary/80">{currentCase.beforeWeight} كجم</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-clinic-secondary bg-clinic-pink border border-clinic-secondary/15 font-bold block text-center py-1 rounded-lg">اللاحق (بعد) ✓</span>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-clinic-secondary">
                  <img 
                    src={currentCase.afterUrl} 
                    alt="After weight loss" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-center font-mono text-[10px] font-black text-clinic-secondary">{currentCase.afterWeight} كجم</p>
              </div>
            </div>

            {/* Stories Testimonial (md:col-span-7) */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-bold text-clinic-primary">البطلة الملهمة:</span>
                  <h4 className="text-sm font-extrabold text-clinic-charcoal">{currentCase.name}</h4>
                </div>
                <div className="bg-emerald-50 text-emerald-800 border-emerald-200 border py-1 px-3 rounded-full text-xs font-black flex items-center gap-1 animate-bounce">
                  🚩 خسارة: -{weightLost} كجم في {currentCase.durationMonths} أشهر
                </div>
              </div>

              <div className="bg-clinic-bg/25 border border-primary/5 rounded-2xl p-4 relative antialiased leading-relaxed text-xs text-clinic-charcoal">
                <Quote className="w-8 h-8 text-clinic-secondary/10 absolute -top-1 -right-1 fill-current" />
                <p className="relative z-10 italic">
                  "{currentCase.text}"
                </p>
              </div>

              <div className="flex gap-2">
                <span className="flex-1 bg-clinic-bg text-clinic-charcoal p-2.5 rounded-xl text-[10px] text-center font-bold border border-clinic-primary/10">
                  ⌛ معلّم الفترة: {currentCase.durationMonths} أشهر متواصلة
                </span>
                <span className="flex-1 bg-clinic-pink text-clinic-secondary p-2.5 rounded-xl text-[10px] text-center font-bold border border-clinic-secondary/10">
                  🧬 مؤشر الكتلة (BMI): انخفاض مثالي
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* 2. Future Vision Uplink Board (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-clinic-bg/40 p-5 rounded-3xl border border-clinic-primary/10 flex flex-col justify-between">
          
          <div>
            <h3 className="text-sm font-extrabold text-clinic-charcoal mb-0.5 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-clinic-accent" />
              لوحة أحلامي المستقبلية
            </h3>
            <p className="text-[10px] text-clinic-primary mb-3">الصورة التي ترغب في تجسيد جسدك وصحتك إليها قريباً!</p>

            {/* Inspiration pic frame */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-clinic-primary/15 bg-white relative mb-4">
              <img 
                src={userFuturePic} 
                alt="My future dream layout" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 right-2 bg-clinic-charcoal/80 text-white text-[9px] px-2.5 py-1 rounded-full font-bold backdrop-blur-sm">
                🎯 عازم على الوصول بالتأكيد
              </div>
            </div>

            {/* Mock pic setup form */}
            <form onSubmit={handleUpdateFuturePic} className="space-y-2">
              <label className="block text-[10px] font-bold text-clinic-charcoal">حدث صورة هدفك الملهم (رابط أو ملف محاكاة):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={picInput}
                  onChange={(e) => setPicInput(e.target.value)}
                  placeholder="ضع رابط صورة الرياضية هنا..."
                  className="flex-1 bg-white border border-clinic-primary/20 rounded-xl px-2.5 py-1.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-clinic-secondary font-mono"
                />
                <button
                  type="submit"
                  className="bg-clinic-primary hover:bg-clinic-primary-light text-white font-bold text-[10px] py-1.5 px-3 rounded-xl transition-all shrink-0"
                >
                  تعيين
                </button>
              </div>
            </form>
          </div>

          <p className="text-[10px] text-clinic-primary/60 border-t border-clinic-primary/10 pt-3 mt-4 leading-relaxed">
            * الدراسات العصبية تشير أن النظر اليومي لصورة جسد مثالي يبرز قرارات الحرق المتبعة دافعياً بمستويات حادة جداً ويسهل سد الـ Cravings.
          </p>

        </div>

      </div>

      {/* Grid gallery case collections */}
      <div>
        <h3 className="text-xs font-bold text-clinic-charcoal mb-4 flex items-center gap-1.5 select-none">
          <Star className="w-4 h-4 text-clinic-accent fill-current" />
          البطولات السابقة المدونة بمركز د. شيماء للتغذية
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stories.map((story, idx) => (
            <button
              onClick={() => setCurrentIndex(idx)}
              key={story.id}
              className={`p-4 bg-white border rounded-2xl text-right transition-all flex flex-col justify-between hover:scale-[1.01] ${
                currentIndex === idx 
                  ? "border-clinic-secondary bg-clinic-pink/10 ring-1 ring-clinic-secondary/20 shadow-md" 
                  : "border-clinic-primary/10 hover:border-clinic-primary/20 shadow-sm"
              }`}
            >
              <div>
                <span className="text-[9px] text-clinic-primary/60">البطلة #{idx + 1}</span>
                <h4 className="text-xs font-extrabold text-clinic-charcoal mt-0.5">{story.name}</h4>
                <p className="text-[10px] text-clinic-secondary mt-1 font-bold">خسارة وزن: -{story.beforeWeight - story.afterWeight} كجم</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-clinic-primary/5 flex justify-between items-center text-[9px] text-clinic-primary font-bold">
                <span>المدة: {story.durationMonths} أشهر قاسية</span>
                <span className="text-clinic-secondary/90 underline font-sans">معاينة كاملة 👁️</span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
