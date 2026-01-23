import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Target, Award, Users, Zap, Shield, 
  TrendingUp, Globe, Heart, CheckCircle, Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { value: '500+', label: 'عميل راضٍ', icon: Users },
  { value: '10,000+', label: 'طلب منجز', icon: CheckCircle },
  { value: '99.9%', label: 'نسبة الوقت المتاح', icon: TrendingUp },
  { value: '24/7', label: 'دعم متواصل', icon: Shield }
];

const values = [
  {
    icon: Target,
    title: 'الابتكار',
    description: 'نستخدم أحدث تقنيات الذكاء الاصطناعي لتوفير حلول متطورة'
  },
  {
    icon: Shield,
    title: 'الأمان',
    description: 'بياناتك محمية بأعلى معايير الأمان والتشفير العالمية'
  },
  {
    icon: Zap,
    title: 'السرعة',
    description: 'نظام سريع وفعال يوفر لك الوقت والجهد'
  },
  {
    icon: Heart,
    title: 'الدعم',
    description: 'فريق دعم متميز متاح 24/7 لمساعدتك'
  },
  {
    icon: Globe,
    title: 'التوسع',
    description: 'نظام قابل للتطوير يكبر مع نمو عملك'
  },
  {
    icon: Award,
    title: 'الجودة',
    description: 'نلتزم بأعلى معايير الجودة في كل ما نقدمه'
  }
];

const team = [
  {
    name: 'فريق التطوير',
    role: 'مهندسون ومطورون خبراء',
    description: 'نخبة من المطورين المتخصصين في الذكاء الاصطناعي وتطوير الويب'
  },
  {
    name: 'فريق الدعم',
    role: 'دعم فني على مدار الساعة',
    description: 'فريق متخصص لمساعدتك في أي وقت وحل أي مشكلة'
  },
  {
    name: 'فريق المنتج',
    role: 'خبراء في تجربة المستخدم',
    description: 'مصممون ومحللون يعملون على تحسين تجربتك باستمرار'
  }
];

const timeline = [
  { year: '2024', title: 'البداية', description: 'تأسيس الشركة ووضع الرؤية' },
  { year: '2024', title: 'الإطلاق', description: 'إطلاق النسخة الأولى من النظام' },
  { year: '2025', title: 'الذكاء الاصطناعي', description: 'دمج تقنيات AI المتقدمة' },
  { year: '2026', title: 'التوسع', description: 'خدمة مئات العملاء في الإمارات' }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-purple-100 text-purple-700 px-6 py-2">
            <Sparkles className="h-4 w-4 ml-2 inline" />
            من نحن
          </Badge>
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            نبني مستقبل إدارة الأعمال
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            شركة رويال هي منصة رائدة لإدارة أعمال التنظيف والصيانة في دولة الإمارات.
            نجمع بين قوة الذكاء الاصطناعي وسهولة الاستخدام لتقديم تجربة استثنائية.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <Icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="border-0 shadow-2xl h-full bg-gradient-to-br from-purple-600 to-purple-700 text-white">
              <CardContent className="p-10">
                <Target className="h-16 w-16 mb-6" />
                <h2 className="text-3xl font-bold mb-4">رؤيتنا</h2>
                <p className="text-lg leading-relaxed opacity-90">
                  أن نكون المنصة الأولى والأكثر ابتكاراً في إدارة أعمال الخدمات في المنطقة،
                  ممكنين الشركات من التركيز على النمو بينما نتولى التقنية.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="border-0 shadow-2xl h-full bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <CardContent className="p-10">
                <Sparkles className="h-16 w-16 mb-6" />
                <h2 className="text-3xl font-bold mb-4">مهمتنا</h2>
                <p className="text-lg leading-relaxed opacity-90">
                  تزويد الشركات بأدوات ذكية وسهلة الاستخدام تجعل إدارة الأعمال اليومية أسهل،
                  أسرع، وأكثر كفاءة من خلال الذكاء الاصطناعي.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-12">قيمنا الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                        <Icon className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-12">رحلتنا</h2>
          <div className="relative">
            <div className="absolute right-1/2 top-0 bottom-0 w-1 bg-purple-200" />
            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className={`flex items-center gap-8 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${idx % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-purple-600">{item.year}</Badge>
                        <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-6 h-6 bg-purple-600 rounded-full border-4 border-white shadow-lg z-10" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-12">فريقنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <Card key={idx} className="border-0 shadow-lg hover:shadow-2xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                  <p className="text-purple-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
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
            <CardContent className="p-16">
              <h2 className="text-5xl font-bold mb-6">هل أنت مستعد للانضمام إلينا؟</h2>
              <p className="text-2xl mb-10 opacity-90">
                انضم لمئات الشركات التي تثق بنا في إدارة أعمالها
              </p>
              <div className="flex gap-6 justify-center flex-wrap">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6">
                  ابدأ مجاناً الآن
                  <Sparkles className="h-5 w-5 mr-2" />
                </Button>
                <a href="https://wa.me/0563177803" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                    <Phone className="h-5 w-5 ml-2" />
                    تواصل معنا
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