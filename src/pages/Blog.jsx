import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Calendar, User, Search, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

const articles = [
  {
    id: 1,
    title: 'كيف يغير الذكاء الاصطناعي صناعة التنظيف في 2026',
    excerpt: 'استكشف كيف تُحدث تقنيات AI ثورة في إدارة شركات التنظيف وتحسين الكفاءة التشغيلية بنسبة تصل إلى 300%.',
    category: 'ذكاء اصطناعي',
    date: '23 يناير 2026',
    author: 'فريق رويال',
    readTime: '5 دقائق',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
    featured: true
  },
  {
    id: 2,
    title: '10 نصائح لزيادة إيرادات شركة التنظيف 200%',
    excerpt: 'استراتيجيات مجربة لتنمية أعمالك وزيادة الأرباح من خلال التسويق الذكي وإدارة العملاء الفعالة.',
    category: 'إدارة الأعمال',
    date: '20 يناير 2026',
    author: 'أحمد الخبير',
    readTime: '8 دقائق',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'دليل شامل لبرامج الولاء للعملاء',
    excerpt: 'كيف تصمم برنامج ولاء فعال يزيد من معدل العملاء العائدين ويضاعف قيمة العميل.',
    category: 'تسويق',
    date: '18 يناير 2026',
    author: 'سارة المسوقة',
    readTime: '6 دقائق',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'تتبع GPS للعمال: ضرورة أم رفاهية؟',
    excerpt: 'تعرف على فوائد تتبع مواقع العمال في الوقت الفعلي وكيف يحسن جودة الخدمة ويقلل التكاليف.',
    category: 'تقنية',
    date: '15 يناير 2026',
    author: 'محمد التقني',
    readTime: '7 دقائق',
    image: 'https://images.unsplash.com/photo-1569025743873-ea3a9ade89f9?w=800&auto=format&fit=crop'
  },
  {
    id: 5,
    title: 'أفضل ممارسات خدمة العملاء في قطاع التنظيف',
    excerpt: 'أساليب مجربة لتحسين رضا العملاء وبناء سمعة قوية لشركتك في السوق.',
    category: 'خدمة العملاء',
    date: '12 يناير 2026',
    author: 'ليلى الخدمات',
    readTime: '5 دقائق',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop'
  },
  {
    id: 6,
    title: 'كيف تحول عملك الصغير إلى إمبراطورية تنظيف',
    excerpt: 'قصص نجاح ملهمة ونصائح عملية من شركات بدأت صغيرة ونمت لتصبح قادة السوق.',
    category: 'قصص نجاح',
    date: '10 يناير 2026',
    author: 'فريق رويال',
    readTime: '10 دقائق',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop'
  }
];

const categories = ['الكل', 'ذكاء اصطناعي', 'إدارة الأعمال', 'تسويق', 'تقنية', 'خدمة العملاء', 'قصص نجاح'];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.includes(searchTerm) || article.excerpt.includes(searchTerm);
    const matchesCategory = selectedCategory === 'الكل' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = articles.find(a => a.featured);

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
            <BookOpen className="h-4 w-4 ml-2 inline" />
            مدونة رويال
          </Badge>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            مقالات وأفكار ملهمة
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نشارك معك أحدث الاتجاهات، النصائح، والأفكار لمساعدتك على النجاح في عالم الأعمال
          </p>
        </motion.div>

        {/* Search & Filter */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="ابحث في المقالات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12 h-14 text-lg"
            />
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'bg-purple-600' : ''}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && selectedCategory === 'الكل' && !searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <Card className="border-0 shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div 
                  className="h-80 lg:h-auto bg-cover bg-center"
                  style={{ backgroundImage: `url(${featuredArticle.image})` }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                    <Badge className="bg-yellow-500 text-white">
                      <Sparkles className="h-4 w-4 ml-2" />
                      مميز
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-10 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-purple-100 text-purple-700">{featuredArticle.category}</Badge>
                  <h2 className="text-4xl font-bold mb-4 text-gray-800 leading-tight">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {featuredArticle.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {featuredArticle.author}
                    </span>
                    <span>{featuredArticle.readTime}</span>
                  </div>
                  <Button className="w-fit bg-purple-600 hover:bg-purple-700">
                    اقرأ المقال
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredArticles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 h-full">
                <div 
                  className="h-48 bg-cover bg-center rounded-t-xl"
                  style={{ backgroundImage: `url(${article.image})` }}
                />
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-purple-100 text-purple-700">{article.category}</Badge>
                  <CardTitle className="text-xl leading-tight hover:text-purple-600 transition-colors cursor-pointer">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </span>
                    <span>{article.readTime}</span>
                  </div>
                  <Button variant="ghost" className="w-full justify-between group">
                    اقرأ المزيد
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-12 text-center">
              <TrendingUp className="h-16 w-16 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">اشترك في النشرة البريدية</h2>
              <p className="text-xl mb-8 opacity-90">
                احصل على أحدث المقالات والنصائح مباشرة في بريدك
              </p>
              <div className="flex gap-4 max-w-xl mx-auto">
                <Input 
                  placeholder="بريدك الإلكتروني..." 
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-14"
                  dir="ltr"
                />
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 whitespace-nowrap h-14">
                  اشترك الآن
                </Button>
              </div>
              <p className="text-sm mt-4 opacity-75">
                نرسل مقالاً واحداً أسبوعياً فقط. لا بريد مزعج.
              </p>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}