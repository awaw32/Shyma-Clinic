/**
 * Types and Interfaces for Shyma Nutrition Clinic
 */

export enum Role {
  ADMIN = "admin",
  PATIENT = "patient"
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
  points: number;
  streak: number;
  longestStreak: number;
  lastCheckinDate: string | null;
  targetWaterCups: number;
  weightGoal: number;
  joinedDate: string;
  level: string; // "جديد" | "برونزي" | "فضي" | "ذهبي"
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: "أغذية صحية" | "مكملات غذائية" | "عسل طبيعي" | "أعشاب علاجية";
  pointsReward: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface MealLog {
  id: string;
  patientId: string;
  date: string;
  type: MealType;
  description: string;
  calories: number;
  createdAt: string;
}

export interface WaterLog {
  date: string; // YYYY-MM-DD
  cups: number;
}

export interface MeasurementLog {
  id: string;
  patientId: string;
  weight: number;
  waist: number;
  hip: number;
  chest: number;
  arm: number;
  thigh: number;
  notes: string;
  photoUrl?: string;
  measuredAt: string; // YYYY-MM-DD
}

export interface ExerciseVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // youtube links or mock links
  pointsReward: number;
  orderIndex: number;
}

export interface ExerciseProgress {
  videoId: string;
  completed: boolean;
  completedAt: string;
}

export interface DietPlan {
  id: string;
  patientId: string;
  title: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  notes: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  text: string;
  createdAt: string;
  patientId: string; // always associated to a patient thread
}

export interface QuickConsult {
  id: string;
  patientId: string;
  patientName: string;
  question: string;
  category: string;
  answerByDoctor: string | null;
  status: "pending" | "answered";
  createdAt: string;
}

export interface SuccessStory {
  id: string;
  name: string;
  beforeUrl: string;
  afterUrl: string;
  beforeWeight: number;
  afterWeight: number;
  durationMonths: number;
  text: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  type: "chat" | "broadcast";
}

export interface DailyMotivation {
  id: string;
  message: string;
  sendHour: string;
  isActive: boolean;
}
