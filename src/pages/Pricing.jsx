import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'المجاني',
    nameEn: 'Free',
    price: 0,
    period: 'مجاناً للأبد',
    icon: Star,
    color: 'from-gray-500 to-gray-600',
    features: [
      'حتى 10 طلبات شهرياً',
      'إدارة العملاء الأساسية',
      'تقارير بسيطة',
      'دعم عبر البريد',
      '1 مستخدم فقط'
    ],
    limitations: [
      'بدون ذكاء اصطناعي',
      'بدون تتبع GPS',
      'بدون تكاملات'
    ]
  },
  {
    name: 'الاحترافي',
    nameEn: 'Pro',
    price: 299,
    period: 'درهم/شهرياً',
    icon: Zap,
    color: 'from-purple-500 to-purple-700',
    popular: true,
    features: [
      'طلبات غير محدودة',
      'كل ميزات المجاني',
      'ذكاء اصطناعي متقدم',
      'مولد محتوى سوشيال ميديا',
      'تتبع GPS للعمال',
      'تقارير متقدمة وتحليلات',
      'برنامج ولاء العملاء',
      'تكاملات API',
      'حتى 5 مستخدمين',
      'دعم ذو أولوية'
    ],
    limitations: []
  },
  {
    name: 'المؤسسات',
    nameEn: 'Enterprise',
    price: 799,
    period: 'درهم/شهرياً',
    icon: Crown,
    color: 'from-yellow-500 to-yellow-600',
    features: [
      'كل ميزات الاحترافي',
      'مستخدمين غير محدودين',
      'وكيل ذكاء اصطناعي مخصص',
      'نشر تلقائي للسوشيال ميديا',
      'مولد فيديوهات AI',
      'White Label (علامتك التجارية)',
      'دومين مخصص',
      'API متقدم',
      'تدريب مخصص',
      'مدير حساب مخصص',
      'دعم 24/7 عبر واتساب'
    ],
    limitations: []
  },
  {
    name: 'حسب الطلب',
    nameEn: 'Custom',
    price: null,
    period: 'تواصل معنا',
    icon: Rocket,
    color: 'from-blue-500 to-blue-700',
    features: [
      'حلول مخصصة بالكامل',
      'تطوير ميزات خاصة',
      'تكامل مع أنظمتك',
      'SLA مخصص',
      'استشارات تقنية',
      'ترحيل البيانات',
      'دعم مخصص 24/7'
    ],
    limitations: []
  }
];

const addons = [
  { name: 'مستخدم إضافي', price: 50, period: 'درهم/شهرياً' },
  { name: 'مساحة تخزين إضافية (10GB)', price: 30, period: 'درهم/شهرياً' },
  { name: 'رسائل واتساب (1000 رسالة)', price: 100, period: 'درهم/مرة' },
  { name: 'تدريب مخصص', price: 500, period: 'درهم/جلسة' },
];

