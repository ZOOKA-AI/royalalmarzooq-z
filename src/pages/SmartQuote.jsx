import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, Plus, Trash2, Sparkles, Send, 
  FileText, Loader2, Wand2, Download
} from 'lucide-react';
import { toast } from 'sonner';

export default function SmartQuote() {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [generating, setGenerating] = useState(false);

  const queryClient = useQueryClient();

  const { data: services = [] } = useQuery({
    queryKey: ['services-for-quote'],
    queryFn: () => base44.entities.Service.filter({ is_active: true }),
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => base44.entities.Quote.list('-created_date'),
  });

  const createQuoteMutation = useMutation({
    mutationFn: (data) => base44.entities.Quote.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('تم إنشاء عرض السعر');
      resetForm();
    },
  });

  const addService = (service) => {
    setSelectedServices([
      ...selectedServices,
      {
        service_name: service.name,
        description: service.description,
        quantity: 1,
        unit_price: service.price,
        total: service.price
      }
    ]);
  };

  const removeService = (index) => {
    setSelectedServices(selectedServices.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, quantity) => {
    const updated = [...selectedServices];
    updated[index].quantity = quantity;
    updated[index].total = quantity * updated[index].unit_price;
    setSelectedServices(updated);
  };

  const calculateTotals = () => {
    const subtotal = selectedServices.reduce((sum, s) => sum + s.total, 0);
    const discount = 0;
    const tax = subtotal * 0.05; // 5% VAT
    const total = subtotal - discount + tax;
    return { subtotal, discount, tax, total };
  };

  const generateSmartQuote = async () => {
    if (!clientName || selectedServices.length === 0) {
      toast.error('أضف عميل وخدمات');
      return;
    }

    setGenerating(true);
    try {
      const { subtotal, discount, tax, total } = calculateTotals();

      // توليد نصائح وتوصيات ذكية
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنشئ عرض سعر احترافي لعميل شركة تنظيف:

العميل: ${clientName}
الخدمات: ${selectedServices.map(s => s.service_name).join(', ')}
المبلغ: ${total} درهم

اكتب:
1. رسالة ترحيبية شخصية
2. وصف موجز لكل خدمة وفوائدها
3. ملاحظات مهمة للعميل
4. شروط وأحكام واضحة
5. call to action قوي`,
        response_json_schema: {
          type: "object",
          properties: {
            welcome_message: { type: "string" },
            notes: { type: "string" },
            terms: { type: "string" },
            call_to_action: { type: "string" }
          }
        }
      });

      const quoteNumber = 'QTE-' + Date.now();
      const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      await createQuoteMutation.mutateAsync({
        quote_number: quoteNumber,
        client_name: clientName,
        client_phone: clientPhone,
        services: selectedServices,
        subtotal,
        discount,
        tax,
        total,
        status: 'مسودة',
        valid_until: validUntil,
        notes: response.notes,
        terms: response.terms
      });

      toast.success('تم توليد عرض السعر! 🎉');
    } catch (error) {
      toast.error('فشل التوليد');
    } finally {
      setGenerating(false);
    }
  };

  const resetForm = () => {
    setClientName('');
    setClientPhone('');
    setSelectedServices([]);
  };

  const { subtotal, discount, tax, total } = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">عروض الأسعار الذكية</h1>
          <p className="text-gray-500">إنشاء عروض أسعار احترافية بالذكاء الاصطناعي</p>
        </div>
        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2">
          <Sparkles className="h-4 w-4 ml-2" />
          AI-Powered
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-purple-600" />
                إنشاء عرض سعر جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">اسم العميل</label>
                <Input
                  placeholder="أحمد محمد"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">رقم الهاتف</label>
                <Input
                  placeholder="0501234567"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">اختر الخدمات</label>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {services.map(service => (
                    <Button
                      key={service.id}
                      variant="outline"
                      size="sm"
                      onClick={() => addService(service)}
                      className="justify-start"
                    >
                      <Plus className="h-3 w-3 ml-1" />
                      {service.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={generateSmartQuote}
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
                    توليد عرض سعر ذكي
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Quotes */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>آخر عروض الأسعار</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quotes.slice(0, 5).map(quote => (
                  <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-bold text-sm">{quote.client_name}</p>
                      <p className="text-xs text-gray-500">{quote.quote_number}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-purple-600">{quote.total} د</p>
                      <Badge variant="outline" className="text-xs">{quote.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                معاينة عرض السعر
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedServices.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>لم تضف خدمات بعد</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {selectedServices.map((service, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-bold text-sm">{service.service_name}</p>
                            <p className="text-xs text-gray-500">{service.description}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeService(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={service.quantity}
                            onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                            className="w-20 h-8 text-sm"
                          />
                          <span className="text-sm text-gray-500">×</span>
                          <span className="text-sm">{service.unit_price} د</span>
                          <span className="text-sm text-gray-500">=</span>
                          <span className="font-bold text-purple-600">{service.total} د</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>المجموع الفرعي</span>
                      <span className="font-bold">{subtotal.toFixed(2)} د</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>الخصم</span>
                        <span>-{discount.toFixed(2)} د</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>الضريبة (5%)</span>
                      <span>+{tax.toFixed(2)} د</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-purple-600 border-t pt-2">
                      <span>الإجمالي</span>
                      <span>{total.toFixed(2)} د</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 ml-1" />
                      تحميل PDF
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Send className="h-4 w-4 ml-1" />
                      إرسال
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}