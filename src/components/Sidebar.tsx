import React from "react";
import { 
  Dumbbell, 
  Apple, 
  ShoppingBag, 
  MessageSquare, 
  LineChart, 
  Flame, 
  Compass, 
  HeartHandshake, 
  FileText, 
  ShieldAlert,
  UserCheck,
  Droplet
} from "lucide-react";
import { Role } from "../types";

interface SidebarProps {
  currentRoom: string;
  setRoom: (room: string) => void;
  userRole: Role;
  setUserRole: (role: Role) => void;
  points: number;
  streak: number;
  level: string;
}

export default function Sidebar({ 
  currentRoom, 
  setRoom, 
  userRole, 
  setUserRole, 
  points, 
  streak,
  level 
}: SidebarProps) {
  const menuItems = [
    { id: "nutrition", label: "غرفة التغذية والوجبات", icon: Apple, color: "text-emerald-600" },
    { id: "sports", label: "الرياضة والتمارين المتسلسلة", icon: Dumbbell, color: "text-blue-600" },
    { id: "measurements", label: "قياساتي الأسبوعية ورسمي البياني", icon: LineChart, color: "text-violet-600" },
    { id: "shop", label: "متجر الأغذية والمكملات الصحية", icon: ShoppingBag, color: "text-amber-600" },
    { id: "chat", label: "المحادثة والاستشارة الطبية", icon: MessageSquare, color: "text-cyan-600" },
    { id: "consult", label: "الاستشارة الفورية السريعة", icon: Compass, color: "text-indigo-600" },
    { id: "rage", label: "غرفة تفريغ الغضب وضغوط الوزن", icon: HeartHandshake, color: "text-rose-600" },
    { id: "gallery", label: "معرض قصص النجاح (أحلامك واقع)", icon: Flame, color: "text-red-500" },
    { id: "report", label: "تقرير المتابعة الشهري والنتائج", icon: FileText, color: "text-slate-600" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-clinic-surface border-l border-clinic-primary/10 h-screen sticky top-0 shadow-lg justify-between select-none">
      <div className="p-6">
        {/* Clinic Branding */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-clinic-primary/10">
          <div className="w-12 h-12 rounded-2xl bg-clinic-secondary flex items-center justify-center shadow-md animate-pulse">
            <span className="font-serif text-white font-bold text-xl">S</span>
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-clinic-secondary leading-tight">Shyma Clinic</h1>
            <p className="text-xs text-clinic-primary font-medium">عيادة د. شيماء للتغذية العلاجية</p>
          </div>
        </div>

        {/* Level & Points Summary */}
        <div className="bg-clinic-bg rounded-2xl p-4 mb-6 border border-clinic-primary/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-clinic-primary font-bold">المستوى الحالي:</span>
            <span className="bg-clinic-secondary/10 text-clinic-secondary px-2 py-0.5 rounded-full text-xs font-bold">
              👑 {level}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold mb-1">
            <span>🔥 المجموع: {points} نقطة</span>
            <span>💧 السلسلة: {streak} أيام</span>
          </div>
          <div className="w-full bg-clinic-primary/10 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-clinic-secondary h-full transition-all duration-500"
              style={{ width: `${Math.min((points / 1000) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const IconComp = item.icon;
            const isActive = currentRoom === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setRoom(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? "bg-clinic-secondary text-white shadow-md shadow-clinic-secondary/20 scale-[1.02]" 
                    : "text-clinic-charcoal/80 hover:bg-clinic-primary/5 hover:text-clinic-charcoal"
                }`}
              >
                <IconComp className={`w-5 h-5 ${isActive ? "text-white" : item.color}`} />
                <span className="flex-1 truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Simulator Switch at the bottom */}
      <div className="p-4 border-t border-clinic-primary/10 bg-clinic-bg/40">
        <div className="flex flex-col gap-2 bg-clinic-surface p-3 rounded-2xl border border-clinic-primary/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-clinic-charcoal font-bold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-clinic-secondary" />
              محاكاة دور المستخدم:
            </span>
            <span className={`text-[10px] px-2 py-0.5 font-bold rounded-lg ${
              userRole === Role.ADMIN 
                ? "bg-amber-100 text-amber-800" 
                : "bg-emerald-100 text-emerald-800"
            }`}>
              {userRole === Role.ADMIN ? "د. شيماء" : "مريض عيادي"}
            </span>
          </div>
          <p className="text-[10px] text-clinic-primary/80 leading-relaxed mb-1">
            تبديل الوضع يسمح لك بفحص لوحة المريض الحقيقية أو لوحة الطبيبة لإدارة المرضى ومراجعة الوجبات والرد على الاستشارات.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setUserRole(Role.PATIENT);
                if (currentRoom === "admin") setRoom("nutrition");
              }}
              className={`flex-1 py-1 px-2 text-xs rounded-lg font-bold transition-all ${
                userRole === Role.PATIENT 
                  ? "bg-clinic-primary text-white" 
                  : "bg-clinic-bg text-clinic-charcoal hover:bg-clinic-primary/10"
              }`}
            >
              مريض
            </button>
            <button
              onClick={() => {
                setUserRole(Role.ADMIN);
                setRoom("admin");
              }}
              className={`flex-1 py-1 px-2 text-xs rounded-lg font-bold transition-all ${
                userRole === Role.ADMIN 
                  ? "bg-clinic-secondary text-white" 
                  : "bg-clinic-bg text-clinic-charcoal hover:bg-clinic-primary/10"
              }`}
            >
              د. شيماء
            </button>
          </div>
        </div>

        <div className="text-center mt-3">
          <p className="text-[10px] text-clinic-primary/60">عيادة التغذية العلاجية الذكية © 2026</p>
        </div>
      </div>
    </aside>
  );
}