const faqs = [
  {
    q: 'هل يمكنني تجربة النظام مجاناً؟',
    a: 'نعم! الخطة المجانية متاحة للأبد بدون الحاجة لبطاقة ائتمان.'
  },
  {
    q: 'هل يمكنني تغيير الخطة لاحقاً؟',
    a: 'بالتأكيد! يمكنك الترقية أو التخفيض في أي وقت. التغييرات تطبق فوراً.'
  },
  {
    q: 'ما هي طرق الدفع المتاحة؟',
    a: 'نقبل Stripe، PayPal، Apple Pay، Google Pay، وتحويل بنكي.'
  },
  {
    q: 'هل توجد رسوم خفية؟',
    a: 'لا، أبداً. الأسعار شفافة وواضحة بدون رسوم خفية.'
  },
  {
    q: 'هل البيانات آمنة؟',
    a: 'نعم، نستخدم تشفير من الدرجة العسكرية ونلتزم بمعايير الأمان العالمية.'
  }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-purple-100 text-purple-700 px-6 py-2">
            <Sparkles className="h-4 w-4 ml-2 inline" />
            أسعار شفافة وعادلة
          </Badge>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            اختر الخطة المناسبة لك
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            من الشركات الصغيرة إلى المؤسسات الكبرى - لدينا خطة مثالية لاحتياجاتك
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('monthly')}
              className={billingCycle === 'monthly' ? 'bg-purple-600' : ''}
            >
              شهري
            </Button>
            <Button
              variant={billingCycle === 'yearly' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('yearly')}
              className={billingCycle === 'yearly' ? 'bg-purple-600' : ''}
            >
              سنوي
              <Badge className="mr-2 bg-green-500">وفر 20%</Badge>
            </Button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            const finalPrice = plan.price && billingCycle === 'yearly' 
              ? Math.floor(plan.price * 12 * 0.8) 
              : plan.price;
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 shadow-lg">
                      ⭐ الأكثر شعبية
                    </Badge>
                  </div>
                )}
                
                <Card className={`border-0 shadow-2xl h-full hover:scale-105 transition-transform ${plan.popular ? 'ring-4 ring-purple-200' : ''}`}>
                  <CardHeader className={`bg-gradient-to-br ${plan.color} text-white rounded-t-xl pb-8`}>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="h-12 w-12" />
                      {plan.popular && <Star className="h-6 w-6 fill-yellow-300 text-yellow-300" />}
                    </div>
                    <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-white/80 text-sm">{plan.nameEn}</CardDescription>
                    <div className="mt-6">
                      {plan.price !== null ? (
                        <>
                          <span className="text-5xl font-bold">{finalPrice}</span>
                          <span className="text-xl mr-2">
                            {billingCycle === 'yearly' ? 'درهم/سنوياً' : plan.period}
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold">{plan.period}</span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                      {plan.limitations.map((limit, i) => (
                        <li key={i} className="flex items-start gap-3 opacity-50">
                          <span className="text-gray-400">✕</span>
                          <span className="text-gray-500 line-through">{limit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link to={createPageUrl('PaymentGateway')}>
                      <Button className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`}>
                        {plan.price === null ? 'تواصل معنا' : 'ابدأ الآن'}
                        <ArrowRight className="h-4 w-4 mr-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">خدمات إضافية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {addons.map((addon, idx) => (
              <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg mb-2">{addon.name}</h3>
                  <p className="text-2xl font-bold text-purple-600">{addon.price} {addon.period}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">مقارنة شاملة</h2>
          <Card className="border-0 shadow-2xl overflow-x-auto">
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-right font-bold">الميزة</th>
                    <th className="p-4 text-center">المجاني</th>
                    <th className="p-4 text-center bg-purple-50">الاحترافي</th>
                    <th className="p-4 text-center">المؤسسات</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-4">عدد الطلبات</td>
                    <td className="p-4 text-center">10/شهر</td>
                    <td className="p-4 text-center bg-purple-50">غير محدود</td>
                    <td className="p-4 text-center">غير محدود</td>
                  </tr>
                  <tr>
                    <td className="p-4">المستخدمين</td>
                    <td className="p-4 text-center">1</td>
                    <td className="p-4 text-center bg-purple-50">5</td>
                    <td className="p-4 text-center">غير محدود</td>
                  </tr>
                  <tr>
                    <td className="p-4">الذكاء الاصطناعي</td>
                    <td className="p-4 text-center">✕</td>
                    <td className="p-4 text-center bg-purple-50">✓</td>
                    <td className="p-4 text-center">✓ متقدم</td>
                  </tr>
                  <tr>
                    <td className="p-4">التتبع GPS</td>
                    <td className="p-4 text-center">✕</td>
                    <td className="p-4 text-center bg-purple-50">✓</td>
                    <td className="p-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="p-4">الدعم</td>
                    <td className="p-4 text-center">بريد</td>
                    <td className="p-4 text-center bg-purple-50">ذو أولوية</td>
                    <td className="p-4 text-center">24/7 واتساب</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">أسئلة شائعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-purple-600">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-4">هل أنت مستعد للبدء؟</h2>
              <p className="text-xl mb-8 opacity-90">انضم لمئات الشركات التي تثق بنا</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to={createPageUrl('Dashboard')}>
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                    ابدأ مجاناً
                    <ArrowRight className="h-5 w-5 mr-2" />
                  </Button>
                </Link>
                <a href="https://wa.me/0563177803" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    تحدث معنا
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}