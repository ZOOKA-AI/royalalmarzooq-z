import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Crown,
  Trophy,
  Languages,
  ClipboardList,
  Users,
  Wrench,
  CreditCard,
  FileText,
  MapPin,
  Sparkles,
  Bot,
  Star,
  Award,
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";

const content = {
  ar: {
    title: "الدليل والمميزات",
    subtitle: "Royal Haroon للتنظيف والتعقيم",
    langLabel: "English",
    tabs: {
      overview: "نظرة عامة",
      privileges: "الامتيازات",
      usage: "طرق الاستخدام",
      leaderboard: "المتصدرين",
    },
    overview: {
      heading: "مرحباً بك في منصة Royal Haroon",
      desc: "منصة متكاملة لإدارة خدمات التنظيف والتعقيم ومكافحة الحشرات. استخدم التبويبات للتعرف على الامتيازات وطرق الاستخدام ومتابعة أداء فريقك.",
      quickStart: "ابدأ من هنا",
      quickItems: [
        "أضف عملاءك من صفحة العملاء",
        "أنشئ طلب تنظيف جديد من صفحة الطلبات",
        "أضف عمالك وعيّنهم للطلبات",
        "تابع التقارير والأرباح من لوحة التحكم",
      ],
    },
    privileges: {
      heading: "امتيازات المنصة",
      desc: "كل ما تحتاجه لإدارة عملك بكفاءة في مكان واحد",
      items: [
        { icon: ClipboardList, title: "إدارة الطلبات", desc: "تتبع كامل للطلبات من الإنشاء حتى الاكتمال مع حالات متعددة" },
        { icon: Users, title: "قاعدة عملاء", desc: "حفظ بيانات العملاء وتاريخهم وتصنيفهم (عادي، VIP، شركة)" },
        { icon: Wrench, title: "إدارة الخدمات", desc: "تسعير مرن حسب الوحدة أو المساحة مع 14 نوع خدمة" },
        { icon: CreditCard, title: "بوابة دفع", desc: "دفع إلكتروني عبر Stripe مع فواتير وعروض أسعار تلقائية" },
        { icon: FileText, title: "تقارير متقدمة", desc: "تحليلات شاملة للأرباح والأداء والمصروفات" },
        { icon: MapPin, title: "تتبع مباشر", desc: "متابعة موقع العمال على الخريطة لحظة بلحظة" },
        { icon: Sparkles, title: "مولد محتوى", desc: "إنشاء منشورات وصور تسويقية بالذكاء الاصطناعي" },
        { icon: Bot, title: "مساعد ذكي", desc: "ردود تلقائية على واتساب ومساعدة فورية للعملاء" },
        { icon: Crown, title: "برنامج ولاء", desc: "نقاط ومستويات للعملاء (برونزي، فضي، ذهبي، بلاتيني)" },
      ],
    },
    usage: {
      heading: "طرق الاستخدام",
      desc: "خطوات بسيطة للبدء وإدارة عملك",
      steps: [
        { title: "إضافة عميل", desc: "اذهب لصفحة العملاء، اضغط \"إضافة عميل\"، أدخل الاسم والهاتف والعنوان" },
        { title: "إنشاء طلب", desc: "من صفحة الطلبات اضغط \"طلب جديد\"، اختر العميل والخدمة والتاريخ" },
        { title: "تعيين عامل", desc: "اختر عاملاً متاحاً من القائمة واربطه بالطلب" },
        { title: "متابعة التنفيذ", desc: "بدّل حالة الطلب من \"جديد\" إلى \"مؤكد\" ثم \"قيد التنفيذ\" ثم \"مكتمل\"" },
        { title: "تحصيل الدفع", desc: "سجّل الدفع نقداً أو عبر بوابة الدفع الإلكتروني" },
        { title: "مراجعة التقارير", desc: "افتح التقارير المتقدمة لمراجعة الأرباح والأداء" },
      ],
    },
    leaderboard: {
      heading: "لوحة المتصدرين",
      desc: "ترتيب العمال حسب الأداء والإنجازات",
      rank: "الترتيب",
      worker: "العامل",
      orders: "الطلبات",
      rating: "التقييم",
      empty: "لا يوجد عمال بعد. أضف عمالاً من صفحة العمال لعرض الترتيب.",
      badges: {
        gold: "بطل الذهب",
        silver: "نجم فضي",
        bronze: "صاعد برونزي",
      },
    },
  },
  en: {
    title: "Guide & Features",
    subtitle: "Royal Cleaning, Sanitization & Pest Control",
    langLabel: "العربية",
    tabs: {
      overview: "Overview",
      privileges: "Privileges",
      usage: "How to Use",
      leaderboard: "Leaderboard",
    },
    overview: {
      heading: "Welcome to Royal Platform",
      desc: "An all-in-one platform for cleaning, sanitization, and pest control services. Use the tabs to explore features, usage methods, and track your team's performance.",
      quickStart: "Start Here",
      quickItems: [
        "Add your clients from the Clients page",
        "Create a new cleaning order from the Orders page",
        "Add your workers and assign them to orders",
        "Track reports and profits from the Dashboard",
      ],
    },
    privileges: {
      heading: "Platform Privileges",
      desc: "Everything you need to run your business efficiently in one place",
      items: [
        { icon: ClipboardList, title: "Order Management", desc: "Full tracking from creation to completion with multiple statuses" },
        { icon: Users, title: "Client Database", desc: "Store client data, history, and categories (Regular, VIP, Corporate)" },
        { icon: Wrench, title: "Service Management", desc: "Flexible pricing per unit or area with 14 service types" },
        { icon: CreditCard, title: "Payment Gateway", desc: "Online payments via Stripe with automatic invoices and quotes" },
        { icon: FileText, title: "Advanced Reports", desc: "Comprehensive analytics for profits, performance, and expenses" },
        { icon: MapPin, title: "Live Tracking", desc: "Track worker locations on the map in real time" },
        { icon: Sparkles, title: "Content Generator", desc: "AI-powered marketing posts and images creation" },
        { icon: Bot, title: "AI Assistant", desc: "Automated WhatsApp replies and instant customer support" },
        { icon: Crown, title: "Loyalty Program", desc: "Points and tiers for clients (Bronze, Silver, Gold, Platinum)" },
      ],
    },
    usage: {
      heading: "How to Use",
      desc: "Simple steps to get started and manage your business",
      steps: [
        { title: "Add a Client", desc: "Go to Clients, click \"Add Client\", enter name, phone, and address" },
        { title: "Create an Order", desc: "From Orders click \"New Order\", select client, service, and date" },
        { title: "Assign a Worker", desc: "Choose an available worker from the list and link them to the order" },
        { title: "Track Execution", desc: "Change order status from \"New\" to \"Confirmed\" to \"In Progress\" to \"Completed\"" },
        { title: "Collect Payment", desc: "Record payment as cash or via the online payment gateway" },
        { title: "Review Reports", desc: "Open Advanced Reports to review profits and performance" },
      ],
    },
    leaderboard: {
      heading: "Leaderboard",
      desc: "Workers ranked by performance and achievements",
      rank: "Rank",
      worker: "Worker",
      orders: "Orders",
      rating: "Rating",
      empty: "No workers yet. Add workers from the Workers page to see the ranking.",
      badges: {
        gold: "Gold Champion",
        silver: "Silver Star",
        bronze: "Bronze Riser",
      },
    },
  },
};

