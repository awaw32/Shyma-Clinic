import React from "react";
import { 
  Apple, 
  Dumbbell, 
  ShoppingBag, 
  MessageSquare,
  Home,
  UserCheck
} from "lucide-react";
import { Role } from "../types";

interface BottomNavBarProps {
  currentRoom: string;
  setRoom: (room: string) => void;
  userRole: Role;
  setUserRole: (role: Role) => void;
}

export default function BottomNavBar({ 
  currentRoom, 
  setRoom, 
  userRole, 
  setUserRole 
}: BottomNavBarProps) {
  
  const navItems = [
    { id: "nutrition", label: "نظامي", icon: Apple },
    { id: "sports", label: "الرياضة", icon: Dumbbell },
    { id: "shop", label: "المتجر", icon: ShoppingBag },
    { id: "chat", label: "استشارة", icon: MessageSquare },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-clinic-surface border-t border-clinic-primary/10 shadow-[0_-4px_16px_rgba(114,86,76,0.06)] px-4 py-2 flex justify-around items-center select-none pb-safe">
      
      {/* Home shortcut */}
      <button 
        onClick={() => setRoom("nutrition")}
        className={`flex flex-col items-center justify-center p-2 min-w-14 rounded-xl transition-all ${
          currentRoom === "nutrition" || currentRoom === "general" 
            ? "text-clinic-secondary font-bold scale-105" 
            : "text-clinic-charcoal/60"
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">الرئيسية</span>
      </button>

      {navItems.map((item) => {
        const IconComp = item.icon;
        const isActive = currentRoom === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setRoom(item.id)}
            className={`flex flex-col items-center justify-center p-2 min-w-14 rounded-xl transition-all ${
              isActive 
                ? "text-clinic-secondary font-bold scale-105" 
                : "text-clinic-charcoal/60"
            }`}
          >
            <IconComp className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}

      {/* Admin Simulator Toggle for Quick Testing on Mobile */}
      <button
        onClick={() => {
          if (userRole === Role.PATIENT) {
            setUserRole(Role.ADMIN);
            setRoom("admin");
          } else {
            setUserRole(Role.PATIENT);
            setRoom("nutrition");
          }
        }}
        className={`flex flex-col items-center justify-center p-2 min-w-14 rounded-xl transition-all ${
          currentRoom === "admin" 
            ? "text-amber-600 font-bold scale-105" 
            : "text-clinic-charcoal/40"
        }`}
      >
        <UserCheck className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">
          {userRole === Role.ADMIN ? "الطبيبة" : "محاكاة"}
        </span>
      </button>

    </div>
  );
}
