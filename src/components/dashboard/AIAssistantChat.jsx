import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, Send, Mic, MicOff, Loader2, Sparkles, X, Maximize2, Minimize2,
  ClipboardList, Users, Calendar, TrendingUp
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const quickCommands = [
  { label: 'إنشاء طلب جديد', icon: ClipboardList, command: 'أريد إنشاء طلب جديد' },
  { label: 'إضافة عميل', icon: Users, command: 'أريد إضافة عميل جديد' },
  { label: 'طلبات اليوم', icon: Calendar, command: 'اعرض لي طلبات اليوم' },
  { label: 'تقرير الإيرادات', icon: TrendingUp, command: 'أريد تقرير الإيرادات' },
];

export default function AIAssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'مرحباً! أنا مساعدك الذكي لإدارة شركة رويال 🤖\n\nكيف يمكنني مساعدتك اليوم؟ يمكنني:\n• إنشاء طلبات جديدة\n• إضافة عملاء\n• عرض التقارير\n• الإجابة على استفساراتك'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
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
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('حدث خطأ في التعرف على الصوت');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('المتصفح لا يدعم التعرف على الصوت');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const sendMessage = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت مساعد ذكي لشركة رويال للتنظيف والتعقيم ومكافحة الحشرات في الإمارات.
        
معلومات الشركة:
- رقم التواصل: 0563177803
- الخدمات: تنظيف كنب، سجاد، ستائر، خزانات، مطابخ، شقق، فلل، مكيفات، مكافحة حشرات
- نعمل 24 ساعة في جميع أنحاء الإمارات

طلب المستخدم: ${text}

أجب بشكل مختصر ومفيد باللغة العربية. إذا كان يريد إنشاء طلب أو إضافة عميل، اطلب منه المعلومات المطلوبة خطوة بخطوة.`,
        response_json_schema: {
          type: "object",
          properties: {
            response: { type: "string" },
            action: { type: "string" },
            data: { type: "object" }
          }
        }
      });

      const responseText = response?.response || response || 'تم استلام طلبك، كيف يمكنني مساعدتك؟';
      const assistantMessage = {
        role: 'assistant',
        content: typeof responseText === 'string' ? responseText : 'تم استلام طلبك، كيف يمكنني مساعدتك؟'
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Text-to-speech for response
      if ('speechSynthesis' in window && typeof responseText === 'string') {
        const utterance = new SpeechSynthesisUtterance(responseText);
        utterance.lang = 'ar-AE';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCommand = (command) => {
    sendMessage(command);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg hover:shadow-xl transition-all"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className={`fixed z-50 ${isExpanded ? 'inset-4' : 'bottom-6 left-6 w-96 h-[500px]'} transition-all`}>
      <Card className="h-full border-0 shadow-2xl flex flex-col">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">مساعد رويال الذكي</CardTitle>
                <div className="flex items-center gap-1 text-xs text-purple-200">
                  <Sparkles className="h-3 w-3" />
                  <span>مدعوم بالذكاء الاصطناعي</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
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
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-sm">
                <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Quick Commands */}
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <Badge
                  key={idx}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-50 whitespace-nowrap flex items-center gap-1 py-1"
                  onClick={() => handleQuickCommand(cmd.command)}
                >
                  <Icon className="h-3 w-3" />
                  {cmd.label}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className={`shrink-0 ${isListening ? 'bg-red-100 text-red-600 border-red-300' : ''}`}
              onClick={toggleListening}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={isListening ? 'جاري الاستماع...' : 'اكتب رسالتك...'}
              className="flex-1"
              disabled={isListening}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}