import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle, Shield, Scale, UserCheck, XCircle, RefreshCw, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const sections = [
  {
    icon: UserCheck,
    title: 'قبول الشروط',
    content: `باستخدامك لمنصة Royal Haroon، أنت توافق على:

• الالتزام بجميع الشروط والأحكام المذكورة
• المسؤولية الكاملة عن استخدامك للمنصة
• تحديث معلوماتك بدقة وصدق
• الاستخدام القانوني والأخلاقي فقط
• عدم إساءة استخدام الخدمة أو محاولة اختراقها

إذا لم توافق على هذه الشروط، يرجى عدم استخدام المنصة.`
  },
  {
    icon: Shield,
    title: 'التسجيل والحساب',
    content: `عند إنشاء حساب:

• يجب أن تكون فوق 18 عاماً
• تقديم معلومات صحيحة ودقيقة
• الحفاظ على سرية كلمة المرور
• أنت مسؤول عن جميع الأنشطة في حسابك
• إشعارنا فوراً بأي استخدام غير مصرح به

نحتفظ بالحق في:
• تعليق أو إلغاء الحسابات المخالفة
• طلب التحقق من الهوية
• رفض التسجيل لأي سبب`
  },
  {
    icon: FileText,
    title: 'استخدام الخدمة',
    content: `يُسمح لك بـ:

✓ استخدام المنصة لأغراض عملك المشروعة
✓ إنشاء وإدارة الطلبات والعملاء
✓ الوصول للميزات المتاحة في خطتك
✓ تخصيص الإعدادات حسب احتياجاتك

يُحظر عليك:
✗ مشاركة حسابك مع الغير
✗ نسخ أو تعديل أكواد المنصة
✗ استخدام المنصة لأنشطة غير قانونية
✗ إرسال رسائل مزعجة أو محتوى ضار
✗ محاولة اختراق أو تعطيل النظام`
  },
  {
    icon: RefreshCw,
    title: 'الاشتراكات والدفع',
    content: `شروط الدفع:

• الأسعار معلنة بوضوح على صفحة الأسعار
• الدفع يتم مسبقاً شهرياً أو سنوياً
• نقبل: Stripe، PayPal، بطاقات ائتمان، تحويل بنكي
• يتم التجديد تلقائياً ما لم تلغي الاشتراك
• لا نسترد المبالغ المدفوعة عن الفترة الحالية
• يمكنك إلغاء الاشتراك في أي وقت
• عند الإلغاء، تستمر الخدمة حتى نهاية الفترة المدفوعة

الضرائب:
• الأسعار لا تشمل ضريبة القيمة المضافة (5%)
• يتم احتساب الضرائب حسب قوانين الإمارات`
  },
  {
    icon: XCircle,
    title: 'الإلغاء والإنهاء',
    content: `يمكنك إلغاء اشتراكك:

• من إعدادات الحساب في أي وقت
• بالتواصل مع الدعم الفني
• سيتوقف التجديد التلقائي فوراً
• تستمر الخدمة حتى نهاية الفترة المدفوعة
• يمكنك تحميل بياناتك قبل الإنهاء النهائي

نحن قد نلغي حسابك إذا:
• انتهكت شروط الاستخدام
• لم تدفع الرسوم المستحقة
• استخدمت الحساب لأنشطة احتيالية
• ظل الحساب غير نشط لأكثر من 12 شهراً`
  },
  {
    icon: AlertCircle,
    title: 'المسؤولية وإخلاء المسؤولية',
    content: `نحن نقدم الخدمة "كما هي":

• نبذل قصارى جهدنا لضمان الجودة والاستقرار
• لا نضمن عمل الخدمة بدون انقطاع
• لا نتحمل مسؤولية أي خسائر مباشرة أو غير مباشرة
• أنت مسؤول عن عمل نسخ احتياطية لبياناتك
• لا نضمن دقة البيانات المدخلة من طرفك

الحد الأقصى للمسؤولية:
• لا يتجاوز المبلغ المدفوع في آخر 3 أشهر
• لا نتحمل أضراراً عرضية أو تبعية`
  },
  {
    icon: Shield,
    title: 'الملكية الفكرية',
    content: `حقوق الملكية:

• جميع حقوق المنصة والأكواد ملك لRoyal Haroon
• الشعارات والعلامات التجارية محمية
• لا يجوز نسخ أو توزيع أو بيع أي جزء من المنصة
• المحتوى الذي تنشئه (بيانات العملاء، الطلبات) يبقى ملكك
• نحتفظ برخصة استخدام بياناتك لتقديم الخدمة

الاستخدام العادل:
• يمكنك عمل لقطات شاشة للأغراض الشخصية
• يحظر استخدام الشعارات تجارياً بدون إذن`
  },
  {
    icon: Scale,
    title: 'القانون المنظم',
    content: `الإطار القانوني:

• هذه الشروط تخضع لقوانين دولة الإمارات العربية المتحدة
• أي نزاع يُحل عبر محاكم إمارة دبي
• نلتزم بـ:
  - قانون حماية البيانات الشخصية
  - قانون المعاملات الإلكترونية
  - قانون مكافحة الجرائم الإلكترونية

اللغة:
• النص العربي هو النص الرسمي
• عند التعارض بين الترجمات، يُعتد بالنص العربي`
  }
];

const highlights = [
  { icon: Shield, text: 'جميع البيانات مشفرة ومحمية' },
  { icon: RefreshCw, text: 'يمكنك الإلغاء في أي وقت' },
  { icon: UserCheck, text: 'بياناتك تبقى ملكك' },
  { icon: Phone, text: 'دعم فني متواصل 24/7' }
];

export default function Terms() {
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
            <FileText className="h-4 w-4 ml-2 inline" />
            اتفاقية الاستخدام
          </Badge>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            شروط وأحكام الاستخدام
          </h1>
          <p className="text-xl text-gray-600">
            آخر تحديث: 23 يناير 2026
          </p>
          <p className="text-lg text-gray-500 mt-4 max-w-3xl mx-auto">
            يرجى قراءة هذه الشروط بعناية قبل استخدام منصة Royal Haroon.
            استخدامك للمنصة يعني موافقتك الكاملة على هذه الشروط والأحكام.
          </p>
        </motion.div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Icon className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-700">{item.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-8 w-8 text-orange-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-xl mb-2 text-orange-900">تنويه مهم</h3>
                  <p className="text-orange-800 leading-relaxed">
                    هذه الشروط تشكل اتفاقية قانونية ملزمة بينك وبين Royal Haroon.
                    يرجى قراءتها بعناية. إذا كنت تستخدم المنصة نيابة عن شركة، فأنت تقر بأن لديك الصلاحية للموافقة على هذه الشروط نيابة عن تلك الشركة.
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
              <h2 className="text-3xl font-bold mb-4">هل لديك أسئلة عن الشروط؟</h2>
              <p className="text-xl mb-6 opacity-90">
                فريقنا القانوني جاهز للإجابة على استفساراتك
              </p>
              <div className="flex gap-4 flex-wrap">
                <a href="mailto:legal@royal-cleaning.com" className="text-white hover:underline text-lg">
                  📧 legal@royal-cleaning.com
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
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. 
                سيتم إشعارك بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار على المنصة.
                استمرارك في استخدام المنصة بعد التعديلات يعني موافقتك على الشروط المحدثة.
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