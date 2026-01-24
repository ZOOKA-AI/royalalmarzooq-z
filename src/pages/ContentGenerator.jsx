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

const campaignObjectives = [
  { id: 'awareness', name: 'الوعي بالعلامة', budget: '300-500' },
  { id: 'engagement', name: 'التفاعل', budget: '200-400' },
  { id: 'traffic', name: 'زيارات الموقع', budget: '400-600' },
  { id: 'leads', name: 'جذب عملاء', budget: '500-800' },
  { id: 'conversions', name: 'مبيعات', budget: '600-1000' },
];

const targetAudiences = [
  { id: 'homeowners', name: 'أصحاب المنازل', age: '25-45' },
  { id: 'companies', name: 'الشركات', age: '30-55' },
  { id: 'newmovers', name: 'المنتقلون الجدد', age: '25-40' },
  { id: 'families', name: 'العائلات', age: '28-50' },
];

const campaignObjectives = [
  { id: 'awareness', name: 'زيادة الوعي بالعلامة', budget: '50-100 درهم/يوم' },
  { id: 'engagement', name: 'زيادة التفاعل', budget: '30-70 درهم/يوم' },
  { id: 'leads', name: 'جمع عملاء محتملين', budget: '70-150 درهم/يوم' },
  { id: 'conversions', name: 'زيادة المبيعات', budget: '100-300 درهم/يوم' },
  { id: 'traffic', name: 'زيادة الزيارات', budget: '40-80 درهم/يوم' },
];

