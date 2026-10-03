import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, FileText, Database, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const sections = [
  {
    icon: Database,
    title: 'جمع البيانات',
    content: `نقوم بجمع البيانات التالية:
    
• المعلومات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف
• بيانات الاستخدام: كيفية استخدامك للمنصة، الميزات المستخدمة
• بيانات الأعمال: معلومات الطلبات، العملاء، الخدمات
• البيانات التقنية: عنوان IP، نوع المتصفح، نظام التشغيل
• ملفات تعريف الارتباط (Cookies): لتحسين تجربة الاستخدام

نجمع هذه البيانات فقط بموافقتك ولأغراض مشروعة.`
  },
  {
    icon: Lock,
    title: 'استخدام البيانات',
    content: `نستخدم بياناتك للأغراض التالية:

• تقديم وتحسين خدماتنا
• التواصل معك وإرسال التحديثات المهمة
• معالجة المدفوعات والمعاملات
• تخصيص تجربتك على المنصة
• تحليل الأداء وتحسين الميزات
• الامتثال للمتطلبات القانونية
• منع الاحتيال وضمان الأمان

لن نستخدم بياناتك لأغراض تجارية أخرى بدون موافقتك الصريحة.`
  },
  {
    icon: Shield,
    title: 'حماية البيانات',
    content: `نحمي بياناتك من خلال:

• تشفير 256-bit SSL/TLS لجميع البيانات
• تخزين آمن في خوادم محمية
• نسخ احتياطية منتظمة ومشفرة
• مراقبة أمنية على مدار الساعة
• اختبارات أمنية دورية
• سياسات صارمة للوصول للبيانات
• التزام بمعايير ISO 27001

بياناتك في أمان تام معنا.`
  },
  {
    icon: Users,
    title: 'مشاركة البيانات',
    content: `لا نشارك بياناتك إلا في الحالات التالية:

• مع موافقتك الصريحة
• لمقدمي خدمات موثوقين (مثل معالجات الدفع)
• عند الطلب القانوني من السلطات
• لحماية حقوقنا وسلامة المستخدمين

نحن لا نبيع أو نؤجر بياناتك لأطراف ثالثة أبداً.`
  },
  {
    icon: Eye,
    title: 'حقوقك',
    content: `لديك الحقوق التالية:

• الوصول لبياناتك الشخصية في أي وقت
• تصحيح أو تحديث بياناتك
• حذف بياناتك (الحق في النسيان)
• تحديد استخدام بياناتك
• نقل بياناتك لمنصة أخرى
• الاعتراض على معالجة بياناتك
• سحب الموافقة في أي وقت

للمطالبة بأي من هذه الحقوق، تواصل معنا.`
  },
  {
    icon: FileText,
    title: 'الاحتفاظ بالبيانات',
    content: `نحتفظ بالبيانات:

• طالما أن حسابك نشط
• المدة المطلوبة قانونياً
• ما دام هناك حاجة لتقديم الخدمة

عند حذف الحساب:
• يتم حذف البيانات الشخصية خلال 30 يوماً
• قد نحتفظ ببعض البيانات للالتزامات القانونية
• النسخ الاحتياطية تُحذف تلقائياً بعد 90 يوماً`
  },
  {
    icon: AlertTriangle,
    title: 'ملفات تعريف الارتباط (Cookies)',
    content: `نستخدم Cookies لـ:

• تحسين تجربة التصفح
• تذكر تفضيلاتك وإعداداتك
• تحليل استخدام الموقع
• عرض محتوى مخصص

يمكنك:
• قبول أو رفض Cookies من إعدادات المتصفح
• حذف Cookies في أي وقت
• اختيار أنواع Cookies المسموح بها

بعض الوظائف قد لا تعمل بدون Cookies الضرورية.`
  },
  {
    icon: CheckCircle,
    title: 'خصوصية الأطفال',
    content: `خدماتنا مخصصة للأعمال فقط:

• لا نجمع بيانات من أشخاص دون 18 عاماً
• نطلب التحقق من العمر عند التسجيل
• إذا اكتشفنا بيانات طفل، نحذفها فوراً

مسؤولية الأهل والأوصياء مراقبة استخدام الأطفال للإنترنت.`
  }
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-purple-100 text-purple-700 px-6 py-2">
            <Shield className="h-4 w-4 ml-2 inline" />
            حماية خصوصيتك أولويتنا
          </Badge>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            سياسة الخصوصية
          </h1>
          <p className="text-xl text-gray-600">
            آخر تحديث: 23 يناير 2026
          </p>
          <p className="text-lg text-gray-500 mt-4 max-w-3xl mx-auto">
            نحن في Royal Haroon نلتزم بحماية خصوصيتك وبياناتك الشخصية. 
            هذه السياسة توضح كيف نجمع ونستخدم ونحمي معلوماتك.
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Lock className="h-8 w-8 text-purple-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-xl mb-2 text-purple-900">التزامنا بخصوصيتك</h3>
                  <p className="text-purple-800 leading-relaxed">
                    نتعامل مع بياناتك بأقصى درجات الجدية والمسؤولية. نستخدم أحدث معايير التشفير والأمان لحماية معلوماتك.
                    لن نبيع أو نشارك بياناتك مع أطراف ثالثة بدون موافقتك الصريحة.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8 mb-16">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-10">
              <h2 className="text-3xl font-bold mb-4">هل لديك أسئلة عن خصوصيتك؟</h2>
              <p className="text-xl mb-6 opacity-90">
                فريقنا المختص بالخصوصية جاهز للإجابة على استفساراتك
              </p>
              <div className="flex gap-4 flex-wrap">
                <a href="mailto:privacy@royal-cleaning.com" className="text-white hover:underline text-lg">
                  📧 privacy@royal-cleaning.com
                </a>
                <a href="https://wa.me/0563177803" className="text-white hover:underline text-lg">
                  📱 0563177803
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Legal Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-lg bg-gray-50">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 text-sm leading-relaxed">
                هذه السياسة خاضعة لقوانين دولة الإمارات العربية المتحدة.
                نحتفظ بالحق في تحديث هذه السياسة في أي وقت. سيتم إشعارك بأي تغييرات جوهرية.
                استمرارك في استخدام خدماتنا بعد التحديثات يعني موافقتك على السياسة المحدثة.
              </p>
              <p className="text-gray-500 text-xs mt-4">
                © 2026 Royal Haroon للتنظيف والتعقيم - جميع الحقوق محفوظة
              </p>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}