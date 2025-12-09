import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Video, Image, Sparkles, Download, Play, 
  Wand2, Loader2, Copy, Share2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function VideoCreator() {
  const [topic, setTopic] = useState('');
  const [script, setScript] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState(null);
  const [videoScenes, setVideoScenes] = useState([]);
  const [generatingImages, setGeneratingImages] = useState(false);

  const generateScript = async () => {
    if (!topic) {
      toast.error('أدخل موضوع الفيديو');
      return;
    }

    setGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت كاتب سكريبتات فيديو محترف. اكتب سكريبت فيديو تسويقي احترافي عن "${topic}" لشركة رويال للتنظيف:

المتطلبات:
- المدة: 60-90 ثانية
- أسلوب جذاب وحماسي
- 6-8 مشاهد متنوعة
- كل مشهد مع:
  * نص الكلام (15-20 كلمة)
  * وصف المشهد المرئي بالتفصيل
  * مدة المشهد بالثواني
- افتتاحية قوية وخاتمة مع CTA

التركيز على:
- جودة الخدمة
- السرعة والاحترافية
- الأسعار التنافسية
- التوفر 24/7`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            duration: { type: "string" },
            scenes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  scene_number: { type: "number" },
                  narration: { type: "string" },
                  visual_description: { type: "string" },
                  duration_seconds: { type: "number" },
                  style: { type: "string" }
                }
              }
            },
            call_to_action: { type: "string" }
          }
        }
      });

      setGeneratedScript(response);
      setScript(response.scenes.map(s => s.narration).join('\n\n'));
      toast.success('تم توليد السكريبت! 🎬');
    } catch (error) {
      toast.error('فشل التوليد');
    } finally {
      setGenerating(false);
    }
  };

  const generateSceneImages = async () => {
    if (!generatedScript || !generatedScript.scenes) {
      toast.error('قم بتوليد السكريبت أولاً');
      return;
    }

    setGeneratingImages(true);
    const scenes = [];

    try {
      for (const scene of generatedScript.scenes) {
        toast.info(`توليد مشهد ${scene.scene_number}...`);
        
        const imagePrompt = `Professional marketing photo: ${scene.visual_description}. 
High quality, bright lighting, clean aesthetic, modern style. 
For cleaning services company. Photorealistic.`;

        const imageResponse = await base44.integrations.Core.GenerateImage({
          prompt: imagePrompt
        });

        scenes.push({
          ...scene,
          image_url: imageResponse.url
        });

        // تأخير صغير بين الطلبات
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      setVideoScenes(scenes);
      toast.success('تم توليد كل المشاهد! 🎉');
    } catch (error) {
      toast.error('فشل توليد الصور');
    } finally {
      setGeneratingImages(false);
    }
  };

  const copyScript = () => {
    navigator.clipboard.writeText(script);
    toast.success('تم نسخ السكريبت 📋');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مولد الفيديوهات التسويقية</h1>
          <p className="text-gray-500">سكريبتات ومشاهد احترافية بالذكاء الاصطناعي</p>
        </div>
        <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2">
          <Video className="h-4 w-4 ml-2" />
          مجاني 100%
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-purple-600" />
                إنشاء سكريبت فيديو
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">موضوع الفيديو</label>
                <Input
                  placeholder="مثال: خدمات تنظيف المنازل الاحترافية"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <Button 
                onClick={generateScript}
                disabled={generating}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 ml-2" />
                    توليد السكريبت
                  </>
                )}
              </Button>

              {generatedScript && (
                <Button 
                  onClick={generateSceneImages}
                  disabled={generatingImages}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  {generatingImages ? (
                    <>
                      <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                      توليد الصور...
                    </>
                  ) : (
                    <>
                      <Image className="h-5 w-5 ml-2" />
                      توليد صور المشاهد
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {generatedScript && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>السكريبت الكامل</CardTitle>
                <Button size="sm" variant="outline" onClick={copyScript}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="font-bold text-lg mb-2">{generatedScript.title}</p>
                    <Badge variant="outline">المدة: {generatedScript.duration}</Badge>
                  </div>
                  <Textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="font-bold text-sm mb-2">Call to Action:</p>
                    <p className="text-sm">{generatedScript.call_to_action}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          {videoScenes.length > 0 ? (
            <>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-green-600" />
                    مشاهد الفيديو ({videoScenes.length})
                  </CardTitle>
                </CardHeader>
              </Card>

              {videoScenes.map((scene, index) => (
                <Card key={index} className="border-0 shadow-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src={scene.image_url} 
                      alt={`Scene ${scene.scene_number}`}
                      className="w-full h-64 object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-black/70 text-white">
                      مشهد {scene.scene_number} - {scene.duration_seconds}ث
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">النص:</p>
                      <p className="text-sm font-medium">{scene.narration}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">الوصف المرئي:</p>
                      <p className="text-sm">{scene.visual_description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-4 w-4 ml-1" />
                        تحميل
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Share2 className="h-4 w-4 ml-1" />
                        مشاركة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Video className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">لا توجد مشاهد بعد</p>
                <p className="text-sm text-gray-400">قم بتوليد السكريبت وصور المشاهد</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Templates */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>قوالب جاهزة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: 'فيديو تعريفي', emoji: '👋', topic: 'تعريف بشركة رويال وخدماتها' },
              { name: 'عرض خاص', emoji: '🎁', topic: 'عرض خصم 30% على خدمات التنظيف' },
              { name: 'شهادة عميل', emoji: '⭐', topic: 'شهادة عميل راضي عن خدمة التنظيف' },
              { name: 'قبل وبعد', emoji: '✨', topic: 'نتائج مذهلة قبل وبعد التنظيف' },
              { name: 'فريق العمل', emoji: '👨‍💼', topic: 'تعريف بفريق العمل المحترف' },
              { name: 'خدمة 24/7', emoji: '⏰', topic: 'خدمة على مدار الساعة' },
              { name: 'تقنيات حديثة', emoji: '🔧', topic: 'معدات وتقنيات تنظيف حديثة' },
              { name: 'نصائح تنظيف', emoji: '💡', topic: 'نصائح سريعة للحفاظ على النظافة' }
            ].map((template, i) => (
              <Button
                key={i}
                variant="outline"
                className="h-auto py-4 flex-col"
                onClick={() => setTopic(template.topic)}
              >
                <span className="text-3xl mb-2">{template.emoji}</span>
                <span className="text-sm font-medium">{template.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}