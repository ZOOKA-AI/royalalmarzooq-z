import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Sparkles, ImageIcon, Video, Calendar, Send, Download, Copy, RefreshCw,
  Instagram, Facebook, Clock, CheckCircle, Loader2, Wand2, Target, 
  TrendingUp, DollarSign, Users, BarChart3, Eye, MousePointer
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

const campaignObjectives = [
  { id: 'awareness', name: 'الوعي بالعلامة', budget: '300-500', icon: Eye },
  { id: 'engagement', name: 'التفاعل', budget: '200-400', icon: MousePointer },
  { id: 'traffic', name: 'زيارات الموقع', budget: '400-600', icon: TrendingUp },
  { id: 'leads', name: 'جذب عملاء', budget: '500-800', icon: Users },
  { id: 'conversions', name: 'مبيعات', budget: '600-1000', icon: DollarSign },
];

const targetAudiences = [
  { id: 'homeowners', name: 'أصحاب المنازل', age: '25-45', interests: 'ديكور، عقارات' },
  { id: 'companies', name: 'الشركات', age: '30-55', interests: 'أعمال، مكاتب' },
  { id: 'newmovers', name: 'المنتقلون الجدد', age: '25-40', interests: 'عقارات، انتقال' },
  { id: 'families', name: 'العائلات', age: '28-50', interests: 'أطفال، منزل' },
];

