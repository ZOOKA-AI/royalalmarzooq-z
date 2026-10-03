import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, CheckCircle, TrendingUp, Shield, Zap, Users,
  Bot, MapPin, Camera, BarChart3, MessageSquare, Star,
  ArrowRight, Phone, Mail, Globe, Award, Rocket, Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

const features = [
  { icon: Bot, title: 'ذكاء اصطناعي متقدم', desc: 'AI يدير أعمالك تلقائياً' },
  { icon: MapPin, title: 'تتبع GPS حي', desc: 'راقب عمالك لحظة بلحظة' },
  { icon: Camera, title: 'مولد صور AI', desc: 'صور احترافية بالذكاء الاصطناعي' },
  { icon: BarChart3, title: 'تقارير متقدمة', desc: 'تحليلات ذكية ومفصلة' },
  { icon: MessageSquare, title: 'شات بوت ذكي', desc: 'دعم تلقائي 24/7' },
  { icon: Shield, title: 'أمان عالمي', desc: 'تشفير 256-bit SSL' }
];

const stats = [
  { value: '500+', label: 'شركة تثق بنا' },
  { value: '10K+', label: 'طلب يومياً' },
  { value: '99.9%', label: 'وقت متاح' },
  { value: '24/7', label: 'دعم فوري' }
];

const testimonials = [
  {
    name: 'أحمد العلي',
    company: 'شركة النظافة المثالية',
    text: 'Royal Haroon غيرت طريقة عملنا بالكامل! زادت إنتاجيتنا 300% في 3 أشهر فقط.',
    rating: 5
  },
  {
    name: 'سارة محمد',
    company: 'خدمات التنظيف الذكي',
    text: 'الذكاء الاصطناعي رهيب! يوفر علينا ساعات من العمل اليومي.',
    rating: 5
  },
  {
    name: 'خالد السعيد',
    company: 'مؤسسة البريق',
    text: 'أفضل استثمار قمنا به. النظام سهل ومتطور جداً!',
    rating: 5
  }
];

