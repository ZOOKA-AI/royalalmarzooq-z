import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectSummary() {
  const [copied, setCopied] = useState(false);

  const projectPrompt = `
# مشروع Royal Clean Services - ملخص شامل

## 1. نظرة عامة على المشروع
تطبيق إدارة شامل لشركة رويال للتنظيف والتعقيم ومكافحة الحشرات في الإمارات
- الاسم: Royal Clean Services
- النوع: نظام إدارة خدمات تنظيف
- اللغة: العربية (RTL)
- التقنيات: React, Tailwind CSS, Base44 Platform

---

## 2. الكيانات (Entities) - قاعدة البيانات

### Client (العميل)
{
  "name": "Client",
  "properties": {
    "name": "string - اسم العميل",
    "phone": "string - رقم الهاتف",
    "whatsapp": "string - رقم الواتساب",
    "email": "string - البريد الإلكتروني",
    "address": "string - العنوان",
    "area": "string - المنطقة",
    "notes": "string - ملاحظات",
    "category": "enum - [عادي, VIP, محتمل, شركة, متكرر]",
    "building_type": "enum - [شقة, فيلا, مكتب, محل, مبنى]",
    "source": "enum - [واتساب, اتصال, موقع, إحالة, إعلان, آخر]",
    "preferred_time": "enum - [صباحاً, ظهراً, مساءً, أي وقت]",
    "total_orders": "number - إجمالي الطلبات",
    "total_spent": "number - إجمالي المصروف"
  }
}

### Service (الخدمة)
{
  "name": "Service",
  "properties": {
    "name": "string - اسم الخدمة",
    "description": "string - وصف الخدمة",
    "price": "number - السعر الأساسي",
    "price_unit": "enum - [ثابت, للشخص, للمتر, للحبة, للغرفة, حسب المساحة]",
    "min_price": "number - الحد الأدنى للسعر",
    "notes": "string - ملاحظات السعر",
    "category": "enum - [تنظيف كنب, تنظيف سجاد, تنظيف ستائر, تنظيف خزانات, تنظيف مطابخ, تنظيف شقق, تنظيف نجف, تنظيف مكيفات, تنظيف حوش, تنظيف حمامات, تسليك بوالع, تنظيف فلل, مكافحة حشرات, أسلاك طاردة للحمام]",
    "is_active": "boolean - نشط"
  }
}

### Order (الطلب)
{
  "name": "Order",
  "properties": {
    "order_number": "string - رقم الطلب",
    "client_id": "string - معرف العميل",
    "client_name": "string - اسم العميل",
    "client_phone": "string - هاتف العميل",
    "client_address": "string - عنوان العميل",
    "service_id": "string - معرف الخدمة",
    "service_name": "string - اسم الخدمة",
    "worker_id": "string - معرف العامل",
    "worker_name": "string - اسم العامل",
    "scheduled_date": "date - تاريخ الموعد",
    "scheduled_time": "string - وقت الموعد",
    "status": "enum - [جديد, مؤكد, قيد التنفيذ, مكتمل, ملغي]",
    "price": "number - السعر",
    "discount": "number - الخصم",
    "total": "number - الإجمالي",
    "payment_status": "enum - [غير مدفوع, مدفوع جزئياً, مدفوع]",
    "payment_method": "enum - [نقدي, تحويل بنكي, بطاقة]",
    "notes": "string - ملاحظات",
    "rating": "number - تقييم العميل"
  }
}

### Worker (العامل)
{
  "name": "Worker",
  "properties": {
    "name": "string - اسم العامل",
    "phone": "string - رقم الهاتف",
    "id_number": "string - رقم الهوية",
    "specialty": "enum - [تنظيف عام, تنظيف سجاد, تنظيف واجهات, مكافحة حشرات, تنظيف خزانات]",
    "status": "enum - [متاح, مشغول, إجازة, غير نشط]",
    "salary": "number - الراتب",
    "join_date": "date - تاريخ التعيين",
    "rating": "number - التقييم",
    "completed_orders": "number - الطلبات المكتملة"
  }
}

### Employee (الموظف)
{
  "name": "Employee",
  "properties": {
    "name": "string - اسم الموظف",
    "email": "string - البريد الإلكتروني",
    "phone": "string - رقم الهاتف",
    "role": "enum - [مدير النظام, مشرف, موظف تنظيف, خدمة عملاء, مدير فرع]",
    "branch": "enum - [دبي, أبوظبي, الشارقة, عجمان, العين, رأس الخيمة]",
    "status": "enum - [نشط, غير نشط, إجازة]",
    "tasks_completed": "number - المهام المكتملة",
    "rating": "number - التقييم",
    "salary": "number - الراتب",
    "join_date": "date - تاريخ الانضمام",
    "notes": "string - ملاحظات"
  }
}

### CommunicationLog (سجل التواصل)
{
  "name": "CommunicationLog",
  "properties": {
    "client_id": "string - معرف العميل",
    "type": "enum - [مكالمة, واتساب, زيارة, ملاحظة]",
    "notes": "string - تفاصيل التواصل",
    "result": "enum - [ناجح, لم يرد, مؤجل, غير مهتم]"
  }
}

---

## 3. الصفحات (Pages)

### Dashboard (الرئيسية)
- إحصائيات مباشرة (الإيرادات، الطلبات، العملاء، العمال)
- رسم بياني للإيرادات الأسبوعية
- رسم دائري لتوزيع الخدمات
- أحدث الطلبات
- أفضل 5 خدمات مطلوبة
- حالة العمال
- روابط التواصل الاجتماعي
- رؤى AI ذكية (تحليل أداء الأعمال)

### StoreDashboard (لوحة المتجر)
- خاص بمتجر ROYAL ALMARZOOQ الإلكتروني
- إحصائيات المبيعات والطلبات
- رسم بياني للطلبات (7 أيام)
- أفضل المنتجات مبيعاً
- آخر الطلبات
- معدل التحويل وهدف الشهر

### Orders (الطلبات)
- عرض وإدارة كل الطلبات
- بحث وفلترة حسب الحالة
- إضافة/تعديل/حذف طلبات
- تغيير سريع للحالة
- ربط العميل والخدمة والعامل
- حساب تلقائي للسعر والخصم

### Clients (العملاء)
- عرض وإدارة العملاء
- تصنيفات العملاء (VIP, شركة, متكرر...)
- حقول مخصصة (نوع المبنى، المصدر، الوقت المفضل)
- سجل تفصيلي لكل عميل
- سجل الطلبات السابقة
- سجل التواصل والملاحظات

### Workers (العمال)
- إدارة العمال والمتخصصين
- حالة العامل (متاح، مشغول، إجازة)
- التخصص والتقييم
- عدد الطلبات المكتملة

### Services (الخدمات)
- إدارة الخدمات والأسعار
- تصنيفات الخدمات
- وحدات السعر المرنة
- تفعيل/إلغاء الخدمات

### Employees (الموظفين)
- إدارة الموظفين الداخليين
- الأدوار والصلاحيات
- الفروع المختلفة
- إحصائيات الأداء

### ClientReports (تقارير العملاء)
- فلترة حسب التاريخ والخدمة
- إحصائيات تفصيلية
- رسوم بيانية:
  * شعبية الخدمات
  * توزيع العملاء حسب المنطقة
  * اتجاه الطلبات
- أفضل 10 عملاء

### ContentGenerator (مولد المحتوى)
- توليد محتوى تسويقي بالذكاء الاصطناعي
- منشورات لمنصات مختلفة (Instagram, Facebook, Twitter, LinkedIn)
- أنواع محتوى (إعلاني، تعليمي، عرض، قصة نجاح)
- توليد صور احترافية
- خطة محتوى شهرية (30 يوم)

### Settings (الإعدادات)
- معلومات المستخدم
- بيانات الشركة
- ربط واتساب بوت
- تسجيل الخروج

---

## 4. المكونات (Components)

### Dashboard Components
- LiveStats: كروت الإحصائيات المباشرة
- RevenueChart: رسم الإيرادات الأسبوعية
- ServiceChart: رسم توزيع الخدمات
- RecentOrders: آخر الطلبات
- TopServices: أفضل الخدمات
- WorkerStatus: حالة العمال
- SocialLinks: روابط التواصل
- AIInsights: رؤى ذكية من AI

### Client Components
- ClientHistory: سجل العميل التفصيلي
  * الطلبات السابقة
  * سجل التواصل
  * إحصائيات العميل

### AI Components
- AIAssistantChat: شات بوت ذكي
  * تحدث صوتي (Speech Recognition)
  * قراءة الردود (Text-to-Speech)
  * أوامر سريعة
  * قاعدة معرفة محلية
  * تكامل مع InvokeLLM

---

## 5. Layout (التخطيط)

### Sidebar Navigation
- قائمة جانبية احترافية
- أيقونات للصفحات
- تصميم متجاوب (Mobile/Desktop)
- زر تسجيل الخروج

### Styling
- تدرجات لونية بنفسجية (Purple theme)
- تصميم RTL كامل
- Responsive design
- تأثيرات Hover و Transitions
- Shadows و Gradients

---

## 6. الميزات الذكية (AI Features)

### AI Assistant (المساعد الذكي)
- شات بوت صوتي متكامل
- يظهر في كل الصفحات
- قادر على:
  * الإجابة على الاستفسارات
  * عرض الخدمات والأسعار
  * إنشاء طلبات
  * عرض إحصائيات
  * التواصل صوتياً

### AI Insights
- تحليل أداء الأعمال
- نقاط القوة والتحديات
- توصيات استراتيجية
- توقعات الإيرادات

### Content Generator
- توليد محتوى تسويقي
- إنشاء صور بالذكاء الاصطناعي
- خطط محتوى شهرية

---

## 7. Agent Configuration

### royal_clean_assistant
- وكيل AI للعملاء
- يمكنه:
  * قراءة الخدمات
  * إنشاء عملاء وطلبات
  * عرض معلومات العمال
- تكامل WhatsApp
- رسائل ترحيبية مخصصة

---

## 8. التكاملات (Integrations)

### Core Integrations
- InvokeLLM: استدعاء نماذج اللغة
- SendEmail: إرسال بريد إلكتروني
- UploadFile: رفع الملفات
- GenerateImage: توليد صور
- ExtractDataFromUploadedFile: استخراج بيانات

### Planned Integrations
- Stripe للدفع الإلكتروني
- WordPress REST API
- Google Cloud Run
- Gemini AI Agent

---

## 9. معلومات الشركة

**رويال للتنظيف والتعقيم ومكافحة الحشرات**
- الهاتف: 0563177803
- واتساب: 0563177803
- نعمل: 24 ساعة / 7 أيام
- التغطية: جميع مناطق الإمارات

### الخدمات الرئيسية:
1. تنظيف كنب: 35-50 درهم/القطعة
2. تنظيف سجاد: 8-10 درهم/المتر
3. تنظيف ستائر: 90-150 درهم
4. تنظيف خزانات: 250-300 درهم
5. تنظيف مطابخ: من 60 درهم
6. تنظيف شقق: من 500 درهم
7. تنظيف فلل: من 1,200 درهم
8. تنظيف مكيفات: 50 درهم/الوحدة
9. مكافحة حشرات: 250 درهم/النوع

---

## 10. الحالة الحالية للمشروع

✅ مكتمل:
- جميع الكيانات الأساسية
- جميع الصفحات الإدارية
- شات بوت ذكي مع صوت
- مولد محتوى
- تقارير تفصيلية
- لوحة متجر إلكتروني
- تصميم احترافي كامل

🔄 قيد التطوير:
- ربط API خارجي للمتجر
- تكامل Stripe للدفع
- تطبيق موبايل (مستقبلي)

---

## 11. التقنيات المستخدمة

### Frontend
- React 18
- Tailwind CSS
- Shadcn/UI Components
- Lucide Icons
- Recharts (للرسوم البيانية)
- React Query (إدارة البيانات)
- Framer Motion (للحركة)
- React Markdown
- Date-fns (للتواريخ)

### Backend (Base44 Platform)
- Base44 SDK
- Built-in Authentication
- Entity Management
- File Storage
- AI Integrations

### AI Features
- Web Speech API (التعرف الصوتي)
- Speech Synthesis (القراءة الصوتية)
- LLM Integration (نماذج اللغة)
- Image Generation (توليد صور)

---

## 12. هيكل الملفات

\`\`\`
/entities
  - Client.json
  - Service.json
  - Order.json
  - Worker.json
  - Employee.json
  - CommunicationLog.json

/pages
  - Dashboard.js
  - StoreDashboard.js
  - Orders.js
  - Clients.js
  - Workers.js
  - Services.js
  - Employees.js
  - ClientReports.js
  - ContentGenerator.js
  - Settings.js

/components
  /dashboard
    - LiveStats.jsx
    - RevenueChart.jsx
    - ServiceChart.jsx
    - RecentOrders.jsx
    - TopServices.jsx
    - WorkerStatus.jsx
    - SocialLinks.jsx
    - AIInsights.jsx
    - AIAssistantChat.jsx
  /clients
    - ClientHistory.jsx

/agents
  - royal_clean_assistant.json

- Layout.js
\`\`\`

---

## 13. نقاط القوة في التصميم

1. **واجهة عربية كاملة** - RTL متكامل
2. **تصميم احترافي** - تدرجات وألوان متناسقة
3. **Responsive** - يعمل على كل الأجهزة
4. **Real-time** - بيانات مباشرة بدون تحديث
5. **AI-Powered** - ذكاء اصطناعي متكامل
6. **Voice Enabled** - دعم صوتي كامل
7. **Comprehensive** - نظام إدارة شامل

---

## 14. الخطوات القادمة المقترحة

1. ربط API للمتجر الإلكتروني
2. إضافة نظام إشعارات
3. تقارير PDF قابلة للطباعة
4. لوحة تحكم للعملاء
5. تطبيق موبايل
6. تكامل الدفع الإلكتروني
7. نظام المواعيد المتقدم
8. تتبع GPS للعمال

---

## 15. ملاحظات للنسخ

هذا المشروع جاهز للاستخدام الفوري ويمكن نسخه أو تعديله.
جميع المكونات معيارية ويمكن إعادة استخدامها.
الكود نظيف ومنظم مع تعليقات عربية.

---

تم بناء هذا المشروع بالكامل على منصة Base44 🚀
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(projectPrompt);
    setCopied(true);
    toast.success('تم نسخ الملخص الكامل!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ملخص المشروع الكامل</h1>
          <p className="text-gray-500">كل التفاصيل من البداية للنهاية</p>
        </div>
        <Button 
          onClick={copyToClipboard}
          className="bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          {copied ? (
            <>
              <CheckCircle className="h-5 w-5 ml-2" />
              تم النسخ
            </>
          ) : (
            <>
              <Copy className="h-5 w-5 ml-2" />
              نسخ الكل
            </>
          )}
        </Button>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardTitle>📋 الملخص الشامل</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-3xl font-bold text-purple-600">6</p>
              <p className="text-sm text-gray-600">كيانات</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">10</p>
              <p className="text-sm text-gray-600">صفحات</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-3xl font-bold text-green-600">10+</p>
              <p className="text-sm text-gray-600">مكونات</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <p className="text-3xl font-bold text-orange-600">100%</p>
              <p className="text-sm text-gray-600">جاهز</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">📊 الكيانات الرئيسية</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Client</Badge>
                <Badge variant="outline">Service</Badge>
                <Badge variant="outline">Order</Badge>
                <Badge variant="outline">Worker</Badge>
                <Badge variant="outline">Employee</Badge>
                <Badge variant="outline">CommunicationLog</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">📄 الصفحات</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Dashboard</Badge>
                <Badge>StoreDashboard</Badge>
                <Badge>Orders</Badge>
                <Badge>Clients</Badge>
                <Badge>Workers</Badge>
                <Badge>Services</Badge>
                <Badge>Employees</Badge>
                <Badge>ClientReports</Badge>
                <Badge>ContentGenerator</Badge>
                <Badge>Settings</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">🤖 ميزات الذكاء الاصطناعي</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-100 text-purple-700">شات بوت صوتي</Badge>
                <Badge className="bg-purple-100 text-purple-700">تحليل أداء</Badge>
                <Badge className="bg-purple-100 text-purple-700">مولد محتوى</Badge>
                <Badge className="bg-purple-100 text-purple-700">توليد صور</Badge>
                <Badge className="bg-purple-100 text-purple-700">رؤى ذكية</Badge>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600">
                هذا الملخص يحتوي على كل التفاصيل الفنية للمشروع من البداية للنهاية.
                يمكنك نسخه واستخدامه كمرجع أو لإعادة بناء المشروع في مكان آخر.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>📝 الملخص النصي الكامل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto max-h-96 text-sm font-mono">
            <pre className="whitespace-pre-wrap">{projectPrompt}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}