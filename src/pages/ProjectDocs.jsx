import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectDocs() {
  const [copied, setCopied] = useState(false);

  const fullPrompt = `# 📋 برومت بناء مشروع Royal Clean - من الصفر

## المرحلة 1️⃣: الكيانات الأساسية

أنشئ 6 كيانات لنظام إدارة شركة تنظيف:

### 1. Client (العميل)
- name, phone (مطلوب)
- whatsapp, email, address, area, notes
- category: [عادي, VIP, محتمل, شركة, متكرر]
- building_type: [شقة, فيلا, مكتب, محل, مبنى]
- source: [واتساب, اتصال, موقع, إحالة, إعلان, آخر]
- preferred_time: [صباحاً, ظهراً, مساءً, أي وقت]
- total_orders, total_spent (numbers)

### 2. Service (الخدمة)
- name, price, category (مطلوب)
- description, notes
- price_unit: [ثابت, للشخص, للمتر, للحبة, للغرفة, حسب المساحة]
- min_price
- category: [تنظيف كنب, سجاد, ستائر, خزانات, مطابخ, شقق, نجف, مكيفات, حوش, حمامات, تسليك بوالع, فلل, مكافحة حشرات, أسلاك طاردة للحمام]
- is_active (boolean)

### 3. Order (الطلب)
- client_name, client_phone, service_name (مطلوب)
- order_number, client_id, client_address
- service_id, worker_id, worker_name
- scheduled_date, scheduled_time
- status: [جديد, مؤكد, قيد التنفيذ, مكتمل, ملغي]
- price, discount, total
- payment_status: [غير مدفوع, مدفوع جزئياً, مدفوع]
- payment_method: [نقدي, تحويل بنكي, بطاقة]
- notes, rating

### 4. Worker (العامل)
- name, phone (مطلوب)
- id_number
- specialty: [تنظيف عام, تنظيف سجاد, تنظيف واجهات, مكافحة حشرات, تنظيف خزانات]
- status: [متاح, مشغول, إجازة, غير نشط]
- salary, join_date, rating, completed_orders

### 5. Employee (الموظف)
- name, phone, role (مطلوب)
- email
- role: [مدير النظام, مشرف, موظف تنظيف, خدمة عملاء, مدير فرع]
- branch: [دبي, أبوظبي, الشارقة, عجمان, العين, رأس الخيمة]
- status: [نشط, غير نشط, إجازة]
- tasks_completed, rating, salary, join_date, notes

### 6. CommunicationLog (سجل التواصل)
- client_id, type (مطلوب)
- type: [مكالمة, واتساب, زيارة, ملاحظة]
- notes
- result: [ناجح, لم يرد, مؤجل, غير مهتم]

---

## المرحلة 2️⃣: الصفحات الأساسية

### Dashboard (الرئيسية)
- إحصائيات مباشرة: الإيرادات، الطلبات، العملاء، العمال
- رسم بياني للإيرادات الأسبوعية (Area Chart)
- رسم دائري لتوزيع الخدمات (Pie Chart)
- أحدث 5 طلبات
- أفضل 5 خدمات
- حالة العمال
- روابط التواصل الاجتماعي

### Orders (الطلبات)
- عرض كل الطلبات في Grid
- بحث وفلترة حسب الحالة
- إضافة/تعديل/حذف طلبات
- نموذج شامل مع ربط العميل والخدمة والعامل
- حساب تلقائي للسعر والخصم

### Clients (العملاء)
- عرض العملاء في Cards
- تصنيفات ملونة (VIP بتاج ذهبي)
- بحث وفلترة
- نموذج مفصل مع حقول مخصصة
- زر "السجل" لكل عميل

### Workers (العمال)
- عرض العمال مع حالاتهم
- بحث بالاسم أو التخصص
- بطاقات ملونة حسب الحالة
- نموذج إضافة/تعديل

### Services (الخدمات)
- عرض الخدمات بالتصنيفات
- بحث وفلترة
- بطاقات ملونة لكل تصنيف
- تفعيل/إلغاء الخدمة

---

## المرحلة 3️⃣: التحسينات والمميزات

### AIInsights (رؤى ذكية)
- استخدام base44.integrations.Core.InvokeLLM
- تحليل أداء الأعمال
- نقاط القوة والتحديات
- توصيات استراتيجية
- تحديث تلقائي كل 5 دقائق

### ClientHistory (سجل العميل)
- Sheet جانبي مع Tabs
- Tab 1: الطلبات السابقة مع الأسعار
- Tab 2: سجل التواصل مع الأيقونات
- إحصائيات سريعة: عدد الطلبات، إجمالي الإنفاق، سجلات التواصل
- نموذج إضافة سجل تواصل جديد

### Employees (الموظفين)
- مثل Workers لكن للموظفين الداخليين
- فلترة حسب الدور والفرع والحالة
- إحصائيات الأداء

### ClientReports (تقارير العملاء)
- فلترة بالتاريخ والخدمة
- إحصائيات: عدد العملاء، الإيرادات، متوسط الطلب، العملاء الجدد
- رسوم بيانية:
  * Bar Chart لشعبية الخدمات
  * Pie Chart لتوزيع العملاء حسب المنطقة
  * Line Chart لاتجاه الطلبات
- جدول أفضل 10 عملاء

### ContentGenerator (مولد المحتوى)
- نموذج لتوليد محتوى تسويقي
- اختيار المنصة: Instagram, Facebook, Twitter, LinkedIn
- نوع المحتوى: إعلاني, تعليمي, عرض, قصة نجاح
- استخدام InvokeLLM لتوليد النص
- استخدام GenerateImage لتوليد صورة
- زر توليد خطة شهرية (30 منشور)

---

## المرحلة 4️⃣: الشات بوت الذكي

### AIAssistantChat (المساعد الذكي الصوتي)

**الميزات:**
- زر عائم في كل الصفحات (fixed bottom-left)
- واجهة حوار احترافية مع Header وFooter
- دعم الصوت الكامل:
  * Web Speech API للتعرف الصوتي
  * Speech Synthesis للقراءة
  * زر ميكروفون يتحول لأحمر عند التسجيل
  * إرسال تلقائي بعد التعرف على الصوت

**قاعدة المعرفة المحلية:**
- الترحيب: "مرحباً! أنا مساعد رويال الذكي..."
- الخدمات: عرض قائمة الخدمات والأسعار
- التواصل: رقم 0563177803، واتساب، 24/7
- الشكر: "العفو! دائماً في خدمتك"
- الوداع: "مع السلامة! نتشرف بخدمتك"

**أوامر سريعة:**
- طلب جديد
- عميل جديد
- الخدمات
- طلبات اليوم
- الإيرادات

**تكامل AI:**
- طلبات اليوم: جلب من base44.entities.Order
- تقرير الإيرادات: حساب من الطلبات المكتملة
- أسئلة معقدة: استخدام InvokeLLM مع prompt مفصل

**التصميم:**
- فقاعات حوار ملونة (أزرق للمستخدم، رمادي للبوت)
- تأثيرات حركة smooth
- مؤشر "جاري الكتابة..."
- مؤشر "جاري الاستماع..." أحمر
- أيقونات Lucide Icons

---

## المرحلة 5️⃣: لوحة المتجر الإلكتروني

### StoreDashboard
**بيانات ROYAL ALMARZOOQ:**
- merchant: { id, storeName, owner, logo, currency }
- stats: todayRevenue, todayOrders, conversionRate, monthlyGoalProgress
- ordersChart: آخر 7 أيام
- topProducts: مع الصور والـ SKU
- recentOrders: آخر الطلبات بالتفاصيل

**المكونات:**
- StatCard: بطاقات إحصائيات مع أيقونات وتدرجات
- Area Chart للطلبات (Recharts)
- أفضل المنتجات مع صور وترتيب (🥇🥈🥉)
- جدول الطلبات الأخيرة
- شريط تقدم لهدف الشهر

---

## المرحلة 6️⃣: Layout والتصميم

### Layout.js
- Sidebar احترافي بتدرجات بنفسجية
- قائمة التنقل مع أيقونات
- responsive (mobile + desktop)
- زر Logout
- AIAssistantChat في كل الصفحات

### التصميم العام:
- RTL كامل (dir="rtl")
- تدرجات بنفسجية (purple/violet)
- shadows و rounded corners
- hover effects سلسة
- responsive grid layouts
- badges ملونة حسب الحالة

---

## المرحلة 7️⃣: Agent Configuration

### royal_clean_assistant.json
- description: "مساعد افتراضي لشركة رويال"
- instructions: استقبال طلبات، عرض خدمات، إنشاء طلبات
- tool_configs:
  * Service: read
  * Worker: read
  * Client: create, read, update
  * Order: create, read, update
- whatsapp_greeting: رسالة ترحيبية

---

## الخدمات والأسعار (للمساعد الذكي):

🛋️ تنظيف الكنب: 35-50 درهم/القطعة
🧹 تنظيف السجاد: 8-10 درهم/المتر
🪟 تنظيف الستائر: 90-150 درهم
💧 تنظيف الخزانات: 250-300 درهم
🍳 تنظيف المطابخ: من 60 درهم
🏠 تنظيف الشقق: من 500 درهم
❄️ تنظيف المكيفات: 50 درهم/الوحدة
🐜 مكافحة الحشرات: 250 درهم/النوع
🏡 تنظيف الفلل: من 1,200 درهم

📞 رقم التواصل: 0563177803
⏰ نعمل: 24 ساعة / 7 أيام
📍 التغطية: جميع مناطق الإمارات

---

## 🎯 ملخص البرومت الكامل:

\`\`\`
أنشئ نظام إدارة لشركة رويال للتنظيف والتعقيم ومكافحة الحشرات:

1. 6 كيانات: Client, Service, Order, Worker, Employee, CommunicationLog
2. 10 صفحات: Dashboard, StoreDashboard, Orders, Clients, Workers, Services, Employees, ClientReports, ContentGenerator, Settings
3. شات بوت ذكي صوتي مع قاعدة معرفة وأوامر سريعة
4. مولد محتوى بالذكاء الاصطناعي
5. تقارير تفصيلية برسوم بيانية
6. سجل تفصيلي لكل عميل
7. تصميم RTL احترافي بتدرجات بنفسجية
8. Agent للواتساب
9. لوحة متجر إلكتروني ROYAL ALMARZOOQ

التصميم: responsive, real-time, AI-powered, voice-enabled
\`\`\`

---

## 🚀 جاهز للنسخ!

هذا البرومت الكامل يمكنك نسخه واستخدامه مع أي AI لإعادة بناء المشروع من الصفر.

✅ 100% مكتمل
✅ تم الاختبار
✅ جاهز للإنتاج
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    toast.success('تم النسخ! الصق في أي مكان 📋');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📋 البرومت الكامل</h1>
        <p className="text-gray-500">كل خطوات بناء المشروع من البداية للنهاية</p>
      </div>

      <Card className="border-2 border-purple-200 shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Copy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">انسخ والصق</h2>
                <p className="text-sm text-gray-500">جاهز للاستخدام في أي مكان</p>
              </div>
            </div>
            <Button 
              onClick={copyToClipboard}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 shadow-lg"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-5 w-5 ml-2" />
                  تم النسخ ✓
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5 ml-2" />
                  نسخ الكل
                </>
              )}
            </Button>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 overflow-auto max-h-[70vh]">
            <pre className="text-gray-100 text-sm font-mono whitespace-pre-wrap leading-relaxed">
              {fullPrompt}
            </pre>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-xl">
            <p className="text-sm text-gray-700 text-center">
              💡 <strong>نصيحة:</strong> استخدم هذا البرومت مع أي AI لإعادة بناء المشروع بالكامل
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}