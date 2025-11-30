import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, Send, Mic, MicOff, Loader2, Sparkles, X, Maximize2, Minimize2,
  ClipboardList, Users, Calendar, TrendingUp, Camera, CameraOff, 
  Volume2, VolumeX, Phone, MapPin, Wrench, DollarSign
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

const quickCommands = [
  { label: 'طلب جديد', icon: ClipboardList, command: 'أريد إنشاء طلب جديد' },
  { label: 'عميل جديد', icon: Users, command: 'أريد تسجيل عميل جديد' },
  { label: 'الخدمات', icon: Wrench, command: 'ما هي الخدمات والأسعار؟' },
  { label: 'طلبات اليوم', icon: Calendar, command: 'اعرض طلبات اليوم' },
  { label: 'الإيرادات', icon: DollarSign, command: 'اعرض تقرير الإيرادات' },
];

// قاعدة المعرفة للردود السريعة
const knowledgeBase = {
  greetings: {
    patterns: ['مرحبا', 'السلام عليكم', 'اهلا', 'هاي', 'صباح الخير', 'مساء الخير', 'هلا'],
    responses: [
      'أهلاً وسهلاً بك! 🌟 أنا مساعد رويال الذكي. كيف يمكنني خدمتك اليوم؟',
      'مرحباً بك في شركة رويال! 🏠 أنا هنا لمساعدتك. ماذا تحتاج؟',
      'حياك الله! 👋 أنا جاهز لمساعدتك. اختر من الأوامر السريعة أو اكتب طلبك.'
    ]
  },
  services: {
    patterns: ['خدمات', 'خدماتكم', 'ماذا تقدمون', 'الاسعار', 'سعر', 'كم سعر', 'تكلفة'],
    responses: [
      `🛠️ خدماتنا وأسعارنا:

🛋️ تنظيف الكنب: من 35-50 درهم/القطعة
🧹 تنظيف السجاد: 8-10 درهم/المتر
🪟 تنظيف الستائر: 90-150 درهم
💧 تنظيف الخزانات: 250-300 درهم
🍳 تنظيف المطابخ: من 60 درهم
🏠 تنظيف الشقق: من 500 درهم
❄️ تنظيف المكيفات: 50 درهم/الوحدة
🐜 مكافحة الحشرات: 250 درهم/النوع
🏡 تنظيف الفلل: من 1,200 درهم

📞 للحجز: 0563177803
⏰ نعمل 24 ساعة`
    ]
  },
  contact: {
    patterns: ['رقم', 'تواصل', 'اتصال', 'هاتف', 'واتساب', 'تليفون'],
    responses: [
      '📞 رقم التواصل: 0563177803\n📱 واتساب: 0563177803\n⏰ متاحين 24 ساعة\n📍 نخدم جميع مناطق الإمارات'
    ]
  },
  thanks: {
    patterns: ['شكرا', 'مشكور', 'يعطيك العافية', 'جزاك الله'],
    responses: [
      'العفو! 😊 دائماً في خدمتك. هل تحتاج شيء آخر؟',
      'لا شكر على واجب! 🌟 نحن سعداء بخدمتك.'
    ]
  },
  goodbye: {
    patterns: ['مع السلامة', 'باي', 'وداعا', 'الى اللقاء'],
    responses: [
      'مع السلامة! 👋 نتشرف بخدمتك دائماً.',
      'إلى اللقاء! 🌟 لا تتردد في التواصل معنا في أي وقت.'
    ]
  }
};

