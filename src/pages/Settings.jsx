import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Settings as SettingsIcon, User, Building, Phone, Mail, MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Settings() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await base44.auth.me();
      setUserData(user);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">الإعدادات</h1>
        <p className="text-gray-500">إدارة إعدادات الحساب والنظام</p>
      </div>

      {/* User Profile */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-600" />
            الملف الشخصي
          </CardTitle>
          <CardDescription>معلومات حسابك الشخصية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-3xl">
                {userData?.full_name?.charAt(0) || userData?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{userData?.full_name || 'مستخدم'}</h3>
              <p className="text-gray-500">{userData?.email}</p>
              <p className="text-sm text-purple-600">{userData?.role === 'admin' ? 'مدير النظام' : 'مستخدم'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Info */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-purple-600" />
            معلومات الشركة
          </CardTitle>
          <CardDescription>شركة رويال للتنظيف والتعقيم ومكافحة الحشرات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Phone className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">رقم الهاتف</p>
                <p className="font-medium" dir="ltr">+971 56 317 7803</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <MessageCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">الواتساب</p>
                <p className="font-medium" dir="ltr">+971 56 317 7803</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <p className="text-purple-700 font-medium">⏰ خدمة 24 ساعة في جميع أنحاء الإمارات</p>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Bot Info */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <MessageCircle className="h-5 w-5" />
            بوت الواتساب للرد التلقائي
          </CardTitle>
          <CardDescription>الرد التلقائي على استفسارات العملاء</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            البوت يمكنه الرد على العملاء تلقائياً وتقديم معلومات عن الخدمات والأسعار وحجز المواعيد.
          </p>
          <div className="bg-white p-4 rounded-xl">
            <h4 className="font-bold text-gray-800 mb-2">الوظائف المتاحة:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ عرض قائمة الخدمات والأسعار</li>
              <li>✅ الرد على استفسارات العملاء</li>
              <li>✅ إنشاء طلبات جديدة</li>
              <li>✅ متابعة حالة الطلبات</li>
              <li>✅ تحديث بيانات العملاء</li>
            </ul>
          </div>
          <a 
            href={base44.agents.getWhatsAppConnectURL('royal_clean_assistant')} 
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <MessageCircle className="h-4 w-4 ml-2" />
              ربط الواتساب بالبوت الذكي
            </Button>
          </a>
          <p className="text-xs text-gray-500 mt-2 text-center">
            البوت يفهم استفسارات العملاء ويحجز الطلبات تلقائياً
          </p>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="border-0 shadow-lg border-red-100">
        <CardContent className="p-6">
          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleLogout}
          >
            تسجيل الخروج
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}