const targetAudiences = [
  { id: 'homeowners', name: 'أصحاب المنازل', age: '25-55', interests: 'تنظيف, ديكور منزلي' },
  { id: 'companies', name: 'الشركات', age: '30-60', interests: 'خدمات B2B, مكاتب' },
  { id: 'villas', name: 'أصحاب الفلل', age: '35-65', interests: 'رفاهية, خدمات راقية' },
  { id: 'newlyweds', name: 'المتزوجون حديثاً', age: '22-35', interests: 'منزل جديد, عائلة' },
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
  const [campaigns, setCampaigns] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    objective: 'awareness',
    platform: 'facebook',
    budget: '',
    duration: 7,
    audience: 'homeowners',
  });

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
    date: '',
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ!');
  };

  const getPlatformIcon = (platform) => {
    const p = platforms.find(pl => pl.id === platform || pl.name.includes(platform));
    return p ? p.icon : Send;
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
4. الكلمات المفتاحية
5. توزيع الميزانية اليومية
6. معدل النقر المتوقع CTR
7. التكلفة المتوقعة للنقرة CPC
8. العملاء المتوقعين`,
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
      // محاكاة بيانات تحليلية
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

  const createCampaign = async () => {
    if (!generatedContent) {
      toast.error('يرجى توليد المحتوى أولاً');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت خبير إعلانات رقمية. أنشئ حملة إعلانية احترافية لشركة تنظيف.
        
الهدف: ${campaignObjectives.find(o => o.id === campaignForm.objective)?.name}
المنصة: ${campaignForm.platform === 'facebook' ? 'فيسبوك' : 'انستغرام'}
الميزانية: ${campaignForm.budget} درهم
المدة: ${campaignForm.duration} أيام
الجمهور المستهدف: ${targetAudiences.find(a => a.id === campaignForm.audience)?.name}

المحتوى المتوفر:
${generatedContent.post_text}

أنشئ:
1. عنوان إعلان جذاب
2. نص إعلاني مختصر ومقنع
3. دعوة لإجراء واضحة
4. الكلمات المفتاحية للاستهداف
5. توزيع مقترح للميزانية
6. مؤشرات الأداء المتوقعة (Impressions, Clicks, CTR)`,
        response_json_schema: {
          type: "object",
          properties: {
            ad_title: { type: "string" },
            ad_copy: { type: "string" },
            cta_text: { type: "string" },
            targeting_keywords: { type: "array", items: { type: "string" } },
            budget_breakdown: { type: "object" },
            expected_performance: { type: "object" }
          }
        }
      });

      const newCampaign = {
        id: Date.now(),
        name: campaignForm.name || `حملة ${format(new Date(), 'dd/MM')}`,
        ...campaignForm,
        ad_details: response,
        content: generatedContent,
        image: generatedImage,
        status: 'نشط',
        created_at: new Date().toISOString(),
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          spent: 0
        }
      };

      setCampaigns(prev => [newCampaign, ...prev]);
      setShowCampaignForm(false);
      toast.success('✅ تم إنشاء الحملة الإعلانية بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ في إنشاء الحملة');
    } finally {
      setIsGenerating(false);
    }
  };

  const schedulePost = (date, time) => {
    if (!generatedContent) {
      toast.error('يرجى توليد المحتوى أولاً');
      return;
    }

    const scheduledPost = {
      id: Date.now(),
      content: generatedContent,
      image: generatedImage,
      platform: contentForm.platform,
      scheduled_date: date,
      scheduled_time: time,
      status: 'مجدول'
    };

    setScheduledPosts(prev => [scheduledPost, ...prev]);
    toast.success('📅 تم جدولة المنشور بنجاح!');
  };

  const suggestBudget = (objective, duration) => {
    const obj = campaignObjectives.find(o => o.id === objective);
    if (!obj) return 'غير متوفر';
    
    const [min, max] = obj.budget.match(/\d+/g).map(Number);
    const totalMin = min * duration;
    const totalMax = max * duration;
    
    return `${totalMin}-${totalMax} درهم (لمدة ${duration} أيام)`;
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
        <TabsList className="grid w-full grid-cols-5 gap-1">
          <TabsTrigger value="generate" className="flex items-center gap-1 text-xs">
            <Wand2 className="h-3 w-3" />
            المحتوى
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-1 text-xs">
            <ImageIcon className="h-3 w-3" />
            الصور
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-1 text-xs">
            <Send className="h-3 w-3" />
            الحملات
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            الجدولة
          </TabsTrigger>
          <TabsTrigger value="plan" className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
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

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>الحملات الإعلانية</CardTitle>
                  <CardDescription>إنشاء وإدارة حملات Facebook و Instagram</CardDescription>
                </div>
                <Button 
                  onClick={() => setShowCampaignForm(true)}
                  disabled={!generatedContent}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                >
                  <Send className="h-4 w-4 ml-2" />
                  حملة جديدة
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!generatedContent && (
                <div className="text-center py-8 text-yellow-600 bg-yellow-50 rounded-xl">
                  يرجى توليد المحتوى أولاً من تبويب "المحتوى" لإنشاء حملة
                </div>
              )}

              {showCampaignForm && (
                <div className="mb-6 p-6 bg-gray-50 rounded-xl space-y-4">
                  <h3 className="font-bold text-lg">إعدادات الحملة</h3>
                  
                  <div>
                    <Label>اسم الحملة</Label>
                    <Input
                      value={campaignForm.name}
                      onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                      placeholder="مثال: حملة تنظيف الكنب - يناير"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>هدف الحملة</Label>
                      <Select 
                        value={campaignForm.objective} 
                        onValueChange={(v) => setCampaignForm({...campaignForm, objective: v})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {campaignObjectives.map(obj => (
                            <SelectItem key={obj.id} value={obj.id}>
                              {obj.name}
                              <span className="text-xs text-gray-500 mr-2">({obj.budget})</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>المنصة</Label>
                      <Select 
                        value={campaignForm.platform} 
                        onValueChange={(v) => setCampaignForm({...campaignForm, platform: v})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="facebook">فيسبوك</SelectItem>
                          <SelectItem value="instagram">انستغرام</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>المدة (أيام)</Label>
                      <Input
                        type="number"
                        value={campaignForm.duration}
                        onChange={(e) => setCampaignForm({...campaignForm, duration: Number(e.target.value)})}
                        min={1}
                        max={30}
                      />
                    </div>

                    <div>
                      <Label>الميزانية اليومية (درهم)</Label>
                      <Input
                        type="number"
                        value={campaignForm.budget}
                        onChange={(e) => setCampaignForm({...campaignForm, budget: e.target.value})}
                        placeholder="مثال: 100"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>الجمهور المستهدف</Label>
                    <Select 
                      value={campaignForm.audience} 
                      onValueChange={(v) => setCampaignForm({...campaignForm, audience: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {targetAudiences.map(aud => (
                          <SelectItem key={aud.id} value={aud.id}>
                            {aud.name}
                            <span className="text-xs text-gray-500 mr-2">({aud.age})</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      💰 الميزانية المقترحة: {suggestBudget(campaignForm.objective, campaignForm.duration)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={createCampaign}
                      disabled={isGenerating || !campaignForm.budget}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Send className="h-4 w-4 ml-2" />}
                      إطلاق الحملة
                    </Button>
                    <Button variant="outline" onClick={() => setShowCampaignForm(false)}>
                      إلغاء
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {campaigns.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Send className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>لا توجد حملات إعلانية بعد</p>
                  </div>
                ) : (
                  campaigns.map(campaign => (
                    <Card key={campaign.id} className="border-2 border-purple-100">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{campaign.name}</h3>
                            <div className="flex gap-2 mt-2">
                              <Badge className="bg-blue-100 text-blue-700">
                                {campaign.platform === 'facebook' ? 'فيسبوك' : 'انستغرام'}
                              </Badge>
                              <Badge className="bg-green-100 text-green-700">{campaign.status}</Badge>
                              <Badge variant="outline">{campaign.duration} أيام</Badge>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="text-2xl font-bold text-purple-600">{campaign.budget} د.إ</p>
                            <p className="text-xs text-gray-500">ميزانية يومية</p>
                          </div>
                        </div>

                        {campaign.ad_details && (
                          <div className="space-y-3">
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <p className="text-xs text-purple-600 mb-1">عنوان الإعلان</p>
                              <p className="font-medium">{campaign.ad_details.ad_title}</p>
                            </div>
                            
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">نص الإعلان</p>
                              <p className="text-sm">{campaign.ad_details.ad_copy}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div className="p-3 bg-blue-50 rounded-lg text-center">
                                <p className="text-xs text-blue-600">المشاهدات</p>
                                <p className="text-xl font-bold">{campaign.performance.impressions.toLocaleString()}</p>
                              </div>
                              <div className="p-3 bg-green-50 rounded-lg text-center">
                                <p className="text-xs text-green-600">النقرات</p>
                                <p className="text-xl font-bold">{campaign.performance.clicks}</p>
                              </div>
                              <div className="p-3 bg-orange-50 rounded-lg text-center">
                                <p className="text-xs text-orange-600">التحويلات</p>
                                <p className="text-xl font-bold">{campaign.performance.conversions}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>جدولة المنشورات</CardTitle>
              <CardDescription>جدولة المحتوى للنشر التلقائي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!generatedContent ? (
                <div className="text-center py-8 text-yellow-600 bg-yellow-50 rounded-xl">
                  يرجى توليد المحتوى أولاً لجدولته
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded-xl space-y-4">
                  <h3 className="font-bold">جدولة منشور جديد</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>تاريخ النشر</Label>
                      <Input
                        type="date"
                        min={format(new Date(), 'yyyy-MM-dd')}
                        onChange={(e) => {
                          const time = prompt('أدخل الوقت (مثال: 20:00):', '20:00');
                          if (time) schedulePost(e.target.value, time);
                        }}
                      />
                    </div>
                    <div>
                      <Label>المنصة</Label>
                      <Select value={contentForm.platform}>
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
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 mb-2">معاينة المحتوى</p>
                    <p className="text-sm line-clamp-3">{generatedContent.post_text}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-bold text-sm text-gray-700">المنشورات المجدولة ({scheduledPosts.length})</h3>
                
                {scheduledPosts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">لا توجد منشورات مجدولة</p>
                  </div>
                ) : (
                  scheduledPosts.map(post => (
                    <div key={post.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{platforms.find(p => p.id === post.platform)?.name}</p>
                        <p className="text-sm text-gray-600 line-clamp-1">{post.content.post_text}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{format(new Date(post.scheduled_date), 'dd/MM/yyyy')}</p>
                        <p className="text-xs text-gray-500">{post.scheduled_time}</p>
                        <Badge className="bg-green-100 text-green-700 mt-1">{post.status}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
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