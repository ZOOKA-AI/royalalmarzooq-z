import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar, Clock, Send, Sparkles, CheckCircle2,
  Instagram, Facebook, Twitter, Linkedin, MessageSquare,
  Image, Video, FileText, Zap, Play, Pause
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AutoPoster() {
  const [schedule, setSchedule] = useState({
    enabled: false,
    frequency: 'daily',
    time: '10:00',
    platforms: {
      instagram: true,
      facebook: true,
      twitter: false,
      linkedin: false,
      whatsapp: false
    }
  });

  const [generating, setGenerating] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: 1,
      date: '2025-12-10',
      time: '10:00',
      content: 'خصم 30% على خدمات التنظيف! احجز الآن 🎉',
      platforms: ['instagram', 'facebook'],
      status: 'scheduled',
      image: null
    },
    {
      id: 2,
      date: '2025-12-10',
      time: '15:00',
      content: 'نصيحة اليوم: كيف تحافظ على نظافة الكنب؟ 💡',
      platforms: ['twitter', 'linkedin'],
      status: 'scheduled',
      image: null
    }
  ]);

  const generateMonthlyPlan = async () => {
    setGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنشئ خطة محتوى تسويقية لمدة 30 يوم لRoyal Haroon للتنظيف:

المتطلبات:
- 30 منشور متنوع
- كل منشور يحتوي:
  * تاريخ مقترح (من اليوم)
  * وقت النشر المثالي
  * نص المنشور (100-150 حرف)
  * المنصات المناسبة
  * نوع المحتوى (نصائح، عروض، قصص نجاح، تعريف بالخدمات)
  * وصف صورة مقترحة

التنوع:
- 40% محتوى تعليمي ونصائح
- 30% عروض وخصومات
- 20% شهادات وقصص نجاح
- 10% ترفيه وتفاعل`,
        response_json_schema: {
          type: "object",
          properties: {
            posts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  date: { type: "string" },
                  time: { type: "string" },
                  content: { type: "string" },
                  content_type: { type: "string" },
                  platforms: { type: "array", items: { type: "string" } },
                  image_description: { type: "string" },
                  hashtags: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      const newPosts = response.posts.map((post, index) => ({
        id: Date.now() + index,
        date: post.date,
        time: post.time,
        content: post.content,
        platforms: post.platforms,
        status: 'scheduled',
        image: null,
        type: post.content_type,
        hashtags: post.hashtags
      }));

      setScheduledPosts(newPosts);
      toast.success('تم توليد خطة 30 يوم! 🎉');
    } catch (error) {
      toast.error('فشل التوليد');
    } finally {
      setGenerating(false);
    }
  };

  const togglePlatform = (platform) => {
    setSchedule({
      ...schedule,
      platforms: {
        ...schedule.platforms,
        [platform]: !schedule.platforms[platform]
      }
    });
  };

  const platformIcons = {
    instagram: Instagram,
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    whatsapp: MessageSquare
  };

  const platformColors = {
    instagram: 'from-purple-500 to-pink-500',
    facebook: 'from-blue-500 to-blue-600',
    twitter: 'from-sky-400 to-sky-500',
    linkedin: 'from-blue-600 to-blue-700',
    whatsapp: 'from-green-500 to-green-600'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">النشر التلقائي الذكي</h1>
          <p className="text-gray-500">جدولة ونشر المحتوى تلقائياً على جميع المنصات</p>
        </div>
        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2">
          <Zap className="h-4 w-4 ml-2" />
          ذكاء اصطناعي
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Settings */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  إعدادات الجدولة
                </span>
                <Switch
                  checked={schedule.enabled}
                  onCheckedChange={(checked) => setSchedule({...schedule, enabled: checked})}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">تكرار النشر</label>
                <Select value={schedule.frequency} onValueChange={(v) => setSchedule({...schedule, frequency: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">يومياً</SelectItem>
                    <SelectItem value="twice_daily">مرتين يومياً</SelectItem>
                    <SelectItem value="three_times">3 مرات يومياً</SelectItem>
                    <SelectItem value="hourly">كل ساعة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">وقت النشر</label>
                <Input
                  type="time"
                  value={schedule.time}
                  onChange={(e) => setSchedule({...schedule, time: e.target.value})}
                />
              </div>

              <div>
                <p className="text-sm font-medium mb-3">المنصات المفعّلة</p>
                <div className="space-y-2">
                  {Object.entries(schedule.platforms).map(([platform, enabled]) => {
                    const Icon = platformIcons[platform];
                    return (
                      <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 bg-gradient-to-r ${platformColors[platform]} rounded-lg flex items-center justify-center`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-medium capitalize">{platform}</span>
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={() => togglePlatform(platform)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button 
                onClick={generateMonthlyPlan}
                disabled={generating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {generating ? (
                  <>
                    <Clock className="h-4 w-4 ml-2 animate-spin" />
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 ml-2" />
                    خطة 30 يوم تلقائية
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">{scheduledPosts.length}</p>
                <p className="text-xs text-gray-500">منشور مجدول</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Object.values(schedule.platforms).filter(Boolean).length}
                </p>
                <p className="text-xs text-gray-500">منصة نشطة</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Scheduled Posts */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                المنشورات المجدولة
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="space-y-3">
            {scheduledPosts.slice(0, 10).map((post) => (
              <Card key={post.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-gray-500">{post.date.split('-')[2]}</p>
                      <p className="text-lg font-bold text-purple-600">
                        {new Date(post.date).toLocaleDateString('ar', { month: 'short' })}
                      </p>
                      <p className="text-xs text-gray-500">{post.time}</p>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm mb-3">{post.content}</p>
                      
                      {post.hashtags && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.hashtags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {post.platforms.map((platform) => {
                          const Icon = platformIcons[platform];
                          return (
                            <div
                              key={platform}
                              className={`w-6 h-6 bg-gradient-to-r ${platformColors[platform]} rounded flex items-center justify-center`}
                            >
                              <Icon className="h-3 w-3 text-white" />
                            </div>
                          );
                        })}
                        
                        <Badge className="mr-auto" variant={post.status === 'scheduled' ? 'outline' : 'default'}>
                          {post.status === 'scheduled' ? 'مجدول' : 'منشور'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="ghost">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {scheduledPosts.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Calendar className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">لا توجد منشورات مجدولة</p>
                <p className="text-sm text-gray-400">قم بتوليد خطة محتوى تلقائية</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col">
              <Image className="h-6 w-6 mb-2 text-purple-600" />
              <span className="text-sm">منشور صورة</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <Video className="h-6 w-6 mb-2 text-red-600" />
              <span className="text-sm">منشور فيديو</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <FileText className="h-6 w-6 mb-2 text-blue-600" />
              <span className="text-sm">منشور نصي</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <Sparkles className="h-6 w-6 mb-2 text-orange-600" />
              <span className="text-sm">توليد تلقائي</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}