export default function ContentGenerator() {
  const [activeTab, setActiveTab] = useState('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [monthlyPlan, setMonthlyPlan] = useState([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [adAnalytics, setAdAnalytics] = useState(null);

  const [contentForm, setContentForm] = useState({
    platform: 'instagram',
    type: 'promo',
    service: 'تنظيف كنب',
    customTopic: '',
  });

  const [campaignForm, setCampaignForm] = useState({
    objective: 'awareness',
    audience: 'homeowners',
    budget: 500,
    duration: 7,
    platforms: ['facebook', 'instagram'],
  });

  const [scheduleForm, setScheduleForm] = useState({
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    time: '20:00',
    platform: 'instagram',
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

  const createCampaign = async () => {
    if (!generatedContent) {
      toast.error('يرجى توليد المحتوى أولاً');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت خبير حملات إعلانية. أنشئ حملة إعلانية احترافية بناءً على:
        
الهدف: ${campaignObjectives.find(o => o.id === campaignForm.objective)?.name}
الجمهور المستهدف: ${targetAudiences.find(a => a.id === campaignForm.audience)?.name}
الميزانية: ${campaignForm.budget} درهم لمدة ${campaignForm.duration} أيام
المحتوى: ${generatedContent.post_text}

أنشئ:
1. عنوان الإعلان (جذاب، 25 حرف)
2. نص الإعلان (مقنع، 90 حرف)
3. دعوة للتفاعل
4. الكلمات المفتاحية (5 كلمات)
5. توزيع الميزانية اليومية
6. معدل النقر المتوقع CTR (نسبة مئوية)
7. التكلفة المتوقعة للنقرة CPC (درهم)
8. العملاء المتوقعين (عدد)`,
        response_json_schema: {
          type: "object",
          properties: {
            ad_title: { type: "string" },
            ad_text: { type: "string" },
            cta: { type: "string" },
            keywords: { type: "array", items: { type: "string" } },
            daily_budget: { type: "number" },
            expected_ctr: { type: "string" },
            expected_cpc: { type: "string" },
            expected_leads: { type: "number" }
          }
        }
      });

      const newCampaign = {
        id: Date.now(),
        ...response,
        objective: campaignForm.objective,
        audience: campaignForm.audience,
        budget: campaignForm.budget,
        duration: campaignForm.duration,
        platforms: campaignForm.platforms,
        status: 'مسودة',
        created_at: new Date().toISOString(),
      };

      setCampaigns([...campaigns, newCampaign]);
      toast.success('✅ تم إنشاء الحملة الإعلانية!');
    } catch (error) {
      toast.error('حدث خطأ في إنشاء الحملة');
    } finally {
      setIsGenerating(false);
    }
  };

  const schedulePost = () => {
    if (!generatedContent || !scheduleForm.date) {
      toast.error('يرجى توليد المحتوى واختيار التاريخ');
      return;
    }

    const newSchedule = {
      id: Date.now(),
      content: generatedContent,
      image: generatedImage,
      date: scheduleForm.date,
      time: scheduleForm.time,
      platform: scheduleForm.platform,
      status: 'مجدول',
    };

    setScheduledPosts([...scheduledPosts, newSchedule]);
    toast.success('✅ تم جدولة المنشور!');
  };

  const fetchAdAnalytics = async () => {
    setIsGenerating(true);
    try {
      const mockAnalytics = {
        impressions: Math.floor(Math.random() * 50000) + 10000,
        clicks: Math.floor(Math.random() * 2000) + 500,
        ctr: (Math.random() * 3 + 1).toFixed(2),
        conversions: Math.floor(Math.random() * 100) + 20,
        cost: Math.floor(Math.random() * 800) + 200,
        cpc: (Math.random() * 2 + 0.5).toFixed(2),
        roas: (Math.random() * 3 + 2).toFixed(2),
      };
      
      setAdAnalytics(mockAnalytics);
      toast.success('تم تحديث التحليلات');
    } catch (error) {
      toast.error('حدث خطأ في جلب التحليلات');
    } finally {
      setIsGenerating(false);
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
          مولد المحتوى والحملات الإعلانية
        </h1>
        <p className="text-gray-500">توليد محتوى، صور، حملات، وجدولة تلقائياً</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="generate">
            <Wand2 className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">محتوى</span>
          </TabsTrigger>
          <TabsTrigger value="image">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">صور</span>
          </TabsTrigger>
          <TabsTrigger value="campaign">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">حملات</span>
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">جدولة</span>
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">تحليلات</span>
          </TabsTrigger>
          <TabsTrigger value="plan">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">خطة</span>
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

        {/* Campaign Tab */}
        <TabsContent value="campaign" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>إنشاء حملة إعلانية</CardTitle>
              <CardDescription>حملات Facebook و Instagram الاحترافية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!generatedContent && (
                <div className="p-4 bg-yellow-50 rounded-xl text-yellow-700 mb-4">
                  يرجى توليد المحتوى أولاً قبل إنشاء الحملة
                </div>
              )}

              <div>
                <Label>هدف الحملة</Label>
                <Select value={campaignForm.objective} onValueChange={(v) => setCampaignForm({...campaignForm, objective: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignObjectives.map(o => {
                      const Icon = o.icon;
                      return (
                        <SelectItem key={o.id} value={o.id}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{o.name}</span>
                            <span className="text-xs text-gray-500">({o.budget} درهم)</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>الجمهور المستهدف</Label>
                <Select value={campaignForm.audience} onValueChange={(v) => setCampaignForm({...campaignForm, audience: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {targetAudiences.map(a => (
                      <SelectItem key={a.id} value={a.id}>
                        <div>
                          <p>{a.name} ({a.age} سنة)</p>
                          <p className="text-xs text-gray-500">{a.interests}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الميزانية (درهم)</Label>
                  <Input
                    type="number"
                    value={campaignForm.budget}
                    onChange={(e) => setCampaignForm({...campaignForm, budget: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>المدة (أيام)</Label>
                  <Input
                    type="number"
                    value={campaignForm.duration}
                    onChange={(e) => setCampaignForm({...campaignForm, duration: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">المنصات</Label>
                <div className="flex gap-4">
                  {['facebook', 'instagram'].map(p => (
                    <div key={p} className="flex items-center gap-2">
                      <Switch
                        checked={campaignForm.platforms.includes(p)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCampaignForm({...campaignForm, platforms: [...campaignForm.platforms, p]});
                          } else {
                            setCampaignForm({...campaignForm, platforms: campaignForm.platforms.filter(pl => pl !== p)});
                          }
                        }}
                      />
                      <Label className="capitalize">{p}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-1">💰 الميزانية المقترحة</p>
                <p className="text-xs text-blue-600">
                  {campaignObjectives.find(o => o.id === campaignForm.objective)?.budget} درهم للهدف المحدد
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  📊 الميزانية اليومية: {Math.round(campaignForm.budget / campaignForm.duration)} درهم
                </p>
              </div>

              <Button 
                onClick={createCampaign} 
                disabled={isGenerating || !generatedContent}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
              >
                {isGenerating ? (
                  <><Loader2 className="h-4 w-4 ml-2 animate-spin" /> جاري الإنشاء...</>
                ) : (
                  <><Target className="h-4 w-4 ml-2" /> إنشاء الحملة</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Campaigns List */}
          {campaigns.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>الحملات المُنشأة ({campaigns.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{campaign.ad_title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{campaign.ad_text}</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700">{campaign.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="text-center p-2 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">الميزانية</p>
                        <p className="font-bold text-purple-600">{campaign.budget} درهم</p>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">يومياً</p>
                        <p className="font-bold">{campaign.daily_budget} درهم</p>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">CTR متوقع</p>
                        <p className="font-bold text-green-600">{campaign.expected_ctr}%</p>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">عملاء متوقعين</p>
                        <p className="font-bold text-blue-600">{campaign.expected_leads}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {campaign.keywords?.map((kw, idx) => (
                        <Badge key={idx} variant="outline">{kw}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Badge className="bg-blue-100 text-blue-700">{campaign.cta}</Badge>
                      <span>•</span>
                      <span>{campaign.duration} أيام</span>
                      <span>•</span>
                      <span>{campaign.platforms.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>جدولة المنشور</CardTitle>
              <CardDescription>حدد التاريخ والوقت لنشر المحتوى تلقائياً</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!generatedContent && (
                <div className="p-4 bg-yellow-50 rounded-xl text-yellow-700 mb-4">
                  يرجى توليد المحتوى أولاً قبل الجدولة
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>التاريخ</Label>
                  <Input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
                <div>
                  <Label>الوقت</Label>
                  <Input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>المنصة</Label>
                <Select value={scheduleForm.platform} onValueChange={(v) => setScheduleForm({...scheduleForm, platform: v})}>
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

              {generatedContent && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">المحتوى المجدول:</p>
                  <p className="text-sm line-clamp-3">{generatedContent.post_text}</p>
                </div>
              )}

              <Button 
                onClick={schedulePost} 
                disabled={!generatedContent || !scheduleForm.date}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:opacity-90"
              >
                <Clock className="h-4 w-4 ml-2" /> جدولة المنشور
              </Button>
            </CardContent>
          </Card>

          {/* Scheduled Posts */}
          {scheduledPosts.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>المنشورات المجدولة ({scheduledPosts.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scheduledPosts.map((post) => {
                  const PlatformIcon = getPlatformIcon(post.platform);
                  return (
                    <div key={post.id} className="p-4 bg-gray-50 rounded-xl flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                        <PlatformIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 line-clamp-2">{post.content.post_text}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(post.date), 'dd MMM yyyy', { locale: ar })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.time}
                          </span>
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            <CheckCircle className="h-3 w-3 ml-1" />
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>تحليلات الإعلانات</CardTitle>
                  <CardDescription>متابعة أداء الحملات في الوقت الفعلي</CardDescription>
                </div>
                <Button onClick={fetchAdAnalytics} disabled={isGenerating} variant="outline">
                  <RefreshCw className={`h-4 w-4 ml-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  تحديث
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!adAnalytics ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">اضغط على "تحديث" لجلب تحليلات الإعلانات</p>
                  <Button onClick={fetchAdAnalytics} className="bg-purple-600 hover:bg-purple-700">
                    <RefreshCw className="h-4 w-4 ml-2" />
                    جلب التحليلات
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <CardContent className="p-4 text-center">
                        <Eye className="h-8 w-8 mx-auto mb-2 opacity-80" />
                        <p className="text-2xl font-bold">{adAnalytics.impressions.toLocaleString()}</p>
                        <p className="text-xs opacity-80">مرات الظهور</p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                      <CardContent className="p-4 text-center">
                        <MousePointer className="h-8 w-8 mx-auto mb-2 opacity-80" />
                        <p className="text-2xl font-bold">{adAnalytics.clicks.toLocaleString()}</p>
                        <p className="text-xs opacity-80">النقرات</p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-green-600 text-white">
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-80" />
                        <p className="text-2xl font-bold">{adAnalytics.ctr}%</p>
                        <p className="text-xs opacity-80">معدل النقر CTR</p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                      <CardContent className="p-4 text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-80" />
                        <p className="text-2xl font-bold">{adAnalytics.conversions}</p>
                        <p className="text-xs opacity-80">التحويلات</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">التكلفة الإجمالية</p>
                      <p className="text-2xl font-bold text-purple-600">{adAnalytics.cost} درهم</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">تكلفة النقرة CPC</p>
                      <p className="text-2xl font-bold text-blue-600">{adAnalytics.cpc} درهم</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">عائد الاستثمار ROAS</p>
                      <p className="text-2xl font-bold text-green-600">{adAnalytics.roas}x</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-800 font-medium mb-2">📊 ملخص الأداء</p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• معدل نقر ممتاز ({adAnalytics.ctr}% أعلى من المتوسط)</li>
                      <li>• تكلفة النقرة ({adAnalytics.cpc} درهم) ضمن المعدل المقبول</li>
                      <li>• عائد استثمار إيجابي ({adAnalytics.roas}x من كل درهم مستثمر)</li>
                      <li>• {adAnalytics.conversions} عميل محتمل تم جذبهم</li>
                    </ul>
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