import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Phone, Mail, Globe, MapPin, Clock, Shield, Award,
  CheckCircle, Star, ArrowRight, Users, Droplets, Home, Building2,
  Sofa, Wind, Bug, SprayCan, PaintBucket, Wrench, Leaf, Heart,
  ChevronLeft, FileText, ShieldCheck, ThumbsUp, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

const services = [
  { icon: Home, title: 'تنظيف الشقق والفلل', desc: 'تنظيف شامل للمنازل والفلل بأدوات ومواد عالية الجودة', color: 'from-blue-500 to-blue-600' },
  { icon: Sofa, title: 'تنظيف الكنب والسجاد', desc: 'غسيل وتعقيم الكنب والسجاد والستائر بأحدث المعدات', color: 'from-purple-500 to-purple-600' },
  { icon: Droplets, title: 'تنظيف الخزانات', desc: 'تنظيف وتعقيم خزانات المياه وفقًا للمعايير الصحية', color: 'from-cyan-500 to-cyan-600' },
  { icon: Wind, title: 'تنظيف المكيفات', desc: 'صيانة وتنظيف وحدات التكييف لتحسين جودة الهواء', color: 'from-teal-500 to-teal-600' },
  { icon: Bug, title: 'مكافحة الحشرات', desc: 'قضاء نهائي على الحشرات والقوارض بطرق آمنة', color: 'from-red-500 to-red-600' },
  { icon: Building2, title: 'تنظيف الواجهات', desc: 'تنظيف واجهات المباني الزجاجية والحجرية', color: 'from-indigo-500 to-indigo-600' },
  { icon: SprayCan, title: 'التعقيم والتطهير', desc: 'تعقيم شامل للمنازل والمكاتب بمواد معتمدة', color: 'from-green-500 to-green-600' },
  { icon: Wrench, title: 'تنظيف المطابخ', desc: 'إزالة الدهون والزيوت من المطابخ والأفران', color: 'from-orange-500 to-orange-600' },
];

const features = [
  { icon: ShieldCheck, title: 'مواد آمنة ومعتمدة', desc: 'نستخدم مواد تنظيف صديقة للبيئة ومعتمدة صحياً' },
  { icon: Users, title: 'فريق محترف ومدرب', desc: 'عمال مدربون على أعلى المعايير بخبرة طويلة' },
  { icon: Clock, title: 'خدمة على مدار الساعة', desc: 'متاحون 24/7 لخدمتك في أي وقت وأي مكان' },
  { icon: Award, title: 'جودة مضمونة', desc: 'نضمن رضاك التام أو نعيد الخدمة مجاناً' },
];

const stats = [
  { value: '500+', label: 'عميل سعيد', icon: Users },
  { value: '10,000+', label: 'طلب منجز', icon: CheckCircle },
  { value: '8', label: 'سنوات خبرة', icon: Award },
  { value: '24/7', label: 'دعم متواصل', icon: Clock },
];

