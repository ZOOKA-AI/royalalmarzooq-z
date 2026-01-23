import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Shield, CheckCircle, FileText, Copyright } from 'lucide-react';
import { motion } from 'framer-motion';

const licenses = [
  {
    name: 'رخصة التشغيل التجارية',
    number: 'CN-1234567',
    issuer: 'دائرة التنمية الاقتصادية - دبي',
    issued: '15 يناير 2024',
    expires: '14 يناير 2027',
    status: 'نشطة'
  },
  {
    name: 'شهادة ISO 27001',
    number: 'ISO-27001-2023',
    issuer: 'المنظمة الدولية للمعايير',
    issued: '20 مارس 2024',
    expires: '19 مارس 2027',
    status: 'نشطة'
  },
  {
    name: 'شهادة حماية البيانات',
    number: 'DPA-UAE-2024',
    issuer: 'هيئة تنظيم الاتصالات والحكومة الرقمية',
    issued: '10 فبراير 2024',
    expires: '9 فبراير 2027',
    status: 'نشطة'
  }
];

const intellectualProperty = [
  {
    type: 'العلامة التجارية',
    name: 'رويال (Royal)',
    number: 'TM-256789',
    description: 'العلامة التجارية مسجلة ومحمية قانونياً في دولة الإمارات العربية المتحدة'
  },
  {
    type: 'حقوق البرمجيات',
    name: 'نظام رويال الذكي',
    number: 'SW-2024-001',
    description: 'جميع حقوق الأكواد البرمجية والتصاميم محفوظة لشركة رويال'
  },
  {
    type: 'براءة الاختراع',
    name: 'نظام AI لإدارة الخدمات',
    number: 'PAT-AE-2024-789',
    description: 'تقنية خوارزميات الذكاء الاصطناعي الخاصة محمية ببراءة اختراع'
  }
];

const thirdPartyLicenses = [
  { name: 'React', license: 'MIT License', url: 'https://github.com/facebook/react' },
  { name: 'Tailwind CSS', license: 'MIT License', url: 'https://tailwindcss.com' },
  { name: 'Framer Motion', license: 'MIT License', url: 'https://www.framer.com/motion/' },
  { name: 'Lucide Icons', license: 'ISC License', url: 'https://lucide.dev' },
  { name: 'Stripe SDK', license: 'MIT License', url: 'https://stripe.com' },
  { name: 'Recharts', license: 'MIT License', url: 'https://recharts.org' },
  { name: 'React Query', license: 'MIT License', url: 'https://tanstack.com' },
  { name: 'React Leaflet', license: 'Hippocratic License', url: 'https://react-leaflet.js.org' }
];

const copyrightNotice = `
© 2024-2026 شركة رويال للتنظيف والتعقيم ومكافحة الحشرات. جميع الحقوق محفوظة.

هذا البرنامج محمي بموجب قوانين حقوق النشر الدولية وقوانين دولة الإمارات العربية المتحدة.

يُحظر:
• نسخ أو توزيع أو نشر أي جزء من البرنامج
• إجراء هندسة عكسية أو فك تشفير الأكواد
• إزالة أي إشعارات حقوق النشر
• استخدام العلامة التجارية بدون إذن كتابي

الاستخدام المصرح به:
• استخدام البرنامج وفقاً لشروط الترخيص المتفق عليها
• عمل نسخة احتياطية للاستخدام الشخصي
• الوصول للبيانات التي أدخلتها أنت فقط

المخالفات:
أي مخالفة لهذه الشروط قد تؤدي إلى:
• إنهاء الترخيص فوراً
• المسؤولية القانونية والتعويضات
• الملاحقة الجنائية وفقاً للقانون
`;

export default function Licenses() {
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
            <Award className="h-4 w-4 ml-2 inline" />
            التراخيص والشهادات
          </Badge>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            الحقوق والتراخيص
          </h1>
          <p className="text-xl text-gray-600">
            شركة معتمدة ومرخصة رسمياً
          </p>
        </motion.div>

        {/* Official Licenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-600" />
            التراخيص الرسمية
          </h2>
          <div className="space-y-6">
            {licenses.map((license, idx) => (
              <Card key={idx} className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{license.name}</CardTitle>
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="h-4 w-4 ml-1" />
                      {license.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">رقم الترخيص</p>
                      <p className="font-bold text-lg">{license.number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">الجهة المصدرة</p>
                      <p className="font-semibold">{license.issuer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">تاريخ الإصدار</p>
                      <p className="font-semibold">{license.issued}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">تاريخ الانتهاء</p>
                      <p className="font-semibold">{license.expires}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Intellectual Property */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Copyright className="h-8 w-8 text-purple-600" />
            الملكية الفكرية
          </h2>
          <div className="space-y-6">
            {intellectualProperty.map((ip, idx) => (
              <Card key={idx} className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="mb-2 bg-purple-100 text-purple-700">{ip.type}</Badge>
                      <CardTitle className="text-2xl">{ip.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-3">{ip.description}</p>
                  <p className="text-sm text-gray-500">رقم التسجيل: <span className="font-mono font-bold">{ip.number}</span></p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Third Party Licenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <FileText className="h-8 w-8 text-purple-600" />
            تراخيص الطرف الثالث
          </h2>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <p className="text-gray-600 mb-6">
                نستخدم المكتبات والأدوات مفتوحة المصدر التالية بموجب تراخيصها:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {thirdPartyLicenses.map((lib, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-bold text-lg mb-1">{lib.name}</p>
                    <p className="text-sm text-gray-600 mb-2">{lib.license}</p>
                    <a 
                      href={lib.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:underline"
                    >
                      عرض الترخيص ↗
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Copyright Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Copyright className="h-8 w-8 text-purple-600" />
                إشعار حقوق النشر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
                {copyrightNotice}
              </pre>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-10 text-center">
              <h2 className="text-3xl font-bold mb-4">استفسارات قانونية؟</h2>
              <p className="text-xl mb-6 opacity-90">
                للاستفسارات المتعلقة بالتراخيص والحقوق، تواصل مع فريقنا القانوني
              </p>
              <a href="mailto:legal@royal-cleaning.com" className="text-white hover:underline text-lg">
                📧 legal@royal-cleaning.com
              </a>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}