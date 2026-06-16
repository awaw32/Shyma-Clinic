import React, { useState } from "react";
import { MessageSquare, Compass, Send, HelpCircle, CheckCircle, Clock, Sparkles, Smile, ShieldAlert } from "lucide-react";
import { ChatMessage, QuickConsult, Role } from "../types";

interface ChatAndConsultProps {
  chatMessages: ChatMessage[];
  consultations: QuickConsult[];
  userRole: Role;
  patientId: string;
  patientName: string;
  onSendChatMessage: (text: string) => void;
  onPostConsultation: (question: string, cat: string) => void;
}

export default function ChatAndConsult({
  chatMessages,
  consultations,
  userRole,
  patientId,
  patientName,
  onSendChatMessage,
  onPostConsultation,
}: ChatAndConsultProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "consult">("chat");
  const [msgInput, setMsgInput] = useState("");
  const [consultText, setConsultText] = useState("");
  const [consultCategory, setConsultCategory] = useState("عادات التغذية وتفتيت الدهون");

  const handleSendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    onSendChatMessage(msgInput);
    setMsgInput("");
  };

  const handlePostConsult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultText.trim()) return;

    onPostConsultation(consultText, consultCategory);
    setConsultText("");
  };

  const consultCategories = [
    "عادات التغذية وتفتيت الدهون",
    "توقيت النوم وهرمونات الحرق",
    "الرياضة النسائية وشد الترهلات",
    "المكملات العذائية والأمراض المزمنة",
  ];

  return (
    <div className="bg-clinic-surface border border-clinic-primary/10 rounded-3xl p-6 md:p-8 shadow-md">
      
      {/* Title Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-clinic-primary/10">
        <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center shadow-inner">
          <MessageSquare className="w-6 h-6 animate-float" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-clinic-charcoal">غرفة المحادثات والاستشارة الطبية</h2>
          <p className="text-xs text-clinic-primary font-semibold">تواصل مباشر مشفر مع الدكتورة شيماء لمراجعة فحوصاتك وضمان الحرق الصحي وآمن</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-clinic-primary/10 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("chat")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === "chat" 
              ? "border-clinic-secondary text-clinic-secondary font-black" 
              : "border-transparent text-clinic-charcoal/60 hover:text-clinic-charcoal"
          }`}
        >
          💬 المحادثة والملف المشفر المباشر
        </button>
        <button
          onClick={() => setActiveTab("consult")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === "consult" 
              ? "border-clinic-secondary text-clinic-secondary font-black" 
              : "border-transparent text-clinic-charcoal/60 hover:text-clinic-charcoal"
          }`}
        >
          🧭 عيادة الاستشارات الفورية السريعة
        </button>
      </div>

      {activeTab === "chat" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main chat box (lg:col-span-8) */}
          <div className="lg:col-span-8 flex flex-col h-[480px] bg-white border border-clinic-primary/10 rounded-2xl overflow-hidden shadow-inner">
            
            {/* Header info */}
            <div className="bg-clinic-bg/40 border-b border-clinic-primary/10 p-3 flex justify-between items-center select-none">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full overflow-hidden border">
                  <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200" alt="Doctor profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-clinic-charcoal">د. شيماء تغذية علاجية</h4>
                  <p className="text-[9px] text-emerald-600 font-bold">نشطة لتلقي رسائل المتابعة 🟢</p>
                </div>
              </div>
              <span className="text-[9px] bg-clinic-secondary/10 text-clinic-secondary px-2 py-0.5 rounded-full font-bold">
                قفل حماية معتمد عيادياً ✓
              </span>
            </div>

            {/* Messages body list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-clinic-bg/5 scroll-smooth">
              {chatMessages.length === 0 ? (
                <div className="text-center py-20 text-clinic-primary">لا يوجد رسائل محادثة سابقة. عيادة التغذية تفتح دافع العزم!</div>
              ) : (
                chatMessages.map((msg) => {
                  const isDoctor = msg.senderRole === Role.ADMIN;
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex gap-2.5 max-w-[85%] ${
                        isDoctor ? "mr-0 ml-auto flex-row" : "mr-auto ml-0 flex-row-reverse"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-clinic-bg/45 border font-serif text-clinic-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                        {isDoctor ? "S" : "P"}
                      </div>
                      
                      {/* Message bubble */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[9px] text-clinic-primary">
                          <span className="font-bold">{msg.senderName}</span>
                          <span>•</span>
                          <span className="font-mono">{new Date(msg.createdAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isDoctor 
                            ? "bg-clinic-secondary text-white rounded-tr-none shadow-sm" 
                            : "bg-clinic-primary text-white rounded-tl-none shadow-sm"
                        }`}>
                          <p className="whitespace-pre-line">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message composer input bar */}
            <form onSubmit={handleSendMsg} className="p-3 border-t border-clinic-primary/10 bg-white flex gap-2">
              <input
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="اكتب رسالتك أو استفسارك الغذائي المباشر هنا للدكتورة شيماء..."
                className="flex-1 bg-clinic-bg/50 border border-clinic-primary/15 px-4 py-2 rounded-xl text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary placeholder-clinic-primary/45"
              />
              <button
                type="submit"
                disabled={!msgInput.trim()}
                className="bg-clinic-secondary hover:bg-clinic-secondary/90 disabled:bg-clinic-primary/30 text-white w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-md"
              >
                <Send className="w-4 h-4 transform rotate-180" />
              </button>
            </form>

          </div>

          {/* Right features pane (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-clinic-bg/40 p-5 rounded-3xl border border-clinic-primary/10">
              <h3 className="text-xs font-black text-clinic-charcoal mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-clinic-accent" />
                تحليل الفحوصات والتحاليل الطبية
              </h3>
              <p className="text-[10px] text-clinic-primary leading-relaxed mb-4">
                في عيادتنا الخاصة، تحرص د. شيماء على تفنيد تحاليل الغدة الدرقية، مقاومة الأنسولين، وفيتامين د3 لتلافي تثبيط الحرق. من فضلك اكتب نتائج تحليلك في الشات المباشر أو ارفعها بصيغة نصية لتقوم الطبيبة بتقديم تقرير مفصل عنها.
              </p>

              {/* simulated files upload */}
              <div className="border border-dashed border-clinic-primary/30 p-4 rounded-xl text-center cursor-pointer bg-white/60 hover:bg-clinic-primary/5 transition-all">
                <HelpCircle className="w-8 h-8 text-clinic-primary/40 mx-auto mb-1 animate-pulse" />
                <span className="text-[10px] text-clinic-charcoal font-black block">محاكاة إرفاق ملف تحليلي (PDF / JPG)</span>
                <span className="text-[8px] text-clinic-primary/60 mt-0.5 block">ملف الغدة أو فيتامين د للمراجعة</span>
              </div>
            </div>

            <div className="bg-clinic-pink border border-clinic-secondary/15 rounded-2xl p-4 text-[10px] text-clinic-secondary font-bold space-y-1.5">
              <div className="flex items-center gap-1">
                <Smile className="w-4 h-4" />
                <span>إشعار الطبيبة المعتمد:</span>
              </div>
              <p className="leading-relaxed">
                تقوم الدكتورة شيماء بمراجعة محادثات وعيادات جميع ملفات المرضى مرتين يومياً (الفترة الصباحية والمسائية)، وستتلقى إشعاراً فورياً هنا في صفحتك فور إفادتها أو كتابة ردها.
              </p>
            </div>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Post custom quick consult card (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-clinic-bg/40 p-5 rounded-3xl border border-clinic-primary/10 h-fit">
            <h3 className="text-sm font-extrabold text-clinic-charcoal mb-1 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-clinic-secondary" />
              أرسل استشارة سريعة حائطة
            </h3>
            <p className="text-[10px] text-clinic-primary mb-4 leading-relaxed">
              هذه العيادة لاستشارة طارئة سريعة حول المأكولات وحياتك اليومية لتتلقى رداً طبيًا حاسماً يعرضه باقي زملاؤك في العيادة.
            </p>

            <form onSubmit={handlePostConsult} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">حدد تصنيف استشارتك:</label>
                <select
                  value={consultCategory}
                  onChange={(e) => setConsultCategory(e.target.value)}
                  className="w-full bg-white border border-clinic-primary/20 rounded-xl px-2.5 py-1.5 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary"
                >
                  {consultCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-clinic-charcoal mb-1">اكتب سؤالك بوضوح وتفصيل:</label>
                <textarea
                  value={consultText}
                  onChange={(e) => setConsultText(e.target.value)}
                  placeholder="مثال: هل تناول ثمرة ثوم مقشر على الريق يسبب مشاكل للقولون ويبطئ حرق الكيتو جينيك سيسستم؟"
                  rows={4}
                  className="w-full bg-white border border-clinic-primary/20 rounded-xl p-3 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary placeholder-clinic-primary/30 resize-none leading-relaxed"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={!consultText.trim()}
                className="w-full bg-clinic-secondary hover:bg-clinic-secondary/90 disabled:bg-clinic-primary/25 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
              >
                <Send className="w-4 h-4" />
                انشر سؤالي الفوري للطبيبة
              </button>
            </form>
          </div>

          {/* List of consultations (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-bold text-clinic-charcoal mb-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-500 fill-current" />
              الاستشارات الطبية المحلولة والمعلقة العيادية
            </h3>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {consultations.map((consult) => (
                <div key={consult.id} className="bg-white border border-clinic-primary/10 rounded-2xl p-4 shadow-sm space-y-3 animate-fade-in text-right">
                  
                  {/* Category + Status */}
                  <div className="flex justify-between items-center bg-clinic-bg/30 p-2 rounded-xl">
                    <span className="text-[10px] font-black text-clinic-primary bg-white px-2 py-0.5 rounded-md border border-clinic-primary/5">
                      🏷️ {consult.category}
                    </span>
                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      consult.status === "answered" 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-150 border" 
                        : "bg-amber-50 text-amber-850 border-amber-100 border animate-pulse"
                    }`}>
                      {consult.status === "answered" ? (
                        <>✓ تم الإفادة والحل</>
                      ) : (
                        <>⏳ بانتظار تصديق الدكتورة</>
                      )}
                    </span>
                  </div>

                  {/* Question */}
                  <div>
                    <span className="text-[10px] text-clinic-primary font-bold">الاستفسار المطروح:</span>
                    <p className="text-xs font-extrabold text-clinic-charcoal leading-relaxed mt-0.5">
                      "{consult.question}"
                    </p>
                  </div>

                  {/* Answer (if answered) */}
                  {consult.answerByDoctor ? (
                    <div className="bg-clinic-pink text-clinic-charcoal/90 border-r-4 border-clinic-secondary p-3.5 rounded-l-xl rounded-r-sm text-xs leading-relaxed space-y-1">
                      <div className="flex items-center gap-1 text-clinic-secondary text-[11px] font-black">
                        <Smile className="w-4 h-4 fill-current text-white bg-clinic-secondary rounded-full" />
                        <span>إفادة الدكتورة شيماء الطبية:</span>
                      </div>
                      <p className="whitespace-pre-line font-medium text-clinic-charcoal">
                        {consult.answerByDoctor}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 text-slate-500 p-3 rounded-xl border border-dashed text-center text-[10px] font-bold">
                      ⏳ السؤال قيد التحليل والدراسة من الدكتورة شيماء، تفقد الصندوق لاحقاً.
                    </div>
                  )}

                  <div className="text-[9px] text-clinic-primary/50 text-left">
                    طرح بواسطة: {consult.patientName} • {new Date(consult.createdAt).toLocaleDateString("ar-EG")}
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