export default function AIAssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🌟 مرحباً بك في شركة رويال!\n\nأنا مساعدك الذكي، يمكنني:\n• إنشاء طلبات وتسجيل عملاء\n• عرض الخدمات والأسعار\n• الإجابة على استفساراتك\n• التحدث معك صوتياً 🎤\n\nكيف أساعدك؟'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [conversationContext, setConversationContext] = useState({
    step: null,
    data: {}
  });
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // تهيئة التعرف على الصوت
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ar-AE';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // إرسال تلقائي بعد التعرف على الصوت
        setTimeout(() => {
          sendMessage(transcript);
        }, 500);
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          toast.error('حدث خطأ في التعرف على الصوت');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // تحويل النص إلى كلام بصوت طبيعي
  const speak = (text) => {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    // تنظيف النص من الإيموجي والرموز
    const cleanText = text
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // إزالة كل الإيموجي
      .replace(/[•\-\*\#\d️⃣✅❌📋💰📞📱⏰📍]/g, '') // إزالة الرموز
      .replace(/\n+/g, '. ') // تحويل الأسطر الجديدة لوقفات
      .replace(/\s+/g, ' ') // إزالة المسافات الزائدة
      .trim();
    
    if (!cleanText) return;
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // البحث عن أفضل صوت عربي متاح
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => 
      v.lang.includes('ar') && (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Natural'))
    ) || voices.find(v => v.lang.includes('ar'));
    
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }
    
    utterance.lang = 'ar-SA'; // العربية السعودية عادة أوضح
    utterance.rate = 0.85; // أبطأ قليلاً للوضوح
    utterance.pitch = 1.05; // نبرة طبيعية أكثر
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
  };

  // تحميل الأصوات عند بدء التطبيق
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // تحميل الأصوات (قد تحتاج وقت للتحميل)
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const toggleListening = () => {
    // التحقق من دعم المتصفح
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('المتصفح لا يدعم التعرف على الصوت. استخدم Chrome أو Edge');
      return;
    }

    // إنشاء recognition جديد في كل مرة لتجنب مشاكل الحالة
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'ar-AE';
      
      recognition.onstart = () => {
        setIsListening(true);
        toast.success('🎤 جاري الاستماع... تحدث الآن');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        toast.success(`سمعت: "${transcript}"`);
        // إرسال تلقائي
        setTimeout(() => {
          sendMessage(transcript);
        }, 300);
      };

      recognition.onerror = (event) => {
        console.error('Speech error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          toast.warning('لم أسمع شيئاً. حاول مرة أخرى');
        } else if (event.error === 'not-allowed') {
          toast.error('يرجى السماح بالوصول للميكروفون من إعدادات المتصفح');
        } else {
          toast.error('حدث خطأ. حاول مرة أخرى');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (e) {
      console.error('Recognition error:', e);
      setIsListening(false);
      toast.error('فشل تشغيل الميكروفون. تأكد من السماح بالوصول');
    }
  };

  // البحث في قاعدة المعرفة للردود السريعة
  const findQuickResponse = (text) => {
    const lowerText = text.toLowerCase();
    for (const category in knowledgeBase) {
      for (const pattern of knowledgeBase[category].patterns) {
        if (lowerText.includes(pattern)) {
          const responses = knowledgeBase[category].responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }
    return null;
  };

  // جلب البيانات الحقيقية من قاعدة البيانات
  const fetchRealData = async (type) => {
    try {
      if (type === 'orders_today') {
        const orders = await base44.entities.Order.list('-created_date', 50);
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(o => 
          o.created_date && o.created_date.startsWith(today)
        );
        return {
          count: todayOrders.length,
          total: todayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
          orders: todayOrders.slice(0, 5)
        };
      }
      
      if (type === 'revenue') {
        const orders = await base44.entities.Order.filter({ status: 'مكتمل' }, '-created_date', 100);
        const thisMonth = new Date();
        const monthOrders = orders.filter(o => {
          if (!o.created_date) return false;
          const d = new Date(o.created_date);
          return d.getMonth() === thisMonth.getMonth() && d.getFullYear() === thisMonth.getFullYear();
        });
        return {
          totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
          monthRevenue: monthOrders.reduce((sum, o) => sum + (o.total || 0), 0),
          completedOrders: orders.length,
          monthOrders: monthOrders.length
        };
      }

      if (type === 'clients') {
        const clients = await base44.entities.Client.list('-created_date', 10);
        return { count: clients.length, recent: clients.slice(0, 3) };
      }

      if (type === 'workers') {
        const workers = await base44.entities.Worker.list();
        const available = workers.filter(w => w.status === 'متاح');
        return { total: workers.length, available: available.length };
      }

      if (type === 'services') {
        const services = await base44.entities.Service.filter({ is_active: true });
        return services;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  const sendMessage = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText = '';
      const lowerText = text.toLowerCase();

      // التحقق من الردود السريعة أولاً
      const quickResponse = findQuickResponse(text);
      if (quickResponse && !lowerText.includes('طلب') && !lowerText.includes('تقرير')) {
        responseText = quickResponse;
      }
      // طلبات اليوم
      else if (lowerText.includes('طلبات اليوم') || lowerText.includes('طلبات الیوم')) {
        const data = await fetchRealData('orders_today');
        if (data) {
          responseText = `📋 طلبات اليوم:\n\n`;
          responseText += `• عدد الطلبات: ${data.count}\n`;
          responseText += `• إجمالي المبيعات: ${data.total.toLocaleString()} درهم\n\n`;
          if (data.orders.length > 0) {
            responseText += `آخر الطلبات:\n`;
            data.orders.forEach((o, i) => {
              responseText += `${i + 1}. ${o.client_name || 'عميل'} - ${o.service_name || 'خدمة'} (${o.total || 0} درهم)\n`;
            });
          } else {
            responseText += `لا توجد طلبات اليوم بعد. ابدأ بإضافة طلب جديد!`;
          }
        } else {
          responseText = 'عذراً، لم أتمكن من جلب البيانات. حاول مرة أخرى.';
        }
      }
      // تقرير الإيرادات
      else if (lowerText.includes('ايراد') || lowerText.includes('إيراد') || lowerText.includes('revenue') || lowerText.includes('تقرير')) {
        const data = await fetchRealData('revenue');
        if (data) {
          responseText = `💰 تقرير الإيرادات:\n\n`;
          responseText += `• إجمالي الإيرادات: ${data.totalRevenue.toLocaleString()} درهم\n`;
          responseText += `• إيرادات الشهر: ${data.monthRevenue.toLocaleString()} درهم\n`;
          responseText += `• الطلبات المكتملة: ${data.completedOrders}\n`;
          responseText += `• طلبات الشهر: ${data.monthOrders}`;
        } else {
          responseText = 'عذراً، لم أتمكن من جلب البيانات.';
        }
      }
      // إنشاء طلب جديد
      else if (lowerText.includes('طلب جديد') || lowerText.includes('انشاء طلب') || lowerText.includes('إنشاء طلب')) {
        responseText = `✅ لإنشاء طلب جديد، أحتاج المعلومات التالية:\n\n`;
        responseText += `1️⃣ اسم العميل\n`;
        responseText += `2️⃣ رقم الهاتف\n`;
        responseText += `3️⃣ نوع الخدمة\n`;
        responseText += `4️⃣ العنوان\n\n`;
        responseText += `أو يمكنك الذهاب لصفحة الطلبات مباشرة.\n\n`;
        responseText += `اكتب: "اسم العميل: أحمد، هاتف: 0501234567، الخدمة: تنظيف كنب"`;
      }
      // تسجيل عميل
      else if (lowerText.includes('عميل جديد') || lowerText.includes('تسجيل عميل')) {
        responseText = `👤 لتسجيل عميل جديد:\n\n`;
        responseText += `اكتب البيانات بالشكل التالي:\n`;
        responseText += `"الاسم: أحمد محمد، الهاتف: 0501234567، المنطقة: دبي"\n\n`;
        responseText += `أو اذهب لصفحة العملاء لإضافته.`;
      }
      // استخدام الذكاء الاصطناعي للأسئلة المعقدة
      else {
        const response = await base44.integrations.Core.InvokeLLM({
          prompt: `أنت مساعد ذكي لشركة رويال للتنظيف والتعقيم ومكافحة الحشرات في الإمارات.

معلومات الشركة:
- رقم التواصل: 0563177803
- الخدمات: تنظيف كنب (35-50 درهم)، سجاد (8-10 درهم/متر)، ستائر (90-150 درهم)، خزانات (250-300 درهم)، مطابخ (من 60 درهم)، شقق (من 500 درهم)، فلل (من 1200 درهم)، مكيفات (50 درهم)، مكافحة حشرات (250 درهم/نوع)
- نعمل 24 ساعة في جميع الإمارات

سؤال العميل: ${text}

أجب بشكل مختصر ومفيد وودود باللغة العربية. استخدم الإيموجي باعتدال.`,
          response_json_schema: {
            type: "object",
            properties: {
              response: { type: "string" }
            },
            required: ["response"]
          }
        });

        responseText = response?.response || 'تم استلام طلبك. كيف يمكنني مساعدتك أكثر؟';
      }

      const assistantMessage = { role: 'assistant', content: responseText };
      setMessages(prev => [...prev, assistantMessage]);
      
      // نطق الرد
      speak(responseText);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = 'عذراً، حدث خطأ. حاول مرة أخرى أو استخدم الأوامر السريعة.';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-[9999]">
        <button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 shadow-2xl hover:shadow-xl transition-all hover:scale-110 border-4 border-white flex items-center justify-center cursor-pointer"
          style={{ 
            animation: 'chatBounce 2s ease-in-out infinite',
          }}
          type="button"
          aria-label="فتح المساعد الذكي"
        >
          <Bot className="h-8 w-8 text-white" />
        </button>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse pointer-events-none"></span>
        <style>{`
          @keyframes chatBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`fixed z-[9999] ${isExpanded ? 'inset-4' : 'bottom-6 left-6 w-[380px] h-[550px]'} transition-all`}>
      <Card className="h-full border-0 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center relative">
                <Bot className="h-6 w-6" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-purple-600"></span>
              </div>
              <div>
                <CardTitle className="text-base font-bold">مساعد رويال الذكي</CardTitle>
                <div className="flex items-center gap-1 text-xs text-purple-200">
                  <Sparkles className="h-3 w-3" />
                  <span>متصل الآن • 24/7</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 text-white hover:bg-white/20 ${!isSpeechEnabled ? 'bg-white/10' : ''}`}
                onClick={() => {
                  setIsSpeechEnabled(!isSpeechEnabled);
                  window.speechSynthesis.cancel();
                }}
                title={isSpeechEnabled ? 'إيقاف الصوت' : 'تفعيل الصوت'}
              >
                {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => {
                  setIsOpen(false);
                  window.speechSynthesis.cancel();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-3 rounded-bl-md shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                  <span className="text-sm text-gray-500">جاري الكتابة...</span>
                </div>
              </div>
            </div>
          )}
          {isListening && (
            <div className="flex justify-center">
              <div className="bg-red-50 border border-red-200 rounded-full px-4 py-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-red-600">🎤 جاري الاستماع...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Quick Commands */}
        <div className="px-3 py-2 bg-white border-t">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {quickCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <Badge
                  key={idx}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 whitespace-nowrap flex items-center gap-1 py-1.5 px-2.5 transition-colors"
                  onClick={() => sendMessage(cmd.command)}
                >
                  <Icon className="h-3 w-3 text-purple-600" />
                  <span className="text-xs">{cmd.label}</span>
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t">
          <div className="flex gap-2">
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              className={`shrink-0 transition-all ${
                isListening 
                  ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 animate-pulse' 
                  : 'hover:bg-purple-100 hover:border-purple-400 hover:text-purple-600'
              }`}
              onClick={toggleListening}
              disabled={isLoading}
              type="button"
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={isListening ? '🎤 تحدث الآن...' : 'اكتب رسالتك أو اضغط 🎤'}
              className="flex-1 text-sm"
              disabled={isListening || isLoading}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700 px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Links */}
          <div className="flex justify-center gap-4 mt-2 pt-2 border-t border-gray-100">
            <Link to={createPageUrl('Orders')} className="text-xs text-purple-600 hover:underline flex items-center gap-1">
              <ClipboardList className="h-3 w-3" />
              الطلبات
            </Link>
            <Link to={createPageUrl('Clients')} className="text-xs text-purple-600 hover:underline flex items-center gap-1">
              <Users className="h-3 w-3" />
              العملاء
            </Link>
            <a href="tel:0563177803" className="text-xs text-green-600 hover:underline flex items-center gap-1">
              <Phone className="h-3 w-3" />
              اتصل بنا
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}