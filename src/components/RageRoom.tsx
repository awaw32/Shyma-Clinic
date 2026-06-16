import React, { useState } from "react";
import { HeartHandshake, HelpCircle, Send, Sparkles, Smile, MessageCircle } from "lucide-react";

interface RageRoomProps {
  onAwardPoints: (points: number) => void;
}

export default function RageRoom({ onAwardPoints }: RageRoomProps) {
  const [ventText, setVentText] = useState("");
  const [counselingReply, setCounselingReply] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [selectedFrustration, setSelectedFrustration] = useState("craving");

  const frustrations = [
    { id: "craving", label: " cravings الرغبة الشرسة في تناول طعام تخريبي" },
    { id: "plateau", label: "ثبات الوزن ومقاومة الجسم على الميزان" },
    { id: "exhausted", label: "الإجهاد اليومي والتعب من العادات الصارمة" },
    { id: "guilt", label: "الشعور بالذنب وجلد الذات لتناول وجبة خاطئة" },
  ];

  const doctorResponses: Record<string, string[]> = {
    craving: [
      "يا بطل، أنا أتفهم هذه الرغبة الملحة تماماً! تذكر أن الرغبة (Craving) هي موجة كيميائية قوية تستقر في عقلك لـ 15 دقيقة فقط ثم تتلاشى. جرب الآن شرب كوبين من الماء البارد، وقم بمضع علكة خالية من السكر أو تناول حبتين من اللوز من متجرنا لتشغل حاسة التذوق لديك. أنت أقوى من لقمة زائلة تسرق تعبك وأنا أثق بوعيك الكامل!",
      "عندما تشتهي السكريات، فجسمك يطلب طاقة سريعة أو هرمون السعادة. جرب بدلاً عن ذلك ملعقة عسل سدر كشميري طبيعي من متجر العيادة لرفع السكر بمعدل آمن، أو شرب كوب كاكاو خام محلى بظرف ستيفيا. تنفس بعمق 5 مرات، واملأ رئتيك بالأوكسجين بدلاً من السعرات وجلد الذات الحزين."
    ],
    plateau: [
      "ثبات الميزان هو مجرد استراحة محارب ذكية لجسمك! جسمك يعيد توزيع السوائل وبناء الكتلة العضلية رداً على تمرينك. القياس في عيادتنا بالمازورة وصورة المرآة والملابس هو الفيصل الفعلي، وليس الرقم الصامت على الحديد. استمر على الخطة الغذائية، وسيكسر جسمك هذا الثبات العابر قريباً جداً، ثق بالرحلة!",
      "هل تعلم أن نقص شرب الماء يزيد من احتباس السوائل بالجسم ويبطئ حرق الدهون؟ لا تقلق من الميزان هذا الأسبوع. اهتم بزيادة حركتك اليومية بـ 2000 خطوة، وأكثر من شرب الماء لـ 10 أكواب لتصريف السوائل المخزنة. ثق بصبرك وتعبك الشريف."
    ],
    exhausted: [
      "خذ نفساً عميقاً، وارخِ كتفيك. في عيادتي، لا نؤمن بالتعذيب الصارم، بل بالتغذية كنمط حياة هادئ ومريح. إذا كنت مجهداً اليوم، فتخطى تمرين الكارديو المكثف واكتفِ بتمارين الإطالة والستريتشنغ في غرفة الرياضة، واستمتع بنوم مبكر لـ 7 ساعات متواصلة لإعادة توازن هرمون الكورتيزول المسؤول عن الحرق.",
      "الحياة ليست سباق ماراتون عنيفاً، بل هي خطوات رفق ولين. لا بأس بالشعور بالتعب، خذ قسطاً من الاستراحة اليوم، واطبخ وجبتك التغذوية بطهو هادئ، واقرأ في قصص النجاح لتستلهم طاقتك. دمت عظيماً."
    ],
    guilt: [
      "لا تقم بجلد ذاتك أبداً! تناول وجبة خارج النظام ليس فشلاً بل هو عثرة عادية وجزء كامل من الرحلة الطبيعية. ما يدمّر التعب ليس الوجبة الخاطئة نفسها، بل سلوك الاستسلام الذي يليها ككرة الثلج. انس وجبتك الفائتة فوراً، وابدأ وجبتك القادمة الآن كشخص سليم ممتلئ وعياً ورعاية.",
      "الجسم البشري معجزة حيوية لا تدمره وجبة واحدة! تعامل مع الأمر بذكاء: زد خطواتك اليوم بـ 3000 خطوة إضافية، واشرب كوب زنجبيل دافئ بالليمون، ثم عد للالتزام بصلابة. لقد كسبت اليوم درساً ثميناً، والعيادة تفتح ذراعيها دائماً للبدء من جديد."
    ]
  };

  const handleVentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ventText.trim()) return;

    setIsAnswering(true);
    setCounselingReply(null);

    // Get response from doctor responses
    const responses = doctorResponses[selectedFrustration] || doctorResponses.craving;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    setTimeout(() => {
      setCounselingReply(randomResponse);
      setIsAnswering(false);
      onAwardPoints(15); // Reward points for emotional tracking/self-care reflection
      setVentText("");
    }, 1200);
  };

  return (
    <div className="bg-clinic-surface border border-clinic-primary/10 rounded-3xl p-6 md:p-8 shadow-md">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-clinic-primary/10">
        <div className="w-12 h-12 bg-rose-50 text-clinic-secondary rounded-2xl flex items-center justify-center shadow-inner">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-clinic-charcoal">غرفة تفريغ الغضب وضغوط الوزن</h2>
          <p className="text-xs text-clinic-primary font-semibold">مساحة آمنة وسرية تماماً لتفريغ توترك وشهيتك والحصول على استشارات الطبيبة الفورية</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left side: Guide & Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-clinic-bg/60 rounded-2xl p-4 text-xs text-clinic-charcoal/90 leading-relaxed border border-clinic-primary/5">
            <span className="font-extrabold text-clinic-secondary block mb-1">💡 كيف تساعدك هذه الغرفة؟</span>
            عندما تمر بيوم شاق، أو تشتهي بشدة كسر الحمية وتناول السكريات أو الوجبات السريعة الضارة، لا تستسلم! افرغ مشاعرك الحانقة أو رغبتك العابرة هنا في صندوق التنفيس. ذكاء الطبيبة الافتراضي سيحلل حالتك الذهنية ويدعمك فوراً ببدائل غذائية ملهمة ومهدئة للوزن لتعود لطريقك القوي.
          </div>

          <form onSubmit={handleVentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-clinic-charcoal mb-2">1. ما الذي يضايقك أو تشتهيه الآن بشدة؟</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {frustrations.map((frust) => (
                  <button
                    type="button"
                    key={frust.id}
                    onClick={() => setSelectedFrustration(frust.id)}
                    className={`px-3 py-2.5 rounded-xl text-right text-xs transition-all border ${
                      selectedFrustration === frust.id 
                        ? "bg-clinic-secondary text-white border-clinic-secondary font-bold shadow-sm" 
                        : "bg-white text-clinic-charcoal/80 border-clinic-primary/15 hover:bg-clinic-bg"
                    }`}
                  >
                    {frust.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-clinic-charcoal mb-2">2. اكتب مشاعرك أو فكرتك الغاضبة بكل صراحة وشفافية:</label>
              <textarea
                value={ventText}
                onChange={(e) => setVentText(e.target.value)}
                placeholder="مثال: أشعر بإحباط كبير من الميزان هذا الأسبوع، أريد تناول برجر دبل تشيز مع بطاطس مقلية وحلوى الشوكولاتة فوراً أو التوقف عن الدايت..."
                rows={4}
                className="w-full bg-white border border-clinic-primary/20 rounded-2xl p-4 text-sm text-clinic-charcoal focus:outline-none focus:ring-2 focus:ring-clinic-secondary/40 placeholder-clinic-primary/40 leading-relaxed resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isAnswering || !ventText.trim()}
              className="w-full bg-clinic-secondary hover:bg-clinic-secondary/90 disabled:bg-clinic-primary/30 text-white font-bold py-3 px-6 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              افرغ شحنتي الآن واحصل على دعم د. شيماء (+15 نقطة وعي)
            </button>
          </form>
        </div>

        {/* Right side: Interactive Doctor Advice */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full bg-clinic-bg/40 rounded-3xl p-6 border border-clinic-primary/10 relative overflow-hidden">
          
          {/* Avatar Area */}
          <div className="relative flex flex-col items-center text-center p-3">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300" // Premium looking female doctor representative
                  alt="Dr. Shyma" 
                  className="w-full h-full object-cover grayscale-0"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-clinic-secondary text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="text-sm font-extrabold text-clinic-charcoal">معالجة الطوارئ الافتراضية</h3>
            <p className="text-[10px] text-clinic-secondary font-bold">بصوت ورؤية الدكتورة شيماء</p>
          </div>

          {/* Reply Area */}
          <div className="flex-1 my-6 flex flex-col justify-center">
            {isAnswering ? (
              <div className="flex flex-col items-center justify-center text-center py-8 space-y-3">
                <div className="flex justify-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-clinic-secondary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2.5 h-2.5 bg-clinic-secondary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2.5 h-2.5 bg-clinic-secondary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                <p className="text-xs text-clinic-primary font-bold animate-pulse">الدكتورة شيماء تحلل مشاعرك وتصيغ لك رداً طبياً حكيماً...</p>
              </div>
            ) : counselingReply ? (
              <div className="bg-white rounded-2xl p-5 border border-clinic-primary/15 shadow-sm animate-fade-in text-right">
                <div className="flex items-center gap-1 mb-2 text-clinic-secondary">
                  <Smile className="w-4 h-4" />
                  <span className="text-xs font-bold">رسالة دعم من الدكتورة:</span>
                </div>
                <p className="text-xs text-clinic-charcoal leading-relaxed whitespace-pre-line">
                  {counselingReply}
                </p>
                <div className="mt-4 pt-3 border-t border-clinic-primary/10 flex justify-between items-center text-[10px] text-clinic-primary font-bold">
                  <span>تم منحك 15 نقطة وعي عاطفي</span>
                  <span className="text-emerald-600">نشط الآن 🟢</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10 px-4 text-clinic-primary/60">
                <MessageCircle className="w-10 h-10 stroke-[1.5] mb-2 text-clinic-primary/40" />
                <p className="text-xs leading-relaxed">لم تقم بكتابة أي تشنجات أو غضب بعد.</p>
                <p className="text-[10px] mt-1">اكتب ما تفكر به لمقاومة شهيتك وسنساعدك فوراً!</p>
              </div>
            )}
          </div>

          {/* Bottom encouragement banner */}
          <div className="text-center">
            <span className="inline-block text-[10px] text-clinic-charcoal/60 bg-white/60 py-1 px-3 rounded-full border border-clinic-primary/5">
              ⚖️ صحتك النفسية والعصبية هي عماد حرق الدهون السليم
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
