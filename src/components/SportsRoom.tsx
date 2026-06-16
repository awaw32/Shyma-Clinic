import React, { useState } from "react";
import { Dumbbell, Play, Lock, CheckCircle, Flame, Star, Trophy, ClipboardList, Plus } from "lucide-react";
import { ExerciseVideo, ExerciseProgress } from "../types";

interface SportsRoomProps {
  videos: ExerciseVideo[];
  progress: ExerciseProgress[];
  onCompleteVideo: (videoId: string, reward: number) => void;
  onAwardPoints: (points: number) => void;
}

export default function SportsRoom({ 
  videos, 
  progress, 
  onCompleteVideo, 
  onAwardPoints 
}: SportsRoomProps) {
  const [activeVideo, setActiveVideo] = useState<ExerciseVideo>(videos[0]);
  const [steps, setSteps] = useState<number | "">("");
  const [loggedSteps, setLoggedSteps] = useState<{ date: string; count: number }[]>([
    { date: "أمس", count: 8500 },
    { date: "قبل يومين", count: 10200 },
  ]);
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Checks if a video is unlocked
  const isVideoUnlocked = (video: ExerciseVideo) => {
    if (video.orderIndex === 1) return true;
    
    // Find the previous video
    const prevVideo = videos.find(v => v.orderIndex === video.orderIndex - 1);
    if (!prevVideo) return true;

    // Check if the previous video is in progress with completed = true
    return progress.some(p => p.videoId === prevVideo.id && p.completed);
  };

  // Checks if video is completed
  const isVideoCompleted = (videoId: string) => {
    return progress.some(p => p.videoId === videoId && p.completed);
  };

  const handleComplete = (video: ExerciseVideo) => {
    if (isVideoCompleted(video.id)) return;

    onCompleteVideo(video.id, video.pointsReward);
    setSuccessAnimation(true);
    setTimeout(() => setSuccessAnimation(false), 2500);
  };

  const handleAddSteps = (e: React.FormEvent) => {
    e.preventDefault();
    if (!steps || Number(steps) <= 0) return;

    const count = Number(steps);
    setLoggedSteps([{ date: "اليوم", count }, ...loggedSteps]);
    
    // Grant bonus points for walking! (1 point per 500 steps, rounded, max 20 pts)
    const points = Math.min(Math.round(count / 500), 20);
    if (points > 0) {
      onAwardPoints(points);
    }
    setSteps("");
  };

  const completedCount = progress.filter(p => p.completed).length;
  const currPercent = Math.round((completedCount / videos.length) * 100);

  return (
    <div className="bg-clinic-surface border border-clinic-primary/10 rounded-3xl p-6 md:p-8 shadow-md">
      
      {/* Title Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-clinic-primary/10">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
          <Dumbbell className="w-6 h-6 animate-spin-slow rotate-45" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-clinic-charcoal">غرفة الرياضة والتمارين المتسلسلة</h2>
          <p className="text-xs text-clinic-primary font-semibold">تأهيل رياضي متدرج لزيادة الكتلة العضلية ومضاعفة معدلات تفكيك الشحوم</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Video Screen Component (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active video card */}
          <div className="bg-white border border-clinic-primary/10 rounded-3xl overflow-hidden shadow-sm relative">
            
            {successAnimation && (
              <div className="absolute inset-0 bg-clinic-secondary/95 flex flex-col items-center justify-center text-center p-6 z-10 text-white animate-fade-in select-none">
                <Trophy className="w-16 h-16 text-clinic-accent animate-bounce mb-3" />
                <h3 className="text-lg font-black">أحسنت يا بطل! تم إنهاء التمرين الإجباري بنجاح! 🏆</h3>
                <p className="text-xs text-white/90 mt-1">حصلت على <span className="font-bold underline text-clinic-accent">+{activeVideo.pointsReward} نقطة رياضية</span> وتم كشف المستوى التالي في المنهج.</p>
              </div>
            )}

            {/* Embed player */}
            <div className="relative aspect-video bg-black">
              {isVideoUnlocked(activeVideo) ? (
                <iframe
                  src={activeVideo.videoUrl}
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-white/80 select-none">
                  <Lock className="w-14 h-14 text-clinic-secondary mb-3 animate-pulse" />
                  <p className="font-extrabold text-xs">يرجى فك التشفير عن هذا المقرر أولاً!</p>
                  <p className="text-[10px] text-white/50 max-w-sm mt-1">هذا التمرين متسلسل. يجب إكمال التمارين السابقة بالترتيب للحصول على التأهيل البدني الآمن دون إجهاد غير مبرر للأوتار.</p>
                </div>
              )}
            </div>

            {/* Video description */}
            <div className="p-5">
              <div className="flex justify-between items-start gap-4 flex-wrap mb-2">
                <div>
                  <span className="text-[10px] text-clinic-primary font-bold">التمرين النشط: ترتيب #{activeVideo.orderIndex}</span>
                  <h3 className="text-sm font-extrabold text-clinic-charcoal mt-0.5">{activeVideo.title}</h3>
                </div>
                <div className="bg-clinic-secondary/10 text-clinic-secondary px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> +{activeVideo.pointsReward} نقطة
                </div>
              </div>

              <p className="text-xs text-clinic-primary/95 leading-relaxed bg-clinic-bg/40 p-3 rounded-xl border border-clinic-primary/5 mb-4">
                {activeVideo.description}
              </p>

              {isVideoUnlocked(activeVideo) && (
                <div className="flex items-center justify-between border-t border-clinic-primary/5 pt-4">
                  {isVideoCompleted(activeVideo.id) ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 py-1.5 px-4 rounded-xl">
                      <CheckCircle className="w-4 h-4 fill-current text-emerald-500" /> لقد أنجزت هذا المقرر بنجاح ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => handleComplete(activeVideo)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      أنجزت هذا التمرين الإجباري بنجاح (+{activeVideo.pointsReward} نقطة)
                    </button>
                  )}
                  <span className="text-[10px] text-clinic-primary/60">يتطلب المتابعة الصادقة لنتائج طبية أسرع</span>
                </div>
              )}
            </div>

          </div>

          {/* Sequential Program Syllabus (Scrollable) */}
          <div className="bg-white border border-clinic-primary/10 p-5 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xs font-extrabold text-clinic-charcoal">منهج التمارين المتسلسلة (تأهيل د. شيماء)</h3>
                <p className="text-[9px] text-clinic-primary mt-0.5">أكمل لتفتح التمارين المتقدمة</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-clinic-secondary">{currPercent}% منجز</span>
                <div className="w-24 bg-clinic-primary/10 h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-clinic-secondary h-full" style={{ width: `${currPercent}%` }}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videos.map((vid) => {
                const isUnlocked = isVideoUnlocked(vid);
                const isCompleted = isVideoCompleted(vid.id);
                const isActive = activeVideo.id === vid.id;

                return (
                  <button
                    key={vid.id}
                    onClick={() => {
                      if (isUnlocked) setActiveVideo(vid);
                    }}
                    className={`p-3.5 rounded-xl border text-right transition-all flex items-start gap-3 relative ${
                      isActive 
                        ? "bg-clinic-primary/5 border-clinic-primary" 
                        : "bg-white border-clinic-primary/10 hover:border-clinic-primary/20"
                    } ${!isUnlocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isCompleted 
                        ? "bg-emerald-100 text-emerald-600" 
                        : !isUnlocked 
                          ? "bg-slate-100 text-slate-500" 
                          : "bg-clinic-secondary/10 text-clinic-secondary"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 fill-current" />
                      ) : !isUnlocked ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px] text-clinic-primary font-bold">المستوى #{vid.orderIndex}</span>
                        {isCompleted && <span className="text-[9px] text-emerald-600">تم الإكمال</span>}
                        {!isUnlocked && <span className="text-[9px] text-slate-500">مغلق</span>}
                      </div>
                      <p className="text-xs font-bold text-clinic-charcoal truncate">{vid.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Columns: Steps Counter & Presets Plans (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Steps logger */}
          <div className="bg-clinic-bg/40 p-5 rounded-3xl border border-clinic-primary/10">
            <h3 className="text-sm font-extrabold text-clinic-charcoal mb-0.5 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-clinic-secondary animate-pulse" />
              عداد الخطوات والحرق اليومي
            </h3>
            <p className="text-[10px] text-clinic-primary mb-3">سجل خطوات مشيك اليوم لتتحول لنقاط حقيقية!</p>

            <form onSubmit={handleAddSteps} className="space-y-3">
              <div>
                <input
                  type="number"
                  required
                  value={steps}
                  onChange={(e) => setSteps(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="مثال: 8500 خطوة"
                  className="w-full bg-white border border-clinic-primary/20 rounded-xl px-3 py-1.5 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary"
                />
              </div>

              <button
                type="submit"
                disabled={!steps || Number(steps) <= 0}
                className="w-full bg-clinic-secondary hover:bg-clinic-secondary/90 disabled:bg-clinic-primary/20 text-white font-bold py-1.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                سجل المشي واحصد النقاط
              </button>
            </form>

            <div className="mt-4 border-t border-clinic-primary/15 pt-3 space-y-2">
              <p className="text-[10px] text-clinic-charcoal font-bold">الخطوات المدونة حديثاً:</p>
              {loggedSteps.map((log, index) => {
                const burnCalories = Math.round(log.count * 0.04);
                return (
                  <div key={index} className="flex justify-between items-center text-xs font-medium bg-white p-2 rounded-lg border border-clinic-primary/5">
                    <span className="text-clinic-charcoal">{log.date}</span>
                    <span className="font-mono text-clinic-secondary font-black">{log.count.toLocaleString()} خطوة</span>
                    <span className="text-[9px] bg-amber-50 text-amber-800 px-1 rounded">🔥 {burnCalories} سعرة</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Text workout prescriptions */}
          <div className="bg-white border border-clinic-primary/10 p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-clinic-charcoal flex items-center gap-1.5 border-b border-clinic-primary/10 pb-2">
              <ClipboardList className="w-4 h-4 text-clinic-primary" />
              الخطة الرياضية التقليدية (د. شيماء)
            </h3>

            <div className="text-[11px] text-clinic-charcoal/90 leading-relaxed space-y-2.5">
              <div>
                <p className="font-extrabold text-clinic-secondary">1. المشي السريع (Cardio Outdoor)</p>
                <p className="text-clinic-primary">معدل 45 دقيقة يومياً بمقاومة تنفس عادية (يفضل بعد الوجبة الكبرى بساعتين لتقليل السكر).</p>
              </div>
              <div className="border-t border-clinic-primary/5 pt-2">
                <p className="font-extrabold text-clinic-secondary">2. تمارين المقاومة المنزلية (Strength)</p>
                <p className="text-clinic-primary">3 مرات أسبوعياً للبطن والساقين باستخدام وزن الجسم لمنع ترهل العضلات أثناء النحافة.</p>
              </div>
              <div className="border-t border-clinic-primary/5 pt-2">
                <p className="font-extrabold text-clinic-secondary">3. تمرين البطن المسطح المقترح (Vacuum)</p>
                <p className="text-clinic-primary">شفط جدار البطن للداخل لـ 20 ثانية أثناء التنفس المريح، يكرر 10 مرات صباحاً على الريق.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
