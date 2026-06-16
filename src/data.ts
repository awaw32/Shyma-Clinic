import { Product, ExerciseVideo, SuccessStory, DietPlan, ChatMessage, Role, QuickConsult, Patient } from "./types";

// Starter Products representing Dr. Shyma's Boutique Healthy Shop
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "عسل سدر كشميري طبيعي (عضوي 100%)",
    price: 350,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400",
    description: "عسل نحل جبلي فاخر لتقوية المناعة وتوفير مضادات الأكسدة الهامة في برامج التغذية.",
    category: "عسل طبيعي",
    pointsReward: 35
  },
  {
    id: "prod-2",
    name: "شاي أخضر للتنحيف بخلطة الأعشاب الطبيعية",
    price: 95,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400",
    description: "مزيج فريد من الأعشاب الطبية التي تحفز حرق الدهون وتنظّم عملية الهضم والامتصاص.",
    category: "أعشاب علاجية",
    pointsReward: 10
  },
  {
    id: "prod-3",
    name: "مكمل الأوميغا 3 النقي عالي الكثافة (60 كبسولة)",
    price: 220,
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&q=80&w=400",
    description: "أحماض دهنية أوميغا 3 مكررة لتدعيم صحة القلب والشرايين وخسارة الوزن الصحية.",
    category: "مكملات غذائية",
    pointsReward: 25
  },
  {
    id: "prod-4",
    name: "شوفان عضوي خالي من الغلوتين عالي الألياف",
    price: 65,
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&q=80&w=400",
    description: "شوفان ممتاز محضر خصيصاً لوجبات الإفطار وسد الشهية لفترات طويلة.",
    category: "أغذية صحية",
    pointsReward: 5
  },
  {
    id: "prod-5",
    name: "نخالة القمح الطبيعية الغنية بالسيليوم وبذور الكتان",
    price: 80,
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&q=80&w=400",
    description: "تعتبر ممتازة للمخبوزات الصحية والدايت السريع لمن يعانون من بطء الحرق والقولون العصبي.",
    category: "أغذية صحية",
    pointsReward: 8
  },
  {
    id: "prod-6",
    name: "كبسولات المغنيسيوم سترات المهدئة للعضلات والمساعدة على النوم",
    price: 180,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400",
    description: "تخفف تشنج العضلات المترتب على المجهود الرياضي الشديد وتساعد على تحفيز الاستشفاء العضلي الهادئ.",
    category: "مكملات غذائية",
    pointsReward: 15
  }
];

// Exercise Videos corresponding directly to sequential sports journey program
export const INITIAL_VIDEOS: ExerciseVideo[] = [
  {
    id: "video-1",
    title: "تمارين الإحماء وتنشيط الدورة الدموية (المستوى المبتدئ)",
    description: "فيديو تأهيلي بسيط مدته 10 دقائق لتهيئة عضلات الجسم وحمايتها من الإصابات وتنشيط الحرق.",
    videoUrl: "https://www.youtube.com/embed/gC_L9_DM_YI", // General Cardio Cardio Warmup
    pointsReward: 20,
    orderIndex: 1
  },
  {
    id: "video-2",
    title: "كارديو حرق الدهون عالي الكثافة (HIIT Core Workout)",
    description: "جلسة كارديو مكثفة لتفتيت السعرات الزائدة في فترات قصيرة وتحسين كفاءة التنفس.",
    videoUrl: "https://www.youtube.com/embed/ml6cT4AZdqI", // HIIT workout
    pointsReward: 35,
    orderIndex: 2
  },
  {
    id: "video-3",
    title: "تمارين تنحيف البطن وشد الترهلات البطنية",
    description: "أقوى حركات استهداف دهون الأحشاء لتقوية جدار المعدة والحصول على بطن مشدود.",
    videoUrl: "https://www.youtube.com/embed/1f8yoYTJy_g", // Abs workout
    pointsReward: 40,
    orderIndex: 3
  },
  {
    id: "video-4",
    title: "ستريتشنغ وإطالة لمرونة الجسم وتخفيف الإجهاد العضلي",
    description: "تمارين إطالة هادئة بعد الانتهاء من التمارين الشديدة للمحافظة على الارتخاء وتدفق الدورة الدموية.",
    videoUrl: "https://www.youtube.com/embed/g_tea8ZNk5A", // Full body stretch
    pointsReward: 25,
    orderIndex: 4
  }
];

