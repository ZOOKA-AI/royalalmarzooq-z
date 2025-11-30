import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Sparkles, ImageIcon, Video, Calendar, Send, Download, Copy, RefreshCw,
  Instagram, Facebook, Clock, CheckCircle, Loader2, Wand2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { ar } from 'date-fns/locale';

const platforms = [
  { id: 'instagram', name: 'انستغرام', icon: Instagram },
  { id: 'facebook', name: 'فيسبوك', icon: Facebook },
  { id: 'tiktok', name: 'تيك توك', icon: Video },
  { id: 'x', name: 'X (تويتر)', icon: Send },
];

const contentTypes = [
  { id: 'promo', name: 'عرض ترويجي', emoji: '🎉' },
  { id: 'tips', name: 'نصائح تنظيف', emoji: '💡' },
  { id: 'before_after', name: 'قبل وبعد', emoji: '✨' },
  { id: 'service', name: 'تعريف بخدمة', emoji: '🧹' },
  { id: 'testimonial', name: 'رأي عميل', emoji: '⭐' },
  { id: 'seasonal', name: 'موسمي/مناسبات', emoji: '🎊' },
];

export default function ContentGenerator() {
  const [activeTab, setActiveTab] = useState('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [monthlyPlan, setMonthlyPlan] = useState([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const [contentForm, setContentForm] = useState({
    platform: 'instagram',
    type: 'promo',
    service: 'تنظيف كنب',
    customTopic: '',
  });

  const services = [
    'تنظيف كنب', 'تنظيف سجاد', 'تنظيف ستائر', 'تنظيف خزانات',
    'تنظيف مطابخ', 'تنظيف شقق', 'تنظيف فلل', 'مكافحة حشرات',
    'تنظيف مكيفات', 'تسليك بواليع'
  ];

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت خبير تسويق رقمي لشركة رويال للتنظيف والتعقيم ومكافحة الحشرات في الإمارات.

أنشئ محتوى لمنصة ${contentForm.platform} من نوع "${contentTypes.find(t => t.id === contentForm.type)?.name}".
الخدمة المستهدفة: ${contentForm.service}
${contentForm.customTopic ? `موضوع إضافي: ${contentForm.customTopic}` : ''}

المطلوب:
1. نص المنشور (مناسب للمنصة، جذاب، مع إيموجي)
2. هاشتاقات مناسبة (10 هاشتاقات)
3. أفضل وقت للنشر
4. وصف الصورة/الفيديو المقترح
5. دعوة للتفاعل (CTA)