const steps = [
  { num: '1', title: 'تواصل معنا', desc: 'اتصل أو راسلنا عبر واتساب لحجز موعد' },
  { num: '2', title: 'نحدد الموعد', desc: 'نتفق على الوقت المناسب لك وفق جدولك' },
  { num: '3', title: 'ننفذ الخدمة', desc: 'يصل فريقنا بالمعدات ويبدأ التنظيف' },
  { num: '4', title: 'تقييم الجودة', desc: 'نتأكد من رضاك التام قبل المغادرة' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Top Bar */}
      <div className="bg-purple-900 text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> 0563177803</span>
            <span className="hidden sm:flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> info@royalharoon.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Privacy')} className="hover:text-yellow-300">الخصوصية</Link>
            <span className="opacity-30">|</span>
            <Link to={createPageUrl('Terms')} className="hover:text-yellow-300">الشروط</Link>
            <span className="opacity-30">|</span>
            <Link to={createPageUrl('About')} className="hover:text-yellow-300">من نحن</Link>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-800 leading-tight">Royal Haroon</h1>
              <p className="text-xs text-gray-500">للتنظيف والتعقيم</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#services" className="hover:text-purple-600">خدماتنا</a>
            <a href="#why" className="hover:text-purple-600">لماذا نحن</a>
            <a href="#how" className="hover:text-purple-600">كيف نعمل</a>
            <Link to={createPageUrl('About')} className="hover:text-purple-600">من نحن</Link>
            <Link to={createPageUrl('OnlineBookingPublic')} className="hover:text-purple-600">احجز الآن</Link>
          </div>
          <a href="https://wa.me/0563177803" target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Phone className="h-4 w-4 ml-1" />
              تواصل معنا
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)`
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-2 text-base">
              <Sparkles className="h-5 w-5 ml-2" />
              خبرة 8 سنوات في التنظيف والتعقيم
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Royal Haroon
              <br />
              <span className="text-yellow-300 text-3xl md:text-5xl">للتنظيف والتعقيم</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
              خدمات تنظيف وتعقيم احترافية في الإمارات — نظافة ملكية، وخدمة تليق بك.
              نعتني بمنزلك ومكتبك بأيدٍ ماهرة ومواد آمنة.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://wa.me/0563177803" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 h-auto py-4">
                  <Phone className="h-5 w-5 ml-2" />
                  احجز خدمتك الآن
                </Button>
              </a>
              <Link to={createPageUrl('OnlineBookingPublic')}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 h-auto py-4">
                  حجز أونلاين
                  <ArrowRight className="h-5 w-5 mr-2" />
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-white/80 text-sm">
              ✓ معاينة مجانية  •  ✓ أسعار تنافسية  •  ✓ ضمان الجودة
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center bg-white/10 rounded-2xl p-4 backdrop-blur"
                >
                  <Icon className="h-7 w-7 mx-auto mb-2 text-yellow-300" />
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-700 px-6 py-2">
              <Sparkles className="h-4 w-4 ml-2" />
              خدماتنا
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              خدمات تنظيف وتعقيم متكاملة
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              نقدم باقة شاملة من خدمات التنظيف والتعقيم للمنازل والمكاتب والمنشآت
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 h-full group">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-gray-800">{service.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <a href="https://wa.me/0563177803" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 h-auto py-3">
                <Phone className="h-5 w-5 ml-2" />
                اطلب خدمة غير مدرجة
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-700 px-6 py-2">
              <Award className="h-4 w-4 ml-2" />
              لماذا تختارنا
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              نتميز بالاحترافية والجودة
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              نلتزم بأعلى معايير الجودة والسلامة في كل خدمة نقدمها
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full text-center">
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
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-700 px-6 py-2">
              <Zap className="h-4 w-4 ml-2" />
              كيف نعمل
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              أربع خطوات بسيطة
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                      {step.num}
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-800">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </CardContent>
                </Card>
                {idx < steps.length - 1 && (
                  <ChevronLeft className="hidden lg:block absolute top-1/2 -left-3 -translate-y-1/2 h-6 w-6 text-purple-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badge className="mb-4 bg-purple-100 text-purple-700 px-4 py-1.5">
                <Heart className="h-4 w-4 ml-2" />
                من نحن
              </Badge>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                شركة متخصصة في التنظيف والتعقيم
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                Royal Haroon للتنظيف والتعقيم شركة إماراتية رائدة تقدم خدمات تنظيف
                احترافية للمنازل والفلل والمكاتب والمنشآت التجارية في جميع إمارات الدولة.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                نعتمد على فريق من العمال المدربين والمواد المعتمدة صحياً لنضمن لك
                نظافة فائقة وتعقيماً آمناً. هدفنا هو راحتك ورضاك التام.
              </p>
              <Link to={createPageUrl('About')}>
                <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                  تعرف علينا أكثر
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Shield, label: 'مواد معتمدة' },
                { icon: Users, label: 'فريق محترف' },
                { icon: Leaf, label: 'صديق للبيئة' },
                { icon: ThumbsUp, label: 'رضاك مضمون' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Card key={idx} className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <Icon className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                      <p className="font-semibold text-gray-700">{item.label}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="h-14 w-14 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">جاهز لخدمة تنظيف احترافية؟</h2>
          <p className="text-xl mb-8 opacity-90">
            تواصل معنا الآن واحصل على معاينة مجانية وعرض سعر مناسب
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://wa.me/0563177803" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 h-auto py-4">
                <Phone className="h-5 w-5 ml-2" />
                اتصل: 0563177803
              </Button>
            </a>
            <Link to={createPageUrl('OnlineBookingPublic')}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 h-auto py-4">
                احجز أونلاين
                <ArrowRight className="h-5 w-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Royal Haroon</span>
                  <p className="text-xs text-gray-400">للتنظيف والتعقيم</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                شركة إماراتية رائدة في خدمات التنظيف والتعقيم للمنازل والمكاتب والمنشآت
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">روابط سريعة</h3>
              <div className="space-y-2 text-sm">
                <Link to={createPageUrl('About')} className="block text-gray-400 hover:text-white">من نحن</Link>
                <Link to={createPageUrl('OnlineBookingPublic')} className="block text-gray-400 hover:text-white">احجز خدمة</Link>
                <Link to={createPageUrl('Dashboard')} className="block text-gray-400 hover:text-white">لوحة التحكم</Link>
                <Link to={createPageUrl('Pricing')} className="block text-gray-400 hover:text-white">الأسعار</Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">السياسات والقوانين</h3>
              <div className="space-y-2 text-sm">
                <Link to={createPageUrl('Privacy')} className="block text-gray-400 hover:text-white">سياسة الخصوصية</Link>
                <Link to={createPageUrl('Terms')} className="block text-gray-400 hover:text-white">الشروط والأحكام</Link>
                <Link to={createPageUrl('Licenses')} className="block text-gray-400 hover:text-white">التراخيص</Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">تواصل معنا</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-purple-400" />
                  <a href="tel:0563177803" className="hover:text-white">0563177803</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-400" />
                  <a href="mailto:info@royalharoon.com" className="hover:text-white">info@royalharoon.com</a>
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-400" />
                  دبي، الإمارات العربية المتحدة
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  متاحون 24/7
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
            <p>© 2026 Royal Haroon Cleaning and Disinfection Services — جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
}