const comparisons = [
  { feature: 'ذكاء اصطناعي', us: true, others: false },
  { feature: 'تتبع GPS', us: true, others: '⚠️ محدود' },
  { feature: 'مولد محتوى', us: true, others: false },
  { feature: 'شات بوت صوتي', us: true, others: false },
  { feature: 'تقارير ذكية', us: true, others: '⚠️ بسيطة' },
  { feature: 'السعر', us: '299 درهم', others: '500+ درهم' }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-2 text-lg">
              <Sparkles className="h-5 w-5 ml-2" />
              الأكثر تطوراً في المنطقة
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              مستقبل إدارة الأعمال
              <br />
              <span className="text-yellow-300">بالذكاء الاصطناعي</span>
            </h1>
            
            <p className="text-2xl md:text-3xl mb-10 opacity-90 max-w-4xl mx-auto leading-relaxed">
              منصة شاملة تدير شركتك تلقائياً وتضاعف أرباحك بتقنيات AI المتطورة
            </p>
            
            <div className="flex gap-6 justify-center flex-wrap">
              <Link to={createPageUrl('Dashboard')}>
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-10 py-7 h-auto">
                  <Rocket className="h-6 w-6 ml-3" />
                  ابدأ مجاناً الآن
                </Button>
              </Link>
              <a href="https://wa.me/0563177803" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-xl px-10 py-7 h-auto">
                  <Phone className="h-6 w-6 ml-3" />
                  تحدث مع خبير
                </Button>
              </a>
            </div>
            
            <p className="mt-8 text-white/80">
              ✓ بدون بطاقة ائتمان  •  ✓ تفعيل فوري  •  ✓ إلغاء في أي وقت
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 px-6 py-2">
              <Zap className="h-4 w-4 ml-2" />
              ميزات متطورة
            </Badge>
            <h2 className="text-5xl font-bold mb-4">كل ما تحتاجه في مكان واحد</h2>
            <p className="text-xl text-gray-600">أدوات قوية لإدارة أعمالك بكفاءة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 h-full">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                        <Icon className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-gray-600 text-lg">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">لماذا Royal Haroon؟</h2>
            <p className="text-xl text-gray-600">نحن الأفضل، والأرقام تثبت ذلك</p>
          </div>

          <Card className="border-0 shadow-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <tr>
                  <th className="p-6 text-right text-xl">الميزة</th>
                  <th className="p-6 text-center text-xl">
                    <Crown className="h-6 w-6 inline mb-1 ml-2" />
                    Royal Haroon
                  </th>
                  <th className="p-6 text-center text-xl">المنافسون</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {comparisons.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-6 font-semibold text-lg">{comp.feature}</td>
                    <td className="p-6 text-center">
                      {typeof comp.us === 'boolean' ? (
                        comp.us ? (
                          <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400 text-2xl">✕</span>
                        )
                      ) : (
                        <span className="font-bold text-purple-600 text-lg">{comp.us}</span>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {typeof comp.others === 'boolean' ? (
                        comp.others ? (
                          <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400 text-2xl">✕</span>
                        )
                      ) : (
                        <span className="text-gray-500 text-lg">{comp.others}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 px-6 py-2">
              <Star className="h-4 w-4 ml-2" />
              آراء العملاء
            </Badge>
            <h2 className="text-5xl font-bold mb-4">ماذا يقول عملاؤنا</h2>
            <p className="text-xl text-gray-600">قصص نجاح حقيقية من شركات مثلك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">"{test.text}"</p>
                    <div>
                      <p className="font-bold text-lg">{test.name}</p>
                      <p className="text-gray-500">{test.company}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Award className="h-20 w-20 mx-auto mb-8" />
          <h2 className="text-6xl font-bold mb-6">جاهز لتحويل عملك؟</h2>
          <p className="text-2xl mb-10 opacity-90">
            انضم لمئات الشركات التي ضاعفت أرباحها مع Royal Haroon
          </p>
          <div className="flex gap-6 justify-center flex-wrap mb-8">
            <Link to={createPageUrl('Pricing')}>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-12 py-7 h-auto">
                <TrendingUp className="h-6 w-6 ml-3" />
                اشترك الآن
              </Button>
            </Link>
            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-xl px-12 py-7 h-auto">
                جرب مجاناً
                <ArrowRight className="h-6 w-6 mr-3" />
              </Button>
            </Link>
          </div>
          <p className="text-lg opacity-80">
            📞 اتصل بنا: <a href="tel:0563177803" className="underline hover:no-underline">0563177803</a>
            {' • '}
            📧 <a href="mailto:info@royal-cleaning.com" className="underline hover:no-underline">info@royal-cleaning.com</a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold">Royal Haroon</span>
              </div>
              <p className="text-gray-400">
                منصة إدارة الأعمال الأذكى في المنطقة
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-lg">الشركة</h3>
              <div className="space-y-2">
                <Link to={createPageUrl('About')} className="block text-gray-400 hover:text-white">من نحن</Link>
                <Link to={createPageUrl('Blog')} className="block text-gray-400 hover:text-white">المدونة</Link>
                <Link to={createPageUrl('Pricing')} className="block text-gray-400 hover:text-white">الأسعار</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-lg">قانوني</h3>
              <div className="space-y-2">
                <Link to={createPageUrl('Privacy')} className="block text-gray-400 hover:text-white">الخصوصية</Link>
                <Link to={createPageUrl('Terms')} className="block text-gray-400 hover:text-white">الشروط</Link>
                <Link to={createPageUrl('Licenses')} className="block text-gray-400 hover:text-white">التراخيص</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-lg">تواصل معنا</h3>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  0563177803
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  info@royal-cleaning.com
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  دبي، الإمارات
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 Royal Haroon - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
}