معلومات الشركة:
- رقم التواصل: 0563177803
- نعمل 24 ساعة
- خدمة في جميع الإمارات`,
        response_json_schema: {
          type: "object",
          properties: {
            post_text: { type: "string" },
            hashtags: { type: "array", items: { type: "string" } },
            best_time: { type: "string" },
            image_description: { type: "string" },
            cta: { type: "string" }
          }
        }
      });

      const content = response || {};
      setGeneratedContent({
        post_text: content.post_text || 'محتوى تجريبي للمنشور',
        hashtags: content.hashtags || ['#رويال_للتنظيف', '#تنظيف_الإمارات'],
        best_time: content.best_time || '8:00 مساءً',
        image_description: content.image_description || 'صورة احترافية لخدمات التنظيف',
        cta: content.cta || 'تواصل معنا الآن!'
      });
      toast.success('تم توليد المحتوى بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ في توليد المحتوى');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!generatedContent?.image_description) {
      toast.error('يرجى توليد المحتوى أولاً');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await base44.integrations.Core.GenerateImage({
        prompt: `Professional cleaning company advertisement in UAE style. ${generatedContent.image_description}. Modern, clean design with purple and white colors. Arabic text welcome. High quality, professional look.`
      });

      setGeneratedImage(response.url);
      toast.success('تم توليد الصورة بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ في توليد الصورة');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMonthlyPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت خبير تسويق رقمي. أنشئ خطة محتوى شهرية لشركة رويال للتنظيف في الإمارات.

أنشئ 30 منشور (منشور يومي) يتضمن:
- تنويع بين المنصات (انستغرام، فيسبوك، تيك توك، X)
- تنويع أنواع المحتوى (عروض، نصائح، قبل وبعد، شهادات عملاء)
- مراعاة المناسبات والأعياد
- توزيع على الخدمات المختلفة

لكل منشور: التاريخ، المنصة، نوع المحتوى، الخدمة، ملخص المحتوى، أفضل وقت`,
        response_json_schema: {
          type: "object",
          properties: {
            posts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  platform: { type: "string" },
                  content_type: { type: "string" },
                  service: { type: "string" },
                  summary: { type: "string" },
                  time: { type: "string" }
                }
              }
            }
          }
        }
      });

      const posts = response?.posts || [];
      const planWithDates = posts.length > 0 
        ? posts.map((post, idx) => ({
            ...post,
            date: format(addDays(new Date(), idx), 'yyyy-MM-dd'),
            status: 'مجدول'
          }))
        : Array.from({ length: 30 }, (_, idx) => ({
            day: idx + 1,
            platform: platforms[idx % 4].name,
            content_type: contentTypes[idx % 6].name,
            service: services[idx % services.length],
            summary: `محتوى اليوم ${idx + 1} - ${services[idx % services.length]}`,
            time: idx % 2 === 0 ? '8:00 مساءً' : '12:00 ظهراً',
            date: format(addDays(new Date(), idx), 'yyyy-MM-dd'),
            status: 'مجدول'
          }));

      setMonthlyPlan(planWithDates);
      toast.success('تم إنشاء الخطة الشهرية!');
    } catch (error) {
      toast.error('حدث خطأ في إنشاء الخطة');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ!');
  };

  const getPlatformIcon = (platform) => {
    const p = platforms.find(pl => pl.id === platform || pl.name.includes(platform));
    return p ? p.icon : Send;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          مولد المحتوى الذكي
        </h1>
        <p className="text-gray-500">توليد محتوى وصور تلقائياً للسوشيال ميديا</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            توليد محتوى
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            توليد صور
          </TabsTrigger>
          <TabsTrigger value="plan" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            خطة شهرية
          </TabsTrigger>
        </TabsList>

        {/* Generate Content Tab */}
        <TabsContent value="generate" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>إعدادات المحتوى</CardTitle>
              <CardDescription>اختر المنصة ونوع المحتوى لتوليده تلقائياً</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>المنصة</Label>
                  <Select value={contentForm.platform} onValueChange={(v) => setContentForm({...contentForm, platform: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>نوع المحتوى</Label>
                  <Select value={contentForm.type} onValueChange={(v) => setContentForm({...contentForm, type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.emoji} {t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>الخدمة</Label>
                <Select value={contentForm.service} onValueChange={(v) => setContentForm({...contentForm, service: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>موضوع إضافي (اختياري)</Label>
                <Input
                  value={contentForm.customTopic}
                  onChange={(e) => setContentForm({...contentForm, customTopic: e.target.value})}
                  placeholder="مثال: عرض خاص لشهر رمضان"
                />
              </div>

              <Button 
                onClick={generateContent} 
                disabled={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <><Loader2 className="h-4 w-4 ml-2 animate-spin" /> جاري التوليد...</>
                ) : (
                  <><Sparkles className="h-4 w-4 ml-2" /> توليد المحتوى</>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedContent && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>المحتوى المُولَّد</span>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent.post_text)}>
                    <Copy className="h-4 w-4 ml-1" /> نسخ
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="whitespace-pre-wrap text-gray-800">{generatedContent.post_text}</p>
                </div>

                <div>
                  <Label className="text-sm text-gray-500">الهاشتاقات</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {generatedContent.hashtags?.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="cursor-pointer" onClick={() => copyToClipboard(tag)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600 mb-1">أفضل وقت للنشر</p>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {generatedContent.best_time}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 mb-1">دعوة للتفاعل</p>
                    <p className="font-medium text-sm">{generatedContent.cta}</p>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">وصف الصورة المقترحة</p>
                  <p className="text-sm">{generatedContent.image_description}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Image Generation Tab */}
        <TabsContent value="image" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>توليد صورة بالذكاء الاصطناعي</CardTitle>
              <CardDescription>إنشاء صور احترافية للمنشورات تلقائياً</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedContent?.image_description ? (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">وصف الصورة:</p>
                  <p>{generatedContent.image_description}</p>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 rounded-xl text-yellow-700">
                  يرجى توليد المحتوى أولاً للحصول على وصف الصورة
                </div>
              )}

              <Button 
                onClick={generateImage} 
                disabled={isGenerating || !generatedContent}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
              >
                {isGenerating ? (
                  <><Loader2 className="h-4 w-4 ml-2 animate-spin" /> جاري توليد الصورة...</>
                ) : (
                  <><ImageIcon className="h-4 w-4 ml-2" /> توليد الصورة</>
                )}
              </Button>

              {generatedImage && (
                <div className="space-y-3">
                  <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="w-full rounded-xl shadow-lg"
                  />
                  <div className="flex gap-2">
                    <a href={generatedImage} download className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 ml-2" /> تحميل
                      </Button>
                    </a>
                    <Button variant="outline" onClick={generateImage}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Plan Tab */}
        <TabsContent value="plan" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>خطة النشر الشهرية</CardTitle>
                  <CardDescription>جدول محتوى تلقائي لـ 30 يوم</CardDescription>
                </div>
                <Button 
                  onClick={generateMonthlyPlan}
                  disabled={isGeneratingPlan}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isGeneratingPlan ? (
                    <><Loader2 className="h-4 w-4 ml-2 animate-spin" /> جاري الإنشاء...</>
                  ) : (
                    <><Calendar className="h-4 w-4 ml-2" /> إنشاء خطة جديدة</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {monthlyPlan.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>اضغط على "إنشاء خطة جديدة" لتوليد جدول المحتوى الشهري</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {monthlyPlan.map((post, idx) => {
                    const PlatformIcon = getPlatformIcon(post.platform);
                    return (
                      <div 
                        key={idx}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors"
                      >
                        <div className="text-center min-w-[60px]">
                          <p className="text-xs text-gray-500">يوم {post.day}</p>
                          <p className="font-bold text-purple-600">{format(new Date(post.date), 'dd MMM', { locale: ar })}</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <PlatformIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{post.content_type}</Badge>
                            <Badge className="bg-purple-100 text-purple-700">{post.service}</Badge>
                          </div>
                          <p className="text-sm text-gray-700">{post.summary}</p>
                        </div>
                        <div className="text-left text-sm text-gray-500">
                          <p className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.time}
                          </p>
                          <Badge className="bg-green-100 text-green-700 mt-1">
                            <CheckCircle className="h-3 w-3 ml-1" />
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}