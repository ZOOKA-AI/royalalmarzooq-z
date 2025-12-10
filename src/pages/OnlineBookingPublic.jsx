import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar, Clock, MapPin, Phone, Mail, CheckCircle2, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export default function OnlineBookingPublic() {
  const [formData, setFormData] = useState({
    client_name: '', client_phone: '', client_email: '', 
    service_id: '', preferred_date: '', preferred_time: '',
    address: '', area: '', notes: ''
  });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingNumber, setBookingNumber] = useState('');

  const { data: services = [] } = useQuery({
    queryKey: ['public-services'],
    queryFn: () => base44.entities.Service.filter({ is_active: true }),
  });

  const createBookingMutation = useMutation({
    mutationFn: (data) => base44.entities.OnlineBooking.create(data),
    onSuccess: (newBooking) => {
      const number = newBooking.booking_number || `BK-${Date.now()}`;
      setBookingNumber(number);
      setBookingComplete(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success('🎉 تم الحجز بنجاح!', {
        description: `رقم الحجز: ${number}`,
        duration: 5000
      });
    },
    onError: () => {
      toast.error('فشل الحجز. حاول مرة أخرى');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedService = services.find(s => s.id === formData.service_id);
    const data = {
      ...formData,
      booking_number: `BK-${Date.now()}`,
      service_name: selectedService?.name,
      estimated_price: selectedService?.price,
      status: 'جديد'
    };
    createBookingMutation.mutate(data);
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-6">
        <Card className="max-w-lg w-full border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">تم الحجز بنجاح! 🎉</h2>
            <div className="bg-purple-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">رقم الحجز</p>
              <p className="text-3xl font-bold text-purple-600">{bookingNumber}</p>
            </div>
            <p className="text-gray-600 mb-6">
              سيتواصل معك فريقنا خلال 24 ساعة لتأكيد الموعد
            </p>
            <div className="space-y-3">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  setBookingComplete(false);
                  setFormData({
                    client_name: '', client_phone: '', client_email: '', 
                    service_id: '', preferred_date: '', preferred_time: '',
                    address: '', area: '', notes: ''
                  });
                }}
              >
                حجز آخر
              </Button>
              <a href="tel:0563177803" className="block">
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 ml-2" />
                  اتصل بنا الآن
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">شركة رويال</h1>
          </div>
          <p className="text-lg text-gray-600">للتنظيف والتعقيم ومكافحة الحشرات</p>
          <p className="text-purple-600 font-medium">احجز خدمتك أونلاين - نصلك في 24 ساعة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>بياناتك الشخصية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>الاسم الكامل *</Label>
                <Input
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  required
                  placeholder="أحمد محمد"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>رقم الهاتف *</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.client_phone}
                      onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
                      required
                      placeholder="0501234567"
                      className="pr-10"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div>
                  <Label>البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      value={formData.client_email}
                      onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                      placeholder="email@example.com"
                      className="pr-10"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Selection */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>اختر الخدمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => setFormData({...formData, service_id: service.id})}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.service_id === service.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-800">{service.name}</h3>
                      <Badge className="bg-purple-600 text-white">{service.price} درهم</Badge>
                    </div>
                    {service.description && (
                      <p className="text-sm text-gray-600">{service.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>الموعد المفضل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>التاريخ *</Label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={formData.preferred_date}
                      onChange={(e) => setFormData({...formData, preferred_date: e.target.value})}
                      required
                      className="pr-10"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div>
                  <Label>الوقت المفضل</Label>
                  <Select
                    value={formData.preferred_time}
                    onValueChange={(v) => setFormData({...formData, preferred_time: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الوقت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="صباحاً (8-12)">صباحاً (8-12)</SelectItem>
                      <SelectItem value="ظهراً (12-4)">ظهراً (12-4)</SelectItem>
                      <SelectItem value="مساءً (4-8)">مساءً (4-8)</SelectItem>
                      <SelectItem value="أي وقت">أي وقت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>موقع الخدمة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>المنطقة *</Label>
                <Select
                  value={formData.area}
                  onValueChange={(v) => setFormData({...formData, area: v})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المنطقة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="دبي">دبي</SelectItem>
                    <SelectItem value="أبوظبي">أبوظبي</SelectItem>
                    <SelectItem value="الشارقة">الشارقة</SelectItem>
                    <SelectItem value="عجمان">عجمان</SelectItem>
                    <SelectItem value="العين">العين</SelectItem>
                    <SelectItem value="رأس الخيمة">رأس الخيمة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>العنوان التفصيلي *</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                    placeholder="اسم الشارع، رقم المبنى، رقم الشقة..."
                    rows={3}
                    className="pr-10"
                  />
                </div>
              </div>
              <div>
                <Label>ملاحظات إضافية</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="أي تفاصيل إضافية تريد إخبارنا بها..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700"
            disabled={createBookingMutation.isPending}
          >
            {createBookingMutation.isPending ? 'جاري الحجز...' : 'تأكيد الحجز'}
          </Button>
        </form>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">أو اتصل بنا مباشرة</p>
          <div className="flex items-center justify-center gap-4">
            <a href="tel:0563177803" className="text-purple-600 font-bold text-lg">
              📞 0563177803
            </a>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">⏰ خدمة 24 ساعة</span>
          </div>
        </div>
      </div>
    </div>
  );
}