export default function Guide() {
  const [lang, setLang] = useState("ar");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.entities.Worker.filter(
          {},
          { sort: "-completed_orders", limit: 50, fields: ["name", "completed_orders", "rating", "specialty", "status"] }
        );
        setWorkers(res.items || []);
      } catch {
        setWorkers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const t = content[lang];
  const isRtl = lang === "ar";

  const ranked = [...workers].sort((a, b) => {
    const sa = (a.completed_orders || 0) * 100 + (a.rating || 0) * 10;
    const sb = (b.completed_orders || 0) * 100 + (b.rating || 0) * 10;
    return sb - sa;
  });

  const rankColors = [
    "from-amber-400 to-yellow-600",
    "from-slate-300 to-slate-500",
    "from-orange-400 to-amber-700",
  ];
  const rankBg = ["bg-amber-50 border-amber-200", "bg-slate-50 border-slate-200", "bg-orange-50 border-orange-200"];
  const rankBadgeKey = ["gold", "silver", "bronze"];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      {/* Header with language toggle */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
            <p className="text-sm text-gray-500">{t.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-purple-200 text-purple-700 font-medium shadow-sm hover:bg-purple-50 transition-colors"
        >
          <Languages className="h-5 w-5" />
          {t.langLabel}
        </button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="py-3">{t.tabs.overview}</TabsTrigger>
          <TabsTrigger value="privileges" className="py-3">{t.tabs.privileges}</TabsTrigger>
          <TabsTrigger value="usage" className="py-3">{t.tabs.usage}</TabsTrigger>
          <TabsTrigger value="leaderboard" className="py-3">{t.tabs.leaderboard}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card className="border-purple-100">
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-3 py-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl mx-auto">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{t.overview.heading}</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">{t.overview.desc}</p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6">
                <h3 className="font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t.overview.quickStart}
                </h3>
                <div className="space-y-3">
                  {t.overview.quickItems.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm flex-none">
                        {i + 1}
                      </div>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privileges Tab */}
        <TabsContent value="privileges">
          <div className="space-y-4">
            <div className="text-center py-2">
              <h2 className="text-xl font-bold text-gray-800">{t.privileges.heading}</h2>
              <p className="text-gray-500 text-sm mt-1">{t.privileges.desc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.privileges.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="border-purple-100 hover:shadow-lg hover:border-purple-300 transition-all h-full">
                      <CardContent className="p-5">
                        <div className="w-11 h-11 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-3">
                          <Icon className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage">
          <div className="space-y-4">
            <div className="text-center py-2">
              <h2 className="text-xl font-bold text-gray-800">{t.usage.heading}</h2>
              <p className="text-gray-500 text-sm mt-1">{t.usage.desc}</p>
            </div>
            <div className="relative">
              {t.usage.steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 mb-4"
                >
                  <div className="flex flex-col items-center flex-none">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center font-bold shadow-lg">
                      {i + 1}
                    </div>
                    {i < t.usage.steps.length - 1 && (
                      <div className="w-0.5 flex-1 bg-purple-200 mt-2 min-h-[24px]" />
                    )}
                  </div>
                  <Card className="border-purple-100 flex-1 mb-0">
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard">
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-3">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{t.leaderboard.heading}</h2>
              <p className="text-gray-500 text-sm mt-1">{t.leaderboard.desc}</p>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : ranked.length === 0 ? (
              <Card className="border-purple-100">
                <CardContent className="p-10 text-center text-gray-400">
                  <Award className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p>{t.leaderboard.empty}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {/* Top 3 podium */}
                {ranked.slice(0, 3).length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {ranked.slice(0, 3).map((w, i) => (
                      <motion.div
                        key={w.id || i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`rounded-2xl p-4 text-center border-2 ${rankBg[i] || "bg-gray-50 border-gray-200"}`}
                      >
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${rankColors[i] || "from-gray-300 to-gray-500"} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                          {i === 0 ? <Crown className="h-7 w-7 text-white" /> : <Star className="h-7 w-7 text-white" />}
                        </div>
                        <p className="font-bold text-gray-800 text-sm truncate">{w.name}</p>
                        <Badge className={`mt-1 bg-gradient-to-r ${rankColors[i] || "from-gray-300 to-gray-500"} text-white border-0`}>
                          {t.leaderboard.badges[rankBadgeKey[i]]}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{w.completed_orders || 0} {t.leaderboard.orders}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Full ranking list */}
                <Card className="border-purple-100 overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-purple-50 text-xs font-bold text-purple-700">
                    <div className="col-span-2">{t.leaderboard.rank}</div>
                    <div className="col-span-6">{t.leaderboard.worker}</div>
                    <div className="col-span-2 text-center">{t.leaderboard.orders}</div>
                    <div className="col-span-2 text-center">{t.leaderboard.rating}</div>
                  </div>
                  {ranked.map((w, i) => (
                    <motion.div
                      key={w.id || i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="grid grid-cols-12 gap-2 px-4 py-3 items-center border-t border-purple-50 hover:bg-purple-50/50"
                    >
                      <div className="col-span-2">
                        <span className={`inline-flex w-8 h-8 rounded-full items-center justify-center font-bold text-sm ${i < 3 ? `bg-gradient-to-br ${rankColors[i]} text-white` : "bg-gray-100 text-gray-600"}`}>
                          {i + 1}
                        </span>
                      </div>
                      <div className="col-span-6">
                        <p className="font-medium text-gray-800 text-sm truncate">{w.name}</p>
                        {w.specialty && <p className="text-xs text-gray-400">{w.specialty}</p>}
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="font-bold text-gray-700">{w.completed_orders || 0}</span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="inline-flex items-center gap-1 text-amber-500 font-bold text-sm">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {w.rating || 0}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}