// Real-case Inspired Success Stories by Dr. Shyma's clients
export const INITIAL_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: "story-1",
    name: "منى الأحمد",
    beforeUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    afterUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    beforeWeight: 98,
    afterWeight: 66,
    durationMonths: 6,
    text: "فقدت 32 كيلوجراماً من وزني الزائد مع د. شيماء بفضل نظام الصيام المتقطع المرن والمستمر. لم أشعر بالجوع أو الحرمان، واستعدت حيويتي وشغفي للحياة! بفضل المتابعة اليومية الرائعة تغيرت عادتي الغذائية بالكامل."
  },
  {
    id: "story-2",
    name: "أحمد عبد الله",
    beforeUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    afterUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    beforeWeight: 115,
    afterWeight: 82,
    durationMonths: 8,
    text: "كنت أعاني من مقاومة الأنسولين والكبد الدهني. الدكتورة شيماء صممت لي نظام تغذية قليل الكربوهيدرات (لو كارب) وعالجت المشاكل الطبية قبل الوزن. الفحوصات الطبية الآن ممتازة والوزن مثالي."
  },
  {
    id: "story-3",
    name: "فاطمة عسيري",
    beforeUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    afterUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400",
    beforeWeight: 89,
    afterWeight: 63,
    durationMonths: 5,
    text: "بعد فترات الرضاعة والولادة المتكررة، ساعدتني الدكتورة شيماء في وضع خطة مخصصة لشفاء جسمي دون التأثير على طبيعة التغذية، خسرت الوزن الزائد و تخلصت من السيلوليت تماماً برياضة ونظام غذائي دقيق."
  }
];

export const INITIAL_DIET_PLAN: DietPlan[] = [
  {
    id: "diet-1",
    patientId: "patient-1",
    title: "نظام التخسيس الأسبوعي المتوازن - قليل النشويات (لو كارب)",
    breakfast: "بيضة مسلوقة كاملة + بياض بيضتين + 1/2 حبة أفوكادو صغيرة + جرجير وطماطم بكمية مفتوحة + ثلث رغيف أسمر شعير.",
    lunch: "200 جرام صدر دجاج مشوي متبل بخل التفاح والليمون + طبق سلطة خضراء كبير يحتوي على ملعقة زيت زيتون بكر + 5 ملاعق أرز بني ريزو.",
    dinner: "كوب زبادي يوناني بنصف ملعقة قرفة + حبة خيار + 10 حبات من اللوز النيئ لمنع الجوع الليلي.",
    snacks: "شريحة تفاح أخضر مع ملعقة زبدة فول سوداني طبيعية (خالية من السكر والزيوت المهدرجة) + كوب شاي أخضر للتنحيف من المتجر.",
    notes: "يجب شرب كوب ماء قبل كل وجبة بربع ساعة كحد أدنى. تجنب تماماً السكر المضاف والمقليات واستبدلها بالطهي في المقلاة الهوائية.",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "msg-1",
    senderId: "doctor",
    senderName: "د. شيماء تغذية علاجية",
    senderRole: Role.ADMIN,
    text: "أهلاً بك يا بطل في عيادتنا الخاصة! رحلتك تبدأ بخطوة، وأنا معك في كل ثانية لتصل لوزنك وجسمك الصحي المثالي. من فضلك أدخل قياساتك الأسبوعية في غرفة القياسات، وتابع الماء والوجبات يومياً.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    patientId: "patient-1"
  }
];

export const INITIAL_QUICK_CONSULT: QuickConsult[] = [
  {
    id: "qc-1",
    patientId: "patient-1",
    patientName: "المريض المثالي",
    question: "دكتورة، هل البدائل الخالية من الغلوتين تساهم بشكل أسرع في حرق دهون البطن عن غيرها؟",
    category: "عادات التغذية وتفتيت الدهون",
    answerByDoctor: "أهلاً بك، الغلوتين نفسه لا يمنع الحرق إلا لشخص لديه حساسية قمح (Coeliac). ولكن عادتاً البدائل العضوية الخالية من الغلوتين مثل نخالة الشوفان والسيليوم المعروضة بمتجرنا تحتوي على ألياف كثيفة جداً تؤدي لامتلاء المعدة وتأخير تفريغ الطعام، مما يعطي إحساساً كافياً بالشبع وبالتالي حرق البطن تلقائياً.",
    status: "answered",
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export const INITIAL_MOTIVATIONS = [
  "إن تتبع تقدمك اليومي يمنحك القوة للوقوف ضد مغريات الطعام المؤذية.",
  "الطعام الصحي ليس حرماناً، هو تعبير نبيل عن حب الذات والتقدير لجسدك.",
  "كل كوب ماء تشربه الآن، يساهم في غسيل خلايا جسمك وتنشيط ذرات حرق الدهون.",
  "المثابرة والـ Streak اليومي هما الفارق الحقيقي بين تمني التغيير وتجسيده واقعاً.",
  "دعي الدكتورة شيماء تأخذ بيدك نحو الحلم، فصحتك هي رأس مالك الأبدي."
];

export const SAMPLE_PATIENT: Patient = {
  id: "patient-1",
  name: "محمد أحمد الحربي",
  phone: "0551234567",
  email: "mohamed@example.com",
  role: Role.PATIENT,
  points: 120,
  streak: 3,
  longestStreak: 5,
  lastCheckinDate: new Date().toISOString().split('T')[0],
  targetWaterCups: 8,
  weightGoal: 70,
  joinedDate: "2026-06-01",
  level: "برونزي"
};

// LocalStorage helpers to simulate robust full database persistence on Client Side
export function getSavedData<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(`shyma_clinic_${key}`);
    return raw ? JSON.parse(raw) : initial;
  } catch (err) {
    return initial;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`shyma_clinic_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error("Storage error:", err);
  }
}
