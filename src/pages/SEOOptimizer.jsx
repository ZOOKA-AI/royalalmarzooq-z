import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from '@/api/base44Client';
import { 
  Search, Sparkles, TrendingUp, Globe, Target, 
  Zap, Check, AlertCircle, Copy, Download, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function SEOOptimizer() {
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [seoReport, setSeoReport] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);

  const analyzeSEO = async () => {
    if (!url) {
      toast.error('أدخل رابط الموقع');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت خبير SEO محترف. حلل هذا الموقع وقدم تقرير مفصل:

الموقع: ${url}
الكلمات المفتاحية: ${keywords || 'لا يوجد'}

قدم تحليل شامل يتضمن:
1. نقاط القوة والضعف في SEO
2. تقييم الكلمات المفتاحية (0-100)
3. تقييم المحتوى (0-100)
4. تقييم الروابط (0-100)
5. تقييم السرعة (0-100)
6. توصيات مفصلة للتحسين
7. كلمات مفتاحية مقترحة (20 كلمة)
8. عناوين meta مقترحة
9. أوصاف meta مقترحة
10. استراتيجية backlinks`,
        response_json_schema: {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            keyword_score: { type: "number" },
            content_score: { type: "number" },
            links_score: { type: "number" },
            speed_score: { type: "number" },
            strengths: { type: "array", items: { type: "string" } },
            weaknesses: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            suggested_keywords: { type: "array", items: { type: "string" } },
            meta_titles: { type: "array", items: { type: "string" } },
            meta_descriptions: { type: "array", items: { type: "string" } },
            backlink_strategy: { type: "string" }
          }
        }
      });

      setSeoReport(response);
      toast.success('تم التحليل بنجاح! 🎯');
    } catch (error) {
      toast.error('فشل التحليل');
    } finally {
      setAnalyzing(false);
    }
  };

  const generateSEOContent = async (type) => {
    if (!keywords) {
      toast.error('أدخل الكلمات المفتاحية');
      return;
    }

    setGenerating(true);
    try {
      const prompts = {
        article: `اكتب مقال SEO محسّن 2000 كلمة حول "${keywords}" - استخدم H1, H2, H3، كلمات مفتاحية طبيعية، روابط داخلية`,
        product: `اكتب وصف منتج SEO محسّن لـ "${keywords}" - عنوان جذاب، مميزات، فوائد، CTA قوي`,
        landing: `اكتب محتوى صفحة هبوط SEO محسّن لـ "${keywords}" - عنوان رئيسي، عناوين فرعية، نقاط البيع، شهادات، CTA`,
        blog: `اكتب منشور مدونة SEO محسّن 1500 كلمة حول "${keywords}" - مقدمة، نقاط رئيسية، خاتمة، CTA`
      };

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompts[type],
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            meta_title: { type: "string" },
            meta_description: { type: "string" },
            content: { type: "string" },
            keywords_used: { type: "array", items: { type: "string" } },
            word_count: { type: "number" }
          }
        }
      });

      setGeneratedContent(response);
      toast.success('تم التوليد! 🎉');
    } catch (error) {
      toast.error('فشل التوليد');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ 📋');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">محسن SEO الذكي</h1>
          <p className="text-gray-500">تحليل وتحسين محركات البحث بالذكاء الاصطناعي</p>
        </div>
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2">
          <Sparkles className="h-4 w-4 ml-2" />
          مجاني 100%
        </Badge>
      </div>

      <Tabs defaultValue="analyze" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyze">تحليل SEO</TabsTrigger>
          <TabsTrigger value="generate">توليد محتوى SEO</TabsTrigger>
        </TabsList>

        {/* تحليل SEO */}
        <TabsContent value="analyze" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-600" />
                تحليل الموقع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">رابط الموقع</label>
                <Input
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الكلمات المفتاحية (اختياري)</label>
                <Input
                  placeholder="تنظيف، تعقيم، مكافحة حشرات"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
              <Button 
                onClick={analyzeSEO}
                disabled={analyzing}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                    جاري التحليل...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 ml-2" />
                    تحليل الآن
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* نتائج التحليل */}
          {seoReport && (
            <div className="space-y-4">
              {/* النتيجة الإجمالية */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                <CardContent className="p-6 text-center">
                  <p className="text-sm opacity-90 mb-2">النتيجة الإجمالية</p>
                  <p className="text-6xl font-bold">{seoReport.overall_score}/100</p>
                  <p className="text-sm mt-2 opacity-90">
                    {seoReport.overall_score >= 80 ? '🎉 ممتاز' : seoReport.overall_score >= 60 ? '👍 جيد' : '⚠️ يحتاج تحسين'}
                  </p>
                </CardContent>
              </Card>

              {/* النتائج التفصيلية */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500 mb-2">الكلمات المفتاحية</p>
                    <p className="text-2xl font-bold text-purple-600">{seoReport.keyword_score}</p>
                    <Progress value={seoReport.keyword_score} className="mt-2" />
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500 mb-2">المحتوى</p>
                    <p className="text-2xl font-bold text-blue-600">{seoReport.content_score}</p>
                    <Progress value={seoReport.content_score} className="mt-2" />
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500 mb-2">الروابط</p>
                    <p className="text-2xl font-bold text-green-600">{seoReport.links_score}</p>
                    <Progress value={seoReport.links_score} className="mt-2" />
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500 mb-2">السرعة</p>
                    <p className="text-2xl font-bold text-orange-600">{seoReport.speed_score}</p>
                    <Progress value={seoReport.speed_score} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                {/* نقاط القوة */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <Check className="h-5 w-5" />
                      نقاط القوة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {seoReport.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* نقاط الضعف */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                      نقاط الضعف
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {seoReport.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* التوصيات */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    توصيات التحسين
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {seoReport.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm">{r}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* الكلمات المفتاحية المقترحة */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    كلمات مفتاحية مقترحة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {seoReport.suggested_keywords.map((k, i) => (
                      <Badge key={i} variant="outline" className="cursor-pointer hover:bg-blue-50" onClick={() => copyToClipboard(k)}>
                        {k}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* توليد محتوى SEO */}
        <TabsContent value="generate" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                توليد محتوى محسّن لمحركات البحث
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">الكلمات المفتاحية</label>
                <Input
                  placeholder="مثال: تنظيف منازل في دبي"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => generateSEOContent('article')}
                  disabled={generating}
                  variant="outline"
                  className="h-auto py-4 flex-col"
                >
                  <Globe className="h-6 w-6 mb-2 text-purple-600" />
                  <span className="font-bold">مقال SEO</span>
                  <span className="text-xs text-gray-500">2000 كلمة</span>
                </Button>
                <Button
                  onClick={() => generateSEOContent('product')}
                  disabled={generating}
                  variant="outline"
                  className="h-auto py-4 flex-col"
                >
                  <Target className="h-6 w-6 mb-2 text-blue-600" />
                  <span className="font-bold">وصف منتج</span>
                  <span className="text-xs text-gray-500">محسّن للبيع</span>
                </Button>
                <Button
                  onClick={() => generateSEOContent('landing')}
                  disabled={generating}
                  variant="outline"
                  className="h-auto py-4 flex-col"
                >
                  <Zap className="h-6 w-6 mb-2 text-orange-600" />
                  <span className="font-bold">صفحة هبوط</span>
                  <span className="text-xs text-gray-500">عالية التحويل</span>
                </Button>
                <Button
                  onClick={() => generateSEOContent('blog')}
                  disabled={generating}
                  variant="outline"
                  className="h-auto py-4 flex-col"
                >
                  <TrendingUp className="h-6 w-6 mb-2 text-green-600" />
                  <span className="font-bold">منشور مدونة</span>
                  <span className="text-xs text-gray-500">1500 كلمة</span>
                </Button>
              </div>

              {generating && (
                <div className="text-center py-8">
                  <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600">جاري توليد محتوى SEO محترف...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* المحتوى المولّد */}
          {generatedContent && (
            <div className="space-y-4">
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{generatedContent.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedContent.content)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Meta Title</p>
                      <p className="text-sm font-medium">{generatedContent.meta_title}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">عدد الكلمات</p>
                      <p className="text-sm font-medium">{generatedContent.word_count} كلمة</p>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Meta Description</p>
                    <p className="text-sm">{generatedContent.meta_description}</p>
                  </div>

                  <div className="p-4 bg-white border rounded-lg max-h-96 overflow-y-auto">
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: generatedContent.content.replace(/\n/g, '<br/>') }} />
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">الكلمات المفتاحية المستخدمة:</p>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.keywords_used.map((k, i) => (
                        <Badge key={i} className="bg-purple-100 text-purple-700">
                          {k}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}