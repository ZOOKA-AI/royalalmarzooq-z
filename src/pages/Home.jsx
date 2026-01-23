import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, ArrowLeft, Zap, Shield, TrendingUp, Users,
  Bot, Calendar, CreditCard, MessageSquare, MapPin, Camera
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

const quickActions = [
  { 
    title: 'إدارة الطلبات', 
    desc: 'إنشاء ومتابعة طلبات العملاء', 
    icon: Calendar, 
    page: 'Orders',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    title: 'قاعدة العملاء', 
    desc: 'إدارة بيانات ومعلومات العملاء', 
    icon: Users, 
    page: 'Clients',
    color: 'from-purple-500 to-purple-600'
  },
  { 
    title: 'التتبع المباشر', 
    desc: 'تتبع موقع العمال على الخريطة', 
    icon: MapPin, 
    page: 'LiveTracking',
    color: 'from-green-500 to-green-600'
  },
  { 
    title: 'الوكيل الذكي', 
    desc: 'دردش مع AI متقدم بتقنية Gemini', 
    icon: Bot, 
    page: 'AIAgent',
    color: 'from-orange-500 to-orange-600'
  },
  { 
    title: 'مولد المحتوى', 
    desc: 'إنشاء منشورات وسائل التواصل', 
    icon: MessageSquare, 
    page: 'ContentGenerator',
    color: 'from-pink-500 to-pink-600'
  },
  { 
    title: 'مولد الصور AI', 
    desc: 'توليد صور احترافية بالذكاء الاصطناعي', 
    icon: Camera, 
    page: 'SocialMediaGenerator',
    color: 'from-indigo-500 to-indigo-600'
  },
];

const features = [
  {
    icon: Bot,
    title: 'ذكاء اصطناعي متطور',
    desc: 'نظام AI يتعلم من بياناتك ويحسن أداءك تلقائياً'
  },
  {
    icon: Shield,
    title: 'أمان وخصوصية',
    desc: 'تشفير 256-bit وحماية بيانات عالمية المستوى'
  },
  {
    icon: TrendingUp,
    title: 'تقارير ذكية',
    desc: 'تحليلات مفصلة ورؤى قابلة للتنفيذ فوراً'
  },
  {
    icon: Zap,
    title: 'سرعة فائقة',
    desc: 'استجابة فورية وأداء سلس على جميع الأجهزة'
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 text-white p-12 mb-8"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="relative z-10">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 px-4 py-1.5">
            <Sparkles className="h-4 w-4 ml-2" />
            أحدث نظام إدارة في المنطقة
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            مرحباً بك في
            <br />
            <span className="text-yellow-300">رويال المتطور</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl">
            منصة شاملة تدير شركتك بذكاء، تتبع عملك لحظياً، وتضاعف إنتاجيتك بتقنيات الذكاء الاصطناعي المتقدمة
          </p>
          
          <div className="flex gap-4 flex-wrap">
            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                الذهاب للوحة التحكم
                <ArrowLeft className="h-5 w-5 mr-2" />
              </Button>
            </Link>
            <a href="https://wa.me/0563177803" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                تحدث معنا
              </Button>
            </a>
          </div>
          
          <p className="mt-6 text-white/70 text-sm">
            ✓ استخدام مجاني  •  ✓ تحديثات مستمرة  •  ✓ دعم فني 24/7
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">الأدوات السريعة</h2>
          <Badge variant="outline" className="text-gray-600">اختر للبدء</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={createPageUrl(action.page)}>
                  <Card className="border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer h-full group">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-gray-600">{action.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="mb-12">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-purple-100 text-purple-700 px-4 py-1.5">
            <Zap className="h-4 w-4 ml-2" />
            ميزات متقدمة
          </Badge>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">لماذا رويال؟</h2>
          <p className="text-xl text-gray-600">تقنيات حديثة لتسهيل عملك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 text-white p-10 text-center"
      >
        <Sparkles className="h-16 w-16 mx-auto mb-6" />
        <h2 className="text-4xl font-bold mb-4">جاهز لبدء رحلتك؟</h2>
        <p className="text-xl mb-8 opacity-90">
          استكشف جميع أدوات النظام وابدأ في تحسين عملك اليوم
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to={createPageUrl('Dashboard')}>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <TrendingUp className="h-5 w-5 ml-2" />
              ابدأ الآن
            </Button>
          </Link>
          <Link to={createPageUrl('Pricing')}>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <CreditCard className="h-5 w-5 ml-2" />
              عرض الأسعار
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}